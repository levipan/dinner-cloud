/*
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @author 黄秀杰
 */

const db = wx.cloud.database()

Page({
  onLoad: function() {
    // 管理员认证
    getApp().auth()
  },
  onShow: function() {
    this.loadCategories()
  },
  loadCategories: function() {
    db.collection('Category')
      .orderBy('priority', 'asc')
      .get()
      .then(res => {
        this.setData({
          categories: res.data
        })
      })
  },
  add: function() {
    // 跳转添加页面
    wx.navigateTo({
      url: '../add/add'
    })
  }
})
