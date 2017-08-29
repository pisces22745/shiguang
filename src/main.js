// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './config/router'

import store from './vuex/store'

import '@/style/base/reset.css'
import 'mint-ui/lib/style.css'

import '@/style/base/common.less'
import '@/util/fontset'
import VueCookie from 'vue-cookie'
// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.config.productionTip = false
const whiteList = ['/home', '/preview', '/qrcode'] // 不需要登陆的页面

router.beforeEach(function (to, from, next) {
  if (process.env.NODE_ENV === 'development') {
    store.commit('SET_USERINFO', {
      openid: "oxcqAwJAEWJ7Ncc4QiL_RYlOEaPw"
    })
    next()
  } else {
    if (VueCookie.get('userInfo')) {  // 已关注
      store.commit('SET_USERINFO', VueCookie.get('userInfo'))
      next()
    } else {    // 未关注
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('qrcode')
      }
    }
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
