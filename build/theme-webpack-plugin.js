const cheerio = require('cheerio')
const UglifyJS = require('uglify-es')

function ThemeWebpackPlugin(options) {
    this.options = options;
    // Configure your plugin with options...
}

ThemeWebpackPlugin.prototype.apply = function (compiler) {
    compiler.plugin('compilation', (compilation) => {
        compilation.plugin(
            'html-webpack-plugin-after-html-processing',
            (data) => {
                const $ = cheerio.load(data.html)
                // const code = UglifyJS.minify()
                const themeHtml = {};
                for (const key in this.options) {
                    themeHtml[key] = data.assets.chunks[key].css[0];
                    $(`link[href='${themeHtml[key]}']`).remove();
                    $(`script[src='${data.assets.chunks[key].entry}']`).remove();
                }
                $('head').append(`<script>window.themeUrl = ${JSON.stringify(themeHtml)};</script>`)
                data.html = $.html();
            }
        )
    })
}

module.exports = ThemeWebpackPlugin
