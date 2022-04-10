//inpoutui.js
//获取应用实例
const app = getApp()

Page({
    data: {
        appointmentTime: '',
        appointmentDate: '',

        formData: {},  //订单数据
        carnum: '京',
        fadongji: '',
        frameNumber: '',
        dldate: "请选择行驶证注册日期",
        scolor: "#999",
        carClass: [
            {name: '客车', value: '客车', checked: true},
            {name: '货车', value: '货车'},
            {
                name: '摩托车', value: '摩托车'
            }
        ],
        carClassCur: '客车',
        useCharacter: [
            {
                name: '非营运', value: '非营运',checked: true
            },
            {
                name: '营运', value: '营运'
            },
        ],
        curUseCharacter: '营运',
        carType1: [
            {name: '小（微）型', value: '小（微）型', checked: true},
            {name: '中（轻）型', value: '中（轻）型'},
            {name: '大（重）型', value: '大（重）型'},
        ],
        carType2: [
            {name: '轻型', value: '轻型', checked: true},
            {name: '中型', value: '中型'},
            {name: '重型', value: '重型'},
        ],
        carType3: [
            {name: '普通正三轮', value: '普通正三轮', checked: true},
            {name: '轻便正三轮', value: '轻便正三轮',},
            {name: '正三轮载客', value: '正三轮载客',},
            {name: '正三轮载货', value: '正三轮载货',},
            {name: '侧三轮', value: '侧三轮',},
            {name: '普通二轮', value: '普通二轮',},
            {name: '轻便二轮', value: '轻便二轮',},
            {name: '特殊车型', value: '特殊车型',},
        ],
        carType: "小（微）型",
        quattroType: [
            {name: '两驱（含非全时四驱动）', value: '两驱（含非全时四驱）', checked: true},
            {name: '全时四驱', value: '全时四驱'},
        ],
        quattroTypeCur: "两驱（含非全时四驱）",
        motorcycleCur: "普通正三轮",
        oilType: [
            { name: '汽油', value: '汽油', checked: 'true' },
            { name: '混合动力', value: '混合动力'},
            { name: '电动', value: '电动' },
            { name: '柴油', value: '柴油' },
        ],
        oilTypeCur: "汽油",

        mobile: "",  //请输入车主手机号
        agentMobile: "",
        // bookerName: "",//请输入车主姓名
        feeArray: "",
        options: null,
        formidShow: false,

        worktype: [
            {value: 'SELF', name: '本人办理', checked: true},
            {value: 'AGENT', name: '代理办理'},
        ],
        curWorktype: 'SELF',
        scene: "",
        scanname: "",
        scandldate: "",
        discernType:'手动选择',
        carOilList:[],
        motoOilList:[],

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
    onLoad: function (options) {
//console.log(options);
        //测试数据
        // options.district_id = '402881e54e203a5f014e2047690e0000',//南山区
        // options.value = '9338B6370AD240108D129EBC135B2194',//检查站id
        // options.name = "北京德凯汽车检测场";
        // options.appointDate = "2019-07-23";
        // options.appointTime = "08:00-12:00";
        //console.log(scene);
        console.log(777, app.d.scene)
        this.setData({
            scene: app.d.scene,
            options: options,
            appointmentDate: options.appointDate,
            appointmentTime: options.appointTime,
        })

        this.getUserdata();
        this.getOilType();

    },
    getOilType:function (){
        let that = this;
        wx.request({
            url:app.d.hostApi + `/Api/order/getOilType`,
            data:{
                city:'北京',
                rd3_session: wx.getStorageSync('3rd_session')
            },
            method:'POST',
            header:{
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success:function (res) {
                console.log(333,res);
                if(res.data.success){
                    const {oil_car,oil_motor} = res.data.data;
                    let carOilList=[],motoOilList=[];
                    (oil_car&&oil_car.length!==0)?oil_car.map(item=>{
                        carOilList.push({
                             name:item,
                             value:item
                         })
                     }):[];
                    console.log(333,carOilList)
                    carOilList[0].checked = true;
                    (oil_motor&&oil_motor.length!==0)?oil_motor.map(item=>{
                        motoOilList.push({
                            name:item,
                            value:item
                        })
                    }):[]
                    motoOilList[0].checked = true;
                    that.setData({
                        oilType:carOilList,
                        oilTypeCur:carOilList[0].value,
                        carOilList,
                        motoOilList
                    },()=>{
                        that.caclCost();  //初始化价格
                    })

                }
            },
            fail(res) {

            }
        })
    },
    caclCost: function () {
        let that = this;
        let carClassCur = that.data.carClassCur;
        let carType = that.data.carType;
        let oilTypeCur = that.data.oilTypeCur;
        let quattroTypeCur = that.data.quattroTypeCur;
        wx.showLoading({
            title: '价格测算中...',
            mask: true,
        });
        console.log(222,that.data.scene)

        wx.request({
            url: app.d.hostApi + '/Api/order/basePriceCalcu', //仅为示例，并非真实的接口地址
            data: {
                carClass: carClassCur,
                carType: carType,
                oilType: oilTypeCur,
                quattroType: carClassCur == '摩托车' ? carType : quattroTypeCur,
                city: that.data.options['city'],
                appointmentDate: that.data.appointmentDate,
                appointmentTime: that.data.appointmentTime,
                scene: that.data.scene,
                rd3_session: wx.getStorageSync('3rd_session')
            },

            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                that.setData({feeArray: res.data});
                wx.hideLoading();
                if (wx.getStorageSync('staff_bj_apppower') != "apppower北京") {
                    if (carType == "大（重）型" || carType == "重型") {
                        wx.showModal({
                            title: '提示',
                            content: '大（重）型车辆请致电检测场进行预约，预约电话' + that.data.options.phone,
                            success(res) {
                                if (res.confirm) {
                                    wx.makePhoneCall({
                                        phoneNumber: that.data.options.phone //仅为示例，并非真实的电话号码
                                    });
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        });
                    }
                }


            },
            fail: function (res) {
                wx.hideLoading();
                that.errorMsg('网络通信失败，网络异常,请重试提交_1d');
            }
        });
    },
    carClassRange: function (e) {
        if (e.detail.value == "客车") {
            this.setData({
                carClassCur: e.detail.value,
                carType: "小（微）型",
                oilType:this.data.carOilList,
                oilTypeCur:this.data.carOilList[0].value
            });
        }
        if (e.detail.value == "货车") {
            this.setData({
                carClassCur: e.detail.value,
                carType: "轻型",
                oilType:this.data.carOilList,
                oilTypeCur:this.data.carOilList[0].value
            });
        }
        if (e.detail.value == '摩托车') {
            this.setData({
                carClassCur: e.detail.value,
                carType: "普通正三轮",
                oilType:this.data.motoOilList,
                oilTypeCur:this.data.motoOilList[0].value
            });
        }
        this.caclCost();
    },
    useCharacterRange: function (e) {
        console.log(333, e.detail.value)
        this.setData({curUseCharacter: e.detail.value});
        this.caclCost();
    },
    carTypeRange: function (e) {
        this.setData({carType: e.detail.value});
        this.caclCost();
    },
    oilTypeRange: function (e) {
        this.setData({oilTypeCur: e.detail.value});
        this.caclCost();
    },
    quattroTypeRange: function (e) {
        this.setData({quattroTypeCur: e.detail.value});
        this.caclCost();
    },
    formidSubmit: function (e) {
        let formid = wx.getStorageSync('formid');
        formid.push(e.detail.formId);
        this.setData({formidShow: true});
        //console.log(111)
        //console.log(e.detail.formId);
        wx.setStorageSync('formid', formid);
    },
    formSubmit: function (e) {
        let formData = e.detail.value;
        console.log(222, e);
        let carType = formData['carType'];
        if (wx.getStorageSync('staff_bj_apppower') != "apppower北京") {
            if (carType == "大（重）型" || carType == "重型") {
                wx.showModal({
                    title: '提示',
                    content: '大（重）型车辆请致电检测场（' + that.data.options.phone + '）进行预约,点击确定拨打检测站电话。',
                    success(res) {
                        if (res.confirm) {
                            wx.makePhoneCall({
                                phoneNumber: that.data.options.phone //仅为示例，并非真实的电话号码
                            });
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                });
            }
        }

        function unique(arr) {
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    if (arr[i] == arr[j]) {         //第一个等同于第二个，splice方法删除第二个
                        arr.splice(j, 1);
                        j--;
                    }
                }
            }
            return arr;
        }

        //formid
        let formid = wx.getStorageSync('formid');
        console.log(333,formid,e.detail.formId)
        formid.push(e.detail.formId);
        formid = unique(formid);
        wx.setStorageSync('formid', formid);
        formData['formid'] = wx.getStorageSync('formid');
        let that = this;
        //车牌号码检测
        let carnum = formData.carnum;
        // let reg_carnum = new RegExp(/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领试]))$/);
        // if (!reg_carnum.test((carnum))) {
        //   that.errorMsg("车牌号格式不正确,请检测重新输入");
        //   return false;
        // }
        if (carnum.length < 4) {
            that.errorMsg("车牌号格式不正确,请检测重新输入");
            return false;
        }
        let fadongji = formData.fadongji;
        //let reg_fadongji = new RegExp(/^[0-9A-Za-z\-\－\u4e00-\u9fa5]{1,20}$/);
        if (!fadongji.length || fadongji.length < 5) {//reg_fadongji.test(fadongji)
            that.errorMsg("发动机号格式不正确,请检测重新输入");
            return false;
        }

        // let frameNumber = formData.frameNumber;
        formData.frameNumber = that.data.frameNumber;
        //console.log(frameNumber.length);
        // if (( frameNumber.length != 17 ) ) {
        //   that.errorMsg("车架号不正确");
        //   return false;
        // }
        formData.dldate = that.data.dldate;
        formData.scanname = that.data.scanname;
        formData.scandldate = that.data.scandldate;
        formData.carUseTypeWay = that.data.discernType;
        this.data.carClassCur=='摩托车'&&(formData.quattroType = that.data.carType);
        if (formData.dldate == "请选择行驶证注册日期") {
            that.errorMsg("请选择正确的行驶证注册日期");
            return false;
        }
        //90天判定
        // let nowDay = new Date();
        // let thisYear = new Date().getFullYear();
        // let thisMonth = new Date().getMonth() + 1;
        // let thisDay = new Date().getDate();

        // let dldate = formData.dldate;
        // let dlMonth = dldate.split("-")[1];
        // let dlDay = dldate.split("-")[2];

        // let disDays = (new Date(thisYear + "-" + thisMonth + "-" + thisDay + " 00:00").getTime() - new Date(thisYear + "-" + dlMonth + "-" + dlDay + " 00:00").getTime()) / 1000 / 60 / 60 / 24;
        // if (disDays > 90) {
        //   //console.log(disDays);
        //   that.errorMsg("未到年检检测期，无法预约。行驶证注册日前90天范围内方可年检");
        //   return false;
        // }


        if (new RegExp(/^\s*$/).test((formData.mobile))) {
            that.errorMsg("请输入车主手机号");
            return false;
        }
        if (new RegExp(/^\s*$/).test((formData.name))) {
            that.errorMsg("办理人姓名不能为空");
            return false;
        }

        if (that.data.curWorktype == 'AGENT') {
            if (new RegExp(/^\s*$/).test((formData.agentMobile))) {
                that.errorMsg("请输入车主手机号");
                return false;
            }
            if (new RegExp(/^\s*$/).test((formData.agentName))) {
                that.errorMsg("办理人姓名不能为空");
                return false;
            }
        }


        wx.showLoading({
            title: '预约提交中',
            mask: true,
        });


        let options = that.data.options;
        formData['city'] = options.city;
        formData['svalue'] = options.value;
        formData['appointDate'] = options.appointDate;
        formData['appointTime'] = options.appointTime;
        // formData['name'] = options.name;
        formData['stationId'] = options.stationId;
        formData['rd3_session'] = wx.getStorageSync('3rd_session');//用户信息
        formData['scene'] = that.data.scene;
        wx.request({
            url: app.d.hostApi + '/Api/Order/bookingBj', //仅为示例，并非真实的接口地址
            data: formData,
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res);
                let data = res.data;
                console.log(333, data);
                if (data.success) {
                    wx.redirectTo({
                        url: '/pages/book/success?id=' + data.id, complete: function () {
                            wx.hideLoading();
                        }
                    });
                } else {
                    wx.hideLoading()
                    wx.showModal({
                        title: "错误提示",
                        content: data.msg,
                        showCancel: false
                    });
                }

            },
            fail: function (res) {
                wx.hideLoading()
                that.errorMsg('网络通信失败，网络异常,请重试提交');
            }
        });


    },

    costDetailClose: function () {
        this.setData({iscostdetail: 0,});
    },
    costDetailOpen: function () {
        this.setData({iscostdetail: 1,});
    },
    bindDateChange: function (e) {
        //console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            scolor: "#000",
            dldate: e.detail.value
        })
    },
    request1: function (e) {
        wx.previewImage({urls: [app.d.hostStatic + '/Data/miniapp/ready/1.jpg']})
    },
    request2: function (e) {
        wx.previewImage({urls: [app.d.hostStatic + '/Data/miniapp/ready/2.jpg']})
    },
    request3: function (e) {
        wx.previewImage({urls: [app.d.hostStatic + '/Data/miniapp/ready/3.jpg']})
    },
    request4: function (e) {
        wx.previewImage({urls: [app.d.hostStatic + '/Data/miniapp/ready/4.jpg']})
    },
    request5: function (e) {
        wx.previewImage({urls: [app.d.hostStatic + '/Data/miniapp/ready/5.jpg']})
    },
    driverSuccess: function (res) {
        let that = this;
        let data = res.detail;
        console.log(333, data);
        let plateNum = '';
        // let framenumber = '';
        let fadongji = '';
        let dldate = that.data.dldate;
        let useCharacter = that.data.useCharacter;
        let curUseCharacter = that.data.curUseCharacter;
        let carClass = that.data.carClass;
        let carClassCur = that.data.carClassCur;

        if (data.plate_num) plateNum = data.plate_num.text;
        if (data.engine_num) fadongji = data.engine_num.text;
        // if (data.vin) framenumber = data.vin.text;
        let scandldate = "";
        if (data.register_date) {
            dldate = data.register_date.text;
            scandldate = data.register_date.text;
        }
        let carType = that.data.carType;
        let carType1 = that.data.carType1;
        let carType2 = that.data.carType2;

        if (data.use_character) {
            if (data.use_character.text === '非营运') {
                curUseCharacter = '非营运';
                useCharacter = [

                    {
                        name: '非营运', value: '非营运', checked: true
                    },
                    {
                        name: '营运', value: '营运'
                    },
                ]
                that.setData({
                    discernType:'自动识别',
                })
            } else  if(data.use_character.text === '营运'){
                curUseCharacter = '营运';

                useCharacter = [
                    {
                        name: '非营运', value: '非营运'
                    },
                    {
                        name: '营运', value: '营运', checked: true
                    },

                ]
                that.setData({
                    discernType:'自动识别',
                })
            }else {
                curUseCharacter = data.use_character.text;

                useCharacter = [
                    {
                        name: '非营运', value: '非营运'
                    },
                    {
                        name: '营运', value: '营运',
                    },
                    {
                        name: data.use_character.text, value: data.use_character.text, checked:  true
                    },
                ]
                that.setData({
                    discernType:'自动识别',
                })
            }
        }
        //车型判别
        if (data.vehicle_type) {
            if (data.vehicle_type.text.indexOf("货车") != -1) {
                carClass = [
                    {name: '客车', value: '客车'},
                    {name: '摩托车', value: '摩托车'},
                    {name: '货车', value: '货车', checked: true},
                ];
                carClassCur = '货车';
                carType = '轻型';
                if (data.vehicle_type.text.indexOf("轻型") || data.vehicle_type.text.indexOf("小型")) {
                    carType = "轻型";
                    carType2 = [
                        {name: '轻型', value: '轻型', checked: true},
                        {name: '中型', value: '中型'},
                        {name: '重型', value: '重型'},
                    ];
                } else if (data.vehicle_type.text.indexOf("中型")) {
                    carType = "中型";
                    carType2 = [
                        {name: '轻型', value: '轻型'},
                        {name: '中型', value: '中型', checked: true},
                        {name: '重型', value: '重型'},
                    ];
                } else if (data.vehicle_type.text.indexOf("重型")) {
                    carType = "重型";
                    carType2 = [
                        {name: '轻型', value: '轻型'},
                        {name: '中型', value: '中型'},
                        {name: '重型', value: '重型', checked: true},
                    ];
                }
            } else {
                carClass = [
                    {name: '客车', value: '客车', checked: true},
                    {name: '货车', value: '货车'},
                    {name: '摩托车', value: '摩托车'},
                ];
                carClassCur = '客车';
                carType = '小（微）型';

                if (data.vehicle_type.text.indexOf("微型") || data.vehicle_type.text.indexOf("小型")) {
                    carType = "小（微）型";
                    carType1 = [
                        {name: '小（微）型', value: '小（微）型', checked: true},
                        {name: '中（轻）型', value: '中（轻）型'},
                        {name: '大（重）型', value: '大（重）型'},
                    ];

                } else if (data.vehicle_type.text.indexOf("中型") || data.vehicle_type.text.indexOf("轻型")) {
                    carType = "中（轻）型";
                    carType1 = [
                        {name: '小（微）型', value: '小（微）型'},
                        {name: '中（轻）型', value: '中（轻）型', checked: true},
                        {name: '大（重）型', value: '大（重）型'},
                    ];

                } else if (data.vehicle_type.text.indexOf("大型") || data.vehicle_type.text.indexOf("重型")) {
                    carType = "大（重）型";
                    carType1 = [
                        {name: '小（微）型', value: '小（微）型'},
                        {name: '中（轻）型', value: '中（轻）型'},
                        {name: '大（重）型', value: '大（重）型', checked: true},
                    ];

                }

            }
        }
        //framenumber: framenumber
        let owner = data.owner.text ? data.owner.text : "";
        that.setData({
            carnum: plateNum,
            dldate: dldate,
            scolor: "#000",
            fadongji: fadongji,
            curUseCharacter,
            useCharacter,
            carClass: carClass,
            carClassCur: carClassCur,
            carType: carType,
            carType1: carType1,
            carType2: carType2,
            scanname: owner,
            scandldate: scandldate
        });
        that.caclCost();
        wx.hideLoading();
        wx.showModal({
            title: '识别提示',
            showCancel: false,
            content: '请仔细核对您的车辆信息，如部分内容无法经过OCR识别，请手动核对选择或修改'
        });
    },
    getMobile: function (res) {
        let that = this;
        that.setData({mobile: res.detail});
    },
    getMobileAgent: function (res) {
        let that = this;
        that.setData({agentMobile: res.detail});
    },
    errorMsg: function (content) {
        wx.showModal({
            title: '错误提示',
            showCancel: false,
            content: content
        });
    },
    radioChange: function (e) {
        //console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({curWorktype: e.detail.value});
    },
    getUserdata: function () {

        let that = this;
        wx.request({
            url: app.d.hostApi + '/Api/User/getUserInfo',
            data: {
                rd3_session: wx.getStorageSync('3rd_session')
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {// 设置请求的 header
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                let data = res.data;
                if (data.success) {
                    let info = data.list;
                    that.setData({
                        name: info.uname,
                        mobile: info.tel,
                        agentbookName: info.uname,
                        agentmobile: info.tel,
                    });
                }
            },
            fail: function () {
                // fail
                wx.showToast({
                    title: '网络失败，请重试_error4',
                    icon: "none",
                    duration: 5000
                });
            }
        });
    },

})
