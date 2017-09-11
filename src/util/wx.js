// let wxJsapi = require('weixin-jsapi').default
import wxJsapi from 'weixin-jsapi'
let wx = {
  config: (config) => {
    console.log(wxJsapi.default)
    wxJsapi.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: config.appId, // 必填，公众号的唯一标识
      timestamp: config.timestamp, // 必填，生成签名的时间戳
      nonceStr: config.nonceStr, // 必填，生成签名的随机串
      signature: config.signature, // 必填，签名，见附录1
      jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
  },
  pay: (config, callback) => {
    wxJsapi.chooseWXPay({
      timestamp: config.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: config.nonceStr, // 支付签名随机串，不长于 32 位
      package: config.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: config.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: config.paySign, // 支付签名
      success: callback
    })
  }
}
export default wx
