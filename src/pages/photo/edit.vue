<template>
  <section id="edit">
    <div class="top">
      <span class="menu"></span>
      <span class="logo"></span>
      <span class="print" @click="print">去打印</span>
    </div>
    <div class="bottom">
      <ul class="photo-list">
        <li v-for="(item,index) in photoList">
          <div class="page">
            <div class="tmp-html" v-html="item.galleryInfo"></div>
            <div class="toggle" v-if="index===0">
              <span class="btn page-cover" :class="{active:coverChanging}" @click="changeCover" v-if="index===0"></span>
            </div>
            <div class="toggle" v-if="index!==0">
              <span class="btn page-delete" @click="deletePage(item.id,index)"></span>
              <!--<span class="btn page-edit"></span>-->
              <router-link class="btn page-edit"
                           :to="{path:'update',query:{gid:gid,pid:item.id,type:type,sign:index}}"></router-link>
            </div>
          </div>
          <div class="page-footer">{{pageType[item.type]}}{{index}}</div>
          <router-link
            :to="{path: 'picture',query:{type:type,gid:gid,beforeid:item.id,pagetype:2,temptype:1,sign:index,pretempid:item.tempid,nexttempid:index===photoList.length-1?'':photoList[index+1].tempid}}">
            <span class="page-add">添加新页</span>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
  import {getPhotoList, deletePage, changeCover} from '@/config/api'
  import {Toast, MessageBox} from 'mint-ui'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        photoList: [],
        coverChanging: false,
        pageType: ['', '封面页', '内容页']
      }
    },
    computed: {
      ...mapState(['userInfo']),
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
      getPhotoList: function () {
        getPhotoList({
          gid: this.gid,
          openid: this.openid
        }).then(res => {
          this.photoList = res.obj.gplist
        })
      },
      deletePage: function (id, index) {
        MessageBox.confirm('确定删除这一页？').then(action => {
          deletePage({
            gid: this.gid,
            pid: id,
            sign: index,
            type: this.type
          }).then(res => {
            if (res.status === 0) {
              Toast('删除成功')
              this.photoList.splice(index, 1)
            } else {
              Toast(res.message ? res.message : '请求错误')

            }
          })
        })
      },
      changeCover: function () {
        this.coverChanging = true
        changeCover({
          author: document.getElementsByClassName('author-name')[0].innerHTML,
          date: document.getElementsByClassName('book-date')[0].innerHTML,
          gid: this.gid,
          name: document.getElementsByClassName('book-name')[0].innerHTML,
          openid: this.openid,
          type: this.type
        }).then(res => {
          console.log(res)
          if (res.status === 0) {
            this.photoList.splice(0, 1, res.obj)
            this.coverChanging = false
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      },
      print: function () {
        if (this.type.indexOf('lomo') < 0 && this.type.indexOf('postage') < 0) {
          if (this.photoList.length < 21) {
            Toast('亲，内页在20页以上才可以打印哦！')
          } else {
            this.$router.push({path: 'pay', query: {gid: this.gid, type: this.type}})
          }
        } else {
          if (this.photoList.length < 10) {
            Toast('亲，在10页以上才可以打印哦！')
          } else {
            this.$router.push({path: 'pay', query: {gid: this.gid, type: this.type}})
          }
        }
      }
    },
    mounted() {
      this.getPhotoList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="less">
  @import "../../../static/css/template.css";

  #edit {
    background-color: #fff;
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
      span {
        flex: none;
        &.menu {
          width: 66px;
          height: 20px;
          background: url("../../../static/image/icon_book_index.png") no-repeat left center/20px;
        }
        &.logo {
          width: 25px;
          height: 24px;
          background: url("../../../static/image/icon_edit_logo.png") no-repeat center center/100%;
        }
        &.print {
          line-height: 20px;
          padding: 0 12px;
          font-size: 14px;
          text-align: center;
          background: #e73828;
          border-radius: 12px;
          -webkit-transition: all .2s;
          transition: all .2s;
          color: #fff;
        }
      }
    }
    .bottom {
      margin-top: 40px;
      .photo-list {
        overflow: hidden;
        li {
          width: 3.49rem;
          margin: 12px auto;
          .page {
            position: relative;
            .toggle {
              position: absolute;
              bottom: 14px;
              right: 14px;
              span, a {
                display: block;
                width: 40px;
                height: 40px;
                margin-top: 10px;
                border-radius: 50%;
                background-color: #e73828;
                background-size: 20px;
                background-repeat: no-repeat;
                background-position: center center;
                box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
                &.page-cover {
                  background-image: url("../../../static/image/icon_change_cover.png");
                  -webkit-transition: background-color .2s;
                  transition: background-color .2s;
                  &.active {
                    background-color: #e1e1e1;
                  }
                }
                &.page-delete {
                  background-image: url("../../../static/image/icon_trash.png");
                }
                &.page-edit {
                  background-image: url("../../../static/image/icon_edit_page.png");
                }
              }
            }
          }
          .page-footer {
            padding: 10px 0;
            color: #e73828;
          }
          a {
            color: #999;
            .page-add {
              display: block;
              font-size: 15px;
              width: 100%;
              height: 42px;
              line-height: 42px;
              text-align: center;
              border: 2px dashed #E0E0E0;
              &::before {
                content: '+';
                margin-right: 15px;
                font-size: 30px;
                color: #ddd;
                vertical-align: middle;
              }
            }
          }
          &:last-child {
            a {
              color: #e73828;
              .page-add {
                border: 2px dashed #e73828;
                &::before {
                  color: #e73828;
                }
              }
            }
          }
        }
      }
    }
  }

</style>
<style>
  .template {
    height: 4.87rem;
  }

  .tmp-new {
    height: 4.92rem;
  }

  .template-lj {
    height: 4.65rem;
  }

  .template-sq {
    height: 3.49rem;
  }

  .template-sq {
    height: 3.49rem;
  }
</style>
