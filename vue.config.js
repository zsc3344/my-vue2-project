const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const NODE_ENV = process.env.NODE_ENV
const isProduction = NODE_ENV === 'production'?true: false

const timeStamp = new Date().getTime

module.exports = defineConfig({
  // 基本路径 整个文件夹所在
  publicPath:'./',
  filenameHashing: false,
  // 输出文件目录 文件夹名
  outputDir: 'dist',
  // 放置生成的静态资源 （js、css、img、fonts）的 （相对于outputDir的）目录。   资源放的目录
  assetsDir: './static',
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径    index的路径和名字
  indexPath:'./index.html',
  // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  productionSourceMap: false,
  // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  transpileDependencies: [],
  // eslint-loader 是否在保存的时候检查
  lintOnSave:true,
  // 构建时开启多进程处理babel编译
  parallel: require('os').cpus().length > 1,
  devServer: {
    port: 8081,
    host:'127.0.0.1',
    open: true,
    allowedHosts: '*',
    hot: true,
    proxy:'http://localhost:8080'
    // proxy:{
    //   ['/openSign']: {
    //     target: 'http://192.168.48.40:8666',
    //     changeOrigin: true
    //     // pathRewrite: {
    //     //   ['^' + process.env.VUE_APP_BASE_URL]: ''
    //     // }
    //   }
    // }
  },
  configureWebpack: (config) =>{
    // 输出重构 打包编译后的js文件名称,添加时间戳.
    // config.output = {
    //   filename: `js/js[name].${timeStamp}.js`,
    //   chunkFilename: `js/chunk.[id].${timeStamp}.js`,
    // },
    config.plugins.name = 'my-vue2-project',
    config.resolve = {
      alias: {
        '@': resolve('src')
      }
    }
    config.plugins.devtool = 'inline-cheap-module-source-map',
    config.plugins.configurations = [
      {
        name:'Launch Chrome',
        request:'launch',
        type:'pwa-chrome',
        url:'http://localhost:8080',
        sourceMapPathOverrides:{
          'webpack://my-vue-demo/src/App.vue?11c4':'${workspaceRoot}/src/*'
        }
      }
    ],
    // 公共代码抽离
    config.optimization = {
      splitChunks: {
          cacheGroups: {
              vendor: {
                  chunks: 'all',
                  test: /node_modules/,
                  name: 'vendor',
                  minChunks: 1,
                  maxInitialRequests: 5,
                  minSize: 0,
                  priority: 100
              },
              common: {
                  chunks: 'all',
                  test: /[\\/]src[\\/]js[\\/]/,
                  name: 'common',
                  minChunks: 2,
                  maxInitialRequests: 5,
                  minSize: 0,
                  priority: 60
              },
              styles: {
                  name: 'styles',
                  test: /\.(sa|sc|c)ss$/,
                  chunks: 'all',
                  enforce: true
              },
              runtimeChunk: {
                  name: 'manifest'
              }
          }
      }
    },
    config.devtool="source-map"
  },
  chainWebpack:config => {
    config.resolve.alias // 添加别名
      .set('@assets',resolve('src/assets'))
    // config.module
    //   .rule('worker')
    //   .test(/\.worker\.js$/)
    //   .use('worker')
    //   .loader('worker-loader')
    // 对图片文件进行压缩
    // config.plugins.delete('prefetch')
    // config.module.rule('images')
    //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({ bypassOnDebug: true })
  },
  css: {
    extract: { // 打包后css文件名称添加时间戳
      filename: `css/[name].${timeStamp}.css`,
      chunkFilename: `css/chunk.[id].${timeStamp}.css`,
    }
  }
})
