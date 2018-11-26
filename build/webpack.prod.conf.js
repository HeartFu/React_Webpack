const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const config = require('../config')
const utils = require('./utils')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ThemeWebpackPlugin = require('./theme-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const loadMinified = require('./load-minified')

const { env } = config.build

const webpackConfig = merge(baseWebpackConfig, {
    mode: JSON.parse(env.NODE_ENV),
    // devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?minimize=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'sass-loader',
                    'postcss-loader'
                ],
                include: [utils.resolve('src'), utils.resolve('test')]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash].css')
            // filename: "[name].css"
        }),
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env,
            'process.config': JSON.stringify({
                suffix: ''
            })
        }),
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
            serviceWorkerLoader: `<script>${loadMinified(path.resolve(__dirname, 'service-worker-prod.js'))}</script>`
        }),
        new ThemeWebpackPlugin(config.themes),
        new SWPrecacheWebpackPlugin({
            cacheId: '{{ name }}',
            filename: 'service-worker.js',
            // 注册pwa的静态资源文件类型
            staticFileGlobs: [`${config.build.assetsRoot}/**/*.{js,html,css}`],
            minify: true,
            navigateFallback: config.build.assetsPublicPath + 'index.html',
            stripPrefix: config.build.assetsRoot
         })
    ],
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            // chunks: "initial", async
            chunks: "initial",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors"
                },
                tools: {
                    test: /[\\/]src[\\/]tools[\\/]/,
                    name: "tools"
                }
            }
        },
    },
    performance: {
        hints: false
    }
})

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
