import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import action from './action'

Vue.use(Vuex)

// 应用初始状态
const state = {
  login: false,
  userInfo: {},
  baseUrl: 'http://personalize.hzaiyin.cn/API/Files/Covers/'
}

// 创建 store 实例
export default new Vuex.Store({
  action,
  state,
  mutations
})
