<template>
  <section id="address-add">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="title" v-if="id">修改收货地址</span>
      <span class="title" v-if="!id">添加收货地址</span>
    </div>
    <div class="bottom">
      <mt-field label="" placeholder="收货人姓名" v-model="consignee"></mt-field>
      <mt-field label="" placeholder="手机号码" v-model="mobile"></mt-field>
      <mt-field label="" placeholder="邮政编码" v-model="zcode"></mt-field>
      <mt-field class="bor-b" @click.native.capture="popupVisible = !popupVisible" readonly="readonly" type="text"
                :value="addressProvince+' '+addressCity+' '+addressXian">
      </mt-field>
      <mt-field label="" placeholder="详细地址" type="textarea" rows="4" v-model="address"></mt-field>
      <mt-popup v-model="popupVisible" position="bottom">
        <mt-picker :slots="addressSlots" class="picker" @change="onAddressChange" :visible-item-count="5"></mt-picker>
      </mt-popup>
    </div>
    <button @click="comfirm">确定</button>
  </section>
</template>
<script>
  import Vue from 'vue'
  import {Picker, Field, Popup, Toast} from 'mint-ui'
  import s from '@/util/address.json'
  import {addAddress, getAddress, updateAddress} from '@/config/api'
  import {mapState} from 'vuex'

  Vue.component(Picker.name, Picker)
  Vue.component(Field.name, Field)
  Vue.component(Popup.name, Popup)
  export default {
    data() {
      return {
        consignee: '',
        mobile: '',
        zcode: '',
        address: '',
        addressSlots: [
          {
            flex: 1,
            defaultIndex: 1,
            values: Object.keys(s),
            className: 'slot1',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: [],
            className: 'slot3',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot4'
          }, {
            flex: 1,
            values: [],
            className: 'slot5',
            textAlign: 'center'
          }
        ],
        popupVisible: false,
        addressProvince: '',
        addressCity: '',
        addressXian: ''
      }
    },
    computed: {
      ...mapState(['userInfo']),
      openid: function () {
        return this.userInfo.openid
      },
      isDef: function () {
        return +this.$router.currentRoute.query.isDef === 1 ? 1 : 0
      },
      id: function () {
        return this.$router.currentRoute.query.id
      }
    },
    methods: {
      onAddressChange(picker, values) {
        let sheng = Object.keys(s)
        let shi = s[values[0]] ? Object.keys(s[values[0]]) : []
        let index = values[1] ? shi.indexOf(values[1]) : 0
        let xian = shi[index] ? s[values[0]][shi[index]] : []
        this.xianObj = xian
        picker.setSlotValues(1, shi)
        this.addressProvince = values[0]
        this.addressCity = values[1]
        this.addressXian = values[2]
        picker.setSlotValues(2, xian)
      },
      comfirm: function () {
        if (this.consignee && this.mobile && this.address) {
          let params = {
            openid: this.openid,
            address: {
              address: this.address,
              area: this.addressXian,
              city: this.addressCity,
              consignee: this.consignee,
              isdef: this.isDef,
              mobile: this.mobile,
              prov: this.addressProvince,
              zcode: this.zcode
            }
          }
          if (!this.id) {
            addAddress(params).then(res => {
              if (res.status === 0) {
                Toast('添加成功')
                this.$router.push('/address/list')
              } else {
                Toast(res.message ? res.message : '请求错误')
              }
            })
          } else {
            params.address.id = this.id
            updateAddress(params).then(res => {
              if (res.status === 0) {
                Toast('修改成功')
                this.$router.push('/address/list')
              } else {
                Toast(res.message ? res.message : '请求错误')
              }
            })
          }
        } else if (!this.consignee) {
          Toast('请输入收货人名称')
        } else if (!this.mobile) {
          Toast('请输入手机号')
        } else {
          Toast('请输入详细地址')
        }
      },
      getAddress: function () {
        getAddress({
          id: this.id,
          openid: this.openid
        }).then(res => {
          if (res.status === 0) {
            this.addressProvince = res.obj.prov
            this.addressCity = res.obj.city
            this.addressXian = res.obj.area
            this.address = res.obj.address
            this.consignee = res.obj.consignee
            this.zcode = res.obj.zcode
            this.mobile = res.obj.mobile
          } else {
            Toast(res.message ? res.message : '请求错误')
          }
        })
      }
    },
    mounted() {
//      this.$nextTick(() => {
//        setTimeout(() => {  // 这个是一个初始化默认值的一个技巧
      this.addressSlots[0].defaultIndex = 0
      if (this.id) {
        this.getAddress()
      }
//        }, 100)
//      })
    }
  }
</script>
<style lang="less">
  .mint-popup {
    width: 100%;
  }

  .mint-cell {
    border-bottom: 1px solid #eee;
    .mint-cell-value {
      .mint-field-core {
        font-size: 14px;

      }
    }
  }

  .bor-b {
    .mint-field-other {
      width: 10px;
      height: 10px;
      border-right: 1px solid #bbb;
      border-top: 1px solid #bbb;
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  #address-add {
    background-color: #f5f5f5;
    min-height: 100vh;
    overflow: hidden;
    .top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      margin-bottom: 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e73828;
      background-color: #fff;
      .title {
        display: inline-block;
        width: 70%;
        margin: 0 auto;
        text-align: center;
        font-size: 16px;
        color: #e73828;
      }
    }
    .bottom {
      margin: 50px 0 52px;
    }
    button {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 42px;
      border: none;
      background-color: #e73828;
      color: #fff;
      font-size: 16px;
    }
  }
</style>
