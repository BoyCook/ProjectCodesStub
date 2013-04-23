var should = require('should');
var XML = require('../../index.js').XML;

describe('XML', function () {
    it('should create node with value', function () {
        var node = new XML('node', 'value');
        node.node.should.eql('node');
        node.value.should.eql('value');
        node.asString().should.eql('<node>value</node>');
    });

    it('should create node with children', function () {
        var node = new XML('parent');
        node.addChild(new XML('child', '1'));
        node.addChild(new XML('child', '2'));
        node.addChild(new XML('child', '3'));
        node.node.should.eql('parent');
        should.not.exist(node.value);
        node.asString().should.eql('<parent><child>1</child><child>2</child><child>3</child></parent>');
    });
});
