<template>
  <section id="preview">
    预览
  </section>
</template>
<script>
  import {headerImage} from '@/config/api'
  import {Toast} from 'mint-ui'

  export default {
    data() {
      return {
        headerImg: ''
      }
    },
    methods: {
      headerImage: function () {
        headerImage({
          openid: 'oxcqAwJAEWJ7Ncc4QiL_RYlOEaPw'
        }).then(res => {
          if (res.obj === 0) {
            this.headerImg = res.obj
          }else{
            Toast(res.message)
          }
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .top {
    position: relative;
    border-top: 2px solid #e73828;
    height: 1.78rem;
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
  }
</style>
