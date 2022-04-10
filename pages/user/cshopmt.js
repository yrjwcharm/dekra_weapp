//城市选择
let app = getApp();
let interval = null //倒计时函数
Page({
  data: {
    wxuserinfo:"",
    cshopinfo:"",
    pageNum: 1,
    pageSize: 30,
    hasMoreData: true,
    contentlist: [],
    total:0,
    tewm:"",
    showInviate:false,
  },
  onLoad: function (options) {
    let that = this;
    that.getContentInfo('正在加载数据...');
  },
  onShow: function (options) {
    //wx.redirectTo({ url: '/pages/user/index'});
    let that = this;
    //console.log(app.d.wxuserinfo);
    that.setData({wxuserinfo: app.d.wxuserinfo })
    // 生命周期函数--监听页面加载
    wx.request({
      url: app.d.hostApi + '/Api/Cshopmt/getCshopInfo',
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
          that.setData({ cshopinfo: data.list, tewm: app.d.hostStatic+data.list.tewm});
        }else{
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
  onShareAppMessage: function (res) {
    let pwd = this.data.cshopinfo.pwd;
    let city = this.data.cshopinfo.city;
    if (city == "深圳"){
      city = "SZ";
    }
    if (city == "北京") {
      city = "BJ";
    }

    return {
      title: this.data.cshopinfo.name +'为您推荐'+app.d.shareInfo.title,
      imageUrl: app.d.shareInfo.url,
      path: '/pages/index/index?scene=cshop-' + pwd + '-' + city,
    }
  },
  getContentInfo: function (message) {
    wx.showLoading({
      title: message,
    })
    let that = this;
    wx.request({
      url: app.d.hostApi + "/Api/Cshopmt/list",
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
              , total: res.data.total
            })
          } else {
            that.setData({
              contentlist: contentlistTem.concat(contentlist),
              hasMoreData: true,
              pageNum: that.data.pageNum + 1,
               total: res.data.total
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
  getMobile: function (res) {
    this.setData({tel:res.detail});
  },
  downloadImage: function (imageUrl) {
    // 下载文件  
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        //console.log("下载文件：success");
        //console.log(res);

        // 保存图片到系统相册  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            //console.log("保存图片：success");
            wx.showToast({
              title: '保存成功',
            });
          },
          fail(res) {
            //console.log("保存图片：fail");
            //console.log(res);
          }
        })
      },
      fail: function (res) {
        //console.log("下载文件：fail");
        //console.log(res);
      }
    })
  },
  onSavePicClick: function (e) {
    let that = this;
    //console.log("onSavePicClick");
    //console.log(e);
    let downloadUrl = e.currentTarget.dataset.img;
    //console.log("downloadUrl=" + downloadUrl);

    if (!wx.saveImageToPhotosAlbum) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return;
    }

    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
    wx.getSetting({
      success(res) {
        //console.log("getSetting: success");
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //console.log("1-没有授权《保存图片》权限");

          // 接口调用询问  
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //console.log("2-授权《保存图片》权限成功");
              that.downloadImage(downloadUrl);
            },
            fail() {
              // 用户拒绝了授权  
              //console.log("2-授权《保存图片》权限失败");
              // 打开设置页面  
              wx.openSetting({
                success: function (data) {
                  //console.log("openSetting: success");
                },
                fail: function (data) {
                  //console.log("openSetting: fail");
                }
              });
            }
          })
        } else {
          //console.log("1-已经授权《保存图片》权限");
          that.downloadImage(downloadUrl)
        }
      },
      fail(res) {
        //console.log("getSetting: fail");
        //console.log(res);
      }

    })

  }, 
  showInviate:function(){
    this.setData({ showInviate:true});
  },
  hideInviate: function () {
    this.setData({ showInviate: false });
  },


})
