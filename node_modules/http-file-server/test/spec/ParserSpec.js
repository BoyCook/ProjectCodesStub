var should = require('should');
var Parser = require('../../index.js').Parser;
var data = ['1', '2', '3'];
var expected = {
    xml: '<resources><resource>1</resource><resource>2</resource><resource>3</resource></resources>',
    html: '<div><div><a href="1">1</a></div><div><a href="2">2</a></div><div><a href="3">3</a></div></div>',
    json: { "resources": ['1', '2', '3'] }
};

describe('Parser', function () {
    describe('#asXML', function () {
        it('should list as XML properly', function () {
            var xml = Parser.asXML('resources', 'resource', data);
            xml.should.eql(expected.xml);
        });
    });
    describe('#asJSON', function () {
        it('should list as JSON properly', function () {
            var json = Parser.asJSON('resources', data);
            json.should.eql(expected.json);
        });
    });
    describe('#resourceJSON', function () {
        it('should list as JSON properly', function () {
            var json = Parser.resourceJSON({data: data});
            json.should.eql(JSON.stringify(expected.json));
        });
    });
    describe('#resourceXML', function () {
        it('should list as XML properly', function () {
            var xml = Parser.resourceXML({data: data});
            xml.should.eql(expected.xml);
        });
    });
    describe('#resourceHTML', function () {
        it('should list as HTML properly', function () {
            var html = Parser.resourceHTML({data: data});
            html.should.eql(expected.html);
        });
    });
});
