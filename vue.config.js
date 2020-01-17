module.exports = {
  runtimeCompiler: true,
  devServer: {
    open: false,//使用npm run serve 之后是否自动在浏览器中打开项目
    host: 'localhost',//主机名字
    port: 8080,//端口号
    https: false,//true启动浏览器会给出一些警告
    hotOnly: false,//热更新 webpack已经有
  }
}
