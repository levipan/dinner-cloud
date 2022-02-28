/** 
 * 该云函数已经废弃，改用云开发原生的微信支付
*/
//云开发实现支付
const cloud = require('wx-server-sdk')
cloud.init()

//1，引入支付的三方依赖
const tenpay = require('tenpay')
//2，配置支付信息
const config = {
  appid: 'wx6f3d369c20b1678f', //
  mchid: '1447716902', //
  partnerKey: '21f0ce9b272ecfba342f83994c438f39', //
  notify_url: 'https://mp.weixin.qq.com', //支付回调网址,这里可以先随意填一个网址
  spbill_create_ip: '127.0.0.1'
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let { orderId, amount, body } = event
  //3，初始化支付
  const api = tenpay.init(config)

  let result = await api.getPayParams({
    out_trade_no: orderId,
    body: body,
    total_fee: amount, //订单金额(分),
    openid: wxContext.OPENID //付款用户的openid
  })
  return result
}
