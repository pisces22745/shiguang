<template>
  <section id="address-list">
    <div class="top clearfix">
      <span class="icon-back fl" @click="$router.go(-1)"></span>
      <span class="title">{{title}}</span>
      <span>确定</span>
    </div>
    <div class="bottom">
      <div class="none" v-if="addressList.length===0"></div>
      <ul class="addresses" v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false">
        <li v-for="(item,index) in addressList">
          <div class="item-top">
            <span>{{item.consignee}}</span>
            <span>{{item.mobile}}</span>
            <p>{{item.prov}}{{item.city}}{{item.area}}{{item.address}}</p>
          </div>
          <div class="item-bottom clearfix">
            <div class="fl default" @click="setAddressDefault(item.id)" :ref="item.isdef===1?'active':''"
                 :data-id="index"
                 :class="{active:item.isdef===1}">设为默认
            </div>
            <div class="fr">
              <router-link :to="{path:'add',query:{id:item.id,isDef: item.isdef}}">编辑</router-link>
              <span @click="deleteAddress(item.id,index)">删除</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <router-link :to="{path:'/address/add',query:{isDef:addressList.length===0?1:0}}" class="btn-add">新增地址</router-link>
  </section>
</template>
<script>
  import Vue from 'vue'
  import {getAddressList, deleteAddress, setAddressDefault} from '@/config/api'
  import {mapState} from 'vuex'
  import {InfiniteScroll, Toast, MessageBox} from 'mint-ui'

  Vue.use(InfiniteScroll)

  export default {
    data() {
      return {
        addressList: [],
        page: 1,
        pageSize: 10,
        loading: false,
        infinate: true,
        title: ''
      }
    },
    computed: {
      ...mapState(['userInfo']),
      openid: function () {
        return this.userInfo.openid
      },
      type: function () {
        return this.$router.currentRoute.query.type
      }
    },
    methods: {
      getAddressList: function () {
        if (this.infinate) {
          getAddressList({
            openid: this.openid,
            page: this.page,
            pagesize: this.pageSize
          }).then(res => {
            if (res.status === 0) {
              this.infinate = res.obj.length === this.pageSize
              this.addressList.push.apply(this.addressList, res.obj)
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
          _this.getAddressList()
          _this.loading = false
        }, 500)
      },
      deleteAddress: function (id, index) {
        MessageBox.confirm('确定删除地址?').then(action => {
          deleteAddress({
            addrid: id,
            openid: this.openid,
            page: this.page,
            pagesize: this.pageSize
          }).then(res => {
            if (res.status === 0) {
              Toast('删除成功')
              this.addressList.splice(index, 1)
            } else {
              Toast(res.message ? res.message : '请求错误')
            }
          })
        }).catch(res => {
        })
      },
      setAddressDefault: function (id) {
        let oldid = this.addressList[this.$refs.active[0].getAttribute('data-id')].id
        if (oldid !== id) {
          setAddressDefault({
            newid: id,
            oldid: oldid,
            openid: this.openid
          }).then(res => {
            if (res.status === 0) {
              Toast('设置成功')
            } else {
              Toast(res.message ? res.message : '请求错误')
            }
          })
        }
      },
      getTitle: function () {
        this.title = !this.type ? '选择收货地址' : '地址管理'
      }
    },
    mounted() {
      this.getTitle()
      this.getAddressList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  #address-list {
    background-color: #f5f5f5;
    min-height: 100vh;
    overflow: hidden;
    .top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      margin-bottom: 10px;
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
      margin: 40px 0 52px;
      overflow: hidden;
      .addresses {
        li {
          margin-top: 10px;
          background-color: #fff;
          .item-top {
            padding: 15px 10px;
            border-bottom: 1px solid #eee;
            span {
              font-size: 16px;
              margin-right: 20px;
            }
            p {
              margin-top: 8px;
            }
          }
          .item-bottom {
            padding: 5px 10px;
            .default {
              font-size: 16px;
              &::before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                margin-right: 5px;
                width: 20px;
                height: 20px;
                border: 1px solid #666;
                border-radius: 50%;
              }
              &.active {
                position: relative;
                color: #e73828;
                &::before {
                  border: 1px solid #e73828;
                }
                &::after {
                  content: '';
                  display: block;
                  position: absolute;
                  top: 50%;
                  left: 5px;
                  margin-top: -2px;
                  -webkit-transform: rotate(-40deg);
                  transform: rotate(-40deg);
                  width: 12px;
                  height: 4px;
                  border-bottom: 1px solid #e73828;
                  border-left: 1px solid #e73828;
                }
              }
            }
            .fr {
              a, span {
                font-size: 16px;
                color: #e73828;
                margin-left: 15px;
              }
            }
          }
        }
      }
    }
    .btn-add {
      position: fixed;
      bottom: 0;
      z-index: 1;
      width: 100%;
      height: 42px;
      background: #e73828;
      text-align: center;
      line-height: 42px;
      color: #fff;
      font-size: 16px;
    }
  }
</style>
