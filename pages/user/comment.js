const app = getApp()
// pages/user/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/no-star.png',
    selectedSrc: '../../images/full-star.png',
    halfSrc: '../../images/half-star.png',
    key: 0,//评分
    order_sn:"",
    comment:"",
    count:0,
    disabled:"false",
  },

  onLoad: function (options) {
    let that = this;
    this.setData({ order_sn: options.order_sn });

    wx.request({
      url: app.d.ceshiUrl + '/Api/Commented/getcomment',
      data: {
        oid: that.data.order_sn,
        rd3_session: wx.getStorageSync('3rd_session')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        //console.log(res);
        if (res.data.status == 1) {
          that.setData({ key: res.data.commentinfo.rate, count: res.data.commentinfo.rate, comment: res.data.commentinfo.comment, disabled:"disabled"});
          wx.showToast({
            title: '查看评论',
            duration: 2000
          });
        }else{
          that.setData({  disabled: "" });
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: "请撰写评论",
          duration: 3000
        });
      }
    });

  },
  //点击左边,半颗星
  selectLeft: function (e) {
    if(!this.data.disabled){
    let key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      count:key,
      key: key
    })
    }
  },
  //点击右边,整颗星
  selectRight: function (e) {
    if (!this.data.disabled) {
    let key = e.currentTarget.dataset.key
    this.setData({
      key: key,
      count:key,
    })
    }
  },
  updateComment:function(e){
    //console.log(e.detail.value)
    this.setData({ comment: e.detail.value });
  },
  startRating: function (e) {
    let that = this;
    if(that.data.comment.length < 9){
      wx.showModal({
        title: '提示',
        content: '请输入足够长度评论'
      })
      return false;
    }
    wx.showModal({
      title: '信息',
      content: "确定提交评论？" + that.data.count,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.d.ceshiUrl + '/Api/Commented/docomment',
            data:{
              order_sn: that.data.order_sn,
              rate:that.data.count,
              comment: that.data.comment,
              rd3_session: wx.getStorageSync('3rd_session')
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
              //console.log(res);
              if(res.data.status==1){
                wx.showToast({
                  title: '评论成功',
                  duration: 2000
                });
                wx.navigateTo({ url: '/pages/user/dingdan' });
              }else{
                wx.showToast({
                  title: "评论重复",
                  duration: 3000
                });
              }
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showToast({
                title: "评论失败",
                duration: 3000
              });
            }
          });

        }
      }
    });





  },
  onShareAppMessage: function (res) {
    return {
      title: app.d.shareInfo.title,
      imageUrl: app.d.shareInfo.url,
      path: '/pages/index/index?scene=inviate-' + wx.getStorageSync('wxuserinfo').id
    }
  },

})
