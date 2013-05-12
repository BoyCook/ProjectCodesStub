var HttpServer = require('http-file-server').HttpServer;
new HttpServer({
    port: 8080,
    baseDir: './data',
    verbose: true,
    strictRoutes: true,
    routes: [
        { path: '/projectcodes', makeDir: true },
        { path: '/projectcodes/:id', makeDir: true },
        { path: '/employees', makeDir: true },
        { path: '/employees/:id', makeDir: true },
        { path: '/employees/:id/projectcodes', makeDir: true },
        { path: '/employees/:id/timesheets', makeDir: true },
        { path: '/employees/:id/timesheets/:id', makeDir: true },
        { path: '/employees/:id/timesheets/:id/project', makeDir: true }
    ]
}).start();
