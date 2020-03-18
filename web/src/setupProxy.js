const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy.createProxyMiddleware({
      target: 'https://darwin-api.continuousplatform.com/octopipe',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    })
  );
};