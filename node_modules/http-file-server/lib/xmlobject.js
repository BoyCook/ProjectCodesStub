/*
 A simple hierarchical XML node object tree
 */

var StringBuilder = require('string-builder').StringBuilder;
var Object = require('object-utils');

function XML(node, value) {
    this.node = node;
    this.value = value;
    this.children = [];
    this.attributes = [];
}

XML.prototype.addChild = function (child) {
    this.children.push(child);
    return this;
};

XML.prototype.addAttribute = function (attribute) {
    //TODO: handle multi-value atts
    this.attributes.push(attribute);
    return this;
};

XML.prototype.asString = function () {
    var builder = new StringBuilder();
    builder.append(this.getStartTag());
    if (Object.isDefined(this.value)) {
        builder.append(this.value);
    } else {
        for (var i = 0, len = this.children.length; i < len; i++) {
            builder.append(this.children[i].asString());
        }
    }
    builder.append(this.getEndTag());
    return builder.toString();
};

XML.prototype.getStartTag = function () {
    if (Object.isNotEmpty(this.attributes)) {
        var builder = new StringBuilder();
        builder.append('<' + this.node);
        builder.append(this.getAttributes());
        builder.append('>');
        return builder.toString();
    } else {
        return '<' + this.node + '>';
    }
};

XML.prototype.getEndTag = function () {
    return '</' + this.node + '>';
};

XML.prototype.getAttributes = function () {
    var builder = new StringBuilder();
    for (var x = 0, len = this.attributes.length; x < len; x++) {
        builder.append(' ' + this.getAttribute(this.attributes[x]));
    }
    return builder.toString();
};

XML.prototype.getAttribute = function (attribute) {
    return attribute.key + '="' + attribute.value + '"';
};

exports.XML = XML;
