let app = getApp();
Page({
  data: {
    pageNum: 1,
    pageSize: 30,
    hasMoreData: true,
    contentlist: [],
  },
  onLoad: function(options) {
    let that = this;
    that.getContentInfo('正在加载数据...');
  },
  getContentInfo: function (message) {
    wx.showLoading({
      title: message,
    })
    let that = this;
    wx.request({
      url: app.d.hostApi + "/Api/Order/list",
      data: {
        p: that.data.pageNum,
        pageSize: that.data.pageSize,
        rd3_session: wx.getStorageSync('3rd_session')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let contentlistTem = that.data.contentlist;
        //console.log(res.data.page);

        if (res.data.success) {
          if (that.data.pageNum == 1) {
            contentlistTem = []
          }
          let contentlist = res.data.list;
          if (that.data.pageNum >= res.data.page) {
            that.setData({
              contentlist: contentlistTem.concat(contentlist),
              hasMoreData: false
            })
          } else {
            that.setData({
              contentlist: contentlistTem.concat(contentlist),
              hasMoreData: true,
              pageNum: that.data.pageNum + 1
            })
          }

        } else {
          wx.showToast({
            title: res.data.msg,
            success: function () {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
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

  jumptominiapp:function(e){
    let url = e.currentTarget.dataset.url;
    if (url){
      wx.navigateToMiniProgram({
        appId: 'wx34b0738d0eef5f78',
        path: url
      })
    }else{
      let id = e.currentTarget.dataset.id;
      let siteid = e.currentTarget.dataset.siteid
      let nurl = "/pages/question/query?orderId=" + id + "&siteid=" + siteid
      wx.navigateTo({ url: nurl})
    }


  }





})
