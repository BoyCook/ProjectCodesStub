var HttpServer = require('http-file-server').HttpServer;
new HttpServer({
    port: 8080,
    baseDir: './data',
    verbose: true,
    strictRoutes: true,
    routes: [
        '/projectcodes',
        '/projectcodes/:id',
        '/employees',
        { path: '/employees/:id', makeDir: true },
        '/employees/:id/projectcodes',
        '/employees/:id/timesheets',
        { path: '/employees/:id/timesheets/:id', makeDir: true },
        '/employees/:id/timesheets/:id/project'
    ]
}).start();
