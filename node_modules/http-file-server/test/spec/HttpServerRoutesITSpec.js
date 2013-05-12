var should = require('should');
var request = require('request');
var url = 'http://localhost:8080';
var HttpServer = require('../../index.js').HttpServer;
var fs = require('../../index.js').FSUtil;
var expected = {
    file: {
        "data": "123"
    },
    invalid: '404 - invalid path'
};
var server;

describe('HttpServer', function () {
    before(function (done) {
        server = new HttpServer({
            port: 8080,
            baseDir: './test/data',
            routes: [
                { path: '/temp/:id', makeDir: true, routes: ['subdir'] }
            ]
        }).start(done);
    });

    after(function (done) {
        server.stop(done);
    });

    describe('#createFile', function () {
        it('should create file with sub-directories when route is specified', function (done) {
            request.put({
                    url: url + '/temp/newfile',
                    headers: {'content-type': 'application/json', dataType: 'json'},
                    body: JSON.stringify(expected.file)
                },
                function (error, response, body) {
                    //TODO: assert dir and file on filesystem
                    body = JSON.parse(body);
                    response.statusCode.should.eql(201);
                    body.should.eql(expected.file);
                    fs.isDir('./test/data/temp/newfile').should.be.true;
                    fs.isDir('./test/data/temp/newfile/subdir').should.be.true;
                    done();
                });
        });
    });

    describe('#deleteFile', function () {
        it('should delete file with sub-directories when route is specified', function (done) {
            request.del(url + '/temp/newfile',
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    fs.isNotDir('./test/data/temp/newfile').should.be.true;
                    fs.isNotDir('./test/data/temp/newfile/subdir').should.be.true;
                    done();
                });
        });
    });
});
