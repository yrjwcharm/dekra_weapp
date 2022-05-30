//index.js
//获取应用实例
const app = getApp()

//let rpn = require("../../utils/rpn.js");
let util = require('../../utils/util.js');

Page({
  data: {
    isAdmin:false,
    curStation:{},
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0,
      curStation: null,
    },
    notices:[],

    nowday: '',
    nowtime: '',
    userInfo: {},
    hasUserInfo: false,
    timerData: {},

    orgId:"",
    opengov:"",


    wallpaperbg:"",
    showLock: { status:false,msg:""}, //模拟提示框
    cartype:""
  },

  loadBook: function () {
    //console.log("loadBook");
    let that = this;
    let orgId = that.data.orgId;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.d.hostApi + '/Api/Station/getAppointmentDate', //仅为示例，并非真实的接口地址
      data: {
        orgId: orgId,
        city: that.data.curStation['city'],
        opengov: that.data.opengov,
        rand: Math.random(),
        rd3_session: wx.getStorageSync('3rd_session')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        let data = res.data;
        if(data.success){
          for (let i = 0; i < data.list.length; i++) {
            let resultNowDate = data.list[i].appointDate;
            for (let j = 0; j < data.list[i].appointTimes.length; j++) {
              data.list[i].appointTimes[j].getTime = new Date((resultNowDate + " " + data.list[i].appointTimes[j].appointTime.split("-")[1]).replace(/-/g, '/')).getTime();

            }
          }
          //console.log(data.list);
          let nearlyIndex = data.list[0].appointTimes.length-1;
          //console.log(nearlyIndex);
          let nearlyDayEnd;
          if(that.data.isAdmin){
            nearlyDayEnd = data.list[0].appointTimes[nearlyIndex].getTime+7200000;
          }else{
            nearlyDayEnd = data.list[0].appointTimes[nearlyIndex].getTime;
          }

          //console.log(nearlyDayEnd);
          that.setData({ timerData: data.list, nearlyDayEnd:nearlyDayEnd });
        }else{
          wx.showModal({
            title: data.title,
            content: data.msg,
            showCancel: false
          });
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: "错误提示",
          content:"网络失败,请重试",
          showCancel: false
        });
      }
    });

  },
  onLoad: function (options) {
    console.log(333,options)
    let isAdmin = wx.getStorageSync('staff_bj_apppower');
    if (isAdmin) isAdmin = isAdmin.indexOf("北京");
    if (isAdmin && isAdmin > -1 ){
      isAdmin = true;
    }else{
      isAdmin = false;
    }
    // options = { "svalue":"9338B6370AD240108D129EBC135B2194","city":"深圳"};//test
    // let svalue = options.svalue;
    // let city = options.city;
    let stationId = options.stationId;
    let that = this;
   // let city = this.data.city;
    //let svalue = this.data.svalue;
    wx.request({
      url: app.d.hostApi + `/Api/Infos/index?site_id=${stationId==1?1:4}`,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data;
        console.log(777,data);
        if (data.success) {
          that.setData({
            notices: data.notices,
          })
        }
      }
    })
    wx.request({
      url: app.d.hostApi + '/Api/Station/getStationOne',
      data: {
        stationId: stationId,
        // city: city,
        // svalue: svalue,
        rd3_session: wx.getStorageSync('3rd_session')
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data;
        console.log(4444,data);
        if (data.success) {
          data.detail.fee = app.d.hostStatic + data.detail.fee;
          data.detail.poster = app.d.hostStatic + data.detail.poster ;
          data.detail.thumb = app.d.hostStatic + data.detail.thumb;
          data.detail.gzhewm = app.d.hostStatic + data.detail.gzhewm;
          data.detail.advance = data.detail.advance.split(",");

          let cartypeString = data.detail.cartype.split(",");
          let cartype ="";
          if (cartypeString[0] == 1){
            cartype += "小型车 ";
          }
          if (cartypeString[1] == 1) {
            cartype += "大型车 ";
          }
          if (cartypeString[2] == 1) {
            cartype += "挂车 ";
          }
          if (cartypeString[3] == 1) {
            cartype += "新能源车 ";
          }

          let nowday = util.formatDate(new Date());
          let showLock = that.data.showLock;
          if (data.detail.locknotice && wx.getSystemInfoSync().platform != "devtools" && __wxConfig.envVersion != "develop" && __wxConfig.envVersion != "trial"){
            showLock.status = true;
            showLock.msg = data.detail.locknotice;
          }
          that.setData({
            isAdmin:isAdmin,
            showLock: showLock,
            curStation: data.detail,
            nowday: nowday,
            nowtime: new Date().getTime(),
            orgId: data.detail.value,
            opengov: data.detail.opengov,
            city:data.detail.city,
            svalue: data.detail.value,
            title: data.detail.name,
            info:data.detail.addrtext,
            thumb: data.detail.thumb,
            poster: data.detail.poster,
            gzhEwm: data.detail.gzhewm,
            wallpaperbg: app.d.hostStatic + "/Data/miniapp/testBg.png",
            cartype: cartype

          });
         that.loadBook();
        }
      },
      fail: function (res) {
        wx.hideLoading();
        ////console.log(res);
      }
    });
   // this.setData({ city: city, svalue: svalue});
  },
  onShow:function(){
    if (this.data.orgId) this.loadBook();
  },
  getUserInfo: function (e) {
    ////console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goinputui: function (e) {
    let city = this.data.curStation['city'];
    if(city == "深圳"){
      wx.navigateTo({
        url: '/pages/book/szinputui?name=' + this.data.curStation['name'] + '&&districtid=' + this.data.curStation['distrctid'] + '&&value=' + this.data.curStation['value'] + '&&appointDate=' + e.currentTarget.dataset.appointdate + '&&appointTime=' + e.currentTarget.dataset.appointtime + '&&city=' + city + '&&appid=' + app.d.apnavipid + '&&stationId=' + this.data.curStation['id'] + '&&opengov=' + this.data.curStation['opengov']
      });
    }
    if (city == "北京") {
      wx.navigateTo({
        url: '/pages/book/bjinputui?name=' + this.data.curStation['name'] + '&&districtid=' + this.data.curStation['distrctid'] + '&&value=' + this.data.curStation['value'] + '&&appointDate=' + e.currentTarget.dataset.appointdate + '&&appointTime=' + e.currentTarget.dataset.appointtime + '&&city=' + city + '&&appid=' + app.d.appid + '&&stationId=' + this.data.curStation['id'] + '&&phone=' + this.data.curStation['phone']
      });
    }
    ////console.log();
  },
  tabFun: function (e) {
    let _datasetId = e.target.dataset.id;

    if (_datasetId) {
      //获取触发事件组件的dataset属性
      ////console.log("----" + _datasetId + "----");
      let _obj = {};
      _obj.curHdIndex = _datasetId;
      _obj.curBdIndex = _datasetId;
      this.setData({
        tabArr: _obj
      });

    }
  },
  phonecallevent: function (e) {
    let index = e.currentTarget.dataset.index;

    wx.makePhoneCall({
      phoneNumber: index
    })
  },
  location: function (e) {
    let index = e.currentTarget.dataset.index;
    let that = this;
    index = index.split("_");
    wx.openLocation({
      latitude: parseFloat(index[0]),
      longitude: parseFloat(index[1]),
      scale: 18,
      name: that.data.curStation['name'],
      address: that.data.curStation['addrtext']
    })
  },

  //调用子组件的方法
  getSharePoster: function () {
    this.setData({ isHidden: "isHidden" });
    this.setData({ showVideo: false })
    this.selectComponent('#getPoster').getAvaterInfo()
  },
  myEventListener: function (e) {
    this.setData({ showVideo: true, isHidden: "" });
  },
  bindGetUserInfo: function (e) {
    //console.log(this.data);
    let that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {

      let avatar = e.detail.userInfo.avatarUrl;
      wx.request({
        url: app.d.hostApi + "/Api/Ewm/makeMiniappEwm",
        method: "GET",
        data: {
          inviter:wx.getStorageSync('wxuserinfo').id,
          type: "news"
        },
        success: function (res) {
          let data = res.data;
          if (data.success) {
            that.setData({
              avatar: avatar,
              ewmUrl: app.d.hostApi + data.url,
            });

            that.getSharePoster();
          }
        },
        fail: function () {
          wx.showModal({
            title: '错误提示',
            content: '网络请求失败,请重试',
            showCancel: false,
          });
        },
        complete: function () {

        }
      });


    } else {
      wx.showModal({
        title: '错误提示',
        showCancel: false,
        content: "请重新点击生成海报，同意授权"
      });
    }
  },
  formidSubmit:function(e){
    wx.setStorageSync('formid', []); //formid
    let formid = wx.getStorageSync('formid');
    formid.push(e.detail.formId);
    wx.setStorageSync('formid',formid);
  }
})
