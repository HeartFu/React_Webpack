require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const c2 = require('koa2-connect')
const mount = require('koa-mount')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const mockMiddleware = require('./mock-middleware')
const webpackConfig = require('./webpack.dev.conf')
const c = require('child_process')
const probe = require('./probe')


let _resolve
const readyPromise = new Promise(resolve => {
    _resolve = resolve
})
let server
(async _ => {
    // default port where dev server listens for incoming traffic
    const port = await probe(process.env.PORT || config.dev.port)

    // automatically open browser, if not set will be false
    const autoOpenBrowser = !!config.dev.autoOpenBrowser
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware
    const proxyTable = config.dev.proxyTable || {}

    const app = new Koa()
    const compiler = webpack(webpackConfig)

    const devMiddleware = require('./webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true,
        logLevel: 'warn'
    })

    const hotMiddleware = require('./webpack-hot-middleware')(compiler, {
        log: () => {}
    })
    // force page reload when html-webpack-plugin template changes
    // compiler.plugin('compilation', function (compilation) {
    //     // compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    //     //     // console.log(hotMiddleware.middleware)
    //     //     hotMiddleware.reload()
    //     // })
    //     compilation.plugin.plugin('html-webpack-plugin-after-html-processing', function (data, cb) {
    //         // console.log(hotMiddleware.middleware)
    //         // hotMiddleware.reload()
    //         console.log('222222');
    //         console.log(data);
    //         cb()
    //     })
    // })

    // proxy api requests
    Object.keys(proxyTable).forEach(function (context) {
        const options = proxyTable[context]
        if (typeof options === 'string') {
            options = {
                target: options
            }
        }
        app.use(c2(proxyMiddleware(options.filter || context, options)))
    })
    // handle fallback for HTML5 history API
    app.use(require('koa-connect-history-api-fallback')())


    // serve webpack bundle output
    app.use(devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware)

    // serve pure static assets
    const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
    // staticPath, 
    app.use(mount('/static', koaStatic('./static')))


    const uri = 'http://localhost:' + port

    console.log('> Starting dev server...')
    devMiddleware.waitUntilValid(() => {
        console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
        if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
            opn(uri)
        }
        _resolve()
    })


    app.use(mockMiddleware({
        basePath: __dirname,
        mockFolder: '../mocks',
        routeFile: '../config/mock.js'
    }))
    server = app.listen(port, function () {
        c.exec('start ' + uri);
    })

})()

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}

