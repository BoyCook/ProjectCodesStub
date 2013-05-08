var should = require('should');
var request = require('request');
var url = 'http://localhost:8080';
var HttpServer = require('../../index.js').HttpServer;
var expected = {
    dir: {
        json: {"resources": ["spec"]},
        xml: '<resources><resource>spec</resource></resources>',
        html: '<div><div><a href="/test/spec">spec</a></div></div>'
    },
    file: {
        "data": "123"
    }
};
var server;

describe('HttpServer', function () {
    before(function (done) {
        server = new HttpServer({
            port: 8080,
            baseDir: '.',
            routes: [
                { path: '/test/:filename', makeDir: true }
            ]
        }).start(done);
    });

    after(function (done) {
        server.stop(done);
    });

    describe('#getDir', function () {
        it('should list directory contents as HTML by default',
            function (done) {
                request(url + '/test', function (error, response, body) {
                    response.statusCode.should.eql(200);
                    body.should.eql(expected.dir.html);
                    done();
                });
            });

        it('should list directory contents as HTML ok', function (done) {
            request({url: url + '/test', headers: { Accept: 'text/html'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    body.should.eql(expected.dir.html);
                    done();
                });
        });

        it('should list directory contents as JSON ok', function (done) {
            request({url: url + '/test', headers: { Accept: 'application/json'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    var json = JSON.parse(body);
                    json.should.eql(expected.dir.json);
                    done();
                });
        });

        it('should list directory contents as XML ok', function (done) {
            request({url: url + '/test', headers: { Accept: 'application/xml'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    body.should.eql(expected.dir.xml);
                    done();
                });
        });
    });

    describe('#getFile', function () {
        it('should get file ok', function (done) {
            request(url + '/test/spec/HttpServerITSpec.js',
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    //TODO: finish assertions
                    done();
                });
        });
    });

    describe('#createFile', function () {
        it('should create file ok', function (done) {
            request.put({
                    url: url + '/test/newfile',
                    headers: {'content-type': 'application/json', dataType: 'json'},
                    body: JSON.stringify(expected.file)
                },
                function (error, response, body) {
                    //TODO: assert dir and file on filesystem
                    body = JSON.parse(body);
                    response.statusCode.should.eql(201);
                    body.should.eql(expected.file);
                    done();
                });
        });
    });

    describe('#deleteFile', function () {
        it('should create file ok', function (done) {
            request.del(url + '/test/newfile',
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    done();
                });
        });
    });
});
