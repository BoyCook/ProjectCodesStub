/*
    Represents an allowed path
*/
function Path(path, params) {
    this.path = path;
    this.regexp = this.pathRegExp(path
        , params ? params.sensitive : false
        , params ? params.strict : false);
}

Path.prototype.match = function (path) {
    return this.regexp.exec(path);
};

Path.prototype.pathRegExp = function (path, keys, sensitive, strict) {
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

exports.Path = Path;
