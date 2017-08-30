<template>
  <section id="update">
    <div class="top">调整页面</div>
    <div class="bottom">
      <div class="page" v-html="photo.galleryInfo"></div>
    </div>
    <button @click="update">调整完成</button>
  </section>
</template>
<script>
  import {getUpdatePage} from '@/config/api'
  import {mapState} from 'vuex'
  import {Toast} from 'mint-ui'

  export default {
    data() {
      return {
        photo: {}
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
      },
      pid: function () {
        return this.$router.currentRoute.query.pid
      },
      sign: function () {
        return this.$router.currentRoute.query.sign
      }
    },
    methods: {
      getUpdatePage: function () {
        getUpdatePage({
          openid: this.openid,
          pid: this.pid
        }).then(res => {
          if (res.status === 0) {
            this.photo = res.obj
          }
        })
      },
      update: function () {
        Toast('调整完成')
        this.$router.push({
          path: 'edit', query: {
            gid: this.gid,
            pid: this.pid,
            type: this.type,
            sign: this.sign
          }
        })
      }
    },
    mounted() {
      this.getUpdatePage()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../../../static/css/template.css";

  #update {
    height: 100%;
    background-color: #fff;
    .top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e73828;
      font-size: 16px;
      text-align: center;
      color: #e73828;
      background-color: #fff;
    }
    .bottom {
      margin: 40px 0 50px;
      overflow: hidden;
      .page {
        width: 3.49rem;
        margin: 12px auto;
      }
    }
    button {
      position: fixed;
      bottom: 0;
      left: 0;
      line-height: 42px;
      width: 100%;
      text-align: center;
      border: none;
      z-index: 2;
      font-size: 18px;
      color: #fff;
      background: #e73828;
    }
  }
</style>
<style>
  .tmp-new {
    height: 4.92rem;
  }

  .template-lj {
    height: 4.65rem;
  }
</style>

