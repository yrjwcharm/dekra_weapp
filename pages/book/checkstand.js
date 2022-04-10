const app = getApp()
let util = require('../../utils/util.js');
let QR = require("../../utils/qrcode.js");


Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        carnum: '',
        showMobileStatus: false,
        showConfirmErrorStatus: false,

        showConfirmDownStatus: false,

        showConfirmDownVipStatus: false,
        options: {},
        remark:'',
        orderInfos: "",
        nowday: '',
        payType: [
            {name: 'POS机', value: 'POS机',checked:true},
            {name: '现金', value: '现金'},
            {name: '其他', value: '其他'},
            {name: '月结', value: '月结'},


        ],
        curPayType: "POS机",
        pageSize:30,
        payTypeVip: [
            {name: 'POS机', value: 'POS机',checked:true},
            {name: '现金', value: '现金'},
            {name: '其他', value: '其他'},
            {name: '月结', value: '月结', checked: 'true'},
        ],
        curPayTypeVip: "POS机",
        carType: "",
        carTypeBj: [
            {name: '小（微）型(客车)', value: '小（微）型', checked: 'true'},
            {name: '中（轻）型(客车)', value: '中（轻）型'},
            {name: '大（重）型(客车)', value: '大（重）型'},
            {name: '轻型(货车)', value: '轻型'},
            {name: '中型(货车)', value: '中型'},
            {name: '重型(货车)', value: '重型'},
        ],
        carTypeSz: [
            {name: '小型汽车', value: '小型汽车', checked: 'true'},
            // { name: '大型汽车', value: '大型汽车' },
        ],
        oilType: [
            // {name: '汽油', value: '汽油', checked: 'true'},
            // {name: '混合动力', value: '混合动力'},
            // {name: '柴油', value: '柴油'},
            // {name: '电动', value: '电动'},
        ],
        quattroType: [
            {name: '全时四驱', value: '全时四驱', checked: 'true'},
            {name: '两驱（含非全时四驱）', value: '两驱（含非全时四驱）'},
        ],
        modifyPrice: 0,
        motorCycleList: [
            {name: '普通正三轮', value: '普通正三轮'},
            {name: '轻便正三轮', value: '轻便正三轮',},
            {name: '正三轮载客', value: '正三轮载客',},
            {name: '正三轮载货', value: '正三轮载货',},
            {name: '侧三轮', value: '侧三轮',},
            {name: '普通二轮', value: '普通二轮',},
            {name: '轻便二轮', value: '轻便二轮',},
            {name: '特殊车型', value: '特殊车型',},
        ],
        cur_carType: "",
        cur_oilType: "",
        cur_quattroType: "",
        notMotorCycle: false,
        downVipType: [
            // {name: '车队', value: '车队大客户', checked: 'true'},
            // {name: '中介', value: '中介'},
            // {name: '检测平台', value: '其他检测平台'},
            // {name: '销售员工', value: '销售员工'},
        ],
        curDownVipType: "",
        cur_carClass:'',
        dealCompany: [],
        dealCompanyIndex: 0,
        dealCompanyInfos: "",
        exfee: "",
        isinput: 0,//是否开启价格调整
        contentlist: [],
        carOilList:[],
        motoOilList:[],
        ewmStatus: 0, //ewm
        maskHidden: true,
        pageNum: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {//初始化城市支付方式
        let that = this;
        let city = options.city;
        let nowday = util.formatDate(new Date());
        console.log(333,wx.getStorageSync('staff_bj_apppower'))
        that.setData({city:decodeURIComponent(city),staff_bj_apppower: wx.getStorageSync('staff_bj_apppower'), nowday: nowday},()=>{
            this.getVipTypeList();
        });
        // if(orderInfos.type=='repass')
        // if(city =="深圳"){
        //   let payType =  [
        //     { name: '现金', value: '现金', checked: 'true'},
        //     { name: '其他', value: '其他'},
        //   ];
        //   let curPayType = "现金";
        //   let payTypeVip = [
        //         { name: '月结', value: '月结', checked: 'true' },
        //         { name: '现金', value: '现金' },
        //         { name: '其他', value: '其他' }
        //       ];
        //   let curPayTypeVip = "月结";
        //   that.setData({ payType: payType, curPayType: curPayType, payTypeVip: payTypeVip, curPayTypeVip: curPayTypeVip});
        // }
        // if(city == "北京"){
        //   let payType = [
        //     { name: 'POS机', value: 'POS机', checked: 'true' },
        //     { name: '现金', value: '现金' },
        //     { name: '其他', value: '其他' },
        //   ];
        //   let curPayType = "现金";
        //   let payTypeVip = [
        //     { name: '月结', value: '月结', checked: 'true' },
        //     { name: '现金', value: '现金' },
        //     { name: '其他', value: '其他' }
        //   ];
        //   let curPayTypeVip = "月结";
        // }
        that.getContentInfo('正在加载数据...');

    },
    getOilType:function (oilType){
        let that = this;
        wx.request({
            url:app.d.hostApi + `/Api/order/getOilType`,
            data:{
                city:that.data.city,
                rd3_session: wx.getStorageSync('3rd_session')
            },
            method:'POST',
            header:{
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success:function (res) {
                if(res.data.success){
                    const {oil_car,oil_motor} = res.data.data;
                    let carOilList=[],motoOilList=[];
                    (oil_car&&oil_car.length!==0)?oil_car.map(item=>{
                        carOilList.push({
                            name:item,
                            value:item
                        })
                    }):[];
                    (oil_motor&&oil_motor.length!==0)?oil_motor.map(item=>{
                        motoOilList.push({
                            name:item,
                            value:item
                        })
                    }):[]
                    if(that.data.cur_carClass==='客车'|| that.data.cur_carClass==='货车'){
                            //动力类型初始化
                            for (let i = 0; i < carOilList.length; i++) {
                                if (carOilList[i].value == oilType) {
                                    carOilList[i].checked = true;
                                } else {
                                    carOilList[i].checked = false;
                                }
                            }
                            that.setData({
                                oilType:carOilList,
                                carOilList
                            })


                    }else {
                        //动力类型初始化
                        for (let i = 0; i < motoOilList.length; i++) {
                            if (motoOilList[i].value == oilType) {
                                motoOilList[i].checked = true;
                            } else {
                                motoOilList[i].checked = false;
                            }
                        }
                        that.setData({
                            oilType:motoOilList,
                            motoOilList
                        })

                    }



                }
            },
            fail(res) {

            }
        })
    },
    getVipTypeList(){
        let that = this;
        wx.request({
            url: app.d.hostApi + '/Api/checkstand/offlineVipCateList', //仅为示例，并非真实的接口地址
            data: {
                rd3_session: wx.getStorageSync('3rd_session'),
                city:that.data.city
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                let data = res.data;
                console.log(333,data);
                if(data.success){
                    let  list = data.list,downVipType=[];
                    list&&list.map((item,index)=>{
                        if(index==0){
                            downVipType.push({name:item.name,value:item.code,checked:true})
                        }else {
                            downVipType.push({name:item.name,value:item.code})
                        }
                    })
                    that.setData({
                        downVipType,
                        curDownVipType:downVipType[0].value

                    },()=>{
                        that.getDownVipList();
                    })
                }
            },
            fail: function (res) {
                that.errorMsg('网络通信失败，网络异常,请重试提交');
            }
        });
    },

    getDownVipList() {
        let that = this;
        // let viptype = that.data.downVipType;
        //
        // let nowVipType;
        // for (let i = 0; i < viptype.length; i++){
        //   if (viptype[i].checked){
        //     nowVipType = viptype[i].value;
        //   }
        // }
        wx.request({
            url: app.d.hostApi + '/Api/Checkstand/downviplist', //仅为示例，并非真实的接口地址
            data: {
                type:that.data.curDownVipType,
                code:that.data.curDownVipType,
                city: that.data.city,
                rd3_session: wx.getStorageSync('3rd_session')
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                wx.hideLoading();
                console.log(99999,res);
                let data = res.data;
                if (data.success && data.list.length > 0) {//
                    that.setData({dealCompany: ""});
                    let dealCompany = [];
                    let dealCompanyInfos = [];
                    for (let i = 0; i < data.list.length; i++) {
                        dealCompany[i] = data.list[i].name;
                        dealCompanyInfos[i] = data.list[i];
                    }
                    that.setData({dealCompany: dealCompany, dealCompanyInfos: dealCompanyInfos});
                    that.caclCostDown();
                } else {

                    wx.showModal({
                        title: "错误",
                        content: "无线下大客户信息",
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                that.setData({showConfirmDownVipStatus: false, dealCompany: "", dealCompanyInfos: ""});
                            }
                        }
                    });


                }
                //
                that.setData({showConfirmErrorStatus: false});

            },
            fail: function (res) {
                wx.hideLoading();
                that.errorMsg('网络通信失败，网络异常,请重试提交');
            }
        });


    },
    confirmDownVip: function (e) {
        let that = this;
        if (!that.data.orderInfos || (that.data.orderInfos.status == 3 || that.data.orderInfos.status == 4 || that.data.orderInfos.status == 5)) {
            wx.showModal({
                title: "错误",
                content: "已确认过或无订单信息，无需确认",
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        that.setData({orderInfos: "", carnum: ""});
                    }
                }
            });
            return false;
        }
        this.getOrder(this.data.id);

        if (e.currentTarget.dataset.statu == "close") {
            this.setData({showConfirmDownVipStatus: false});
        } else {
            this.setData({showConfirmDownVipStatus: true},()=>{
                this.caclCostDown();
            });
        }
        // this.getDownVipList();


    },
    confirmError: function (e) {
        let that = this;
        if (!that.data.orderInfos || (that.data.orderInfos.status == 3 || that.data.orderInfos.status == 4 || that.data.orderInfos.status == 5)) {
            wx.showModal({
                title: "错误",
                content: "已确认过或无订单信息，无需确认",
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        that.setData({orderInfos: "", carnum: ""});
                    }
                }
            });
            return false;

        }
        this.getOrder(this.data.id);
        if (e.currentTarget.dataset.statu == "close") {
            this.setData({showConfirmErrorStatus: false});
        } else {
            this.setData({showConfirmErrorStatus: true},()=>{
                this.caclCost();
            });
        }
    },
    doConfirmError: function (e) {
        let that = this;
        let payType = e.detail.value.payType;
        if (!that.data.orderInfos) {
            wx.showModal({
                title: "错误提示",
                content: "订单信息为空",
                showCancel: false
            });
            return false;
        }
        wx.showModal({
            title: '提示',
            content: '请确认是否已经补退金额给用户',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.d.hostApi + '/Api/Checkstand/confirmError', //仅为示例，并非真实的接口地址
                        data: {
                            id: that.data.orderInfos.id,
                            cur_carClass:that.data.cur_carClass,
                            cur_carType: that.data.cur_carType,
                            cur_oilType: that.data.cur_oilType,
                            cur_quattroType: that.data.cur_quattroType,
                            modifyPrice: that.data.modifyPrice,
                            payType: payType,
                            rd3_session: wx.getStorageSync('3rd_session'),
                            exfee: that.data.exfee
                            //lyushine
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        method: 'POST',
                        success: function (res) {
                            wx.hideLoading();
                            let data = res.data;
                            if (data.success) {
                                wx.showModal({
                                    title: "确认成功",
                                    content: data.msg,
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            that.setData({orderInfos: "", carnum: "", exfee: ""},()=>{
                                                if(app.d.channel==='voucher'){
                                                    app.d.scene = '';
                                                }
                                            });
                                            that.clearData();
                                        }
                                    }
                                });
                                //
                            } else {
                                that.errorMsg(data.msg);
                            }
                            that.setData({showConfirmErrorStatus: false});

                        },
                        fail: function (res) {
                            wx.hideLoading();
                            that.errorMsg('网络通信失败，网络异常,请重试提交');
                        }
                    });

                } else if (res.cancel) {

                }
            }
        })
    },
    confirmRight: function (e) {
        let that = this;
        if (!that.data.orderInfos || (that.data.orderInfos.status == 3 || that.data.orderInfos.status == 4 || that.data.orderInfos.status == 5)) {
            wx.showModal({
                title: "错误",
                content: "已确认过或无订单信息，无需确认",
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        that.setData({orderInfos: "", carnum: ""});
                    }
                }
            });
            return false;
        }


        if (that.data.orderInfos.paymethod == "微信支付") {
            that.confirmRightWx();
        } else if (that.data.orderInfos.paymethod == "线下支付") {
            this.confirmRightDown(e);
        } else if (that.data.orderInfos.paymethod == "现金") {
            this.confirmRightDown(e);
        } else {
            wx.showModal({
                title: "错误",
                content: "已确认过或无订单信息，无需确认",
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        that.setData({orderInfos: "", carnum: ""});
                    }
                }
            });
        }
    },
    confirmRightWx: function () {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '订单为微信支付，且信息无误，请确认' + '收款金额为 ' + this.data.orderInfos.price,
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.d.hostApi + '/Api/Checkstand/confirmRightWx', //仅为示例，并非真实的接口地址
                        data: {
                            id: that.data.orderInfos.id,
                            rd3_session: wx.getStorageSync('3rd_session')
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        method: 'POST',
                        success: function (res) {
                            wx.hideLoading();
                            let data = res.data;
                            if (data.success) {
                                wx.showModal({
                                    title: "确认成功",
                                    content: data.msg,
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            that.setData({orderInfos: "", carnum: ""});
                                            that.clearData();
                                        }
                                    }
                                });
                                //
                            } else {
                                that.errorMsg(data.msg);
                            }
                        },
                        fail: function (res) {
                            wx.hideLoading();
                            that.errorMsg('网络通信失败，网络异常,请重试提交');
                        }
                    });

                } else if (res.cancel) {

                }
            }
        })
    },
    confirmRightDown: function (e) {
        this.getOrder(this.data.id);
        if (e.currentTarget.dataset.statu == "close") {
            this.setData({showConfirmDownStatus: false});
        } else {
            this.setData({showConfirmDownStatus: true},()=>{
                this.caclCost();
            });
        }
    },
    bindPickerChange: function (e) {
        //console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    /* 输入框聚焦显示车牌号键盘 */
    handleFocus: function (e) {
        this.setData({
            showKeyboard: true
        })
    },
    /* 车牌号键盘点击事件 */
    setNumber: function (e) {
        this.setData({carnum: e.detail.value});
    },
    driverSuccess: function (res) {
        let that = this;
        let data = res.detail.data;
        //console.log(data);
        if (data.errmsg == "ok") {
            let plateNum = data.plate_num;
            that.setData({carnum: plateNum});
            that.getOrder();
        } else {
            wx.showModal({
                title: '错误提示',
                showCancel: false,
                content: data.errmsg
            });
        }
    },
    getOrder: function (id) {
        let that = this;
        var id = id ? id : "";
        if (Object.prototype.toString.call(id) === '[object Object]') {
            id = "";
        }
        wx.request({
            url: app.d.hostApi + '/Api/Checkstand/checkstand', //仅为示例，并非真实的接口地址
            data: {id: id, carnum: that.data.carnum, rd3_session: wx.getStorageSync('3rd_session')},
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                wx.hideLoading();
                let data = res.data;
                console.log(3333,data)
                if (data.success) {
                    //console.log(data);
                    let carType;
                    let cur_carType;
                    if (data.list.city == "深圳") {  //初始化车辆类型


                        let carTypeSz = that.data.carTypeSz;
                        //console.log(carTypeSz.length);
                        for (let i = 0; i < carTypeSz.length; i++) {
                            //console.log(carTypeSz[i].value + "|");
                            //console.log(data.list.cartype+"|");
                            //console.log(carTypeSz[i].name == data.list.cartype);
                            if (carTypeSz[i].value == data.list.cartype) {
                                //console.log(222222);
                                //console.log(data.list.cartype);
                                cur_carType = data.list.cartype;
                                //console.log(11111);
                                //console.log(cur_carType);
                                carTypeSz[i].checked = true;
                            } else {
                                carTypeSz[i].checked = false;
                            }
                        }
                        carType = carTypeSz;
                    } else if (data.list.city == "北京") {
                        let carTypeBj = [];
                        console.log(333, data)
                        if (data.list.carclass.indexOf('摩托车') !== -1) {
                            carTypeBj = that.data.motorCycleList;

                        } else {
                            carTypeBj = that.data.carTypeBj;
                        }
                        for (let i = 0; i < carTypeBj.length; i++) {
                            if (carTypeBj[i].value == data.list.cartype) {
                                cur_carType = data.list.cartype ? data.list.cartype : "";
                                carTypeBj[i].checked = true;
                            } else {
                                carTypeBj[i].checked = false;
                            }
                        }
                        carType = carTypeBj;
                        console.log(333, carType);

                    }
                    let cur_oilType = data.list.materialtype;
                    //驱动类型初始化
                    let quattroType = that.data.quattroType;
                    let cur_quattroType = data.list.drivertype;
                    for (let i = 0; i < quattroType.length; i++) {
                        if (quattroType[i].value == data.list.drivertype) {
                            quattroType[i].checked = true;
                        } else {
                            quattroType[i].checked = false;
                        }
                    }
                    cur_carType = cur_carType ? cur_carType : "";
                    console.log(111111,quattroType)
                    that.setData({
                        orderInfos: data.list,
                        carType: carType,
                        notMotorCycle: data.list.carclass?data.list.carclass.indexOf('摩托车')==-1:false,
                        // oilType: oilType,
                        quattroType: quattroType,
                        cur_carType: cur_carType,
                        cur_carClass:data.list.carclass,
                        cur_oilType: cur_oilType,
                        cur_quattroType: cur_quattroType,
                        modifyPrice: 0,
                        exfee: ""
                    },()=>{
                        that.getOilType(cur_oilType);
                    });


                    //console.log(data.list);
                } else {
                    that.errorMsg(data.msg);
                }
            },
            fail: function (res) {
                wx.hideLoading();
                that.errorMsg('网络通信失败，网络异常,请重试提交');
            }
        });
    },
    clearData: function () {
        let that = this;
        this.setData({orderInfos: "", carnum: "", pageNum: 1, contentlist: ""});
        that.getContentInfo('正在加载数据...');

    },
    doConfirmRightDown: function (e) {
        let that = this;
        console.log(333,that.data.orderInfos.price)
        let value = e.detail.value;
        let payType = value.payType;
        wx.request({
            url: app.d.hostApi + '/Api/Checkstand/confirmRightDown', //仅为示例，并非真实的接口地址
            data: {
                id: that.data.orderInfos.id,
                payType: payType,
                modifyPrice:that.data.orderInfos.price,
                rd3_session: wx.getStorageSync('3rd_session')
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                wx.hideLoading();
                let data = res.data;
                if (data.success) {
                    wx.showModal({
                        title: "确认成功",
                        content: data.msg,
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                that.setData({orderInfos: "", showConfirmDownStatus: false, carnum: ""},()=>{
                                    if(app.d.channel==='voucher'){
                                        app.d.scene = '';
                                    }
                                });
                                that.clearData();
                            }
                        }
                    });
                } else {
                    that.errorMsg(data.msg);
                }
            },
            fail: function (res) {
                wx.hideLoading();
                that.errorMsg('网络通信失败，网络异常,请重试提交');
            }
        });

    },
    errorMsg: function (content) {
        wx.showModal({
            title: '错误提示',
            showCancel: false,
            content: content
        });
    },
    bindDealCompany: function (e) {
        this.setData({
            dealCompanyIndex: e.detail.value
        });
        this.caclCostDown();
    },
    downVipTypeRange: function (e) {
        let downVipType = this.data.downVipType;
        for (let i = 0; i < downVipType.length; i++) {
            if (downVipType[i].value != e.detail.value) {
                downVipType[i].checked = false;
            } else {
                downVipType[i].checked = true;
            }
        }
        let curPayTypeVip;
        if (e.detail.value == "销售员工") {
            curPayTypeVip = "现金";

        } else {
            curPayTypeVip = "POS机";
        }
        this.setData({
            curDownVipType: e.detail.value,
            dealCompanyIndex: 0,
            downVipType: downVipType,
            curPayTypeVip: curPayTypeVip
        });
        this.getDownVipList();

    },
    carTypeRange: function (e) {
        if(e.detail.value=='轻型'||e.detail.value=='中型'||e.detail.value==='重型'){
            let carOilList = this.data.carOilList;
            //动力类型初始化
            for (let i = 0; i < carOilList.length; i++) {
                if (carOilList[i].value == this.data.cur_oilType) {
                    carOilList[i].checked = true;
                } else {
                    carOilList[i].checked = false;
                }
            }
            this.setData({
                cur_carType: e.detail.value,
                cur_carClass:'货车',
                oilType:carOilList,
            }, () => {

                this.caclCost();
            });
        }else if(e.detail.value=='小（微）型'|| e.detail.value =='中（轻）型'||e.detail.value=='大（重）型') {
            let carOilList = this.data.carOilList;
            //动力类型初始化
            for (let i = 0; i < carOilList.length; i++) {
                if (carOilList[i].value == this.data.cur_oilType) {
                    carOilList[i].checked = true;
                } else {
                    carOilList[i].checked = false;
                }
            }
            this.setData({
                cur_carType: e.detail.value,
                cur_carClass:'客车',
                oilType:carOilList,
            }, () => {
                this.caclCost();

            });
        }else {
            let motoOilList = this.data.motoOilList;
            //动力类型初始化
            console.log(333,motoOilList)
            console.log(444,this.data.cur_quattroType)
            for (let i = 0; i < motoOilList.length; i++) {
                if (motoOilList[i].value == this.data.cur_oilType) {
                    motoOilList[i].checked = true;
                } else {
                    motoOilList[i].checked = false;
                }
            }
            this.setData({
                cur_carType:e.detail.value,
                cur_carClass:'摩托车',
                oilType:motoOilList,
            },()=>{
                this.caclCost();
            })
        }


    },
    carTypeRangeDown: function (e) {
        if(e.detail.value=='轻型'||e.detail.value=='中型'||e.detail.value==='重型'){
            let carOilList = this.data.carOilList;
            //动力类型初始化
            for (let i = 0; i < carOilList.length; i++) {
                if (carOilList[i].value == this.data.cur_oilType) {
                    carOilList[i].checked = true;
                } else {
                    carOilList[i].checked = false;
                }
            }
            this.setData({
                cur_carType: e.detail.value,
                cur_carClass:'货车',
                oilType:carOilList,
            }, () => {
                this.caclCostDown();

            });
        }else if(e.detail.value=='小（微）型'|| e.detail.value =='中（轻）型'||e.detail.value=='大（重）型') {
            let carOilList = this.data.carOilList;
            //动力类型初始化
            for (let i = 0; i < carOilList.length; i++) {
                if (carOilList[i].value == this.data.cur_oilType) {
                    carOilList[i].checked = true;
                } else {
                    carOilList[i].checked = false;
                }
            }
            this.setData({
                cur_carType: e.detail.value,
                cur_carClass:'客车',
                oilType:carOilList,
            }, () => {
                this.caclCostDown();

            });
        }else {
            let motoOilList = this.data.motoOilList;
            //动力类型初始化
            for (let i = 0; i < motoOilList.length; i++) {
                if (motoOilList[i].value == this.data.cur_oilType) {
                    motoOilList[i].checked = true;
                } else {
                    motoOilList[i].checked = false;
                }
            }
            this.setData({
                cur_carType:e.detail.value,
                cur_carClass:'摩托车',
                oilType:motoOilList,
            },()=>{
                this.caclCostDown();
            })
        }
    },
    oilTypeRange: function (e) {
        this.setData({cur_oilType: e.detail.value}, () => {
            this.caclCost();

        });
    },
    oilTypeRangeDown: function (e) {
        this.setData({cur_oilType: e.detail.value}, () => {
            this.caclCostDown();

        });
    },
    quattroTypeRange: function (e) {
        this.setData({cur_quattroType: e.detail.value}, () => {
            this.caclCost();

        });
    },
    quattroTypeRangeDown: function (e) {
        this.setData({cur_quattroType: e.detail.value}, () => {
            this.caclCostDown();

        });
    },
    payTypeRange: function (e) {
        let paytype = e.detail.value;
    },
    tuihuanRange: function (e) {
        this.setData({curPayType: e.detail.value}, () => {
            this.caclCost();

        });

    },
    tuihuanRangeDown: function (e) {
        this.setData({curPayTypeVip: e.detail.value}, () => {
            this.caclCostDown();

        });
    },
    remarkInput:function (e){
       console.log(333,e.detail.value)
        this.setData({remark:e.detail.value})
    },
    caclCost: function () {
        wx.showLoading({
            title: '价格测算中...',
            mask: true,
        });
        let that = this;
        let cur_carType = that.data.cur_carType;
        let cur_oilType = that.data.cur_oilType;
        let cur_quattroType = that.data.cur_quattroType;
        let cur_carClass = that.data.cur_carClass;
        console.log(999, cur_oilType)
        wx.request({
            url: app.d.hostApi + '/Api/Checkstand/diffPriceCalcu', //仅为示例，并非真实的接口地址
            data: {
                id: that.data.orderInfos.id,
                carClass:that.data.cur_carClass,
                carType: that.data.cur_carClass.indexOf('摩托车') != -1 ? '' : cur_carType,
                oilType: cur_oilType,
                quattroType: that.data.cur_carClass.indexOf('摩托车') != -1 ? cur_carType : cur_quattroType,
                city: that.data.orderInfos.city,
                rd3_session: wx.getStorageSync('3rd_session')
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                let data = res.data;
                if (data.success) {
                    let exfee = parseFloat(that.data.exfee) ? parseFloat(that.data.exfee) : 0;
                    that.setData({modifyPrice: data.diffPrice + exfee});
                } else {
                    that.errorMsg(data.msg);
                }
                wx.hideLoading();
            },
            fail: function (res) {
                wx.hideLoading();
                that.errorMsg('网络通信失败，请重新提交选择');
            }
        });
    },
    caclCostDown: function () {
        wx.showLoading({
            title: '价格测算中...',
            mask: true,
        });


        let that = this;
        let cur_carType = that.data.cur_carType;
        let cur_oilType = that.data.cur_oilType;
        let cur_quattroType = that.data.cur_quattroType;
        let cur_carClass = that.data.cur_carClass;

        //console.log(that.data.dealCompanyInfos[that.data.dealCompanyIndex]);
        //console.log(111111111);
        if (that.data.dealCompanyInfos[that.data.dealCompanyIndex].isinput == 1) {
            that.setData({isinput: 1});
        } else {
            that.setData({isinput: 0});
        }

        wx.request({
            url: app.d.hostApi + '/Api/Checkstand/getPriceCalcu', //仅为示例，并非真实的接口地址
            data: {
                id: that.data.orderInfos.id,
                code:that.data.curDownVipType,
                carClass:that.data.cur_carClass,
                carType: that.data.cur_carClass.indexOf('摩托车') != -1 ? '' : cur_carType,
                oilType: cur_oilType,
                quattroType: that.data.cur_carClass.indexOf('摩托车') != -1 ? cur_carType : cur_quattroType,
                city: that.data.orderInfos.city,
                rd3_session: wx.getStorageSync('3rd_session'),
                curDownVipType: that.data.curDownVipType,
                curPayTypeVip: that.data.curPayTypeVip,
                dealCompany: that.data.dealCompanyInfos[that.data.dealCompanyIndex].pwd,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                let data = res.data;
                if (data.success) {
                    let exfee = parseFloat(that.data.exfee) ? parseFloat(that.data.exfee) : 0;
                    that.setData({modifyPrice: parseFloat(data.price) + exfee, baseprice: parseFloat(data.price)});

                    // that.setData({ modifyPrice: data.price });
                } else {
                    that.errorMsg(data.msg);
                }
                wx.hideLoading();

            },
            fail: function (res) {
                wx.hideLoading();
                that.errorMsg('网络通信失败，网络异常,请重试提交_1d');
            }
        });
    }, doconfirmDownVip: function (e) {
        let that = this;
        let payType = e.detail.value.payType;

        if (!that.data.exfee) that.setData({exfee: 0});
        //console.log(that.data.modifyPrice);
        ////console.log(thwatchmodifyPriceDownat.data.exfee)
        //console.log(that.data.baseprice);
        //console.log(that.data.modifyPrice - that.data.exfee - that.data.baseprice);

        if (that.data.modifyPrice - that.data.exfee - that.data.baseprice < 0) {
            wx.showModal({
                title: "错误提示",
                content: "价格过低，不合规",
                showCancel: false
            });
            return false;
        }
        if (!payType) {
            wx.showModal({
                title: "错误提示",
                content: "未选择收款方式",
                showCancel: false
            });
            return false;
        }
        if (!that.data.orderInfos) {
            wx.showModal({
                title: "错误提示",
                content: "订单信息为空",
                showCancel: false
            });
            return false;
        }
        wx.showModal({
            title: '提示',
            content: '请确认该线下VIP身份',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.d.hostApi + '/Api/Checkstand/confirmDownVip', //仅为示例，并非真实的接口地址
                        data: {
                            exfee: that.data.exfee,
                            code: that.data.curDownVipType,
                            id: that.data.orderInfos.id,
                            cur_carClass:that.data.cur_carClass,
                            cur_carType: that.data.cur_carType,
                            cur_oilType: that.data.cur_oilType,
                            cur_quattroType: that.data.cur_quattroType,
                            modifyPrice: that.data.modifyPrice ? that.data.modifyPrice : 0,
                            payType: payType,

                            city: that.data.orderInfos.city,
                            rd3_session: wx.getStorageSync('3rd_session'),
                            curDownVipType: that.data.curDownVipType,
                            dealCompany: that.data.dealCompanyInfos[that.data.dealCompanyIndex].pwd,
                            remark:that.data.remark

                            //lyushine
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        method: 'POST',
                        success: function (res) {
                            wx.hideLoading();
                            let data = res.data;
                            if (data.success) {
                                wx.showModal({
                                    title: "确认成功",
                                    content: data.msg,
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            that.clearData();
                                            that.setData({orderInfos: "", carnum: ""},()=>{
                                                if(app.d.channel==='voucher'){
                                                    app.d.scene = '';
                                                }
                                            });

                                        }
                                    }
                                });
                                //
                            } else {
                                that.errorMsg(data.msg);
                            }
                            that.setData({showConfirmDownVipStatus: false});

                        },
                        fail: function (res) {
                            wx.hideLoading();
                            that.errorMsg('网络通信失败，网络异常,请重试提交');
                        }
                    });

                } else if (res.cancel) {

                }
            }
        })
    },
    watchExfee: function (e) { //监测
        let exfee = e.detail.value;
        let that = this;
        if ((/^[0-9]+$/).test(exfee) || (/^[0-9]+\./).test(exfee)) {
            that.setData({exfee: exfee});
        } else if (!exfee) {
            //console.log(2222);
            that.setData({exfee: ""});
        } else {
            that.setData({exfee: ""});
        }
        this.caclCost();
    },
    watchExfeeDown: function (e) { //监测
        let exfee = e.detail.value;
        let that = this;
        if ((/^[0-9]+$/).test(exfee) || (/^[0-9]+\./).test(exfee)) {
            that.setData({exfee: exfee});
        } else if (!exfee) {
            //console.log(2222);
            that.setData({exfee: ""});
        } else {
            that.setData({exfee: ""});
        }
        this.caclCostDown();
    },
    watchmodifyPriceDown: function (e) {
        let modifyPrice = e.detail.value;
        this.setData({modifyPrice: modifyPrice});
    },
    getContentInfo: function (message) {
        wx.showLoading({
            title: message,
        })
        let that = this;
        wx.request({
            url: app.d.hostApi + "/Api/Checkstand/getOrderlist",
            data: {
                rd3_session: wx.getStorageSync('3rd_session'),
                p: that.data.pageNum,
                pageSize: that.data.pageSize
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                let contentlistTem = that.data.contentlist;
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
    onPullDownRefresh: function () {
        //console.log('下拉');
        wx.showNavigationBarLoading() //在标题栏中显示加载
        //this.data.pageNum = 1
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
    goinputui: function (e) {
        this.setData({carnum: e.currentTarget.dataset.carnum, id: e.currentTarget.dataset.id});
        this.getOrder(e.currentTarget.dataset.id);
    },//ewm
    hideEwm: function () {
        let that = this;
        that.setData({ewmStatus: 0});
    },
    createEwm: function (e) {
        let price = e.currentTarget.dataset.price;
        let orderid = e.currentTarget.dataset.orderid;
        let type = e.currentTarget.dataset.type;
        let that = this;
        that.setData({ewmStatus: 1});
        that.setData({
            maskHidden: false,
        });

        wx.showToast({
            title: '生成中...',
            icon: 'loading',
            duration: 2000,
            mask: true,
        });
        let st = setTimeout(function () {
            wx.hideToast();
            let orderInfos = that.data.orderInfos;
            let modifyPrice = that.data.modifyPrice;
            let ewmTxt;
            if (orderInfos.status == 1) {
                if (type == "type3") {
                    ewmTxt = orderInfos.ordernum + "|" + orderInfos.carnum + "|" + parseFloat(orderInfos.price) + "|" + parseFloat(orderInfos.nprice) + "_" + (orderInfos.nprice - orderInfos.price) + "_" + parseFloat(0);
                } else {
                    //订单号|车牌号|订单金额|订单原价_折扣金额_线上已付金额
                    ewmTxt = orderInfos.ordernum + "|" + orderInfos.carnum + "|" + (parseFloat(modifyPrice)) + "|" + (parseFloat(orderInfos.nprice) - parseFloat(orderInfos.price) + parseFloat(modifyPrice)) + "_" + (orderInfos.nprice - orderInfos.price) + "_" + parseFloat(0);
                }

            }
            if (orderInfos.status == 2) {
                if (type == "type3") {
                    //订单号|车牌号|订单金额|订单原价_折扣金额_线上已付金额
                    ewmTxt = orderInfos.ordernum + "|" + orderInfos.carnum + "|" + 0 + "|" + (parseFloat(orderInfos.nprice)) + "_" + (parseFloat(orderInfos.nprice) - parseFloat(orderInfos.price)) + "_" + parseFloat(orderInfos.price);
                } else {
                    ewmTxt = orderInfos.ordernum + "|" + orderInfos.carnum + "|" + (parseFloat(modifyPrice)) + "|" + (parseFloat(orderInfos.nprice) + parseFloat(modifyPrice)) + "_" + (parseFloat(orderInfos.nprice) - parseFloat(orderInfos.price)) + "_" + parseFloat(orderInfos.price);

                }
            }


            //绘制二维码
            that.createQrCode(ewmTxt, "mycanvas", "250", "250");
            that.setData({
                maskHidden: true
            });
            clearTimeout(st);
        }, 500)

    },
    createQrCode: function (url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(url, canvasId, cavW, cavH);
        setTimeout(() => {
        }, 1000);

    },
    jumpto: function () {
        wx.redirectTo({
            url: '/pages/user/staff?city=北京&staff_bj_apppower=' + wx.getStorageSync('staff_bj_apppower')
        })
    },
    addMobileBtn: function () {
        this.setData({showMobileStatus: true});
    },
    closeMobileBtn: function () {
        this.setData({showMobileStatus: false});
    },
    addMobile: function (e) {
        let data = e.detail.value;
        let that = this;

        wx.request({
            url: app.d.hostApi + '/Api/Checkstand/confirmtel', //仅为示例，并非真实的接口地址
            data: {
                id: that.data.orderInfos.id,
                city: that.data.orderInfos.city,
                mobile: data.mobile,
                rd3_session: wx.getStorageSync('3rd_session')
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                wx.hideLoading();
                let data = res.data;
                if (data.success) {
                    wx.showModal({
                        title: "提示",
                        content: "已新增代理人手机号",
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                that.setData({showMobileStatus: false});
                            }
                        }
                    });
                } else {
                    wx.showModal({
                        title: "提示",
                        content: "操作失败！",
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                that.setData({showMobileStatus: false});
                            }
                        }
                    });
                }

            },
            fail: function (res) {
                wx.showModal({
                    title: "提示",
                    content: "网络错误",
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            that.setData({showMobileStatus: false});
                        }
                    }
                });
                wx.hideLoading();
            }
        });
    }


})
