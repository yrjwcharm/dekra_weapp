//app.js
let commonUtils = require('common/commonUtils.js');
let httpRequest = require('common/request.js');
App({
  d: {
    hostApi:"https://pvi.dekra.com.cn/",
    hostStatic:"https://pvi.dekra.com.cn/",
    // hostApi:"http://dekai.youjiankang.top/",
    // hostStatic: 'http://dekai.youjiankang.top/',
    shareInfo: { "title": "德国品牌 全球连锁 质量保证 服务至上", "url":"https://pvi.dekra.com.cn/Data/miniapp/dshare.jpg"},
    wxuserinfo: {},
    scene:"",
    channel:"",
    msgcookie: "",
  },
  onShow: function (options){
    let that = this;
    //console.log(options);
    wx.setStorageSync('formid', []); //formid
    var scene = options.query.scene ? decodeURIComponent(options.query.scene) : '';
    console.log(333,scene);
    // // - 是我们定义的参数链接方式
    // var channel = scene.split("-")[0];
    // var pwd = scene.split('-')[1];
    // var city = scene.split('-')[2];

    // let sceneObj = {};
    // sceneObj.channel = channel;
    // sceneObj.pwd = pwd;
    // sceneObj.city = city;
    if(scene){
        this.d.scene = scene;
        // - 是我们定义的参数链接方式
        var channel = scene.split("-")[0];
        var pwd = scene.split('-')[1];
        var city = scene.split('-')[2];
        this.d.channel =channel;
        if (channel == "voucher") {
          wx.request({
            url: that.d.hostApi + '/Api/Voucher/validate', //仅为示例，并非真实的接口地址
            data: {
              pwd: pwd,
              city: city,
              scene: scene,
              rd3_session: wx.getStorageSync('3rd_session')
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
              let data = res.data;
              if(data.success){
                wx.showModal({
                  title: "信息提示",
                  content: data.msg,
                  success(res) {
                    if (res.confirm) {
                      console.log(333,data.url)
                      wx.navigateTo({
                        url: data.url,
                      })
                    } else if (res.cancel) {
                      //console.log('用户点击取消')
                      that.d.scene = '';
                    }
                  }
                });
              }
            }
          });


          // wx.showModal({
          //   title: '提示',
          //   content: '这是一个模态弹窗',
          //   success(res) {
          //     if (res.confirm) {
          //       //console.log('用户点击确定')
          //     } else if (res.cancel) {
          //       //console.log('用户点击取消')
          //     }
          //   }
          // });
        }
        if (channel == "cshopmt") {
            wx.request({
              url: that.d.hostApi + '/Api/Cshopmt/validateUser', //仅为示例，并非真实的接口地址
              data: {
                cshopmt: "cshopmt",
                pwd: pwd,
                city: city,
                scene: scene,
                rd3_session: wx.getStorageSync('3rd_session')
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              method: 'POST',
              success: function (res) {
                let data = res.data;
                if (data.success) {
                  that.login_wx();
                  wx.showModal({
                    title: "信息提示",
                    content: data.msg,
                    showCancel: false
                  });
                }else{
                  // wx.showModal({
                  //   title: "信息提示",
                  //   content: data.msg,
                  //   showCancel: false
                  // });
                }




              }
            });


        }
    }
    this.registUserinfo();
  },
  onLaunch: function (options) {
    this.checkUpdateVersion();//检测小程序版本


    let that = this;
    //判断用户登录
    wx.checkSession({
      success: function () {
        let rd3_session = wx.getStorageSync('3rd_session');
        //console.log(rd3_session);
        //console.log(rd3_session);
        if (rd3_session) {
          wx.request({
            url: that.d.hostApi + '/Api/Login/check3Rdsession',
            data: {
              rd3_session: rd3_session
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              let data = res.data;
              if(!data.success){
                that.login_wx();
              }
            }
          })
        } else {
          that.login_wx();
        }
      },
      fail: function () {
        //console.log("缓存登录态过期");
        //登录态过期
        that.login_wx();
      }
    });





  },
  //登录
  login_wx: function () {
    let that = this;
    wx.login({
      success: res => {
        //console.log(res);
        wx.request({
          url: that.d.hostApi + '/Api/Login/onLogin',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            let data = res.data;
            if(data.success){
              wx.setStorageSync('session_key', data.session_key);
              var time = Date.parse(new Date()) + 60 * 60 * 24 * 2
              wx.setStorageSync('exp', time);

              wx.setStorageSync('3rd_session', data.rd3_session);
              //注册用户信息记录
              that.registUserinfo();
            }else{
              wx.showToast({
                title: '登录授权失败',
                icon: 'loading',
                duration: 2000
              });
            }

          }
        })
      }
    })
  },
  registUserinfo:function(){
    var that = this;
    wx.request({
      url: that.d.hostApi + '/Api/Login/registUserinfo',
      data: {
        rd3_session: wx.getStorageSync('3rd_session')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        let data = res.data;
        if(data.success){
          wx.setStorageSync('wxuserinfo', data.userinfo);
        }
      }
    });

  },
  func: {
    httpRequest: httpRequest.httpRequest,
    dateFormat: commonUtils.dateFormat,
    floatAdd: commonUtils.floatAdd,
    floatSub: commonUtils.floatSub,
    floatDiv: commonUtils.floatDiv,
    floatMul: commonUtils.floatMul,
  },
  checkUpdateVersion:function() {
    if(wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          updateManager.applyUpdate();
        })
        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: '已经有新版本喽~',
            content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
          })
        })
      }
    })
  } else {
    wx.showModal({
      title: '溫馨提示',
      content: '当前微信版本过低，无法检测小程序版本并自动更新。'
    })
  }
}
})
