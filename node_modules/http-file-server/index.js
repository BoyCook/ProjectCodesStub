var parser =  process.env.HFS_COV ? require('./lib-cov/parser').Parser : require('./lib/parser').Parser;
var fsutil = process.env.HFS_COV ? require('./lib-cov/fsutil').FSUtil : require('./lib/fsutil').FSUtil;
var server = process.env.HFS_COV ? require('./lib-cov/server').HttpServer : require('./lib/server').HttpServer;
var xmlobject = process.env.HFS_COV ? require('./lib-cov/xmlobject').XML : require('./lib/xmlobject').XML;
var route = process.env.HFS_COV ? require('./lib-cov/route').Route : require('./lib/route').Route;
var routes = process.env.HFS_COV ? require('./lib-cov/routes').Routes : require('./lib/routes').Routes;

module.exports = {
    Parser: parser,
    FSUtil: fsutil,
    HttpServer: server,
    XML: xmlobject,
    Route: route,
    Routes: routes
};
