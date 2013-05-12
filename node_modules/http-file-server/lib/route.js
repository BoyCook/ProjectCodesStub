/*
    Represents an allowed path
*/
function Route(path, config) {
    this.path = path;
    this.makeDir = config && config.makeDir ? config.makeDir : false;
    this.regexp = this.pathRegExp(path
        , config ? config.sensitive : false
        , config ? config.strict : false);
}

Route.prototype.match = function (path) {
    return this.regexp.exec(path);
};

Route.prototype.pathRegExp = function (path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (Array.isArray(path)) path = '(' + path.join('|') + ')';
    path = path
        .concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
            slash = slash || '';
            return ''
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + (optional || '')
                + (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
};

exports.Route = Route;
