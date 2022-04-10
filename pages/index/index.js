//index.js
//获取应用实例
const app = getApp()
let util = require('../../utils/util.js');

Page({
  data: {
    notices:[],
    tlist:[],
    noticeConfig: { autoplay: true, interval: 2000, duration: 1200},
    bannerConfig: { autoplay: true, interval: 3000, duration:800},
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    pageNum: 1,
    pageSize: 30,
    hasMoreData: true,
    contentlist: [],
    iscopyright:0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this
    that.getContentInfo('正在加载数据...');
    that.getInfos();

    // wx.cloud.init();

    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'domsg',
    //   // 传给云函数的参数
    //   data: {
    //     a: 1,
    //     b: 2,
    //   },
    //   success: function (res) {
    //     //console.log(res.result.sum) // 3
    //   },
    //   fail: console.error
    // })


  },
  onShow:function(){
    //let that = this;
    //that.getInfos();

  },
  getInfos:function(){
    let that = this;
    wx.request({
      url: app.d.hostApi + "/Api/Infos/index",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data;
        if (data.success) {
          console.log(333,data);
          that.setData({ notices: data.notices,iscopyright:data.iscopyright });

          let banners = data.banners;
          for (let i = 0; i < banners.length; i++) {
            banners[i].thumb = app.d.hostStatic + banners[i].thumb;
          }
          that.setData({ lunboData: banners});

          let tlist = data.tlist;
          console.log(333,tlist)
          for (let i = 0; i < tlist.length; i++) {
            tlist[i].thumb = app.d.hostStatic + tlist[i].thumb;
          }
          console.log(555,data.tlist)
          that.setData({tlist:data.tlist });
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'loading',
            duration: 2000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '加载数据失败',
          icon: "none"
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
  getContentInfo: function (message) {
    wx.showLoading({
      title: message,
    })
    let that = this;
    wx.request({
      url: app.d.hostApi +"/Api/News/index",
      data: {
        p: that.data.pageNum,
        pageSize:that.data.pageSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let contentlistTem = that.data.contentlist;
        if(res.data.success){
          if (that.data.pageNum == 1) {
            contentlistTem = []
          }
          let contentlist = res.data.list;
          console.log(333,contentlist)
          for(let i=0; i<contentlist.length; i++){
            contentlist[i].inputtime = util.formatDate(new Date(contentlist[i].inputtime*1000));
            if (contentlist[i].thumb != "") {
              contentlist[i].thumb = app.d.hostStatic + contentlist[i].thumb;
            } else {
              contentlist[i].thumb = app.d.hostStatic +'/Data/miniapp/default.jpg';
            }
          }
          if (that.data.pageNum >= res.data.page){
            that.setData({
              contentlist: contentlistTem.concat(contentlist),
              hasMoreData: false
            })
          }else{
            that.setData({
              contentlist: contentlistTem.concat(contentlist),
              hasMoreData: true,
              pageNum: that.data.pageNum + 1
            })
          }

        }else{
          wx.showToast({
            title: res.data.msg,
            success:function(){
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        }


      },
      fail:function(){
        wx.showToast({
          title: '加载数据失败',
          icon: "none"
        })
      },
      complete:function(){
        wx.hideLoading();
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    //console.log('下拉');
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.data.pageNum = 1
    this.getContentInfo('正在刷新数据')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log(this.data.hasMoreData);
    if (this.data.hasMoreData) {
      this.getContentInfo('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  bannerGo: function(e){
    let url = '/'+e.currentTarget.dataset.url;
    wx.navigateTo({url: url,});
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    //console.log(app.d.dshare);
    return {
      title: app.d.shareInfo.title,
      imageUrl: app.d.shareInfo.url,
      path: '/pages/index/index?scene=inviate-' + wx.getStorageSync('wxuserinfo').id
    }
  },
  copyright:function(){
      wx.navigateTo({url: '/pages/about/webview?url='+this.data.iscopyright});
  }
})
