var path = require('path')
var Router = require('./lib/router')
var utils = require('./lib/utils')
var DataSet = require('./lib/dataset')
var mockjs = require('mockjs')

function sleep(delay) {
    return new Promise((reslove) => {
        setTimeout(() => {
            reslove()
        }, delay)
    })
}

module.exports = function (config) {
    //handle config
    config.routeFile = path.resolve(config.basePath, config.routeFile)
    config.mockFolder = path.resolve(config.basePath, config.mockFolder)
    config.mockExts = ['.js', '.json']

    var router = new Router(config.routeFile)

    return async function ({
        res,
        request,
        response
    }, next) {
        var route = request.path
        var match = router.search(route, request.method)

        request._search = {
            route: route,
            match: match
        }
        //if match file's extension not js or json , return next()
        if (!(match && match.file) || !utils.contains(config.mockExts, path.extname(match.file)))
            return next()
        var ds = new DataSet(
            config.mockFolder,
            config.mockExts
        )

        var data = ds.get(match.file, {
            params: match.params,
            query: request.query,
            body: request.body
        })

        //response delay
        var delay = 0
        if (data.$$delay >= 0) {
            delay = data.$$delay
            delete data['$$delay']
        }

        //response status
        var statusCode = 200
        if (!!data.$$statusCode) {
            statusCode = data.$$statusCode
            delete data['$$statusCode']
        }

        //DEFAULT ALLOW CORS
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', '*')

        //set response header
        if (data.$$header) {
            Object.keys(data.$$header).forEach(function (key) {
                res.set(key, data.$$header[key]);
            });
            delete data['$$header'];
        }
        // 提供接口等待共呢哥
        await sleep(delay)
        response.body = mockjs.mock(data)
    }
}
