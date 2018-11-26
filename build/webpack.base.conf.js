const path = require('path');
const utils = require('./utils');

const projectRoot = path.resolve(__dirname, '../');

const config = require('../config');

let webpackConfig = {
    entry: {
        app: ['babel-polyfill', './src/main.js'],
        ...config.themes
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    externals: {
        baseURL: 'baseURL'
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': utils.resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [utils.resolve('src'), utils.resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [utils.resolve('src'), utils.resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'react-svg-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=100000&mimetype=application/octet-stream',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?minimize=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'postcss-loader'
                ],
                include: [utils.resolve('node_modules')]
            }
        ]
    }
}

module.exports = webpackConfig
