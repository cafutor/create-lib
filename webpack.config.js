const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { NODE_ENV: env } = process.env;

const config = {
  mode: 'development',
  entry: {
    bundle: './compDev/index.jsx',
  },
  devtool: 'inline-source-map',
  externals: {
    react: 'React',
    'react-dom/client': 'ReactDOM',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Dev',
      template: path.join(__dirname, 'compDev', 'helper', 'index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: false,
    port: 8080,
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.css',
      '.less',
      '.scss',
    ],
    alias: {
      '@': __dirname,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
};

// 删除 source map
if (env === 'pro') {
  config.mode = 'production';
  delete config.devtool;
}

module.exports = config;
