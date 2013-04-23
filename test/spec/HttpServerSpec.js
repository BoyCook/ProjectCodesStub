var should = require('should');
var HttpServer = require('../../index.js').HttpServer;
var expected = {
    dir: {
        json: {"resources":["spec"]},
        xml: '<resources><resource>spec</resource></resources>',
        html: '<div><div><a href="/test/spec">spec</a></div></div>'
    }
};

describe('HttpServer', function () {
    var server;

    before(function(done) {
        server = new HttpServer({port: 8080, baseDir: '.'});
        done();
    });

    describe('#getKey', function () {
        it('should find key for exact match', function () {
            var result = server.getKey({'item': 'value'}, 'item');
            result.should.eql('item');
        });

        it('should find key for partial match', function () {
            var result = server.getKey({'item': 'value'}, 'item-01');
            result.should.eql('item');
        });

        it('should not find key for no match', function () {
            var result = server.getKey({'item': 'value'}, 'invalid');
            should.not.exist(result);
        });
    });

    describe('#matchKey', function () {
        it('should find key for exact match', function () {
            var result = server.matchKey({'item': 'value'}, ['item']);
            result.should.eql('item');
        });

        it('should find key for partial match', function () {
            var result = server.matchKey({'item': 'value'}, ['item-01']);
            result.should.eql('item');
        });

        it('should use default for no match', function () {
            var result = server.matchKey({'item': 'value'}, ['invalid'], 'default');
            result.should.eql('default');
        });

        it('should not find key for no match', function () {
            var result = server.matchKey({'item': 'value'}, ['invalid']);
            should.not.exist(result);
        });
    });
});
