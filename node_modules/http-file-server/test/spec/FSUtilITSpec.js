var should = require('should');
var fs = require('../../index.js').FSUtil;

describe('FSUtil', function () {
    describe('#isDir', function () {
        it('should be true for directory', function () {
            var result = fs.isDir('./test');
            result.should.be.true;
        });
        it('should be false for invalid path', function () {
            var result = fs.isDir('./XXXXXXX');
            result.should.be.false;
        });
        it('should be false for file', function () {
            var result = fs.isDir('./test/spec/FSUtilITSpec.js');
            result.should.be.false;
        });
    });

    describe('#getDir', function () {
        it('should return result for valid directory', function () {
            var result = fs.getDir('./test');
            should.exist(result);
        });
        it('should not return result for invalid directory', function () {
            var result = fs.getDir('./XXXXXXX');
            should.not.exist(result);
        });
        it('should not return result for a file', function () {
            var result = fs.getDir('./test/spec/FSUtilITSpec.js');
            should.not.exist(result);
        });
    });

    describe('#getFile', function () {
        it('should return result for valid file', function () {
            var result = fs.getFile('./test/spec/FSUtilITSpec.js');
            should.exist(result);
        });
        it('should not return result for invalid file', function () {
            var result = fs.getFile('./XXXXXXX');
            should.not.exist(result);
        });
        it('should not return result for a directory', function () {
            var result = fs.getFile('./test');
            should.not.exist(result);
        });
    });

    describe('#getData', function () {
        it('should return result for a valid directory', function () {
            var result = fs.getData('./test');
            should.exist(result);
        });
        it('should return result for valid file', function () {
            var result = fs.getData('./test/spec/FSUtilITSpec.js');
            should.exist(result);
        });
        it('should return result for valid file with extension', function () {
            var result = fs.getData('./test/spec/FSUtilITSpec', 'js');
            should.exist(result);
        });
    });

    describe('#save', function () {
        it('should create directory ok', function () {
            fs.save('./test/temp');
        });
        it('should save file to disc ok', function () {
            fs.save('./test/temp/test1', {});
        });
    });

    describe('#delete', function () {
        it('should delete file ok', function () {
            fs.delete('./test/temp/test1', {});
        });
        it('should delete directory ok', function () {
            fs.delete('./test/temp');
        });
    });
});
