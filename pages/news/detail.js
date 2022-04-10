// pages/news/detail.js
const app = getApp()
let WxParse = require('../../wxParse/wxParse.js');
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    addr:"",
    isHidden:"",
    date:"",
    ewmUrl:"",
    info:"",
    wallpaperbg: app.d.hostStatic +"/Data/miniapp/wallpaper_newsbg.jpg",
    avatar:"",
    productname:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let newId = options.contentId;
    //let newId = 30;
    let that = this;
    wx.request({
      url: app.d.hostApi + "/Api/News/get",
      method: "GET",
      data: {
        id: newId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data;
        if(data.success){
          //data.content.inputtime = util.formatDate(new Date(data.content.inputtime *1000));
          data.content.inputtime = util.formatTime(new Date(data.content.inputtime * 1000));

          //console.log(data.content.inputtime);

          that.setData({ "title": data.content.title, "productname": data.content.inputtime, "info": data.content.pdescription, "thumb": app.d.hostStatic +"/Data/miniapp/blank.jpg"});

          data.content.content
          let article = data.content.content.replace(/src=\"\/Upload\//g, "src=\"" + app.d.hostStatic+"Upload/");
          WxParse.wxParse('article', 'html', article, that, 5);
        }
      },
      fail: function () {
        wx.showToast({
          title: '加载数据失败',
          icon: none
        })
      },
      complete: function () {
        wx.hideLoading();
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: app.d.shareInfo.title,
      imageUrl: app.d.shareInfo.url,
      path: '/pages/index/index?scene=inviate-' + wx.getStorageSync('wxuserinfo').id
    }
  },
  //调用子组件的方法
  getSharePoster: function () {
    this.setData({ isHidden: "isHidden" });
    this.setData({ showVideo: false })
    this.selectComponent('#getPoster').getAvaterInfo()
  },
  myEventListener: function (e) {
    this.setData({ showVideo: true, isHidden:"" });
  },
  bindGetUserInfo: function (e) {
    //console.log(this.data);
    let that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      let avatar = e.detail.userInfo.avatarUrl;
      wx.request({
        url: app.d.hostApi + "/Api/Ewm/makeMiniappEwm",
        method: "GET",
        data: {
          inviter: wx.getStorageSync('wxuserinfo').id,
          type:"news"
        },
        success: function (res) {
          wx.hideLoading();
          let data = res.data;
          if (data.success){
            that.setData({
              avatar: avatar,
              ewmUrl: app.d.hostStatic+data.url,
            });

            that.getSharePoster();
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: '错误提示',
            content: '网络请求失败,请重试',
            showCancel: false,
          });
        },
        complete: function () {

        }
      });


    }else{
      wx.showModal({
        title: '错误提示',
        showCancel: false,
        content: "请重新点击生成海报，同意授权"
      });
    }
  }
})
