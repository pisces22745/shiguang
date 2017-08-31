<template>
  <section id="pay">
    <div class="top">
      <span class="icon-back"></span>
      <span class="book-name">{{gallery.name}}</span>
      <span class="service"></span>
    </div>
    <div class="middle">
      <div class="cover">
        <img :src="imgurl" alt="">
        <span class="preview"></span>
        <span class="page-num">共{{gallery.pages}}页</span>
      </div>
      <div class="block binding" v-if="type!=='postcard01'&&type!=='lomo'">
        <span class="title">装订方式：</span>
        <div v-for="(item,index) in bindings">
          <input type="radio" class="radio" name="binding" :checked="item.checked" :id="'check-'+index">
          <label :for="'check-'+index">{{item.name}}</label>
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
        <input type="text" v-model="promo" @input="promoInput()"/>
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
      <span>查看详情</span>
      <button @click="pay">去支付</button>
    </div>
  </section>
</template>
<script>
  import {mapState} from 'vuex'
  import {getCheck} from '@/config/api'
  import {Toast} from 'mint-ui'

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
          fixp: 2.9,
          checked: true
        }, {
          name: '文艺蝴蝶装(A5)',
          fixp: 3.9,
          checked: false
        }, {
          name: '硬壳精装(170*240)',
          fixp: 4.9,
          checked: false
        }],
        count: 1,
        promo: '',
        price: 0
      }
    },
    computed: {
      ...mapState(['baseUrl', 'userInfo']),
      openid: function () {
        return this.userInfo.openid
      },
      gid: function () {
        return this.$router.currentRoute.query.gid
      },
      type: function () {
        return this.$router.currentRoute.query.type
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
            this.postage = res.obj.postage
            this.style = res.obj.styles[0]
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      },
      promoInput: function () {

      },
      pay: function () {
        this.$router.push('order')
      }
    },
    mounted() {
      this.getCheck()
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e73828;
      height: 40px;
      padding: 0 12px;
      background-color: #fff;
      .icon-back {
        width: 20px;
        height: 20px;
        background: url("../../../static/image/icon_book_index.png") no-repeat center center/100%;
      }
      .book-name {
        font-size: 14px;
        color: #e73828;
        &::after {
          content: '作品';
          font-size: 12px;
        }
      }
      .service {
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
        height: 2.5rem;
        margin: 0 auto 30px;
        padding-top: 20px;
        img {
          width: 100%;
          box-shadow: 1px 1px 3pt rgba(0, 0, 0, 0.3);
        }
        .preview {
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
              padding: 3px 29px;
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
  }

</style>
