var parser =  process.env.HFS_COV ? require('./lib-cov/parser').Parser : require('./lib/parser').Parser;
var fsutil = process.env.HFS_COV ? require('./lib-cov/fsutil').FSUtil : require('./lib/fsutil').FSUtil;
var server = process.env.HFS_COV ? require('./lib-cov/server').HttpServer : require('./lib/server').HttpServer;
var xmlobject = process.env.HFS_COV ? require('./lib-cov/xmlobject').XML : require('./lib/xmlobject').XML;
var path = process.env.HFS_COV ? require('./lib-cov/path').Path : require('./lib/path').Path;
var paths = process.env.HFS_COV ? require('./lib-cov/paths').Paths : require('./lib/paths').Paths;

module.exports = {
    Parser: parser,
    FSUtil: fsutil,
    HttpServer: server,
    XML: xmlobject,
    Path: path,
    Paths: paths
};
