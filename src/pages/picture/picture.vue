<template>
  <section>
    <div class="top">
      <h1>我的照片库 <span>{{picNum}}</span></h1>
    </div>
    <div class="middle">
      <p>为保证照片书视觉效果，建议您将照片美颜哦。</p>
      <p>已选<span>{{selected.length}}</span>张<i class="icon-trash"></i></p>
      <button>上传照片</button>
    </div>
    <div class="bottom">
      <ul class="date-list">
        <li v-for="(item,index) in obj.datepics">
          <div class="title">
            <span class="date">{{item.date}}</span>
            <span class="select-all" v-if="index===0">全选</span>
          </div>
          <ul class="pic-list">
            <li v-for="picture in item.picList">
              <img :src="obj.baseurl+openid+'/'+picture.id+'?'+obj.thumbset+'&'+picture.token+picture.key" alt="">
              <span></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
  import {getPicList} from '@/config/api'
  import {Toast} from 'mint-ui'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        picNum: 0,
        selected: [],
        obj: {},
        page: 1,
        pageSize: 16
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
          page: 1,
          pagesize: 16
        }).then(res => {
          if (res.status === 0) {
            this.obj = res.obj
            console.log(res.obj)
          } else {
            Toast(res.message)
          }
        })
      }
    },
    mounted() {
      this.getPicList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
