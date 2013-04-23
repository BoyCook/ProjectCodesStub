var should = require('should');
var request = require('request');
var url = 'http://localhost:8080';
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
        require('../../server.js');
        done();
    });

    describe.skip('#codes', function () {
        it('should list directory contents as HTML ok', function (done) {
            request({url: url + '/codes', headers: { Accept: 'text/html'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    body.should.eql(expected.dir.html);
                    done();
                });
        });

        it('should list directory contents as JSON ok', function (done) {
            request({url: url + '/codes', headers: { Accept: 'application/json'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    var json = JSON.parse(body);
                    json.should.eql(expected.dir.json);
                    done();
                });
        });

        it('should list directory contents as XML ok', function (done) {
            request({url: url + '/codes', headers: { Accept: 'application/xml'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    body.should.eql(expected.dir.xml);
                    done();
                });
        });
    });

    describe.skip('#getFile', function () {
        it('should get file ok', function (done) {
            request(url + '/test/spec/HttpServerITSpec.js',
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    //TODO: finish assertions
                    done();
                });
        });
    });

    describe.skip('#createFile', function () {
        it('should create file ok', function (done) {
            request.put({
                    url: url + '/test/newfile',
                    headers: {'content-type': 'application/json', dataType: 'json'},
                    body: JSON.stringify(expected.file)
                },
                function (error, response, body) {
                    body = JSON.parse(body);
                    response.statusCode.should.eql(201);
                    body.should.eql(expected.file);
                    done();
                });
        });
    });

    describe.skip('#deleteFile', function () {
        it('should create file ok', function (done) {
            request.del(url + '/test/newfile',
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    done();
                });
        });
    });
});
