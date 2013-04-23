
function Paths(params) {
    this._paths = params.paths;
    this.paths = [];
    this.generatePaths();
}

Paths.prototype.generatePaths = function () {
    for (var i = 0, len = this._paths.length; i < len; i++) {
        var path = this._paths[i];
        this.paths.push(new Path(path));
    }
};

Paths.prototype.match = function (currentPath) {
    for (var i = 0, len = this.paths.length; i < len; i++) {
        var path = this.paths[i];
        if (path.match(currentPath)) {
            return true;
        }
    }
    return false;
};

exports.Paths = Paths;
