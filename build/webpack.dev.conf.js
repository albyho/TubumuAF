'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const path = require('path')
const glob = require('glob')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    /*
    // 修改1: 在后面配置 HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),*/
    new FriendlyErrorsPlugin()
  ]
})

// 修改2: 配置 HtmlWebpackPlugin
function getEntries(globPath) {
  var entries = {},
    basename, tmp, pathname;
  if (typeof (globPath) !== "object") {
    globPath = [globPath]
  }
  globPath.forEach(function (itemPath) {
    glob.sync(itemPath).forEach(function (entry) {
      basename = path.basename(entry, path.extname(entry));
      if (entry.split('/').length > 4) {
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[pathname] = entry;
      } else {
        entries[basename] = entry;
      }
    });
  });
  return entries;
}

const pages = getEntries(['./src/modules/*.html', './src/modules/**/*.html']);

for (let pathname in pages) {
  const isRedirectPage = (pathname.indexOf('modules') === -1);
  // 配置生成的html文件，定义路径等
  const conf = {
    filename: pathname + '.html',
    template: pages[pathname], // 模板路径
    inject: !isRedirectPage // js插入位置(跳过modules目录下的index.html，其只是用来跳转用)
  };

  if (!isRedirectPage) {
    for (let key in module.exports.entry) {
      if (key === pathname) {
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        conf.chunksSortMode = 'dependency'
        conf.chunks = ['manifestcore', 'vendorcore', pathname];
        conf.hash = true;
      }
    }
  }

  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}
