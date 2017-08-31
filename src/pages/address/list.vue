<template>
  <section id="address-list">
    <div class="top clearfix">
      <span class="icon-back fl" @click="$router.go(-1)"></span>
      <span class="title">地址管理</span>
    </div>
  </section>
</template>
<script>
  import {getAddressList} from '@/config/api'
  import {mapState} from 'vuex'
  import {InfiniteScroll, Toast, MessageBox} from 'mint-ui'

  export default {
    data() {
      return {
        addressList: [],
        page: 1,
        pageSize: 10,
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
      getAddressList: function () {
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
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  #address-list {
    background-color: #f5f5f5;
    min-height: 100vh;
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
  }
</style>
