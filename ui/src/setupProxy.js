const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    process.env.REACT_APP_API_URI,
    createProxyMiddleware({
      target: process.env.REACT_APP_URI,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        [`^${process.env.REACT_APP_API_URI}/`]: process.env.PUBLIC_URL
      }
    })
  );
};
