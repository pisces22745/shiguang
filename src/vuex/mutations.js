import {GET_USERINFO, SET_USERINFO} from './mutation-types'

export default {
  [GET_USERINFO](state) {
    return state.userInfo
  },
  [SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo
  }
}
