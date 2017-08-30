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
      <div v-if="gaList.length===0" class="empty">您还没有相册，快去制作吧~</div>
      <ul class="book-list" v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false">
        <li v-for="(item,index) in gaList" class="clearfix">
          <div class="cover">
            <router-link :to="{path:'preview',query: {id:item.id,isshare:1}}" class="preview">预览</router-link>
            <img :src="baseUrl+item.imgurl" alt="">
            <span class="delete" @click="deleteAlbum(item.id,index)">删除</span>
          </div>
          <div class="text">
            <h1>{{item.name}}</h1>
            <p class="pages">{{item.pages}}</p>
            <p class="date">{{item.date}}</p>
            <p class="index"><span v-if="index<9">0</span>{{index + 1}}</p>
            <router-link :to="{path:'edit',query:{gid:item.id,type:item.type}}" class="btn-edit">去编辑</router-link>
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
  import {getUserCenter, deleteAlbum, getGalib} from '@/config/api'
  import {InfiniteScroll, Toast, MessageBox} from 'mint-ui'
  import {mapState} from 'vuex'

  Vue.use(InfiniteScroll)

  export default {
    data() {
      return {
        headerImg: '',
        galleryNum: 0,
        gaList: [],
        page: 1,
        pageSize: 5,
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
      getUserCenter: function () {
        getUserCenter({
          openid: this.openid,
          page: this.page,
          pagesize: this.pageSize
        }).then(res => {
          if (res.status === 0) {
            this.headerImg = res.obj.headimgurl
            this.galleryNum = res.obj.gallerynum
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      },
      deleteAlbum(id, index) {
        let _this = this
        MessageBox.confirm('确定删除相册?').then(action => {
          deleteAlbum({
            id: id,
            openid: _this.openid,
            page: _this.page,
            pagesize: _this.pageSize
          }).then(res => {
            if (res.status === 0) {
              _this.gaList.splice(index, 1)
              Toast('删除成功')
            } else {
              Toast(res.message ? res.message : '请求错误')
            }
          })
        });
      },
      loadMore: function () {
        let _this = this
        this.loading = true
        setTimeout(() => {
          _this.getList()
          _this.loading = false
        }, 500);
      },
      getList: function () {
        if (this.infinate) {
          getGalib({
            page: this.page,
            pagesize: this.pageSize,
            openid: this.openid
          }).then(res => {
            if (res.status === 0) {
              this.infinate = res.obj.length === this.pageSize
              this.gaList.push.apply(this.gaList, res.obj);
              this.page++
            } else {
              Toast(res.message ? res.message : '请求错误')
            }
          })
        }
      }
    },
    mounted() {
      this.getUserCenter()
      this.getList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  #user {
    background-color: #f5f5f5;
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
          padding: 10px 0;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
          a {
            position: relative;
            display: block;
            vertical-align: middle;
            font-size: 14px;
            color: #666;
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
          }
          &.order {
            a {
              &::before {
                background: url("../../../static/image/icon_order.png") no-repeat center center/100%;
              }
            }
          }
          &.coupon {
            a {
              &::before {
                background: url("../../../static/image/icon_coupon.png") no-repeat center center/100%;
              }
            }
          }
          &.address {
            a {
              &::before {
                background: url("../../../static/image/icon_address.png") no-repeat center center/100%;
              }
            }
          }
        }
      }
    }

    .bottom {
      min-height: 3.4rem;
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
          color: #e73828;
        }
      }
      .empty {
        text-align: center;
        margin-top: 50px;
        color: #999;
      }
      .book-list {
        li {
          position: relative;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          &:last-child {
            border-bottom: none;
          }
          &.loading {
            text-align: center;
            color: #999;
            span {
              vertical-align: middle;
              &.ball_line_rotate {
                position: relative;
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-right: 5px;
                &::before, &::after {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: 0;
                  margin-top: -10px;
                  -webkit-box-sizing: border-box;
                  box-sizing: border-box;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  border: 2px solid #000;
                  background-color: transparent;
                }
                &::before {
                  opacity: 0.3;
                }
                &::after {
                  border-color: transparent;
                  border-right-color: #000;
                  -webkit-animation-fill-mode: both;
                  animation-fill-mode: both;
                  -webkit-animation: ball_line_rotate .8s linear infinite;
                  animation: ball_line_rotate .8s linear infinite;
                }

                @keyframes ball_line_rotate {
                  25% {
                    -webkit-transform: rotate(90DEG);
                    transform: rotate(90DEG);
                  }
                  50% {
                    -webkit-transform: rotate(180DEG);
                    transform: rotate(180DEG);
                  }
                  75% {
                    -webkit-transform: rotate(270DEG);
                    transform: rotate(270DEG);
                  }
                  100% {
                    -webkit-transform: rotate(360DEG);
                    transform: rotate(360DEG);
                  }
                }
              }
            }
          }
          .cover {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            float: left;
            width: 120px;
            height: 154px;
            margin-right: 15px;
            padding: 5px;
            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: block;
              background-color: rgba(0, 0, 0, .5);
            }
            &::before {
              content: '';
              position: absolute;
              bottom: 30px;
              left: 10px;
              width: 100px;
              height: 1px;
              z-index: 1;
              background-color: #fff;
            }
            .preview {
              position: absolute;
              top: 50%;
              left: 50%;
              -webkit-transform: translate(-50%, -50%);
              transform: translate(-50%, -50%);
              padding: 5px;
              font-size: 12px;
              color: #fff;
              z-index: 1;
              &::before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                margin-right: 4px;
                width: 13px;
                height: 13px;
                background: url("../../../static/image/icon_magnifier_prev.png") no-repeat center center/100%;
              }
            }
            .delete {
              position: absolute;
              bottom: 0;
              left: 50%;
              width: 18px;
              height: 20px;
              z-index: 1;
              text-indent: -9999px;
              padding: 5px 0;
              -webkit-transform: translateX(-50%);
              transform: translateX(-50%);
              background: url("../../../static/image/icon_trash.png") no-repeat center center/18px;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .text {
            float: left;
            padding: 5px;
            h1 {
              font-size: 1.3em;
              font-weight: 600;
              margin-bottom: 5px;
              &::before {
                content: '【';
              }
              &::after {
                content: '】';
              }
            }
            p {
              padding-left: 8px;
              font-size: 16px;
              &.pages {
                margin-bottom: 12px;
                &::after {
                  content: '页';
                }
              }
              &.date {
                margin-bottom: 10px;
                &::before {
                  content: '创建时间';
                  display: block;
                  margin-bottom: 3px;
                }
              }
              &.index {
                position: absolute;
                bottom: 15px;
                right: 15px;
                font-size: 12px;
              }
            }
            .btn-edit {
              display: block;
              margin-left: 8px;
              width: 120px;
              height: 20px;
              line-height: 20px;
              border: 1px solid #e73828;
              font-size: 16px;
              color: #e73828;
              background: transparent;
              border-radius: 16px;
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>
