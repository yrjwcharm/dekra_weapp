const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
         type: String
    },
    class: {
         type: String
    },
    size: {
         type: String
    },
    type: {
         type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  ready: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhoneNumber2: function (e) {
      var that = this;
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '未授权',
          success: function (res) { }
        })
      } else {//确认授权

        let time = wx.getStorageSync('exp');
        if (Date.parse(new Date()) > time){
          app.login_wx();
          setTimeout(function () { that.getPhoneDo(e)}, 3000);
        }else{
          that.getPhoneDo(e);
        }

      }
    },
    getPhoneDo: function (e) {
      let that = this;
      var session_key = wx.getStorageSync('session_key')
      wx.request({
        url: app.d.hostApi + `/Api/GetPhone/getPhoneNumber`,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "get",
        data: {
          encryptedData: e.detail.encryptedData, iv: e.detail.iv, session_key: session_key
        },
        success: function (res) {
          if (res.data.msg.phoneNumber) {
            //console.log(res);
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '授权成功',
              success: function () {
                that.triggerEvent('onSuccess', res.data.msg.phoneNumber);
                // //console.log(res);
                // wx.setStorageSync('phoneNumber', res.data.msg.phoneNumber);
                //  var time = Date.parse(new Date()) + 60 * 60 * 24 * 2
                //  wx.setStorageSync('exp', time);
              }
            })
           
          } else {
            wx.showToast({
              title: '授权失败',
              icon: 'loading'
            })
          }

        },
        fail: function () {
          wx.showToast({
            title: '授权失败',
            icon: 'loading'
          })
        }
      })
    }
  }
})