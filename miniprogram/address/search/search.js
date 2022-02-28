/**
 *
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @author 黄秀杰
 */

const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const WxNotificationCenter = require('../../utils/WxNotificationCenter.js')
const qqmapsdk = new QQMapWX({
  key: 'BJFBZ-ZFTHW-Y2HRO-RL2UZ-M6EC3-GMF4U'
})
Page({
  onLoad: function(options) {
    this.reloadCurrent()
  },
  keywordTyping: function(e) {
    // 键盘不断录入绑定取值
    const keyword = e.detail.value
    // 向腾讯地图接口发送请求
    qqmapsdk.getSuggestion({
      keyword: keyword,
      region: this.data.city,
      success: (res) => {
        console.log(res)
        // 保存地址数组
        this.setData({
          result: res.data
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        console.log(res)
      }
    })
  },
  addressTapped: function(e) {
    const title = e.currentTarget.dataset.title
    // 取出点中的地址，然后使用WxNotification回传给首页
    WxNotificationCenter.postNotificationName('poiSelectedNotification', title)
    wx.navigateBack()
  },
  geoTapped: function() {
    const title = this.data.address
    WxNotificationCenter.postNotificationName('poiSelectedNotification', title)
    wx.navigateBack()
  },
  reloadCurrent: function() {
    this.setData({
      address: '正在定位中...'
    })
    // 调用接口
    qqmapsdk.reverseGeocoder({
      poi_options: 'policy=2',
      get_poi: 1,
      success: (res) => {
        // 渲染给页面
        this.setData({
          address: res.result.formatted_addresses.recommend,
          result: res.result.pois,
          city: res.result.address_component.city
        })
      },
      fail: function(res) {
        //         console.log(res);
      },
      complete: function(res) {
        //         console.log(res);
      }
    })
  }
})
