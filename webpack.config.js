const path = require('path')

const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = () => {
  console.log(process.env.ENV, __dirname)
  return {
    entry: {
      contentScript: './src/contentScript/index.tsx',
      background: './src/background/index.ts',
      popup: './src/popup/index.tsx',
      injectContent: './src/contentScript/inject.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]/index.js'
    },
    module: {
      rules: [
        {
          test: /\.ts|tsx$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-typescript', '@babel/react']
          }
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader?modules', 'sass-loader']
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.ENV': JSON.stringify(process.env.ENV),
        'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL)
      }),
      new CopyWebpackPlugin({
        patterns: ['public/manifest.json', 'public/logo192.png']
      }),
      new HtmlWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        template: 'public/popup/index.html',
        title: 'Hello Chrome Extension Plugin',
        filename: 'popup/index.html'
      }),
      new CleanWebpackPlugin(),

      new MiniCssExtractPlugin({
        filename: '[name]/index.css'
      })
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    mode: 'production',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
      hot: true
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules|dist/
    }
  }
}
