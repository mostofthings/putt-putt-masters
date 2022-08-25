const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {SuperMinifyPlugin} = require("./webpack-super-minify-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const glslLoader = path.resolve(__dirname, 'webpack-glsl-loader.js');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new SuperMinifyPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /.spec.ts/, /tools/],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    clean: true,
    path: path.resolve(__dirname, 'dist'),
  },
};
