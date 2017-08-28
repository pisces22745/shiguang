// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './config/router'

import '@/style/base/reset.css'
import '@/style/base/common.less'
import '@/util/fontset'

Vue.config.productionTip = false
const whiteList = ['/home', '/goods', '/login', '/goodsDetails'] // 不需要登陆的页面
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
