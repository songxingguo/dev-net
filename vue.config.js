module.exports = {
  runtimeCompiler: true,
  devServer: {
    open: false,//使用npm run serve 之后是否自动在浏览器中打开项目
    host: 'localhost',//主机名字
    port: 8080,//端口号
    https: false,//true启动浏览器会给出一些警告
    hotOnly: false,//热更新 webpack已经有
    proxy: {
      // 配置跨域，请求后端接口
      '/api': {
        target: 'https://api.weixin.qq.com',//源地址
        changeOrigin: true,//是否允许跨域
        ws: true,//是否代理websockets
        pathRewrite: {
          '^/api': ''
        }
      },
      '/foo': {
        target: 'https://cos.ap-shanghai.myqcloud.com',//源地址
        changeOrigin: true,//是否允许跨域
        ws: true,//是否代理websockets
        pathRewrite: {
          '^/foo': ''
        }
      },
      '/xfyun': {
        target: 'https://api.xfyun.cn',//源地址
        changeOrigin: true,//是否允许跨域
        ws: true,//是否代理websockets
        pathRewrite: {
          '^/xfyun': ''
        }
      }
    }
  }
}
