module.exports = async ({ config }) => {
  config.resolve.extensions.push('.svg');

  config.module.rules = config.module.rules.map(data => {
    if (/svg\|/.test( String( data.test ) ))
      data.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;

    return data;
  });

  config.resolve.alias = {
    core: require('path').resolve(__dirname, '../src/core'),
    containers: require('path').resolve(__dirname, '../src/containers'),
    components: require('path').resolve(__dirname, '../src/components'),
    animations: require('path').resolve(__dirname, '../src/animations'),
    routes: require('path').resolve(__dirname, '../src/routes'),
  }

  config.resolve.extensions = ['.jsx', '.js', '.json']

  config.module.rules.push({
    test: /\.svg$/,
    use: [{ loader: require.resolve('babel-loader') },
          { loader: require.resolve('react-svg-loader') }]
  });

  return config;
};