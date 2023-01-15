const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://1.117.158.138:8081',
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    })
  )
}

