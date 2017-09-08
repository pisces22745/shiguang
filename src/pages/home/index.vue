<template>
  <section id="home">
    <div class="top">
      <mt-swipe class="my-swiper" :auto="4000">
        <mt-swipe-item class="slide" v-for="item in bannerList" :key="1">
          <img :src="item" alt="">
        </mt-swipe-item>
      </mt-swipe>
      <!--<router-link class="title-text" :to="{path: 'gallery'}">他们的书</router-link>-->
      <router-link class="header-img" :to="{path: 'user'}">
        <img :src="headerImg" alt="">
      </router-link>
    </div>
    <div class="bottom">
      <ul class="menu">
        <li v-for="(item,index) in menu" :class="{active:index==active}" @click="addActive(index)">{{item}}</li>
      </ul>
      <ul class="list">
        <li v-for="item in activeList">
          <div class="cover" :class="{new:item.type==3}">
            <img :src="item.cover" alt="封面图片">
            <span class="magnifier"></span>
          </div>
          <div class="text">
            <div class="title">{{item.title}}</div>
            <div class="description">{{item.description}}</div>
            <div class="clearfix">
              <span class="price">{{item.price}}</span>
              <span class="discount">{{item.discount}}</span>
              <button @click="createAlbum(item)">去制作</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
  import {headerImage, createAlbum} from '@/config/api'
  import {Swipe, SwipeItem, Toast} from 'mint-ui'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        headerImg: '',
        bannerList: [
          '../../../static/image/children.jpg',
          '../../../static/image/baby-book-pic.jpg',
          '../../../static/image/lomo-photo-pic.jpg',
          '../../../static/image/photo-print-pic.jpg'
        ],
        menu: ['旅行书', '亲子相册', '纪念册', 'LOMO卡片', '明信片'],
        active: 0,
        bookList: {
          travel: [
            {
              'cover': '../../../static/image/cover/travel06.jpg',
              'title': '萌系手绘',
              'description': '彩云之南，丽江之旅',
              'price': '¥ 58',
              'discount': '¥ 68',
              'type': 3,
              'bookType': 'travel06'
            }, {
              'cover': '../../../static/image/cover/travel01.jpg',
              'title': '经典简约',
              'description': '一个人的旅行',
              'price': '¥ 58',
              'discount': '¥ 68',
              'type': 0,
              'bookType': 'travel01'
            },
            {
              'cover': '../../../static/image/cover/travel02.jpg',
              'title': '时尚活力',
              'description': '我和你，在路上',
              'price': '¥ 58',
              'discount': '¥ 68',
              'type': 0,
              'bookType': 'travel02'
            },
            {
              'cover': '../../../static/image/cover/travel03.jpg',
              'title': '古典山水',
              'description': '我的桂林印象',
              'price': '¥ 58',
              'discount': '¥ 68',
              'type': 0,
              'bookType': 'travel03'
            },
            {
              'cover': '../../../static/image/cover/travel04.jpg',
              'title': '萌系手绘',
              'description': '江南行—最忆是杭州',
              'price': '¥ 58',
              'discount': '¥ 68',
              'type': 0,
              'bookType': 'travel04'
            },
            {
              'cover': '../../../static/image/cover/travel05.jpg',
              'title': '萌系手绘',
              'description': '许我一个江南',
              'price': '¥ 58',
              'discount': '¥ 68',
              'type': 0,
              'bookType': 'travel05'
            }],
          baby: [{
            'cover': '../../../static/image/cover/baby01.jpeg',
            'title': '可爱糖果',
            'description': '萌宝养成记',
            'price': '¥ 58',
            'discount': '¥ 68',
            'type': 0,
            bookType: 'baby01'
          }, {
            'cover': '../../../static/image/cover/baby02.png',
            'title': '可爱糖果',
            'description': '萌宝养成记',
            'price': '¥ 58',
            'discount': '¥ 68',
            'type': 0,
            bookType: 'baby02'
          }],
          memo: [{
            'cover': '../../../static/image/cover/memory06.jpg',
            'title': '简约浪漫',
            'description': '长相知，长相恋',
            'price': '¥ 58',
            'discount': '¥ 68',
            'type': 3,
            bookType: 'memory06'
          }, {
            'cover': '../../../static/image/cover/memory01.jpeg',
            'title': '文艺清新',
            'description': '时光流年',
            'price': '¥ 58',
            'discount': '¥ 68',
            'type': 0,
            bookType: 'memory01'
          }, {
            'cover': '../../../static/image/cover/memory02.jpg',
            'title': '青春复古',
            'description': '青春不散场—毕业纪念',
            'price': '¥ 58',
            'discount': '¥ 68',
            'type': 0,
            bookType: 'memory02'
          }, {
            'cover': '../../../static/image/cover/memory03.jpg',
            'title': '经典校园',
            'description': '感谢有你—毕业纪念',
            'price': '¥ 58',
            'discount': '¥ 68',
            'type': 0,
            bookType: 'memory03'
          }, {
            'cover': '../../../static/image/cover/memory04.png',
            'title': '唯美爱情',
            'description': '感恩有你',
            'price': '¥ 58',
            'discount': '¥ 68',
            'type': 0,
            bookType: 'memory04'
          }, {
            'cover': '../../../static/image/cover/memory05.jpg',
            'title': 'Q版手绘',
            'description': '童年的梦想',
            'price': '¥ 58',
            'discount': '¥ 68',
            'type': 0,
            bookType: 'memory05'
          }],
          lomo: [{
            'cover': '../../../static/image/cover/lomo.jpg',
            'title': '普通装',
            'description': 'lomo照片(每套20张起)',
            'price': '¥ 12',
            'discount': '¥ 20',
            'type': 0,
            bookType: 'lomo'
          }],
          postcard: [{
            'cover': '../../../static/image/cover/postcard.jpg',
            'title': '明信片',
            'description': '明信片(每套10张起)',
            'price': '¥ 20',
            'discount': '¥ 30',
            'type': 0,
            bookType: 'postcard01'
          }]
        },
        activeList: [],
        openid: ''
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      addActive: function (index) {
        this.active = index
        switch (index) {
          case 0:
            this.activeList = this.bookList.travel
            break
          case 1:
            this.activeList = this.bookList.baby
            break
          case 2:
            this.activeList = this.bookList.memo
            break
          case 3:
            this.activeList = this.bookList.lomo
            break
          case 4:
            this.activeList = this.bookList.postcard
            break
        }
      },
      createAlbum: function (item) {
        createAlbum({
          author: '作者',
          name: this.menu[this.active],
          type: item.bookType,
          openid: this.openid,
          date: '',
          gid: ''
        }).then(res => {
          if (res.status === 0) {
            this.$router.push({
              path: 'picture',
              query: {
                openid: this.openid,
                type: item.type,
                gid: res.obj.galleryid,
                beforeid: res.obj.id,
                pagetype: 2,
                temptype: 1,
                pretempid: '',
                nexttempid: '',
                situation: 1
              }
            })
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      },
      getHeaderImage: function () {
        headerImage({
          openid: this.openid
        }).then(res => {
          if (res.status === 0) {
            this.headerImg = res.obj
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      },
      getOpenid: function () {
        if (!this.userInfo.openid) {
          let openid = this.$router.currentRoute.query.openid
          this.$cookie.set('userInfo', JSON.stringify({'openid': openid}))
          this.openid = openid
        } else {
          this.openid = this.userInfo.openid
        }
        this.getHeaderImage()
      }
    },
    mounted() {
      this.activeList = this.bookList.travel
      this.getOpenid()
    },
    components: {
      'mt-swipe': Swipe,
      'mt-swipe-item': SwipeItem
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .mint-swipe-indicator {
    background-color: #fff;
    opacity: 1;
    &.is-active {
      opacity: .5;
    }
  }
</style>
<style scoped lang="less">
  #home {
    .top {
      position: relative;
      .my-swiper {
        height: 1.8rem;
        .slide {
          img {
            width: 100%;
          }
        }
      }
      .title-text {
        position: absolute;
        top: 6px;
        left: 6px;
        color: #fff;
        font-size: 16px;
        &::before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 20px;
          height: 22px;
          margin-right: 10px;
          background: url("../../../static/image/icon_their_book.png") no-repeat center center/100%;
        }
      }
      .header-img {
        img {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 30px;
          height: 30px;
          border: 1px solid #fff;
          border-radius: 50%;
          overflow: hidden;
        }
      }
    }

    .bottom {
      min-height: 4.9rem;
      background-color: #fff;
      .menu {
        display: flex;
        align-items: baseline;
        border-bottom: 1px solid #eee;
        padding: 0 15px;
        li {
          flex: 1 1 auto;
          line-height: 60px;
          text-align: center;
          height: 100%;
          font-size: 12px;
          -webkit-transition: font-size 100ms;
          transition: font-size 100ms;
          &.active {
            border-bottom: 1px solid #e73829;
            color: #e73829;
            font-size: 17px;
          }
        }
      }
      .list {
        padding: 15px;
        overflow: hidden;
        li {
          box-sizing: border-box;
          width: calc(~"(100% - 15px)" / 2);
          float: left;
          margin-bottom: 15px;
          border: 1px solid #e1e1e1;
          overflow: hidden;
          &:nth-child(odd) {
            margin-right: 15px;
          }
          .cover {
            position: relative;
            width: 100%;
            height: 165px;
            background-color: #f3f3f3;
            text-align: center;
            &.new {
              &::before {
                content: '';
                position: absolute;
                top: -5px;
                left: -5px;
                width: 50px;
                height: 50px;
                background: url("../../../static/image/icon_tag_new.png") no-repeat center center/100%;
              }
            }
            span {
              display: block;
              position: absolute;
              top: 50%;
              left: 50%;
              width: 44px;
              height: 44px;
              -webkit-transform: translate(-50%, -50%);
              transform: translate(-50%, -50%);
              background: url("../../../static/image/icon_maginfier.png") no-repeat center center/100%;
            }
            img {
              height: 155px;
              margin: 5px auto;
              box-shadow: 0 0 3px #808080;
            }
          }
          .text {
            padding: 5px 10px;
            .title {
              color: #f2c400;
              font-size: 10px;
              margin-bottom: 5px;
            }
            .description {
              color: #4c4c4c;
              font-size: 12px;
              margin-bottom: 4px;
            }
            .price {
              vertical-align: middle;
              font-size: 12px;
              color: #f44e4b;
            }
            .discount {
              vertical-align: middle;
              font-size: 10px;
              color: #b2b2b2;
              text-decoration: line-through;
            }
            button {
              vertical-align: middle;
              border: none;
              width: 60px;
              background-color: #e73829;
              line-height: 20px;
              height: 20px;
              border-radius: 20px;
              color: #ffffff;
              font-size: 12px;
              text-align: center;
              float: right;
            }
          }
        }
      }
    }
  }

</style>
