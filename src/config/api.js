/**
 * Created by shaoluqin on 2017/8/22.
 */
import axios from 'axios'

let base = process.env.API_ROOT + '/api'

// 获取用户头像
export const headerImage = params => {
  return axios.get(`${base}/p/headerImage`, {params: params}).then(res => res.data)
}
