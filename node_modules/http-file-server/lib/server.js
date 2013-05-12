var http = require('http');
var url = require('url');
var fs = require('./fsutil').FSUtil;
var Parser = require('./parser').Parser;
var Object = require('object-utils');
var Routes = require('./routes').Routes;
var server = undefined;

function HttpServer(config) {
    this.port = config.port;
    this.baseDir = config.baseDir;
    this.defaultDirType = 'text/html';
    this.defaultFileType = 'text/plain';
    this.verbose = config.verbose ? config.verbose : false;
    this.contextPath = config.contextPath ? config.contextPath : '/';
    this.strictRoutes = config.strictRoutes ? config.strictRoutes : false;
    this.routes = new Routes({routes: config.routes ? config.routes : []});

    //Note - these are all in priority order
    this.directoryParsers = {
        "text/html": Parser.resourceHTML,
        "application/xml": Parser.resourceXML,
        "application/json": Parser.resourceJSON
    };
    this.accepts = {
        "text/plain": "txt",
        "text/html": "html",
        "application/json": "json",
        "application/xml": "xml"
    };
}

HttpServer.prototype.start = function (fn) {
    var context = this;
    server = http.createServer(function (req, res) {
        var path = context.getPath(req);
        if (!context.checkPath(path)) {
            res.writeHead(404);
            res.end('404 - invalid path');
        } else {
            switch (req.method) {
                case "GET":
                    context.processGET(req, res, path);
                    break;
                case "DELETE":
                    context.processDELETE(req, res, path);
                    break;
                case "PUT":
                    context.processPUT(req, res, path);
                    break;
                default:
                    res.writeHead(405);
                    res.end('405 - invalid method [%s]', req.method);
                    break;
            }
        }
    }).listen(this.port, fn);

    if (this.verbose) {
        console.log('Server started at [%s]', this.port);
    }
    return this;
};

HttpServer.prototype.stop = function (fn) {
    server.close(fn);
};

HttpServer.prototype.processGET = function (req, res, path) {
    var context = this;
    var accept = context.getAccept(req);
    var contentType = context.matchKey(context.accepts, accept, context.defaultFileType);
    var data = fs.getData(context.baseDir + path, context.accepts[contentType]);
    if (Object.isDefined(data)) {
        //TODO: map response contentType properly
        if (data.type === 'dir') {
            var dirContentType = context.matchKey(context.directoryParsers, accept, context.defaultDirType);
            context.sendResponse(res, 200, dirContentType, context.parseDirectory(dirContentType, {data: data.data, path: context.addPathSuffix(path)}));
        } else if (data.type === 'file') {
            context.sendResponse(res, 200, contentType, data.data);
        }
    }
    res.writeHead(404);
    res.end('404 - invalid path');
};

HttpServer.prototype.processPUT = function (req, res, inboundPath) {
    var context = this;
    var route = context.routes.match(inboundPath);
    var data = "";
    req.on("data", function (chunk) {
        data += chunk.toString();
    });
    req.on("end", function () {
        //TODO this is rubbish - refactor
        //Make dir for entity if route specifies so
        var code = 201;
        if (route && route.route && route.route.makeDir) {
            if (fs.exists(context.baseDir + inboundPath)) {
                res.writeHead(409);
                res.end('409 - conflict: resource already exists');
                return;
            }

            fs.save(context.baseDir + inboundPath);
            //Create sub-directories if specified
            if (route.route.routes) {
                for (var i = 0, len = route.route.routes.length; i < len; i++) {
                    fs.save(context.baseDir + inboundPath + '/' + route.route.routes[i]);
                }
            }
        }
        //TODO: get extension and file name properly
        var extension = context.getExtension(req);
        if (fs.exists(context.baseDir + inboundPath + '.' + extension)) {
            res.writeHead(409);
            res.end('409 - conflict: resource already exists');
            return;
        }
        fs.save(context.baseDir + inboundPath + '.' + extension, data);
        res.writeHead(201);
        res.end(data);
    });
};

HttpServer.prototype.processDELETE = function (req, res, path) {
    //TODO this is rubbish - refactor
    var route = this.routes.match(path);
    if (route && route.route && route.route.makeDir) {
        //Delete sub-directories 1st if specified
        if (route.route.routes) {
            for (var i = 0, len = route.route.routes.length; i < len; i++) {
                fs.delete(this.baseDir + path + '/' + route.route.routes[i]);
            }
        }
        fs.delete(this.baseDir + path);
    }
    fs.delete(this.baseDir + path + '.json');
    res.writeHead(200);
    res.end('200 - DELETED');
};

HttpServer.prototype.sendResponse = function (res, code, contentType, data) {
//TODO: do is object check and parse accordingly
    res.writeHead(code, {'Content-Type': contentType});
    res.end(data);
};

HttpServer.prototype.getExtension = function (req) {
    if (req.headers.datatype) {
        return req.headers.datatype;
    } else if (req.headers['content-type']) {
        //TODO match req.headers['content-type'] to extension
    }
    return 'json';
};

HttpServer.prototype.getAccept = function (req) {
    if (req.headers.accept) {
        return req.headers.accept.split(',');
    }
    return [this.defaultDirType];
};

HttpServer.prototype.getPath = function (req) {
    var path = url.parse(req.url).pathname;
    var index = path.indexOf(this.contextPath);
    if (index == 0) {
        path = path.substring(this.contextPath.length);
    }
    return  '/' + path;
};

HttpServer.prototype.addPathSuffix = function (path) {
    if (path.charAt(path.length - 1) !== '/') {
        path += '/';
    }
    return path;
};

HttpServer.prototype.checkPath = function (path) {
    if (this.strictRoutes) {
        return this.routes.isMatch(path);
    }
    return true;
};

HttpServer.prototype.parseDirectory = function (contentType, data) {
    var fn = this.directoryParsers[contentType];
    return fn(data);
};

//TODO: move to separate class
HttpServer.prototype.matchKey = function (object, accept, defaultType) {
    for (var i = 0, len = accept.length; i < len; i++) {
        var key = this.getKey(object, accept[i]);
        if (Object.isDefined(key)) {
            //Stopping at 1st match
            return key;
        }
    }
    return defaultType;
};

//TODO: move to separate class
HttpServer.prototype.getKey = function (object, value) {
    //Not using hasOwnProperty as doing loose check
    for (var key in object) {
        if (value.indexOf(key) === 0) {
            //Stopping at 1st match
            return key;
        }
    }
    return undefined;
};

exports.HttpServer = HttpServer;
