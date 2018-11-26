const utils = require('./utils')
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ThemeWebpackPlugin = require('./theme-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

const { env } = config.dev

module.exports = merge(baseWebpackConfig, {
    mode: JSON.parse(env.NODE_ENV),
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
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
                include: [utils.resolve('src/themes')]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader?minimize=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'sass-loader',
                    'postcss-loader'
                ],
                include: [utils.resolve('src'), utils.resolve('test')],
                exclude: [utils.resolve('src/themes')]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash].css')
            // filename: "[name].css"
        }),
        new webpack.DefinePlugin({
            'process.env': env,
            'process.config': JSON.stringify({
                suffix: '.json'
            })
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoErrorsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new ThemeWebpackPlugin(config.themes),
        new FriendlyErrorsPlugin()
    ]
})
