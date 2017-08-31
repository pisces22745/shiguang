<template>
  <section id="order">
    <div class="top clearfix">
      <span class="icon-back fl" @click="$router.go(-1)"></span>
      <span class="title">我的订单（{{count}}）</span>
    </div>
    <div class="bottom">
      <div class="none" v-if="orderList.length===0"></div>
      <ul class="order-list" v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false">
        <li v-for="(item,index) in orderList">
          <div class="list-title clearfix">
            <span class="product">爱印客</span>
            <span class="fr status">{{status[item.status]}}</span>
          </div>
          <div class="list-content">
            <div class="order-info clearfix">
              <img :src="item.image" alt="" class="fl">
              <div class="description fl">{{gtype[item.gtype]}}</div>
              <div class="price fr">
                <span>￥{{item.price}}</span>
                <span>×{{item.printnum}}</span>
              </div>
            </div>
            <p>共{{item.printnum}}件商品 实付：￥{{item.relprice}}</p>
          </div>
          <div class="list-footer">
            <span v-if="item.status===0" @click="cancelOrder(item.id,index)">取消订单</span>
            <span class="active" v-if="item.status===0">去支付</span>
            <span class="active" v-if="item.status===1">待发货</span>
            <span class="active" v-if="item.status===10|| item.status===4">晒一晒</span>
            <span class="active" v-if="item.status===3">确认收货</span>
          </div>
        </li>
        <li class="loading" v-if="infinate">
          <span class="ball_line_rotate"></span>
          <span>加载更多</span>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
  import Vue from 'vue'
  import {getOrderList, cancelOrder} from '@/config/api'
  import {mapState} from 'vuex'
  import {InfiniteScroll, Toast, MessageBox} from 'mint-ui'

  Vue.use(InfiniteScroll)
  export default {
    data() {
      return {
        orderList: [],
        count: 0,
        page: 1,
        pageSize: 5,
        status: {
          0: '待付款',
          1: '待发货',
          2: '已取消',
          3: '待收货',
          4: '已收货',
          10: '已完成'
        },
        gtype: {
          travel01: '一个人的旅行',
          travel02: '我和你，在路上',
          travel03: '我的桂林印象',
          travel04: '江南行—最忆是杭州',
          travel05: '许我一个江南',
          travel06: '彩云之南，丽江之旅',
          baby01: '萌宝养成记',
          baby02: '萌宝养成记',
          memory01: '时光流年',
          memory02: '青春不散场—毕业纪念',
          memory03: '感谢有你—毕业纪念',
          memory04: '感恩有你',
          memory05: '童年的梦想',
          memory06: '长相知，长相恋',
          lomo: 'lomo照片',
          postcard: '明信片'
        },
        loading: false,
        infinate: true
      }
    },
    computed: {
      ...mapState(['baseUrl', 'userInfo']),
      openid: function () {
        return this.userInfo.openid
      }
    },
    methods: {
      getOrderList: function () {
        if (this.infinate) {
          getOrderList({
            openid: this.openid,
            page: this.page,
            page_size: this.pageSize,
            status: 0
          }).then(res => {
            if (res.status === 0) {
              this.infinate = res.obj.orders.length === this.pageSize
              this.orderList.push.apply(this.orderList, res.obj.orders)
              this.count = res.obj.count
              this.page++
            } else {
              Toast(res.message ? res.message : '请求错误')
            }
          })
        }
      },
      loadMore: function () {
        let _this = this
        this.loading = true
        setTimeout(() => {
          _this.getOrderList()
          _this.loading = false
        }, 500)
      },
      cancelOrder: function (id, index) {
        MessageBox.confirm('确定取消订单?').then(action => {
          cancelOrder({
            action: 'c',
            oid: id
          }).then(res => {
            if (res.status === 0) {
              Toast('取消订单成功')
              this.orderList[index].status = 2
            } else {
              Toast(res.message ? res.message : '请求错误')
            }
          })
        })
      }
    },
    mounted() {
      this.getOrderList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  #order {
    background-color: #f5f5f5;
    .top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e73828;
      background-color: #fff;
      .title {
        display: inline-block;
        width: 70%;
        margin: 0 auto;
        text-align: center;
        font-size: 16px;
        color: #e73828;
      }
    }
    .bottom {
      .order-list {
        li {
          margin-bottom: 10px;
          padding: 0 10px;
          background-color: #fff;
          .list-title {
            padding: 8px 0;
            font-size: 13px;
            .product {
              color: #333;
              &::before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
                width: 18px;
                height: 16px;
                background: url("../../../static/image/icon_edit_logo.png") no-repeat center center/100%;
              }
            }
            .status {
              color: #e73828;
            }
          }
          .list-content {
            padding: 10px 0;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            .order-info {
              img {
                width: 60px;
                box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
              }
              .description {
                margin: 8px 12px;
                color: #666;
              }
              .price {
                span {
                  display: block;
                  text-align: right;
                  &:first-child {
                    margin: 5px 0;
                    font-size: 14px;
                  }
                  &:last-child {
                    color: #999;
                  }
                }
              }
            }
            p {
              margin-top: 6px;
              text-align: right;
            }
          }
          .list-footer {
            padding: 12px 0;
            text-align: right;
            span {
              display: inline-block;
              margin-left: 2px;
              padding: 2px 12px;
              border-radius: 12px;
              color: #666;
              border: 1px solid #999;
              &.active {
                color: #e73828;
                border: 1px solid #e73828;
              }
            }
          }
          &.loading {
            padding: 10px 0;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
