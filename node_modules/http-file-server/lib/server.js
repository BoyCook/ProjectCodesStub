var http = require('http');
var url = require('url');
var fs = require('./fsutil').FSUtil;
var Parser = require('./parser').Parser;
var Object = require('object-utils');
var server = undefined;

function HttpServer(config) {
    this.port = config.port;
    this.baseDir = config.baseDir;
    this.defaultDirType = 'text/html';
    this.defaultFileType = 'text/plain';
    this.verbose = config.verbose ? config.verbose : false;
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

        switch (req.method) {
            case "GET":
                context.processGET(req, res, path);
                break;
            case "DELETE":
                context.processDELETE(res, path);
                break;
            case "PUT":
                context.processPUT(req, res, path);
                break;
            default:
                res.writeHead(405);
                res.end('405 - invalid method [%s]', req.method);
                break;
        }
    }).listen(this.port, fn);

    if (this.verbose) {
        console.log('Server started at [%s]', this.port);
    }
    return this;
};

HttpServer.prototype.stop = function (fn) {
    server.close();
    if (fn) {
        fn();
    }
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

HttpServer.prototype.processPUT = function (req, res, path) {
    var context = this;
    var data = "";
    req.on("data", function (chunk) {
        data += chunk.toString();
    });
    req.on("end", function () {
        //TODO: get extension and file name properly
        fs.save(context.baseDir + path, data);
        res.writeHead(201);
        res.end(data);
    });
};

HttpServer.prototype.processDELETE = function (res, path) {
    fs.delete(this.baseDir + path);
    res.writeHead(200);
    res.end('200 - DELETED');
};

HttpServer.prototype.sendResponse = function (res, code, contentType, data) {
//TODO: do is object check and parse accordingly
    res.writeHead(code, {'Content-Type': contentType});
    res.end(data);
};

HttpServer.prototype.getAccept = function (req) {
    if (req.headers.accept) {
        return req.headers.accept.split(',');
    }
    return [this.defaultDirType];
};

HttpServer.prototype.getPath = function (req) {
    return url.parse(req.url).pathname;
};

HttpServer.prototype.addPathSuffix = function (path) {
    if (path.charAt(path.length - 1) !== '/') {
        path += '/';
    }
    return path;
};

HttpServer.prototype.parseDirectory = function (contentType, data) {
    var fn = this.directoryParsers[contentType];
    return fn(data);
};

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
