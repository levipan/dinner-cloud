/**
 *
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @author 黄秀杰
 */

const WxNotificationCenter = require('../../utils/WxNotificationCenter')
const { showModal } = require('../../utils/utils')
const User = require('../../utils/user')
const db = wx.cloud.database()

Page({
  onLoad: function(options) {
    // 注册通知
    WxNotificationCenter.addNotification(
      'poiSelectedNotification',
      this.getAddress,
      this
    )
    // 属于编辑状态
    if (options.objectId) {
      this.loadAddress(options.objectId)
      this.setData({
        isEdit: true
      })
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加地址'
      })
    }
  },
  selectAddress: function() {
    console.log('tapped')
    // 跳转选择poi
    wx.navigateTo({
      url: '../search/search'
    })
  },
  getAddress: function(area) {
    // 选择poi地址回调
    this.setData({
      area: area
    })
  },
  add: function(e) {
    const form = e.detail.value
    // console.log(form);
    // 表单验证
    if (form.realname == '') {
      wx.showModal({
        title: '请填写收件人姓名',
        showCancel: false
      })
      return
    }

    if (!/^1[34578]\d{9}$/.test(form.mobile)) {
      wx.showModal({
        title: '请填写正确手机号码',
        showCancel: false
      })
      return
    }

    if (form.detail == '') {
      wx.showModal({
        title: '请填写详细地址',
        showCancel: false
      })
      return
    }
    form.gender = parseInt(form.gender)
    form.user = User.current()._id

    // 添加或者修改分类
    // 修改模式
    if (this.data.isEdit) {
      const address = this.data.address
      db.collection('Address')
        .doc(address._id)
        .update({
          data: form
        })
        .then(res => {
          console.log(res)
          showModal()
        })
    } else {
      db.collection('Address')
        .add({
          data: form
        })
        .then(res => {
          console.log(res)
          showModal()
        })
    }
  },
  loadAddress: function(objectId) {
    db.collection('Address')
      .doc(objectId)
      .get()
      .then(({ data: addressObject }) => {
        this.setData({
          address: addressObject
        })
      })
  },
  delete: function() {
    // 确认删除对话框
    wx.showModal({
      title: '确认删除',
      success: (res) => {
        if (res.confirm) {
          const address = this.data.address
          db.collection('Address').doc(address._id).remove().then(res => {
            console.log(res)
            wx.showModal({
              title: '删除成功',
              showCancel: false,
              success: () => {
                wx.navigateBack()
              }
            })
          })
        }
      }
    })
  }
})
