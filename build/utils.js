const path = require('path')
const config = require('../config')

exports.resolve = function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

exports.assetsPath = function (_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
        config.build.assetsSubDirectory :
        config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}
