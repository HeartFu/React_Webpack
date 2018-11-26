const webpackHotMiddleware = require('webpack-hot-middleware')

module.exports = (compiler, options) => {
	const hot = webpackHotMiddleware(compiler, options)

	return async function (ctx, next) {
		const originalEnd = ctx.res.end;

		await new Promise((resolve) => {
			ctx.res.end = function() {
				originalEnd.apply(this, arguments)
				resolve()
			}
			hot(ctx.req, ctx.res, function () {
				resolve()
			})
		})

		await next()
	}
}


