var should = require('should');
var Routes = require('../../index.js').Routes;

describe('Routes', function () {
    var routes;

    before(function () {
        var _routes = ['/users', { path: '/users/:id', makeDir: true }];
        routes = new Routes({routes: _routes});
    });

    describe('#match', function () {
        it('should match path', function () {
            should.exist(routes.match('/users'));
        });

        it('should not match invalid path', function () {
            should.not.exist(routes.match('/user'));
        });

        it('should match path with parameter ok', function () {
            should.exist(routes.match('/users/boycook'));
        });

        it('should not match invalid path with param', function () {
            should.not.exist(routes.match('/user/boycook'));
        });
    });
});
