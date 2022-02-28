/**
 *
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @author 黄秀杰
 */

const User = require('../../utils/user')
const db = wx.cloud.database()
const moment = require('moment')

Page({
  data: {
    isAdmin: User.current() && User.current().isAdmin
  },
  onLoad: function(options) {
    this.loadOrder(options.objectId)
    this.setData({
      objectId: options.objectId
    })
    getApp().loadSeller(seller => {
      this.setData({
        seller: seller
      })
    })
  },
  loadOrder: function(objectId) {
    // 加载订单详情
    db.collection('Order')
      .doc(objectId)
      .get()
      .then(({ data: order }) => {
				order.createdAt = moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')
        this.setData({
          order: order
				})
				// 再次查询地址信息，因为联表查询是要在云函数中操作的，故而嵌套
				const addressId = order.address
				db.collection('Address').doc(addressId).get().then(({data: address}) => {
					this.setData({
						address: address
					})
				})
      })
  },
  contact: function() {
    const telephone = this.data.seller.telephone
    wx.makePhoneCall({
      phoneNumber: telephone //仅为示例，并非真实的电话号码
    })
  },
  payment: function() {
    // 支付
    getApp().payment(this.data.order)
  },
  cancel: function() {
    // 取消确认
    wx.showModal({
      title: '确定要取消订单吗？',
      success: res => {
        if (res.confirm) {
          // 取消订单
          const order = this.data.order
          db.collection('Order').doc(order._id).update({
            data: {
              status: -1
            }
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: '订单已取消',
              success: () => {
                this.loadOrder(order._id)
              }
            })
          })
        }
      }
    })
  },
  callReceiver: function(e) {
    var telephone = e.currentTarget.dataset.telephone
    wx.makePhoneCall({
      phoneNumber: telephone //仅为示例，并非真实的电话号码
    })
  },
  send: function() {
    // 取消确认
    wx.showModal({
      title: '确定要派送订单吗？',
      success: res => {
        if (res.confirm) {
          // 派送订单
          db.collection('Order')
            .doc(this.data.objectId)
            .update({
              data: {
                status: 2
              }
            })
            .then(res => {
              console.log(res)
              wx.showToast({
                title: '订单已派送',
                success: () => {
                  this.loadOrder(this.data.objectId)
                }
              })
            })
        }
      }
    })
  }
})
