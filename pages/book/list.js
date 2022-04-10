// pages/list/list.js
//banner
let app = getApp();
let index;
let nav_centent_list = [
  ['北京'],
  ['距离由近到远'],
  ['小型车', '大型车', '挂车', '新能源车']];
let util = require('../../utils/util.js');
let locationUrl = 'https://apis.map.qq.com/ws/geocoder/v1/';
// const tencentMapKey = "D4LBZ-3KGCF-NDYJO-NQTR4-2ARZ7-2XBHC";
const  tencentMapKey = "KEFBZ-TW463-76F36-3NBXA-WC44T-C2BO3";
Page({
  data: {
    notfind: app.d.hostStatic+"/Data/miniapp/notfind.jpg?1",
    nav_title: ['北京','排序', '筛选'],
    shownafvindex: null,
    nav_centent: null,
    myLocation: { longitude: 0, latitude: 0 }, //{ longitude: 113.9206690000, latitude: 22.5114550000},
    longitude: 113.9206690000,
    latitude: 22.5114550000,
    scale: 14,
    showLocation: true,
    markers: [],
    lastMarked:0,
    controls: [{
      id: 9,
      iconPath: '/images/map_pos.png',
      position: {
        left: wx.getSystemInfoSync().windowWidth - 40,
        top: 50,
        width: 30,
        height: 30
      },
      clickable: true
    }],

    stationData:[],
    showStationData:[],
  },
  onLoad:function(){
    let that= this;

    that.getLocation();



  },
  getLocation(){
    // let that = this;
    // wx.showLoading({
    //   title: '定位中...',
    // });
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     wx.hideLoading();
    //     let myLocation = { latitude: res.latitude, longitude: res.longitude };
    //     that.setData({ myLocation: myLocation });
    //     app.func.httpRequest(locationUrl, {
    //       key: tencentMapKey,
    //       location: res.latitude + ',' + res.longitude
    //     }, 'GET', {
    //         'content-type': 'application/json'
    //       }, function (result) {
    //       console.log(222,result)
    //         if (result) {
    //           let city =result.result.address_component.city.replace("市", "");
              this.getStations('北京');
          //   } else {
          //     wx.showModal({
          //       title: '错误提示',
          //       content: '获取地理位置失败，请手动选择城市',
          //       showCancel: false,
          //       success(res) {
          //         if (res.confirm) {
          //           //console.log('用户点击确定')
          //         } else if (res.cancel) {
          //           //console.log('用户点击取消')
          //         }
          //       }
          //     });
          //   }
          //
          // });
      // },
    //   fail(res) {
    //     wx.hideLoading();
    //     wx.showModal({
    //       title: '错误提示',
    //       content: '获取地理位置失败，请手动选择城市',
    //       showCancel: false,
    //       success(res) {
    //         if (res.confirm) {
    //           //console.log('用户点击确定')
    //         } else if (res.cancel) {
    //           //console.log('用户点击取消')
    //         }
    //       }
    //     });
    //   },
    //   complete(res) {
    //
    //
    //
    //
    //   }
    // });

  },
  regionchange(e) {


  },
  controltap(e) {
    //console.log("controltap");

    //console.log(e);
    const that = this;
    that.setData({ latitude: that.data.myLocation.latitude, longitude: that.data.myLocation.longitude });
  },
  markertap(e) {
    //console.log(e);
    let nowStation = this.data.showStationData[e.markerId];
    wx.showModal({
      content: '是否进入' + nowStation['name']+'办理年检?',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/book/detect?stationId='+nowStation['id'],
          });
        }
      }
    })
    //console.log(this.data.showStationData[e.markerId]);
    // let markers = this.data.markers;
    // if (e.markerId != 0){
    //   if (this.data.lastMarked) markers[this.data.lastMarked].callout = {};
    //   let stationName = this.data.showStationData[e.markerId].name;
    //   markers[e.markerId].callout = { content: stationName, bgColor: "#999", color: "#fff", textAlign: "center", fontSize: 12, padding: 5 };
    //   this.setData({ markers,lastMarked:e.markerId });
    // }
  },
  getStations:function (city){
    //console.log(city);
     let that = this;
    //
    // let cityList = nav_centent_list[0];
    // //console.log(cityList);
    //
    // let inCity = false;
    // for(let i=0;i < cityList.length; i++){
    //   if (cityList[i] == city){
    //     inCity = true;
    //   }
    // }
    // if (inCity){
    //   let nav_title = that.data.nav_title;
    //   nav_title[0] = city;
    //   that.setData({ nav_title: nav_title });
    // }else{
    //   let nav_title = that.data.nav_title;
    //   nav_title[0] = "选择城市";
    //   that.setData({ nav_title: nav_title });
    //
    //   wx.showModal({
    //     title: '错误提示',
    //     content: '定位到您所在的城市暂未开通检测站，请您手动选择周边的城市检测',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         //console.log('用户点击确定')
    //       } else if (res.cancel) {
    //         //console.log('用户点击取消')
    //       }
    //     }
    //   });
    //
    // }
    wx.showLoading({title: '加载中'});
    wx.request({
      url: app.d.hostApi +'/Api/Station/getStationAll?city=' + city,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        let data = res.data;
        if(data.success){
          let stationData = data.list;
          const latitude = that.data.myLocation.latitude;
          const longitude = that.data.myLocation.longitude;
          for (let i = 0; i < stationData.length; i++) {
            stationData[i].stationId =  stationData[i].id;
            stationData[i].thumb = app.d.hostStatic + stationData[i].thumb;
            stationData[i].distance = Math.floor(that.distance(latitude, longitude, stationData[i].latitude, stationData[i].longitude) * 100) / 100;
          }
          stationData = util.JsonSort(stationData, 'distance');
          //console.log(stationData);

          that.filterData(stationData);
        }else{

        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  phonecallevent: function (e) {
    let index = e.currentTarget.dataset.index;

    wx.makePhoneCall({
      phoneNumber: this.data.showStationData[index]['phone']
    })
  },
  distance :function (la1, lo1, la2, lo2){
    let La1 = la1 * Math.PI / 180.0;
    let La2 = la2 * Math.PI / 180.0;
    let La3 = La1 - La2;
    let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137; //地球半径
    s = Math.round(s * 10000) / 10000;
    // //console.log("计算结果",s)
    return s;
  },
  filterData:function(data){
    let that = this;
    let stationData = data;
    let showStationData = [];

    for (let i = 0; i < stationData.length; i++) {
        stationData[i].advance = stationData[i].advance.split(",");
      //console.log(stationData[i].advance);
        showStationData.push(stationData[i]);
    }


    let markers = [];
    //console.log(showStationData);
    for (let i = 0; i < showStationData.length; i++) {
      //console.log(111);
      markers.push({
        iconPath: "/images/map_default.png",
        id: i,
        latitude: showStationData[i].latitude,
        longitude: showStationData[i].longitude,
        width: 30,
        height: 30
      });
    }
    let stationName = showStationData[0].name;
    markers[0].iconPath = "/images/map_active.png";
  //   markers[0].callout = {
  //     content: "语言：珊珊是不是傻123123", display:"ALWAYS"
  //  }

    markers[0].callout = { content: stationName + "\n离您最近", bgColor: "#007d40", color: "#fff", padding: 5, borderColor: "#007d40",borderRadius:5,textAlign: "center", fontSize: 12, display: "ALWAYS"};
    if (showStationData.length > 1){
      for (let i = 1; i < showStationData.length; i++) {
        markers[i].callout = { content: stationName, bgColor: "#007d40", color: "#fff", padding: 5, borderColor: "#007d40", borderRadius: 5, textAlign: "center", fontSize: 12, };
      }
    }
    //console.log({ markers: markers, latitude: stationData[0].latitude, longitude: stationData[0].longitude, showStationData: showStationData, stationData: data });

    that.setData({ markers: markers, latitude: stationData[0].latitude, longitude: stationData[0].longitude, showStationData: showStationData, stationData:data});

  },
  closeOverlay:function(){
    this.setData({
      nav_centent: null,
      shownavindex: null,
    })
  },
  click_cur:function(e)
  {
    let that = this;
    let curData = e.currentTarget.dataset.index.split('_');
    let nav_title = this.data.nav_title;
    nav_title[curData[0]] = nav_centent_list[curData[0]][curData[1]];

    if (curData[0] == 0){
      that.getStations(nav_centent_list[curData[0]][curData[1]]);
      nav_title[1] = "排序";
      nav_title[2] = "筛选";
    }
    if (curData[0] == 2) {
      let cartype = nav_centent_list[2][curData[1]];



      let stationData = that.data.stationData;


      let showStationData = [];
      for (let i = 0; i < stationData.length; i++) {
        let cartypeArr = stationData[i].cartype.split(",");
        if (cartype == "小型车" && cartypeArr[0] == 1 ){
          showStationData.push(stationData[i]);
        }
        if (cartype == "大型车" && cartypeArr[1] == 1) {
          showStationData.push(stationData[i]);
        }
        if (cartype == "挂车" && cartypeArr[2] == 1) {
          showStationData.push(stationData[i]);
        }
        if (cartype == "新能源车" && cartypeArr[3] == 1) {
          showStationData.push(stationData[i]);
        }
      }
      let markers = [];
      for (let i = 0; i < showStationData.length; i++) {
        markers.push({
          iconPath: "/images/map_default.png",
          id: i,
          latitude: showStationData[i].latitude,
          longitude: showStationData[i].longitude,
          width: 30,
          height: 30
        });
      }
      if (showStationData.length){
        let stationName = showStationData[0].name;
        markers[0].iconPath = "/images/map_active.png";
        markers[0].callout = { content: stationName + "\n离您最近", bgColor: "#007d40", color: "#fff", textAlign: "center", fontSize: 12, padding: 5, display: "ALWAYS"};
        if (showStationData.length > 1){
          //console.log(999)
        for(let i=1; i<showStationData.length; i++){
          markers[i].callout = { content: stationName, bgColor: "#007d40", color: "#fff", padding: 5, borderColor: "#007d40", borderRadius: 5, textAlign: "center", fontSize: 12, };
        }
        }
      }
      this.setData({ nav_title: nav_title, nav_centent: null, shownavindex: null, markers: markers, latitude: stationData[0].latitude, longitude: stationData[0].longitude, showStationData: showStationData });

    }else{
      this.setData({ nav_title: nav_title, nav_centent: null, shownavindex: null });
    }

  },
  click_nav: function (e) {
    if (index == e.currentTarget.dataset.index && this.data.nav_centent != null) {
      index = e.currentTarget.dataset.index;
      this.setData({
        nav_centent: null,
        shownavindex: null,
      })
    } else if (this.data.nav_centent == null) {
      index = e.currentTarget.dataset.index;
      this.setData({
        shownavindex: index,
        nav_centent: nav_centent_list[Number(index)]
      })
    } else {
      index = e.currentTarget.dataset.index;
      this.setData({
        shownavindex: index,
        nav_centent: nav_centent_list[Number(index)]
      })
    }
  }
})
