var HttpServer = require('http-file-server').HttpServer;
new HttpServer({port: 8080, baseDir: './data', verbose: true}).start();
