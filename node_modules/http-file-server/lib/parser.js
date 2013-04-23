var XML = require('./xmlobject.js').XML;

function Parser() {
    //Not using prototype, don't want to store state
}

Parser.resourceJSON = function (data) {
    return JSON.stringify(Parser.asJSON('resources', data.data));
};

Parser.resourceXML = function (data) {
    return Parser.asXML('resources', 'resource', data.data);
};

Parser.resourceHTML = function (data) {
    var parent = new XML('div');
    for (var i = 0, len = data.data.length; i < len; i++) {
        var a = new XML('a', data.data[i]);
        var href = (data.path ? data.path : '') + data.data[i];
        a.addAttribute({key: 'href', value: href });
        parent.addChild(new XML('div').addChild(a));
    }
    return parent.asString();
};

Parser.asJSON = function (items, list) {
    var result = {};
    result[items] = [];
    for (var i = 0, len = list.length; i < len; i++) {
        result[items].push(list[i]);
    }
    return result;
};

Parser.asXML = function (items, item, list) {
    var parent = new XML(items);
    for (var i = 0, len = list.length; i < len; i++) {
        parent.addChild(new XML(item, list[i]));
    }
    return parent.asString();
};

exports.Parser = Parser;
