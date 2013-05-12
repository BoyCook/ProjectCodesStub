var should = require('should');
var Route = require('../../index.js').Route;

describe('Route', function () {

    var route;
    var routeWithParam;

    before(function () {
        route = new Route('/users');
        routeWithParam = new Route('/users/:id');
    });

    describe('#match', function () {
        it('should match path', function () {
            should.exist(route.match('/users'));
        });

        it('should not match invalid path', function () {
            should.not.exist(route.match('/user'));
        });

        it('should match path with parameter ok', function () {
            should.exist(routeWithParam.match('/users/boycook'));
        });

        it('should not match invalid path with param', function () {
            should.not.exist(routeWithParam.match('/user/boycook'));
        });
    });
});
