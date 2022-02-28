// 初始化AV
const User = require('./utils/user')
wx.cloud.init({
  traceUser: true
})
const db = wx.cloud.database()

App({
  login() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      success: res => {
        // console.log(res)
        const { result: user } = res
        wx.setStorage({
          key: 'user',
          data: user
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  onLaunch: function() {
    this.login()
    // 设备信息
    wx.getSystemInfo({
      success: res => {
        this.screenWidth = res.windowWidth
        this.screenHeight = res.windowHeight
        this.pixelRatio = res.pixelRatio
      }
    })
  },
  auth: function() {
    // 管理员认证
    if (!(User.current() && User.current().isAdmin)) {
      wx.switchTab({
        url: '../../shop/index/index'
      })
    }
  },
  async loadSeller(cb) {
    const sellers = await db.collection('Seller').get()
    if (sellers.data.length <= 0) {
      // 没有店铺那就创建一个
      await db.collection('Seller').add({
        data: {
          logo:
            'http://bmob.it577.net/2020/06/16/021d4cf840b6cf1880ac4e9d379cb811.png',
          address: '瑞安市长春花园',
          express_fee: 4.0,
          min_amount: 1.0,
          name: '老硐桥香酥鸭',
          notice: '新鲜每一天',
          telephone: '18658350723',
          business_start: '00:13',
          logo_url:
            'cloud://dinner-cloud.6469-dinner-cloud-1302561035/20200705103710404.png',
          business_end: '16:02'
        }
      })
      const sellers = await db.collection('Seller').get()
      const seller = sellers.data[0]
      cb(seller)
      
    } else {
      const seller = sellers.data[0]
      cb(seller)
    }
  },
  payment: function(obj) {
    db.collection('Order')
      .doc(obj._id)
      .get()
      .then(({ data: order }) => {
        // debugger
        // 发起支付
        wx.cloud.callFunction({
          data: {
            orderId: order._id,
            amount: order.total * 100 && 1,
            body: order.title
          },
          name: 'unified',
          success: res => {
            const { result: payData } = res
            wx.requestPayment({
              timeStamp: payData.timeStamp,
              nonceStr: payData.nonceStr,
              package: payData.package,
              signType: 'MD5',
              paySign: payData.paySign,
              success: res => {
                console.log('支付成功', res)
                wx.showModal({
                  title: '支付成功',
                  showCancel: false,
                  success: () => {
                    // 跳转订单详情页
                    wx.navigateTo({
                      url: '/order/detail/detail?objectId=' + order._id
                    })
                  }
                })
              },
              fail: res => {
                console.log('支付失败', res)
                wx.showModal({
                  showCancel: false,
                  title: '支付失败',
                  success: res => {
                    wx.navigateTo({
                      url: '/order/detail/detail?objectId=' + order._id
                    })
                  }
                })
              },
              complete(res) {
                // console.log('支付完成', res)
              }
            })
          },
          fail: err => {
            console.error(err)
          }
        })
      })
  }
})
