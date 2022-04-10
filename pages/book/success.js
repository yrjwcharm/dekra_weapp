// pages/book/success.
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     successInfo: [],
     mapData:{},
     stationData:{},
     infos:{},
     status:"",
     showModalStatus: false,
    showModalStatusView: false,
     bookNumber:"",
     verifyCode:"",
     mobile:"",
     smsCode:"",
     options:{},

     city:"",

    currentTime: 60,
    time: '获取验证码', //倒计时

    currentTel: "",
    point:0,
    pointPrice:"0.00",


    bookType: [
      { name: '车主', value: 'SELF', checked: true },
      { name: '代办', value: 'AGENT' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
        this.setData({
         options: options,
        })

//      options.id = 215;

      wx.showLoading({
        title: '订单信息获取中',
      });
      wx.request({
        url: app.d.hostApi + '/Api/Order/orderDetail',
        method:'POST',
        data: {
          id: options.id, //,
          rd3_session: wx.getStorageSync('3rd_session')
        },
        header: {
          'Content-Type':  'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideLoading();
          let data = res.data;
          //console.log(data.table);
          if(data.success){
            let mapData = data.mapData;
            let stationData = data.stationData;
            //console.log(data.info.discountonline);
            data.info.discountonline = parseFloat(data.info.discountonline).toFixed(2);
            data.info.maxPoint = data.info.point / data.info.pointDis > ((data.info.price - (data.info.discountonline)) > 0 ? (data.info.price - (data.info.discountonline)) : 0) ? data.info.pointDis * ((data.info.price - (data.info.discountonline)) > 0 ? (data.info.price - (data.info.discountonline)) : 0) : data.info.point;
            //console.log(data.info.scene.indexOf('Score-') > -1);
            if (data.info.scene.indexOf('Score-') > -1){
              data.info.isScore = 1;
            }

            that.setData({
              successInfo: data.table.split(","),
              mapData: mapData,
              stationData: stationData,
              info:data.info,
              currentTel:data.info.bookname == data.info.carname ? data.info.carmobile : data.info.bookmobile,
              staff_bj_apppower: wx.getStorageSync('staff_bj_apppower')
              // infos:res.data.data,
              // status:res.data.data.status
            });

          }else{
            wx.showToast({
              title: data.msg,
              icon: 'loading',
              duration: 2000
            });
          }
        },
        fail: function () {
          wx.hideLoading();
          // fail
          wx.showToast({
            title: '网络异常！',
            icon: 'loading',
            duration: 2000
          });
        }
      });
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
  onShareAppMessage: function (res) {
    let that = this;
    //console.log(that.data.stationData);
    return {
      title: '我在' + that.data.stationData.name+'完成了汽车年检，邀您一起来哦！',
      imageUrl: app.d.shareInfo.url,
      path: '/pages/index/index?scene=inviate-' + wx.getStorageSync('wxuserinfo').id
    }
  },
  updateTel: function (e) {
    let value = e.detail.value;
    this.setData({
      currentTel: value
    });
    //console.log(this.data.currentTel);
  },
  getCode: function (options) {
    let that = this;
    let currentTime = that.data.currentTime;
    let interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    let that = this;
    wx.request({
      url:
        app.d.hostApi +'/Api/Detectsz/msg', //仅为示例，并非真实的接口地址
      data: {
        mobile: that.data.currentTel,
        stationId: this.data.stationData.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        //console.log(res);

        let data = res.data;
        if (data.status == "fail") {
          wx.showModal({
            title: '错误提示',
            showCancel: false,
            content: data.msg
          });
        } else {
          wx.showModal({
            title: '短信获取成功',
            showCancel: false,
            content: data.msg + ',常有网络延迟请耐心等待,验证码有效期为30分钟。'
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          showCancel: false,
          content: '网络失败，请重试,如系统故障请输入任意验证码数值'
        });
      }
    })


    ////console.log(this.data.currentTel);

    this.getCode();
    that.setData({
      disabled: true
    })
  },
  powerDrawer: function (e) {
    let currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  powerDrawerView: function (e) {
    let currentStatu = e.currentTarget.dataset.statu;
    this.utilView(currentStatu)
  },
  errorMsg:function(content) {
      wx.showModal({
        title: '错误提示',
        content: content,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      });
    },
  formSubmitSzView:function(e){
    let options = this.data.options;
    ////console.log(1);
    //return false;
    let that = this;
    let formData = e.detail.value;
    formData.id = that.data.info.id;

    wx.showLoading({
      title: '验证码验证中',
    })
    wx.request({
      url: app.d.hostApi + '/Api/Order/viewSz', //仅为示例，并非真实的接口地址
      data: formData,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        let data = res.data;
        wx.showModal({
          title: "错误提示",
          content: data.msg,
          showCancel: false
        });
      },
      fail: function () {
        wx.hideLoading();
        // fail
        wx.showToast({
          title: '网络异常！',
          icon: 'loading',
          duration: 5000
        });
      }
    });
  },
  formSubmitSz:function(e){
    let options = this.data.options;
    ////console.log(1);
    //return false;
    let that = this;
    let formData = e.detail.value;
    formData.id = that.data.info.id;
    //console.log(formData);
    wx.showLoading({
      title: '验证码验证中',
      mask:true
    })
    let domsging = "";
    if (app.d.msgcookie) {
      domsging = "?msgcookie=" + app.d.msgcookie;
    }
    wx.request({
      url: app.d.hostApi + '/Api/Order/cancelSz' + domsging, //仅为示例，并非真实的接口地址
      data: formData,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {

        wx.hideLoading();
        let data = res.data;
        if(data.success){
          wx.showModal({
            title: "取消成功",
            content: data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.redirectTo({ url: '/pages/user/dingdan' });
              }
            }
          });
        }else{
          wx.showModal({
            title: "错误提示",
            content: data.msg,
            showCancel: false
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        // fail
        wx.showToast({
          title: '网络异常！',
          icon: 'loading',
          duration: 5000
        });
      }
    });

    //this.util("close");



  },
  formSubmitBj:function(e){
    let formData = e.detail.value;
    wx.showLoading({
      title: '订单取消中',
      mask:true
    });
    wx.request({
      url: app.d.hostApi + '/Api/Order/cancelBj',
      method: 'POST',
      data: formData,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        let data = res.data;
        if (data.success) {
          wx.showModal({
            title: "取消成功",
            content: data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.redirectTo({ url: '/pages/user/dingdan'});
              }
            }
          });

        } else {
          wx.showModal({
            title: "错误提示",
            content: data.msg,
            showCancel: false
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        // fail
        wx.showToast({
          title: '网络异常！',
          icon: 'loading',
          duration: 2000
        });
      }
    });


  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例
    let animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  utilView: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例
    let animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatusView: false
          }
        );
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatusView: true
        }
      );
    }
  },
  gouser:function(){
    wx.switchTab({
      url: '/pages/user/user'
    })
  },
  gohome:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  location: function (options) {
    let that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.mapData.latitude),
      longitude: parseFloat(that.data.mapData.longitude),
      scale: 18,
      name: that.data.stationData.name,
      address: that.data.stationData.addrtext,
    })
  },
  weixinpay: function () {
    let that = this;
    wx.showModal({
      title: '支付提示',
      content: '将线上微信支付以节约时间\n若已线下支付请勿重复支付！',
      success: function (res) {
        if (res.confirm) {
          //console.log('用户点击确定');
          wx.showLoading({
            title: '支付拉起中',
            mask:true,
          });
          wx.request({
            url: app.d.hostApi + '/Api/Wxpay/wxpay',
            data: {
              point:that.data.point,
              order_sn: that.data.info.order_sn,
              stationId: that.data.stationData.id,
              rd3_session: wx.getStorageSync('3rd_session'),
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }, // 设置请求的 header
            success: function (res) {
              wx.hideLoading();
              let data = res.data;
              if (data.success) {
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
                      duration: 5000,
                    });
                    let info = that.data.info;
                    console.log(333,info);
                    info.status = 2;
                    that.setData({ info: info });
                    let pages = getCurrentPages();
                    let perpage = pages[pages.length - 1];
                    let options ={};
                    options.id = info.id;
                    perpage.onLoad(options);
                  },
                  fail: function (res) {
                    wx.hideLoading();
                    wx.showToast({
                      title: "支付失败",
                      duration: 5000
                    })
                  }
                })
              } else {
                wx.hideLoading();
                wx.showModal({
                  title: "错误提示",
                  content: data.msg,
                  showCancel: false
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
  sliderPoint:function(e){
    let that = this;
    let point = e.detail.value;
    let pointPrice = (point/20).toFixed(2);
    //console.log(pointPrice);
    that.setData({ point: point, pointPrice: pointPrice});

  },
  switch1Change:function(e){
    let boo = e.detail.value;
    let pointPrice = 0;
    let that = this;
    if(boo){
      pointPrice = that.data.info.maxPoint / that.data.info.pointDis;
    }else{
      pointPrice = 0;
    }
    that.setData({ pointPrice: pointPrice, point: that.data.info.maxPoint});
  },
  jumpto: function () {
    wx.redirectTo({
      url: '/pages/book/checkstand?city=%E5%8C%97%E4%BA%AC'
    })
  }
})
