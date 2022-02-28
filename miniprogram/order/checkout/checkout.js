/**
 *
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @author 黄秀杰
 */

const WxNotificationCenter = require('../../utils/WxNotificationCenter.js')
const db = wx.cloud.database()
const User = require('../../utils/user')
const moment = require('moment')
Page({
  data: {
    personCountIndex: 0
  },
  onLoad: function(options) {
    this.loadAddress()
    // 注册通知
    WxNotificationCenter.addNotification(
      'addressSelectedNotification',
      this.getSelectedAddress,
      this
    )
    WxNotificationCenter.addNotification(
      'remarkNotification',
      this.getRemark,
      this
    )
    // 购物车获取参数
    this.setData({
      carts: JSON.parse(options.carts)
    })
    // 读取商家信息
    getApp().loadSeller(seller => {
      this.setData({
        seller: seller
      })
    })
    this.setData({
      amount: parseFloat(options.amount),
      quantity: parseInt(options.quantity),
      express_fee: parseInt(options.express_fee),
      total: parseFloat(options.amount) + parseInt(options.express_fee)
    })
    this.initPersonCountArray()
  },
  selectAddress: function() {
    wx.navigateTo({
      url: '../../address/list/list?isSwitchAddress=true'
    })
  },
  getSelectedAddress: function(addressId) {
    console.log(addressId)
    // 回调查询地址对象
    db.collection('Address')
      .doc(addressId)
      .get()
      .then(({ data: address }) => {
        this.setData({
          address: address
        })
      })
  },
  loadAddress: function() {
    db.collection('Address')
      .where({
        user: User.current()._id
      })
      .get()
      .then(({ data: addressObjects }) => {
        // 查到用户已有收货地址
        if (addressObjects.length > 0) {
          this.setData({
            address: addressObjects[0]
          })
        }
      })
  },
  initPersonCountArray: function() {
    // 初始化用户数
    const personCountArray = []
    const length = 10
    for (let i = 1; i <= length; i++) {
      personCountArray.push(i + '人')
    }
    personCountArray.push(length + '人以上')
    this.setData({
      personCountArray: personCountArray
    })
  },
  getRemark: function(remark) {
    console.log(remark)
    this.setData({
      remark: remark
    })
  },
  naviToRemark: function() {
    wx.navigateTo({
      url: '../remark/remark?remark=' + (this.data.remark || '')
    })
  },
  bindPickerChange: function(e) {
    // 监听picker事件
    this.setData({
      personCountIndex: e.detail.value
    })
  },
  payment: function() {
    if (!this.data.address) {
      wx.showModal({
        title: '请先选择一个地址',
        showCancel: false
      })
      return
    }
    const title = this.data.carts[0].title + '等' + this.data.quantity + '件商品'
    // 创建订单
    db.collection('Order')
      .add({
        data: {
          user: User.current()._id,
          address: this.data.address._id,
          express_fee: this.data.express_fee,
          title: title,
          quantity: this.data.quantity,
          amount: this.data.amount,
          total: this.data.total,
          status: 0,
          detail: this.data.carts,
          remark: this.data.remark,
          sn: moment().format('YYYYMMDDHHmmssSSS'),
          createdAt: new Date()
        }
      })
      .then(order => {
        console.log(order)
        getApp().payment(order)
      })
  }
})
