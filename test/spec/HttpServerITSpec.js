var should = require('should');
var request = require('request');
var url = 'http://localhost:8080';
var expected = {
    dir: {
        json: {"resources": ["PC0001.json", "PC0002.json", "PC0003.json"]},
        xml: '<resources><resource>PC0001.json</resource><resource>PC0002.json</resource><resource>PC0003.json</resource></resources>',
        html: '<div><div><a href="/projectcodes/PC0001.json">PC0001.json</a></div><div><a href="/projectcodes/PC0002.json">PC0002.json</a></div><div><a href="/projectcodes/PC0003.json">PC0003.json</a></div></div>'
    },
    file: {
        "code": "PC0001"
    },
    employeee: { "id": "321" }
};
var server;

describe('HttpServer', function () {

    before(function (done) {
        require('../../server.js');
        done();
    });

    describe('#ProjectCodes', function () {
        it('should list directory contents as HTML ok', function (done) {
            request({url: url + '/projectcodes', headers: { Accept: 'text/html'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    body.should.eql(expected.dir.html);
                    done();
                });
        });

        it('should list directory contents as JSON ok', function (done) {
            request({url: url + '/projectcodes', headers: { Accept: 'application/json'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    var json = JSON.parse(body);
                    json.should.eql(expected.dir.json);
                    done();
                });
        });

        it('should list directory contents as XML ok', function (done) {
            request({url: url + '/projectcodes', headers: { Accept: 'application/xml'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    body.should.eql(expected.dir.xml);
                    done();
                });
        });
    });

    describe('#ProjectCode', function () {
        it('should get project code ok with extension', function (done) {
            request({url: url + '/projectcodes/PC0001.json'},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    var json = JSON.parse(body);
                    json.should.eql(expected.file);
                    done();
                });
        });

        it('should get project code ok with Accept Header', function (done) {
            request({url: url + '/projectcodes/PC0001', headers: { Accept: 'application/json'}},
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    var json = JSON.parse(body);
                    json.should.eql(expected.file);
                    done();
                });
        });

        it('should create project code ok', function (done) {
            request.put({
                    url: url + '/projectcodes/PC0004',
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

    describe('#Employee', function () {
        it('should create employee ok', function (done) {
            request.put({
                    url: url + '/employees/321',
                    headers: {'content-type': 'application/json', dataType: 'json'},
                    body: JSON.stringify(expected.employeee)
                },
                function (error, response, body) {
                    body = JSON.parse(body);
                    response.statusCode.should.eql(201);
                    body.should.eql(expected.employeee);
                    done();
                });
        });
    });

    describe('#DeleteMopup', function () {
        it('should delete project code ok', function (done) {
            request.del(url + '/projectcodes/PC0004',
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    done();
                });
        });

        it('should delete employee ok', function (done) {
            request.del(url + '/employees/321',
                function (error, response, body) {
                    response.statusCode.should.eql(200);
                    done();
                });
        });
    });
});
