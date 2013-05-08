var HttpServer = require('http-file-server').HttpServer;
new HttpServer({
    port: 8080,
    baseDir: './data',
    verbose: true,
    routes: [
        { path: '/employees/:id', makeDir: true },
        { path: '/employees/:id/timesheets/:id', makeDir: true }
    ]
}).start();
