// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './config/router'

import store from './vuex/store'

import '@/style/base/reset.css'
import '@/style/base/common.less'
import '@/util/fontset'
import 'mint-ui/lib/swipe/style.css'

let VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.config.productionTip = false
const whiteList = ['/home', '/goods', '/login', '/goodsDetails'] // 不需要登陆的页面
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
