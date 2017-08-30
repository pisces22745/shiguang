/**
 * Created by shaoluqin on 2017/8/22.
 */
import axios from 'axios'

let base = process.env.API_ROOT + '/api'

// 获取用户头像
export const headerImage = params => {
  return axios.get(`${base}/p/headerImage`, {params: params}).then(res => res.data)
}
// 获取相册页面信息
export const getUserCenter = params => {
  return axios.get(`${base}/p/center`, {params: params}).then(res => res.data)
}

// 获取相册加载列表
export const getGalib = params => {
  return axios.get(`${base}/p/galib`, {params: params}).then(res => res.data)
}

// 创建相册
export const createAlbum = params => {
  return axios.get(`${base}/c/gallery`, {params: params}).then(res => res.data)
}

// 删除相册
export const deleteAlbum = params => {
  return axios.post(`${base}/p/dg?gid=` + params.id, params).then(res => res.data)
}

// 获取照片库
export const getPicList = params => {
  return axios.get(`${base}/p/piclist`, {params: params}).then(res => res.data)
}
// 生成内容页
export const createPhotoList = params => {
  return axios.post(`${base}/c/gp`, params).then(res => res.data)
}
// 更换封面
export const changeCover = params => {
  return axios.get(`${base}/c/gallery`, {params: params}).then(res => res.data)
}

// 获取内容页列表
export const getPhotoList = params => {
  return axios.get(`${base}/c/pl`, {params: params}).then(res => res.data)
}
// 删除一张内容页
export const deletePage = params => {
  return axios.post(`${base}/c/dp`, params).then(res => res.data)
}

// 获取修改内容页内容
export const getUpdatePage = params => {
  return axios.get(`${base}/c/gpa`, {params: params}).then(res => res.data)
}
