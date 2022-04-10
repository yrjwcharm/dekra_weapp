// pages/book/pay.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  weixinpay1: function () {
    let that = this;
    wx.showModal({
      title: '支付提示',
      content: '将线上微信支付以节约时间\n若已线下支付请勿重复支付！',
      success: function (res) {
        if (res.confirm) {
          //console.log('用户点击确定');
          wx.showLoading({
            title: '支付拉起中',
          });
          //that.infos.status = 2;
          wx.request({
            url: app.d.hostUrl + '/Api/Wxpay/wxpay',
            data: {
              // order_id:"2017052652101abc",
              order_sn: "",
              mchid:""
              // uid:this.data.userId,
              // rd3_session: wx.getStorageSync('3rd_session'),
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }, // 设置请求的 header
            success: function (res) {
              wx.hideLoading();
              // //console.log(app.d.ceshiUrl + '/Api/Wxpay/wxpay');
              if (res.data.status == 1) {
                let order = res.data.arr;
                wx.requestPayment({
                  timeStamp: order.timeStamp,
                  nonceStr: order.nonceStr,//order.nonceStr,
                  package: order.package,
                  signType: 'MD5',
                  paySign: order.paySign,
                  success: function (res) {
                    // //console.log(res);
                    wx.showToast({
                      title: "支付成功!",
                      duration: 2000,
                    });
                    //that.infos.status = 2;
                    that.setData({ status: 2 });
                  },
                  fail: function (res) {
                    wx.hideLoading();
                    wx.showToast({
                      title: "支付失败",
                      duration: 3000
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.err,
                  duration: 2000
                });
              }
            },
            fail: function () {
              wx.hideLoading();
              // fail
              wx.showToast({
                title: '网络异常！err:wxpay',
                duration: 2000
              });
            }
          });
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  weixinpay2: function () {
    let that = this;
    wx.showModal({
      title: '支付提示',
      content: '将线上微信支付以节约时间\n若已线下支付请勿重复支付！',
      success: function (res) {
        if (res.confirm) {
          //console.log('用户点击确定');
          wx.showLoading({
            title: '支付拉起中',
          });
          //that.infos.status = 2;
          wx.request({
            url: app.d.hostUrl + '/Api/Wxpay/wxpay',
            data: {
              // order_id:"2017052652101abc",
              order_sn: "",
              mchid: ""
              // uid:this.data.userId,
              // rd3_session: wx.getStorageSync('3rd_session'),
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }, // 设置请求的 header
            success: function (res) {
              wx.hideLoading();
              // //console.log(app.d.ceshiUrl + '/Api/Wxpay/wxpay');
              if (res.data.status == 1) {
                let order = res.data.arr;
                wx.requestPayment({
                  timeStamp: order.timeStamp,
                  nonceStr: order.nonceStr,//order.nonceStr,
                  package: order.package,
                  signType: 'MD5',
                  paySign: order.paySign,
                  success: function (res) {
                    // //console.log(res);
                    wx.showToast({
                      title: "支付成功!",
                      duration: 2000,
                    });
                    //that.infos.status = 2;
                    that.setData({ status: 2 });
                  },
                  fail: function (res) {
                    wx.hideLoading();
                    wx.showToast({
                      title: "支付失败",
                      duration: 3000
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.err,
                  duration: 2000
                });
              }
            },
            fail: function () {
              wx.hideLoading();
              // fail
              wx.showToast({
                title: '网络异常！err:wxpay',
                duration: 2000
              });
            }
          });
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
})
