import Vue from 'vue'
import Router from 'vue-router'

const Index = resolve => require(['@/pages/home/index'], resolve)
const Address = resolve => require(['@/pages/address/index'], resolve)
const AddressList = resolve => require(['@/pages/address/list'], resolve)
const AddressAdd = resolve => require(['@/pages/address/add'], resolve)
const Coupon = resolve => require(['@/pages/coupon/coupon'], resolve)
const Gallery = resolve => require(['@/pages/gallery/gallery'], resolve)
const Order = resolve => require(['@/pages/order/list'], resolve)
const Payment = resolve => require(['@/pages/pay/payment'], resolve)
const Picture = resolve => require(['@/pages/picture/picture'], resolve)
const Edit = resolve => require(['@/pages/photo/edit'], resolve)
const Update = resolve => require(['@/pages/photo/update'], resolve)
const User = resolve => require(['@/pages/user/user'], resolve)
const Comment = resolve => require(['@/pages/comment/comment'], resolve)
const Preview = resolve => require(['@/pages/preview/index'], resolve)
const Qrcode = resolve => require(['@/pages/qrcode/index'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'index',
      component: Index
    }, {
      path: '/address',
      name: 'address',
      component: Address,
      redirect: '/address/list',
      children: [{
        path: 'list',
        name: 'addressList',
        component: AddressList
      }, {
        path: 'add',
        name: 'addressAdd',
        component: AddressAdd
      }]
    }, {
      path: '/coupon',
      name: 'coupon',
      component: Coupon
    }, {
      path: '/gallery',
      name: 'gallery',
      component: Gallery
    }, {
      path: '/order',
      name: 'order',
      component: Order
    }, {
      path: '/pay',
      name: 'pay',
      component: Payment
    }, {
      path: '/picture',
      name: 'picture',
      component: Picture
    }, {
      path: '/edit',
      name: 'edit',
      component: Edit
    }, {
      path: '/update',
      name: 'update',
      component: Update
    }, {
      path: '/user',
      name: 'user',
      component: User
    }, {
      path: '/comment',
      name: 'comment',
      component: Comment
    }, {
      path: '/preview',
      name: 'preview',
      component: Preview
    }, {
      path: '/qrcode',
      name: 'qrcode',
      component: Qrcode
    }, {
      path: '*',
      redirect: '/qrcode'
    }
  ]
})
