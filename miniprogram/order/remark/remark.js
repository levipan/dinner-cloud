/**
 *

 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *

 * @author 黄秀杰
 */

var WxNotificationCenter = require('../../utils/WxNotificationCenter.js')

Page({
  data: {},
  onLoad: function(options) {
    if (options.remark) {
      this.setData({
        remark: options.remark
      })
    }
  },
  setRemark: function(e) {
    var remark = e.detail.value.remark || ''
    // 推送通知
    WxNotificationCenter.postNotificationName('remarkNotification', remark)
    wx.navigateBack()
  }
})
