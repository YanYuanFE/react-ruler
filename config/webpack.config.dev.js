const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    vendor: ["react", "react-dom"],
  },
  output: {
    filename: "js/[name].[hash].js",
    path: path.resolve(__dirname, "../dist"),
    chunkFilename: "js/[name].chunk.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: ["node_modules", path.resolve(__dirname, "src")],
    alias: {
      src: resolve("src"),
      assets: resolve("assets"),
      components: resolve("src/components"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          }
        }
      },
      {
        test: /\.less$/,
        include: /src/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: false,
                noIeCompat: true,
                javascriptEnabled: true,
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          name: 'fonts/[name].[hash:5].[ext]',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: 'images/[name].[hash:5].[ext]',
        },
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
    hot: true,
    overlay: true,
  },
  plugins: [
    new ESLintPlugin({
      fix: true,
      lintDirtyModulesOnly: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: resolve("public/index.html"),
      filename: "index.html",
      favicon: resolve("public/favicon.ico")
    })
  ]
};
