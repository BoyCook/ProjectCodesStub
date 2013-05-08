var HttpServer = require('./lib/server').HttpServer;
new HttpServer({
    port: 8080,
    baseDir: '.',
    verbose: true
}).start();
