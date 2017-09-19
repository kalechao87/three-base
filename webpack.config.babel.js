import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const defaultEnv = {
  dev: true,
  production: false,
};

export default (env = defaultEnv) => ({
  entry: path.join(__dirname, 'src/app.js'),
  output: {
    filename: '[name].[chunkhash:8].bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [['env', { modules: false }]],
          },
        },
      },

      {
        test: /\.scss/,
        use: env.dev
          ? [
            {
              loader: 'style-loader', // create style nodes from JS string
              options: { sourceMap: true },
            },
            {
              loader: 'css-loader', // transpile CSS int CommonJS
              options: { sourceMap: true },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'sass-loader', // compile Sass to CSS
              options: { sourceMap: true },
            },
          ]
          : ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader', // transpile CSS int CommonJS
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader', // compile Sass to CSS
              },
            ],
            fallback: 'style-loader',
          }),
      },
    ],
  },
  plugins: [
    ...(env.dev ? [] : [new ExtractTextPlugin('[name].[contenthash:8].css')]),
    new HtmlWebpackPlugin({
      title: 'Three.js starter',
      inject: 'body',
    }),
    new CleanWebpackPlugin(['dist']),
  ],
  devtool: env.dev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
  },
});
