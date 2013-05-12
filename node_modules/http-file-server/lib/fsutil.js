var fs = require('fs');
var Object = require('object-utils');

function FSUtil() {
    //Not using prototype, don't want to store state
}

FSUtil.exists = function (path) {
    return fs.existsSync(path);
};

FSUtil.isDir = function (path) {
    if (fs.existsSync(path)) {
        return fs.statSync(path).isDirectory();
    }
    return false;
};

FSUtil.isFile = function (path) {
    if (fs.existsSync(path)) {
        return fs.statSync(path).isFile();
    }
    return false;
};

FSUtil.isNotDir = function (path) {
    return !FSUtil.isDir(path);
};

FSUtil.getDir = function (path) {
    if (FSUtil.isDir(path)) {
        return fs.readdirSync(path);
    }
    return undefined;
};

FSUtil.getFile = function (path) {
    if (fs.existsSync(path) && FSUtil.isNotDir(path)) {
        return fs.readFileSync(path);
    }
    return undefined;
};

FSUtil.delete = function (path) {
    if (FSUtil.isDir(path)) {
        fs.rmdirSync(path);
    } else {
        fs.unlinkSync(path);
    }
};

FSUtil.save = function (path, data) {
    if (Object.isNotEmpty(data)) {
        fs.writeFileSync(path, data);
    } else {
        fs.mkdirSync(path);
    }
};

FSUtil.getData = function (path, extension) {
    var data = undefined;
    if (FSUtil.isDir(path)) {
        data = {};
        data.data = fs.readdirSync(path);
        data.type = 'dir';
    } else if (Object.isDefined(extension) && fs.existsSync(path + '.' + extension)) {
        data = {};
        data.data = fs.readFileSync(path + '.' + extension);
        data.type = 'file';
        data.extension = extension;
    } else if (fs.existsSync(path)) {
        data = {};
        data.data = fs.readFileSync(path);
        data.type = 'file';
    }
    return data;
};

exports.FSUtil = FSUtil;
