// pages/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",       //上个页面传递的参数
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
  getQuestion(){
    let psqlist = [{ id: 1, type: 1, myOrder: 1, question: "检测业务公平公正 ", answerslist: [{ id: 5, answer: "非常满意" }, { id: 3, answer: "基本满意" }, { id: 0, answer: "不满意" }] },
      { id: 2, type: 1, myOrder: 2, question: "检测流程快捷高效 ", answerslist: [{ id: 5, answer: "非常满意" }, { id: 3, answer: "基本满意" }, { id: 0, answer: "不满意" }] },
      { id: 3, type: 1, myOrder: 3, question: "业务大厅舒适整洁 ", answerslist: [{ id: 5, answer: "非常满意" }, { id: 3, answer: "基本满意" }, { id: 0, answer: "不满意" }] },
      { id: 4, type: 1, myOrder: 4, question: "标志标识清晰准确 ", answerslist: [{ id: 5, answer: "非常满意" }, { id: 3, answer: "基本满意" }, { id: 0, answer: "不满意" }] },
      { id: 5, type: 1, myOrder: 5, question: "场区秩序良好有序 ", answerslist: [{ id: 5, answer: "非常满意" }, { id: 3, answer: "基本满意" }, { id: 0, answer: "不满意" }] },

      { id: 6, type: 1, myOrder: 6, question: "外观检查人员 ", answerslist: [{ id: 5, answer: "非常满意" }, { id: 3, answer: "基本满意" }, { id: 0, answer: "不满意" }] },
      { id: 7, type: 1, myOrder: 7, question: "上线司机 ", answerslist: [{ id: 5, answer: "非常满意" }, { id: 3, answer: "基本满意" }, { id: 0, answer: "不满意" }] },
      { id: 8, type: 1, myOrder: 8, question: "大厅业务人员 ", answerslist: [{ id: 5, answer: "非常满意" }, { id: 3, answer: "基本满意" }, { id: 0, answer: "不满意" }] },
      { id: 9, type: 1, myOrder: 9, question: "如果以后有需要，您还会再来我公司检测车辆吗？ ", answerslist: [{ id: 5, answer: "会" }, { id: 3, answer: "可能会" }, { id: 0, answer: "不会" }] },

      { id: 10, type: 1, myOrder: 10, question: "您是否愿意将北京德凯达机动车检测有限公司推荐给您的朋友或者同事？ ", answerslist: [{ id: 5, answer: "非常愿意" }, { id: 3, answer: "一般愿意" }, { id: 0, answer: "不愿意" }] },


      { id: 11, type: 0, myOrder: 11, question: "其他建议或意见" }];
    let question = {};
    let isMust = ["1","2"];
    question.title ="顾客满意度调查表";
    question.des = "我们恳请您完成以下客户满意度调查。我们珍视您的看法和想法，并将以此作为持续改进的契机，为您提供更好的服务。我们在此承诺将对您提供的所有信息保密，且不会影响后续服务的公正性和专业性。";
    question.psqlist = psqlist;


    // let arr =[{id:1},{id:2}];
    // let arrMust = [];
    // arr.forEach((e,index)=>{
    //   if (e.isMust == 1) {
    //     arrMust.push(e.id);
    //   }
    // });
    //console.log(question)
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
    if (!this.isMustF()) {
      wx.showToast({
        title:'必填项请填写答案',
        icon:"none",
        duration:800
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
          //console.log(paperId);
          //console.log(arr);
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
    // this.setData({
    //   id:options.id
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getQuestion();
  },
})
