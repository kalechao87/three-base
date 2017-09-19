import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const defaultEnv = {
  dev: true,
  production: false,
};

export default (env = defaultEnv) => ({
  entry: path.join(__dirname, 'src/app.js'),
  output: {
    filename: '[name].[chunkhash].bundle.js',
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
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
});
