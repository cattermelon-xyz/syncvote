const path = require('path');
// const HtmlPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const Dotenv = require('dotenv-webpack');

console.log('in webpack.config.js');
console.log('output path: ', path.resolve(__dirname, '..', 'chrome-extension'));
module.exports = {
  entry: {
    popup: path.resolve('./src/index.tsx'),
    background: path.resolve('./src/background/background.ts'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new Dotenv()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@configs': path.resolve(__dirname, 'src/configs/'),
      '@data': path.resolve(__dirname, 'src/data/'),
      '@axios': path.resolve(__dirname, 'src/axios/'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'chrome-extension'),
  },
};
