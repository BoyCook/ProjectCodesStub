var Route = require('./route').Route;
var Object = require('object-utils');

function Routes(params) {
    this._routes = params.routes;
    this.routes = [];
    this.generatePathObjects();
}

Routes.prototype.generatePathObjects = function () {
    for (var i = 0, len = this._routes.length; i < len; i++) {
        var route = this._routes[i];
        if (Object.isObject(route)) {
            this.routes.push(new Route(route.path, { makeDir: route.makeDir }));
        } else {
            this.routes.push(new Route(route));
        }
    }
};

Routes.prototype.match = function (path) {
    for (var i = 0, len = this.routes.length; i < len; i++) {
        var route = this.routes[i];
        var match = route.match(path);
        if (match) {
            return { match: match, route: route };
        }
    }
    return undefined;
};

Routes.prototype.isMatch = function (path) {
    return this.match(path);
};

exports.Routes = Routes;
