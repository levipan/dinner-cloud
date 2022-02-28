// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('请求中')
  console.log(cloud.getWXContext().ENV)
  let { orderId, amount, body } = event
  const wxContext = cloud.getWXContext()
  const res = await cloud.cloudPay.unifiedOrder({
    body: body,
    outTradeNo: orderId,
    spbillCreateIp: '127.0.0.1',
    subMchId: '1447716902',
    totalFee: amount,
    envId: 'dinner-cloud',
    functionName: 'pay_cb'
  })
  return res.payment
}
