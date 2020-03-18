const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy.createProxyMiddleware({
      target: 'http://localhost:8080/api/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    })
  );
};