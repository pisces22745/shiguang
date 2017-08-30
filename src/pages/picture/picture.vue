<template>
  <section id="picture">
    <div class="top">
      <h1>我的照片库（{{picNum}}）</h1>
    </div>
    <div class="middle">
      <p>为保证照片书视觉效果，建议您将照片美颜哦。</p>
      <p><span>{{selected.length}}</span><i class="icon-trash" :class="{active:selected.length>0}"></i></p>
      <button>上传照片</button>
    </div>
    <div class="bottom">
      <ul class="date-list">
        <li v-for="(datepic,indexDate) in obj.datepics">
          <div class="title clearfix">
            <span class="date">{{datepic.date}}</span>
            <span class="select-all" :class="{active:selectAllFlag}" v-if="indexDate===0"
                  @click="selectAll">全选</span>
          </div>
          <ul class="pic-list clearfix">
            <li v-for="(picture,indexP) in datepic.picList" :key="picture.id">
              <img :src="obj.baseurl+openid+'/'+picture.id+'?'+obj.thumbset+'&'+picture.token+picture.key"
                   alt="">

              <span class="icon-select" :class="{active:picture.active}"
                    @click="activePic($event,picture)"></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <button :class="{active:selected.length>0}" @click="getPhotoList">下一步</button>
  </section>
