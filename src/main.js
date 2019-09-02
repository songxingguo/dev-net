import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import AV from 'leancloud-storage'
import {Realtime} from 'leancloud-realtime'
import 'ant-design-vue/dist/antd.css'
import './assets/style/base.scss'
import router from './router'
import axios from 'axios'

const {appId, appKey} = {
  appId: "hJlVtqYMU2inTJ6WDsLruwRm-gzGzoHsz",
  appKey: "ist6rnuv2KfBpkdEng22uNA0"
};
// 初始化即时通讯 SDK
const realtime = new Realtime({
  appId: 'hJlVtqYMU2inTJ6WDsLruwRm-gzGzoHsz',
  appKey: 'ist6rnuv2KfBpkdEng22uNA0',
});

// 初始化 axios
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = '/api'
Vue.prototype.$axios = axios


// 初始化 AV
AV.init(appId, appKey);
Vue.prototype.AV = AV  // 将初始化后的 AV 挂载到 Vue 上
Vue.prototype.realtime = realtime
Vue.config.productionTip = false

// 引入 AntDesign
Vue.use(Antd)

// 登录验证
router.beforeEach((to, from, next) => {
  // 这里的meta就是我们刚刚在路由里面配置的meta
  if (to.meta.requireAuth) {
    // 下面这个判断是自行实现到底是否有没有登录
    if (AV.User.current()) {
      // 登录就继续
      next();
    } else {
      // 没有登录跳转到登录页面，登录成功之后再返回到之前请求的页面
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    // 不需要登录的，可以继续访问
    next()
  }
});

// 绑定路由
window.$VueRouter = router

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

