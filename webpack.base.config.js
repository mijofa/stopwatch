const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = function(options) {
  options = {
    ...{
      base: "",
      relocate: true
    },
    ...(options || {})
  };

  return {
    module: {
      rules: [
        {
          test: /\.node$/,
          use: "node-loader"
        },
        options.relocate
          ? {
              test: /\.(m?js|node)$/,
              parser: { amd: false },
              use: {
                loader: "@marshallofsound/webpack-asset-relocator-loader",
                options: {
                  outputAssetBase: "native_modules"
                }
              }
            }
          : {},
        {
          test: /\.vue$/,
          use: "vue-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"]
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico|eot|woff2?|ttf|otf)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[contenthash].[ext]",
              publicPath: options.base
            }
          }
        }
      ]
    },

    resolve: {
      extensions: [".vue", ".js"],
      alias: {
        vue: "vue/dist/vue.esm.js"
      }
    },

    plugins: [
      new webpack.DefinePlugin({
        "flags.PRODUCTION": process.env.NODE_ENV === "production"
      }),
      new VueLoaderPlugin()
    ]
  };
};