</template>
<script>
  import Vue from 'vue'
  import {getPicList, createPhotoList} from '@/config/api'
  import {MessageBox, Toast, Lazyload} from 'mint-ui'
  import {mapState} from 'vuex'

  Vue.use(Lazyload);
  export default {
    data() {
      return {
        picNum: 0,
        selected: [],
        selectAllFlag: false,
        obj: {},
        page: 1,
        pageSize: 16,
        activeBtn: false,
        list: [
          'http://fuss10.elemecdn.com/b/18/0678e57cb1b226c04888e7f244c20jpeg.jpeg',
          'http://fuss10.elemecdn.com/3/1e/42634e29812e6594c98a89e922c60jpeg.jpeg',
          'http://fuss10.elemecdn.com/1/c5/95c37272d3e554317dcec1e17a9f5jpeg.jpeg',
          'http://fuss10.elemecdn.com/7/85/e478e4b26af74f4539c79f31fde80jpeg.jpeg',
          'http://fuss10.elemecdn.com/b/df/b630636b444346e38cef6c59f6457jpeg.jpeg',
          'http://fuss10.elemecdn.com/7/a5/596ab03934612236f807b92906fd8jpeg.jpeg'
        ]
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
      },
      beforeid: function () {
        return this.$router.currentRoute.query.beforeid
      },
      pagetype: function () {
        return this.$router.currentRoute.query.pagetype
      },
      ptype: function () {
        return this.$router.currentRoute.query.ptype
      },
      pretempid: function () {
        return this.$router.currentRoute.query.pretempid
      },
      nexttempid: function () {
        return this.$router.currentRoute.query.nexttempid
      }
    },
    methods: {
      getPicList: function () {
        getPicList({
          gid: this.gid,
          openid: this.openid,
          page: this.page,
          pagesize: this.pageSize
        }).then(res => {
          if (res.status === 0) {
            this.obj = res.obj
            this.page++
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      },
      getPhotoList: function () {
        createPhotoList({
          gid: this.gid,
          type: this.type,
          openid: this.openid,
          beforeid: this.beforeid,
          pagetype: this.pagetype, //页面类型：1封面，2普通页面
          ptype: this.temptype, //模板类型：1普通模板，2文字模板，3图片模板
          pics: this.selected,
          pretempid: this.pretempid, //前一个页面的模板id
          nexttempid: this.nexttempid //后一个页面的模板id
        }).then(res => {
          if (res.status === 0) {
            console.log(res.obj)
            this.$router.push({path: '/edit', query: {gid: this.gid, type: this.type}})
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      },
      activePic: function ($event, picture) {
        if ($event.target.className.indexOf('active') > 0) {
          $event.target.className = 'icon-select'
          let index = this.selected.findIndex(function (element) {
            return element.url === picture.id;
          })
          this.selected.splice(index, 1)
        } else {
          $event.target.className = 'icon-select active'
          this.selected.push({
            hov: picture.hov,
            url: picture.id
          })
        }

      },
      selectAll: function () {
        this.selectAllFlag = !this.selectAllFlag
        let domList = document.getElementsByClassName('icon-select')
        if (this.selectAllFlag) {
          for (let i = 0; i < domList.length; i++) {
            domList[i].className = 'icon-select active'
          }
        } else {
          for (let i = 0; i < domList.length; i++) {
            domList[i].className = 'icon-select'
          }
        }
        for (let i = 0; i < this.obj.datepics.length; i++) {
          for (let j = 0; j < this.obj.datepics[i].picList.length; j++) {
            let pic = this.obj.datepics[i].picList[j]
            this.selected.push({
              hov: pic.hov,
              url: pic.id
            })
          }
        }
      }
    },
    mounted() {
      let _his = this
      this.getPicList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  #picture {
    background-color: #fff;
    overflow: hidden;
    .top {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      background-color: #fff;
      h1 {
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #e73828;
        font-size: 15px;
        font-weight: normal;
        border-bottom: 1px solid #e73828;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
    .middle {
      position: fixed;
      top: 41px;
      left: 0;
      z-index: 1;
      width: 100%;
      padding: 10px 0;
      text-align: center;
      background-color: #fff;
      p {
        text-align: center;
        &:first-child {
          color: #666;
          font-size: 10px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        &:nth-child(2) {
          color: #999;
          font-size: 12px;
          margin-bottom: 10px;
          span {
            color: #e73828;
            padding: 0 4px;
            vertical-align: middle;
            &::before {
              content: '已选';
              color: #666;
              margin-right: 3px;
            }
            &::after {
              content: '张';
              color: #666;
              margin-left: 3px;
            }
          }
          i {
            display: inline-block;
            vertical-align: middle;
            width: 22px;
            height: 22px;
            margin-left: 5px;
            background: url("../../../static/image/icon_delete_grey.png") no-repeat center center/100%;
            &.active {
              background: url("../../../static/image/icon_delete_pink.png") no-repeat center center/100%;
            }
          }
        }
      }
      button {
        -webkit-appearance: none;
        width: 80px;
        height: 22px;
        line-height: 22px;
        border-radius: 10px;
        border: 1px solid #e73828;
        color: #e73828;
        background-color: #fff;
      }
    }
    .bottom {
      margin: 140px 0 52px;
      padding: 0 15px;
      .date-list {
        li {
          .title {
            padding: 5px 0;
            border-bottom: 1px solid #eee;
            .date {
              float: left;
              padding: 2px 10px;
              border-radius: 10px;
              background: #e73828;
              color: #fff;
              opacity: 0.3;
            }
            .select-all {
              float: right;
              font-size: 14px;
              color: #666;
              &::before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                margin-right: 5px;
                width: 22px;
                height: 22px;
                background: url("../../../static/image/icon_check_white.png") no-repeat center center/100%;
              }
              &.active {
                color: #e73828;
                &::before {
                  background: url("../../../static/image/icon_check_pink.png") no-repeat center center/100%;
                }
              }
            }
          }
          .pic-list {
            display: flex;
            flex-flow: row wrap;
            padding: 5px 0;
            li {
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              position: relative;
              width: .8rem;
              height: .8rem;
              margin-right: calc(~"(100% - .8rem*4)" / 3);
              margin-bottom: calc(~"(100% - .8rem*4)" / 3);
              border: 1px solid #e1e1e1;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              &:nth-child(5n-1) {
                margin-right: 0;
              }
              .icon-select {
                position: absolute;
                bottom: 8px;
                right: 8px;
                width: 22px;
                height: 22px;
                background: url("../../../static/image/icon_check_white.png") no-repeat center center/100%;
                &.active {
                  background: url("../../../static/image/icon_check_pink.png") no-repeat center center/100%;
                }
              }
            }
          }
        }
      }
    }
    & > button {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      border: none;
      height: 42px;
      color: #fff;
      font-size: 16px;
      background-color: #c1c1c1;
      &.active {
        background-color: #e73828;
      }
    }
  }
</style>
