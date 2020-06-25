const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://charles-dev.continuousplatform.com',
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api/': '/' // remove base path
      }
    })
  );
};