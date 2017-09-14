<template>
  <section id="picture">
    <div class="top">
      <h1>我的照片库（{{picNum}}）</h1>
    </div>
    <div class="middle">
      <p>为保证照片书视觉效果，建议您将照片美颜哦。</p>
      <p><span>{{selected.length}}</span><i class="icon-trash" :class="{active:selected.length>0}"></i></p>
      <div id="container">
        <button id="btn-upload">上传照片</button>
      </div>
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
  import {getPicList, createPhotoList, getToken} from '@/config/api'
  import {Toast, Lazyload} from 'mint-ui'
  import {mapState} from 'vuex'

  Vue.use(Lazyload)
  export default {
    data: function () {
      return {
        picNum: 0,
        selected: [],
        selectAllFlag: false,
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
        if (this.selected.length > 0) {
          createPhotoList({
            gid: this.gid,
            type: this.type,
            openid: this.openid,
            beforeid: this.beforeid,
            pagetype: this.pagetype, // 页面类型：1封面，2普通页面
            ptype: this.temptype, // 模板类型：1普通模板，2文字模板，3图片模板
            pics: this.selected,
            pretempid: this.pretempid, // 前一个页面的模板id
            nexttempid: this.nexttempid // 后一个页面的模板id
          }).then(res => {
            if (res.status === 0) {
              this.$router.push({path: '/edit', query: {gid: this.gid, type: this.type}})
            } else {
              Toast(res.message ? res.message : '请求错误')
            }
          })
        }
      },
      activePic: function ($event, picture) {
        if ($event.target.className.indexOf('active') > 0) {
          $event.target.className = 'icon-select'
          let index = this.selected.findIndex(function (element) {
            return element.url === picture.id
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
          for (let i = 0; i < this.obj.datepics.length; i++) {
            for (let j = 0; j < this.obj.datepics[i].picList.length; j++) {
              let pic = this.obj.datepics[i].picList[j]
              this.selected.push({
                hov: pic.hov,
                url: pic.id
              })
            }
          }
        } else {
          for (let i = 0; i < domList.length; i++) {
            domList[i].className = 'icon-select'
            this.selected.length = 0
          }
        }
      },
      uploader: function (uptoken) {
        var uploader = Qiniu.uploader({
          disable_statistics_report: false,   // 禁止自动发送上传统计信息到七牛，默认允许发送
          runtimes: 'html5,flash,html4',      // 上传模式,依次退化
          browse_button: 'btn-upload',         // 上传选择的点选按钮，**必需**
          container: 'container',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
          multi_selection: true,
          resize: {quality: 75, preserve_headers: false},
          // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
          // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
          // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
          // uptoken : '<Your upload token>', // uptoken 是上传凭证，由其他程序生成
          // uptoken_url: '/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
          // uptoken_func: function(file){    // 在需要获取 uptoken 时，该方法会被调用
          //    // do something
          //    return uptoken;
          // },
          uptoken: uptoken,
          get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
          // downtoken_url: '/downtoken',
          // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
          // unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
          // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
          domain: 'http://imglib.hzaiyin.cn/',     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
          max_file_size: '100mb',             // 最大文件体积限制
          flash_swf_url: 'path/of/plupload/Moxie.swf',  // 引入 flash,相对路径
          max_retries: 3,                     // 上传失败最大重试次数
          dragdrop: false,                     // 开启可拖曳上传
          drop_element: 'container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
          chunk_size: '4mb',                  // 分块上传时，每块的体积
          auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
          // x_vars : {
          //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
          //    'time' : function(up,file) {
          //        var time = (new Date()).getTime();
          // do something with 'time'
          //        return time;
          //    },
          //    'size' : function(up,file) {
          //        var size = file.size;
          // do something with 'size'
          //        return size;
          //    }
          // },
          init: {
            'FilesAdded': function (up, files) {
              plupload.each(files, function (file) {
                // 文件添加进队列后,处理相关的事情
                console.log(11111111 + file)
              })
            },
            'BeforeUpload': function (up, file) {
              // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function (up, file) {
              // 每个文件上传时,处理相关的事情
              console.log(22222222222 + file)
            },
            'FileUploaded': function (up, file, info) {
              // 每个文件上传成功后,处理相关的事情
              // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
              // {
              //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
              //    "key": "gogopher.jpg"
              //  }
              // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

              // var domain = up.getOption('domain');
              // var res = parseJSON(info.response);
              // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
            },
            'Error': function (up, err, errTip) {
              // 上传出错时,处理相关的事情
            },
            'UploadComplete': function () {
              // 队列文件处理完毕后,处理相关的事情
              Toast('上传成功')
            }
//            ,
//            'Key': function (up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效

//              var key = ''
            // do something with key here
//              return key
//            }
          }
        })
        // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
        // uploader 为一个 plupload 对象，继承了所有 plupload 的方法，参考http://plupload.com/docs
      },
      init: function () {
        getToken({
          openid: this.openid
        }).then(res => {
          if (res.status === 0) {
            this.uploader(res.obj)
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      }
    },
    mounted() {
      let _this = this
      setTimeout(function () {
        _this.init()
      }, 200)
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
      top: 40px;
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
