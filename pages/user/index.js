// pages/user/user.js
let app = getApp()
Page( {
  data: {
    showModalStatus: false,
    orderInfo:{},
    wxuserinfo:"",
       loadingText: '加载中...',
       loadingHidden: false,
  },
  onLoad: function () {

      let that = this
      this.setData({ wxuserinfo:wx.getStorageSync('wxuserinfo')});
    //console.log(this.data.wxuserinfo)
      //调用应用实例的方法获取全局数据
      // app.getUserInfo(function(userInfo){
      //   //更新数据
      //   that.setData({
      //     userInfo:userInfo,
      //     loadingHidden: true
      //   })
      // });

      this.loadOrderStatus();
  },
  onShow:function(){
    this.loadOrderStatus();
  },
  loadOrderStatus:function(){
    //获取用户订单数据
    let that = this;
  },
  bindPhonecall: function(){
    wx.makePhoneCall({
      phoneNumber: app.d.phoneNumber //仅为示例，并非真实的电话号码
    });
  },
  viewAbout: function () {
    ////console.log("123123");
    wx.navigateTo({
      url: '/pages/about/about'
    });
    // wx.redirectTo({
    //   url: '/pages/user/user'
    // })
  },
  modifyMyUser: function(userinfo){
    // //console.log(userinfo.detail)
    // this.data.userinfo = userinfo.detail.userInfo;
    // //console.log( this.data.userinfo );
    app.d.wxuserinfo = userinfo.detail.userInfo;
    wx.navigateTo({
       url: '/pages/user/myinfo'
    })
  },
  clearStorage:function(){
    wx.clearStorage({
      success: function (res) {
        wx.showToast({
          title: '清理本地成功',
          duration: 2000
        });
      },
      fail:function(res){
        wx.showToast({
          title: '清理本地失败',
          duration: 2000
        });
      }
    });
    wx.clearStorage({
      success: function (res) {
        wx.showToast({
          title: '清理异步成功',
          duration: 2000
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '清理异步失败',
          duration: 2000
        });
      }
    });

  },
  staffonly:function(){
    let that = this;
    wx.request({
      url: app.d.hostApi + '/Api/Staffonly/validateUser', //仅为示例，并非真实的接口地址
      data: {
        rd3_session: wx.getStorageSync('3rd_session')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        let data = res.data;
        console.log(222,data.city);
        if(data.success){
          wx.setStorageSync('staff_bj_apppower', data.apppower + data.city);
          wx.navigateTo({url: 'staff?city='+data.city});
        }else{
          that.powerDrawer({ currentTarget: { dataset: { statu: "open" } } });
        }

      }
  });
  // bindgetuserinfo:function(e){
  //   app.d.wxuserinfo = e;
  // }
  },
  powerDrawer:function(){
    if (this.data.showModalStatus){
      this.setData({ showModalStatus: false });
    }else{
      this.setData({ showModalStatus: true });
    }

  },
  formStaffSubmit:function(e){
    let formData = e.detail.value;
    let that = this;
    wx.request({
      url: app.d.hostApi + '/Api/Staffonly/dovalidateUser', //仅为示例，并非真实的接口地址
      data: {
        name: formData['name'],
        pwd: formData['pwd'],
        rd3_session: wx.getStorageSync('3rd_session')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log(333,res);
        let data = res.data;
        wx.showModal({
          title: "信息提示",
          content: data.msg,
          showCancel: false
        });
        that.setData({ showModalStatus: false });
      }
    });
  }



})
