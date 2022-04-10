//城市选择
let app = getApp();
let interval = null //倒计时函数
Page({
  data: {
    wxuserinfo:"",
    nickname:"",
    point:"",
  },
  formSubmit: function (e) {
    let that= this;
    let formData = e.detail.value;

    //console.log(app.d.wxuserinfo);

    if (new RegExp(/^\s*$/).test((formData.uname))) {
      wx.showModal({
        title: '错误提示',
        showCancel: false,
        content: '用户姓名不能为空'
      });
      return false;
    }
    //console.log(formData);
    //console.log(formData.tel);
    if (!(/^1[3456789]\d{9}$/.test(formData.tel))) {
      wx.showModal({
        title: '错误提示',
        showCancel: false,
        content: '手机号码格式不正确'
      });
      return false;
    }


    let nickname;
    let sex;
    let city;
    let photo;

    if (app.d.wxuserinfo){
      nickname = app.d.wxuserinfo.nickName;
      sex = app.d.wxuserinfo.gender;
      city = app.d.wxuserinfo.city;
      photo = app.d.wxuserinfo.avatarUrl;
    }else{
      nickname = "";
      sex = "";
      city = "";
      photo = "";
    }

    wx.request({
      url: app.d.hostApi + '/Api/User/setUserInfo',
      data: {
        uname: formData.uname,
        tel: formData.tel,
        idcard:formData.idcard,
        nickname:nickname,
        sex:sex,
        city:city,
        photo:photo,
        rd3_session: wx.getStorageSync('3rd_session')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data;
        if (data.success) {
          wx.showModal({
            title: "更新成功",
            content: data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({delta: 1})
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
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
          mask:true
        });
      }
    });



  },
  onShow: function (options) {
    //wx.redirectTo({ url: '/pages/user/index'});
    let that = this;
    //console.log(app.d.wxuserinfo);
    that.setData({wxuserinfo: app.d.wxuserinfo })
    // 生命周期函数--监听页面加载
    wx.request({
      url: app.d.hostApi + '/Api/User/getUserInfo',
      data: {
        rd3_session: wx.getStorageSync('3rd_session')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data;
        if(data.success){
          that.setData({
            uname: data.list.uname,
            tel: data.list.tel,
            point: data.list.point,
            nickname: data.list.nickname,
            sex:data.list.sex,
            point:data.list.point,
            idcard:data.list.idcard,

          });
        }else{
            if(app.d.wxuserinfo){
                that.setData({ nickname: app.d.wxuserinfo.nickName, sex: app.d.wxuserinfo.gender, point: 0 });
            }else{
                 that.setData({ point: 0 });
            }
          wx.showToast({
            title: data.msg,
            icon: "loading",
            duration: 2000,
            mask:true,
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
          mask:true,
        });
      }
    });

    ////console.log(app.d.userId);
  },
  getMobile: function (res) {
    this.setData({tel:res.detail});
  }
})
