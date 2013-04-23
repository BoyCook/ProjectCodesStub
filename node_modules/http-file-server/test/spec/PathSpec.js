
var should = require('should');
var Path = require('../../index.js').Path;

describe.skip('Path', function() {

    var path;

    before(function(){
        path = new Path('/users/:id');
    });

    it('should match plain path ok', function(){
        var result = path.match('/users/boycook');
        result.should.bt.true;
    });

    describe('#match', function() {
        it('should match valid path ok', function(){

        });
    });
});
