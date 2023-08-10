const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    assetModuleFilename: path.join('images', '[name][ext]'),
    publicPath: '/',
  },
  module: { rules: [
    { test: /\.ts$/i, use: 'ts-loader' },
    {
      test: /\.html$/,
      loader: 'html-loader',
      options: { minimize: false },
    },
    {
		  test: /\.(sc|sa|c)ss$/i,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    },
    {
      test: /\.(png|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.(woff2?|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name][ext]',
      },
    },
    {
      test: /\.(wav|mp3)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'audio/[name][ext]',
      },
    },
  ]},
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'template.html'),
      filename: 'index.html',
    }),
    new Dotenv(),
    new FileManagerPlugin({
      events: {
        onStart: { delete: ['dist'] },
        onEnd: { copy: [
          { source: path.join('public'), destination: path.join('dist', 'public') },
        ] },
      },
    }),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
};
