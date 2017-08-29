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
            <span class="select-all" :class="{active:selectAll}" v-if="indexDate===0"
                  @click="selectAll=!selectAll">全选</span>
          </div>
          <ul class="pic-list clearfix">
            <li v-for="(picture,indexP) in datepic.picList">
              <img :src="obj.baseurl+openid+'/'+picture.id+'?'+obj.thumbset+'&'+picture.token+picture.key" alt="">
              <span @click="activePic($event,indexDate,indexP)">{{picture.active}}1111</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <button :class="{active:activeBtn}" @click="getPhotoList">下一步</button>
  </section>
</template>
<script>
  import {getPicList, getPhotoList} from '@/config/api'
  import {Toast} from 'mint-ui'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        picNum: 0,
        selected: [],
        selectAll: false,
        obj: {},
        page: 1,
        pageSize: 16,
        activeBtn: false
      }
    },
    computed: {
      ...mapState(['baseUrl', 'userInfo']),
      openid: function () {
        return this.userInfo.openid
      },
      gid: function () {
        return this.$router.currentRoute.query.gid
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
            Toast(res.message)
          }
        })
      },
      getPhotoList: function () {

      },
      activePic: function ($event, indexDate, indexP) {
        $event.target.className = 'active'
        this.activeBtn = this.selected.length > 0
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
        padding: 8px 0;
        text-align: center;
        color: #e73828;
        font-size: 15px;
        font-weight: normal;
        border-bottom: 1px solid #e73828;
      }
    }
    .middle {
      position: fixed;
      top: 37px;
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
      margin-top: 140px;
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
            padding: 5px 0;
            li {
              float: left;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              &:nth-child(5n-1) {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
