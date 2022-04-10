// pages/detail/detail.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ishow:false,
    otherAns:"",
    id:"",       //上个页面传递的参数
    siteid:"",
    orderNum:"",
    question:{},  //ajax 返回数据
    isMust:[],    //获取必须填写的题目id
    rList:{}      //每个题的答案
  },
  radioChange: function (e) {
      let anId = e.detail.value;
      let quId = e.currentTarget.dataset.quid;
      let rList = "rList." + quId;;
      let json = {
        quId: quId,
        anId: anId
      }
      this.setData({
        [rList]: json
      });



  },
  textareaV:function(e) {
    let anserText = e.detail.value;
    let quId = e.currentTarget.dataset.quid;
    let rList = "rList." + quId;;
    let json = {
      quId:quId,
      anId:anserText
    }
    this.setData({
      [rList]: json
    });

    //console.log(json);

    //如果填空题的答案为空了，删除在对象中的值
    if (anserText == "") {
      let _m = this.data.rList;
      delete _m[quId]
      this.setData({
        rList:_m
      })
    }
  },
  // 获取题目
  getQuestion(infos){
    let ansing = "";
    let psqlist = infos.asking;
    console.log(infos.list);
    function getQuestionValue(obj,value){
      for(let i=0; i<obj.length; i++){
        if(obj[i].quId == value){
          return obj[i].anId;
        }
      }
    }
    if (infos.list){
      this.setData({ ishow: true });
      for(let i=0; i<psqlist.length; i++){
        if(psqlist[i].type == 1){
          for (let j = 0; j < psqlist[i].answerslist.length; j++){
            if (psqlist[i].answerslist[j].id == getQuestionValue(infos.list,i+1)){
                  psqlist[i].answerslist[j].checked = true;
                }
          }
        }
        if(psqlist[i].type == 2){
          for (let j = 0; j < psqlist[i].answerslist.length; j++){
            console.log(getQuestionValue(infos.list,i+1));
            if (!getQuestionValue(infos.list,i+1).indexOf(psqlist[i].answerslist[j].id)){
                  psqlist[i].answerslist[j].checked = true;
                }
          }
        }
        if(psqlist[i].type == 0){
          psqlist[i].value = getQuestionValue(infos.list,i+1);
        }

      }
    }
    //lyushine

    let question = {};
    let isMust = infos.ismust;
    question.title =infos.title;
    question.des = infos.des;
    question.psqlist = psqlist;
    question.think = infos.think;

    // let arr =[{id:1},{id:2}];
    // let arrMust = [];
    // arr.forEach((e,index)=>{
    //   if (e.isMust == 1) {
    //     arrMust.push(e.id);
    //   }
    // });
   // //console.log(question)
    this.setData({
      question: question,
      isMust: isMust
    })


    // app.res({
    //   url:"psq/s_id_one",
    //   method:"GET",
    //   data:{
    //     id:this.data.id
    //   },
    //   callback:res=>{
    //     let arr = res.data.psqlist;
    //     let arrMust = [];
    //     arr.forEach((e,index)=>{
    //       if (e.isMust == 1) {
    //         arrMust.push(e.id);
    //       }
    //     });
    //     this.setData({
    //       question: res.data,
    //       isMust:arrMust
    //     })
    //   }
    // })
  },
  //判断必填项是否填写
  isMustF(){
    let arrMust = this.data.isMust;  //获取的必填项
    let arrList = [];
    for (let j in this.data.rList) {
      arrList.push(j);    //得到已选项的数组
    }
    //console.log("arrList");
    //console.log(arrList);
    //console.log("arrMust");
    //console.log(arrMust);

    for(let k in arrMust) {
      //console.log(arrList.indexOf(arrMust[k]));
      if (arrList.indexOf(arrMust[k])<0) {
        return false;
      }
    }
    return true;
  },
  //提交答案
  postAns(e){
    let that = this;
    if (!this.isMustF()) {
      wx.showToast({
        title:'必填项请填写答案',
        icon:"none",
        duration:2000
      })
      return ;
    }
    wx.showModal({
      title: '提示',
      content: '提交后无法更改，您确认提交吗',
      success:res=>{
        if(res.confirm) {
          let paperId = e.currentTarget.dataset.paperid;
          let arr = [];
          for (let i in this.data.rList) {
            arr.push(this.data.rList[i]);
          }

          wx.showLoading({title: '提交中...',mask:true})
          wx.request({
            url: app.d.hostApi+'/Api/Questionnaire/insert', //仅为示例，并非真实的接口地址
            data: {
              siteid:that.data.siteid,
              orderId: that.data.orderId,
              rList: JSON.stringify(arr),
              rd3_session: wx.getStorageSync('3rd_session')
            },
            method:"POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              wx.hideLoading();
              let data = res.data;
              that.setData({ ishow: true });
              if(data.success){
                wx.showModal({
                  title: '提示',
                  content: '提交成功,请返回',
                  showCancel: false,
                  success: res => {
                    if (res.confirm) {
                      wx.navigateBack({ delta: 1});
                    } else {

                    }
                  }
                });
              }else{
                wx.showModal({
                  title: '提示',
                  content: data.msg,
                  success: res => {
                    if (res.confirm) {
                      wx.navigateBack({});
                    } else {

                    }
                  }
                });
              }

            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '错误提示',
                showCancel: false,
                content: "网络请求失败,请稍后再试"
              });
            }
          })
          // app.res({
          //   url: "psq/save_record",
          //   method: "POST",
          //   data: {
          //     paperId: paperId,
          //     rList: arr
          //   },
          //   callback: res => {
          //     wx.showModal({
          //       title: '提示',
          //       content: '提交成功,是否返回主页',
          //       success: res => {
          //         if (res.confirm) {
          //           wx.navigateBack({});
          //         } else {

          //         }
          //       }
          //     })
          //   }
          // })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log();
    options = {orderId:"15191111",siteid:"1"}
    this.setData({
      siteid: options.siteid,
      orderId: options.orderId,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.request({
      url: app.d.hostApi + '/Api/Questionnaire/getInfos',
      method: 'POST',
      data: {
        siteid: this.data.siteid,
        orderId: this.data.orderId,
        rd3_session: wx.getStorageSync('3rd_session')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data;
        that.getQuestion(data.infos);

      }
    });


  },
})
