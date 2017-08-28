<template>
  <section id="user">
    <div class="top">
      <router-link :to="{path: 'home'}" class="home">主页</router-link>
      <router-link :to="{path: 'comment'}" class="comment">评论</router-link>
      <div class="header-img">
        <img :src="headerImg" alt="头像">
      </div>
    </div>
    <div class="middle">
      <ul>
        <li class="order">
          <router-link :to="{path:'order'}">我的订单</router-link>
        </li>
        <li class="coupon">
          <router-link :to="{path:'coupon'}">我的优惠券</router-link>
        </li>
        <li class="address">
          <router-link :to="{path:'address'}">我的地址</router-link>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <div class="title">
        <span>我的相册</span>
        <span>({{galleryNum}})</span>
        <router-link :to="{path:'home'}">+新书</router-link>
      </div>
      <ul>
        <li v-for="(item,index) in gaList">
          <div class="cover">
            <router-link :to="{path:'preview',query: {id:item.id,isshare:1}}" class="preview">预览</router-link>
            <img :src="baseUrl+item.imgurl" alt="">
            <span class="delete" @click="deleteAlbum(item.id)">删除</span>
          </div>
          <div class="text">
            <h1>{{item.name}}</h1>
            <p>{{item.pages}}</p>
            <p>创建时间</p>
            <p>{{item.date}}</p>
            <p>{{index + 1}}</p>
            <router-link :to="{path:'edit',query:{gid:item.id,bookType:item.type}}" class="btn-edit">去编辑</router-link>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
  import {getUserCenter, deleteAlbum} from '@/config/api'
  import {Toast} from 'mint-ui'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        headerImg: '',
        galleryNum: 0,
        gaList: [],
        page: 1,
        pageSize: 5
      }
    },
    computed: {
      ...mapState(['baseUrl'])
    },
    methods: {
      getUserCenter: function () {
        getUserCenter({
          openid: 'oxcqAwJAEWJ7Ncc4QiL_RYlOEaPw',
          page: this.page,
          pagesize: this.pageSize
        }).then(res => {
          if (res.status === 0) {
            this.headerImg = res.obj.headimgurl
            this.gaList = res.obj.galist
          } else {
            Toast(res.message)
          }
        })
      },
      deleteAlbum(id) {
        deleteAlbum({
          id: id
        }).then(res => {
          if (res.status === 0) {
            Toast('删除成功')
          } else {
            Toast(res.message)
          }
        })
      }
    },
    mounted() {
      this.getUserCenter()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .top {
    position: relative;
    border-top: 2px solid #e73828;
    height: 1.78rem;
    margin-bottom: 10px;
    background: url("../../../static/image/user-background.png") no-repeat center center/cover;
    a {
      position: absolute;
      top: 13px;
      display: block;
      width: 20px;
      height: 20px;
      text-indent: -9999px;
      &.home {
        left: 13px;
        background: url("../../../static/image/icon_home.png") no-repeat center center/100%;
      }
      &.comment {
        right: 13px;
        background: url("../../../static/image/icon_comment.png") no-repeat center center/100%;
      }
    }
    .header-img {
      &::before, &::after {
        content: '';
        position: absolute;
      }
      &::before {
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 110px;
        height: 110px;
        border-radius: 50%;
        border: 1px solid #fff;
      }
      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-top: -30px;
        margin-left: -56px;
        background-color: rgba(255, 255, 255, .5);
      }
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        border-radius: 50%;
        width: 64px;
        height: 64px;
        border: 3px solid #fff;
      }
    }
  }

  .middle {
    padding-left: 15px;
    background-color: #fff;
    margin-bottom: 10px;
    ul {
      li {
        position: relative;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        &::before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 21px;
          height: 21px;
          margin-right: 10px;
        }
        &::after {
          position: absolute;
          top: 50%;
          right: 15px;
          margin-top: -4px;
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          border-top: 1px solid #565656;
          border-right: 1px solid #565656;
        }
        &.order {
          &::before {
            background: url("../../../static/image/icon_order.png") no-repeat center center/100%;
          }
        }
        &.coupon {
          &::before {
            background: url("../../../static/image/icon_coupon.png") no-repeat center center/100%;
          }
        }
        &.address {
          &::before {
            background: url("../../../static/image/icon_address.png") no-repeat center center/100%;
          }
        }
        &:last-child {
          border-bottom: none;
        }
        a {
          vertical-align: middle;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .bottom {
    padding: 0 0 0 15px;
    background-color: #fff;
    .title {
      border-bottom: 1px solid #ccc;
      padding: 12px 0;
      &::before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 21px;
        height: 21px;
        background: url("../../../static/image/icon_book_list.png") no-repeat center center/100%;
      }
      span {
        vertical-align: middle;
        font-size: 14px;
        &:nth-child(2) {
          color: #e73828;
        }
      }
      a {
        margin-top: 2px;
        float: right;
        margin-right: 15px;
      }
    }
  }
</style>
