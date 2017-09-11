<template>
  <section id="pay">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="book-name">{{gallery.name}}</span>
      <span class="service" @click="serviceFlag=true"></span>
    </div>
    <div class="middle">
      <div class="cover">
        <img :src="imgurl" alt="封面图片">
        <router-link class="preview" :to="{path:'preview'}"></router-link>
        <span class="page-num">共{{gallery.pages}}页</span>
      </div>
      <div class="block binding" v-if="type!=='postcard01'&&type!=='lomo'">
        <span class="title">装订方式：</span>
        <div v-for="(item,index) in bindings">
          <input type="radio" class="radio" name="binding" :checked="binding.name===item.name" :id="'check-'+index">
          <label :for="'check-'+index" @click="changeBinding(index)">{{item.name}}</label>
        </div>
      </div>
      <div class="block count">
        <span class="title">打印数量：</span>
        <span>
          <i @click="count>1?count--:0">-</i>
          <span>{{count >= 10 ? count : '0' + count}}</span>
          <i @click="count++">+</i>
        </span>
      </div>
      <div class="block promo">
        <span class="title">输入优惠码</span>
        <input type="text" v-model="promo"/>
      </div>
      <div class="block address">
        <div class="title">
          <span>收货信息</span>
          <router-link :to="{path:'address'}"></router-link>
        </div>
        <div class="content">
          <div v-if="address">
            <span>{{address.consignee}}</span>
            <span>{{address.mobile}}</span>
            <p>{{address.prov}}{{address.city}}{{address.area}}{{address.address}}</p>
          </div>
          <div v-if="!address" class="empty"><span>暂无收获信息</span></div>
          <p>注：本平台默认使用中通快递，所有已付款订单将在48小时内发货，如需帮助请联系客服</p>
        </div>
      </div>
    </div>
    <div class="bottom clearfix">
      <span class="price">{{price}}</span>
      <span @click="detailFlag=true">查看详情</span>
      <button @click="pay">去支付</button>
    </div>
    <transition name="fade">
      <div class="service-popup" v-if="serviceFlag" @click="serviceFlag=!serviceFlag">
        <span>客服热线：0571-88924919</span>
      </div>
    </transition>
    <transition name="fade">
      <div class="detail-popup" v-if="detailFlag" @click="detailFlag=!detailFlag">
        <h1>费用详情</h1>
        <ul>
          <li>
            <h2>基本费用：</h2>
            <div class="clearfix">
              <span>{{binding.name}}</span>
              <i>+</i>
              <span>固定的{{fixPage}}页</span>
              <hr/>
              <span class="fr">￥{{fixPage * binding.fixprice}}</span>
            </div>
          </li>
          <li>
            <h2 class="clearfix">超出费用：<i class="fr">+</i></h2>
            <div class="clearfix">
              <hr/>
              <span class="fr">￥{{(gallery.pages - fixPage) * style.unfixp}}</span>
            </div>
          </li>
          <li>
            <h2 class="clearfix">快递费用：<i class="fr">+</i></h2>
            <div class="clearfix">
              <hr/>
              <span class="fr">{{postage}}</span>
            </div>
          </li>
        </ul>
        <div class="all">
          <span>×</span>
          <span>{{count}}本</span>
          <span class="coupon">-￥{{coupon.reduce}}</span>
          <span class="price">总共：￥{{price}}</span>
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
  import {mapState} from 'vuex'
  import {getCheck, createOrder} from '@/config/api'
  import {Toast} from 'mint-ui'
  import wx from '@/util/wx'

  export default {
    data() {
      return {
        gallery: {},
        imgurl: '',
        address: null,
        coupon: null,
        postage: 0,
        style: null,
        bindings: [{
          name: '经典胶装(A5)',
          fixprice: 2.9
        }, {
          name: '文艺蝴蝶装(A5)',
          fixprice: 3.9
        }, {
          name: '硬壳精装(170*240)',
          fixprice: 4.9
        }],
        binding: {
          name: '经典胶装(A5)',
          fixprice: 2.9
        },
        fixPage: 20,
        count: 1,
        promo: '',
        price: 0,
        serviceFlag: false,
        detailFlag: false,
        htmlfile: ''
      }
    },
    computed: {
      ...mapState(['baseUrl', 'userInfo']),
      openid: function () {
        return this.userInfo.openid
      },
      _binding: {
        get: function () {
          return this.binding
        },
        set: function (binding) {
          this.binding = binding
          this.calculate()
        }
      },
      gid: function () {
        return this.$router.currentRoute.query.gid
      },
      type: function () {
        return this.$router.currentRoute.query.type
      }
    },
    watch: {
      count: function (newValue, oldValue) {
        this.calculate()
      },
      promo: function (newValue, oldValue) {
        if (!localStorage.getItem('promo1') && newValue === 'rayuyx0801') {
          this.price = this.calculate() / 2
        } else {
          this.calculate()
        }
      }
    },
    methods: {
      getCheck: function () {
        getCheck({
          gid: this.gid,
          gtype: this.type,
          htmlinfo: '',
          openid: this.openid
        }).then(res => {
          if (res.status === 0) {
            this.gallery = res.obj.gallery
            this.imgurl = this.baseUrl + this.gallery.imgurl
            this.address = res.obj.address
            this.coupon = res.obj.coupon
            this.htmlfile = res.obj.htmlfile
//            this.postage = res.obj.postage
            this.style = res.obj.styles[0]
            this.calculate()
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      },
      calculate: function () {
        let [basePrice, exceedPrice] = [this.binding.fixprice * this.fixPage, (this.gallery.pages - this.fixPage) * this.style.unfixp]
//        this.postage = this.count > 1 ? 0 : this.postage
        this.price = (basePrice + exceedPrice) * this.count + this.postage
        return this.price
      },
      pay: function () {
        createOrder({
          address: this.address.prov + this.address.city + this.address.area + this.address.address,
          consignee: this.address.consignee,
          couponid: this.coupon.mcid,
          cover: this.imgurl,
          gid: this.gid,
          gtype: this.type,
          htmlfile: this.htmlfile,
          mobile: this.address.mobile,
          num: this.count,
          openid: this.openid,
          param: {
            binding: this.binding.name
          },
          postage: this.postage,
          pricetext: {
            fixp: this.binding.fixprice,
            total: this.gallery.pages,
            pages: this.fixPage,
            unfixp: this.style.unfixp,
            reduce: this.postage.reduce
          },
          relprice: this.price,
          zcode: this.address.zcode
        }).then(res => {
          if (res.status === 0) {
            console.log(wx)
            wx.config(res.obj)
            wx.pay(res.obj, data => {
              this.$router.push('order')
            })
          }
        })
      },
      changeBinding: function (index) {
        this._binding = this.bindings[index]
      }
    },
    mounted() {
      this.getCheck()
      if (this.type.indexOf('lomo') > 0 || this.type.indexOf('postage') > 0) {
        this.fixPage = 10
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  #pay {
    .top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #e73828;
      height: 40px;
      line-height: 40px;
      padding: 0 12px;
      text-align: center;
      background-color: #fff;
      .book-name {
        display: inline-block;
        width: 70%;
        margin: 0 auto;
        text-align: center;
        color: #e73828;
        font-size: 14px;
        &::after {
          content: '作品';
          font-size: 12px;
        }
      }
      .service {
        position: absolute;
        top: 50%;
        right: 12px;
        margin-top: -10px;
        width: 20px;
        height: 20px;
        background: url("../../../static/image/icon_service.png") no-repeat center center/100%;
      }
    }
    .middle {
      margin: 40px 0 60px;
      .cover {
        position: relative;
        width: 1.75rem;
        margin: 0 auto 30px;
        padding-top: 20px;
        img {
          width: 100%;
          box-shadow: 1px 1px 3pt rgba(0, 0, 0, 0.3);
        }
        .preview {
          /*display: block;*/
          position: absolute;
          bottom: 2px;
          right: -1px;
          width: 21px;
          height: 21px;
          background: url("../../../static/image/icon_user_preview.png") no-repeat center center/100%;
        }
        .page-num {
          position: absolute;
          bottom: 2px;
          right: -50px;
          color: #e73828;
        }
      }
      .block {
        padding: 0 44px;
        margin-bottom: 10px;
        .title {
          font-size: 16px;
          color: #333;
        }
        &.binding {
          .radio {
            display: none;
            & + label {
              position: relative;
              display: inline-block;
              padding: 3px 0 3px 29px;
              font-size: 14px;
              font-weight: 300;
              &::before {
                content: "";
                position: absolute;
                top: 4px;
                left: 4px;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                border: 2px solid #777980;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
              }
              &::after {
                content: attr(title);
                position: absolute;
                top: 6px;
                left: 6px;
                width: 14px;
                height: 14px;
                border: 3px solid #F7F9F9;
                border-radius: 50%;
                font-size: 14px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
              }
            }
            &:checked + label {
              color: #e73828;
            }
            &:checked + label:before {
              border: 2px solid #e73828;
            }
            &:checked + label:after {
              background: #e73828;
            }
          }
        }
        &.count {
          &::after {
            content: '本';
            vertical-align: middle;
            margin-left: 5px;
            font-size: 16px;
          }
          span {
            &:nth-child(2) {
              i {
                display: inline-block;
                vertical-align: middle;
                width: 20px;
                height: 20px;
                line-height: 20px;
                font-size: 17px;
                border: 1px solid #e73828;
                border-radius: 50%;
                text-align: center;
                color: #e73828;
              }
              span {
                margin: 0 10px;
                font-size: 16px;
                vertical-align: middle;
              }
            }
          }
        }
        &.promo {
          input {
            padding: 6px;
            border-radius: 3px;
            border: 1px solid #e1e1e1;
            -webkit-appearance: none;
          }
        }
        &.address {
          margin: 30px 0 20px;
          .title {
            position: relative;
            display: block;
            padding: 5px 0;
            border-bottom: 2px dashed #e73828;
            span {
              font-size: 16px;
            }
            a {
              position: absolute;
              bottom: 5px;
              right: 0;
              display: block;
              width: 17px;
              height: 16px;
              background: url("../../../static/image/icon_change_address.png") no-repeat center center/100%;
            }
          }
          .content {
            padding: 8px 0;
            div {
              margin-bottom: 10px;
              &.empty {
                color: #999;
              }
              span, p {
                font-size: 14px;
              }
              span {
                margin-right: 5px;
              }
            }
            & > p {
              color: #999;
              font-size: 13px;
            }
          }
        }
      }
    }
    .bottom {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 50px;
      line-height: 50px;
      color: #fff;
      background-color: #e73828;
      padding: 0 44px;
      span {
        &.price {
          font-size: 18px;
          margin-right: 5px;
          &::before {
            content: '现价：￥';
          }
        }
      }
      button {
        float: right;
        height: 30px;
        margin-top: 10px;
        padding: 0 20px;
        border: 1px solid #fff;
        border-radius: 15px;
        background-color: #e73828;
        font-size: 18px;
        color: #fff;
        -webkit-transition: background .2s;
        -o-transition: background .2s;
        transition: background .2s;
        &.disabled {
          background-color: #999;
          border: none;
        }
      }
    }
    .service-popup {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0 35px;
      background-color: rgba(0, 0, 0, .8);
      z-index: 1;
      display: flex;
      align-items: center;
      span {
        flex: auto;
        padding: 25px 0;
        border-radius: 3px;
        box-shadow: 2px 2px 3px #000;
        background-color: #e73828;
        font-size: 18px;
        color: #fff;
        text-align: center;
        &::before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 19px;
          height: 19px;
          margin-right: 5px;
          background: url("../../../static/image/icon_telphone.png") no-repeat center center/100%;
        }
      }
    }
    .detail-popup {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 50px 35px 0;
      background-color: rgba(0, 0, 0, .8);
      z-index: 1;
      color: #fff;
      h1 {
        margin-bottom: 20px;
        font-size: 18px;
        color: #e73828;
      }
      ul {
        li {
          h2 {
            margin-bottom: 10px;
            font-size: 15px;
            font-weight: normal;
            line-height: 15px;
            &::before {
              content: '';
              display: inline-block;
              width: 16px;
              height: 16px;
              line-height: 1;
              margin-right: 5px;
              vertical-align: middle;
              text-align: center;
              border-radius: 50%;
              border: 1px solid #fff;
            }
          }
          & > div {
            padding-left: 21px;
            hr {
              height: 2px;
              margin-bottom: 8px;
              background-color: #fff;
            }
          }
          span {
            display: block;
            font-size: 15px;
            margin-bottom: 8px;
            padding-left: 15px;
          }
          i {
            font-size: 15px;
          }
          &:first-child {
            h2 {
              &::before {
                content: '1';
              }
            }
          }
          &:nth-child(2) {
            h2 {
              &::before {
                content: '2';
              }
            }
          }
          &:nth-child(3) {
            h2 {
              &::before {
                content: '3';
              }
            }
          }
        }
      }
      .all {
        margin-top: 5%;
        span {
          display: block;
          text-align: right;
          margin-bottom: 5px;
          font-size: 15px;
          &.coupon {
            &::before {
              content: '优惠券';
              margin-right: 5px;
            }
          }
          &.price {
            font-size: 16px;
            color: #e73828;
          }
        }
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .2s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
      opacity: 0;
    }
  }

</style>
