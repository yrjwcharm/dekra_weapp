//inpoutui.js
//获取应用实例
const app = getApp()

Page({
    data: {
        dldate: "请选择行驶证注册日期",
        scolor: "#999",
        formData: {},  //订单数据
        appointmentTime: '',
        appointmentDate: '',
        consigneeAddress: '',
        platNumber: '粤',
        car_type: [
            { name: '小型汽车', value: '1', checked: 'true' },
            /*   { name: '大型汽车', value: '2' },
              { name: '挂车', value: '3' },*/
        ],

        carTypeId: '312AED23657445C194540C794DBDBDB9', //carTypeId 提交值
        vehicleCharacter: "XXZK",//vehicleCharacter 提交值
        fuelType: "1",//fuelType 提交值



        isnewflag: [
            { name: '非新车', value: '0', checked: 'true' },
            // { name: '未上牌车', value: '1' },
        ],
        newflag: 0,
        spflag: 0,
        chflag: 0,


        useCharater: '',
        useCharaters: [
            { value: '0', name: '其他', checked: 'true' },
            { value: '1', name: '营转非' },
        ],

        cur_car_type: 1,
        car_class1: ['小型汽车(蓝底白字)', '领馆汽车(黑底白字、红领字)', '外籍汽车(黑底白字)', '教练汽车(黄底黑字黑框线)', '警用汽车(警用汽车)', '小型新能源汽车(渐变绿底黑字)'],
        car_class_value1: ['312AED23657445C194540C794DBDBDB9', 'B4394B3F2F3B4E78911713C3D54D4196', 'A4FA9722C81C408B8A5BB65F8BD9C9B1', 'D7FAFC5A68004845864C42345B58D7BC', '31CCBA351E0A4B7AA1BAFBDE2AA93161', '763FF1EEE4BB4C3995B402E8A7D2C550'],
        car_class_index1: 0,


        car_char1: ['小型载客汽车', '轻型自卸货车', '小型载货汽车(含专项作业车)', '危化品运输车', '校车'],
        car_char_value1: ['XXZK', 'QXZXHC', 'ZZZH', 'WHPZSC', 'XXXC'],
        car_char_index1: 0,

        car_drivetype1: [
            { name: '0', value: '两驱', checked: 'true' },
            // { name: '1', value: '全时四驱' },
        ],

        car_fuel1: ['汽油、混合动力、纯电', '柴油、柴电混合（总质量小于等于3500KG）', '柴油、柴电混合（总质量大于3500KG）'],
        car_fuel_value1: ['1', '2', '3'],
        car_fuel_index1: 0,

        //2
        car_class2: ['大型汽车(黄底黑字)', '领馆汽车(黑底白字、红领字)', '外籍汽车(黑底白字)', '低速车(黄底黑字黑框线)', '教练汽车(黄底黑字黑框线)', '警用汽车(警用汽车)', '大型新能源汽车(黄绿双拼色底黑字)'],
        car_class_value2: ['5AA667F13C2143F0A41C6940E74B127E', 'B4394B3F2F3B4E78911713C3D54D4196', 'A4FA9722C81C408B8A5BB65F8BD9C9B1', '0D7E3ABB86774FD1927EE05CF82FDA4B', 'D7FAFC5A68004845864C42345B58D7BC', '31CCBA351E0A4B7AA1BAFBDE2AA93161', '0EBEC3DB9EAA40A7B97DDD547FF58F51'],
        car_class_index2: 0,

        car_char2: ['中型载客汽车', '大型载客汽车', '中型载货汽车', '低速载货汽车', '中型自卸货车', '重型自卸货车', '重型载货汽车', '专项作业车', '危化品运输车', '校车', '无轨电车'],
        car_char_value2: ['ZXZK', 'DXZK', 'MZXZH', 'DSZH', 'MXZXHC', 'ZXZXHC', 'ZXZH', 'ZXZY', 'WHPZSC', 'DXXC', 'WGDC'],
        car_char_index2: 0,

        car_drivetype2: [
            { name: '3', value: '两轴', checked: 'true' },
            { name: '5', value: '三轴及以上' },
            { name: '6', value: '单轴轴重超15吨' },],


        car_fuel2: ['汽油、混合动力、纯电', '柴油、柴电混合（总质量小于等于3500KG）', '柴油、柴电混合（总质量大于3500KG）'],
        car_fuel_value2: ['1', '2', '3'],
        car_fuel_index2: 0,
        //3

        car_char3: ['普通挂车', '危化品运输车'],
        car_char_value3: ['PTGC', 'WHPZSC'],
        car_char_index3: 0,

        car_drivetype3: [
            { name: '2', value: '两轴及下', checked: 'true' },
            { name: '4', value: '三轴及上' },
            { name: '7', value: '并装双轴及上' },],


        idtype: ['居民身份证', '组织机构代码证书', '统一社会信用代码', '境外人员身份证明'],
        idtype_index: 0,
        idtype_value: ['e4e48584399473d20139947f125e2b2c', '40288282463ceca50146462942d3055c', '4028823f51d79d4d0151f1ebb1dc361e', 'e4e48584399b293601399b60996b55e6'],

        idtype_type: ['idcard', 'text', 'text', 'text'],

        worktype: [
            { value: 'SELF', name: '本人办理', checked: 'true' },
            { value: 'AGENT', name: '代理办理' },
        ],
        curWorktype: 'SELF',

        currentTime: 30,
        time: '获取验证码', //倒计时

        currentTel: "",

        // feeSafe:0,    //安全服务费
        // feeEnvir:0,  //环保检测费
        // feeWork:0,  //工本费
        // feeService:65,   //总费用
        // feeTotal:0,   //总费用

        feeArray: "",


        bookerName: "",//请输入车主姓名
        idNumber: "",  //清输入车主身份证号
        mobile: "",  //请输入车主手机号
        carnum: "",  //车牌号

        agentbookerName: "",//请输入车主姓名
        agentidNumber: "",  //清输入车主身份证号
        agentmobile: "",  //请输入车主手机号

        userInfo: {},
        hasUserInfo: false,

        options: null,


        oilType: [
            { name: '汽油', value: '汽油', checked: 'true' },
            { name: '混合动力', value: '混合动力' },
            { name: '电动', value: '电动' },
            { name: '柴油', value: '柴油' },
        ],
        oilTypeCur: "汽油车",
        formidShow: false,
        scanname: "",
        scene: "",
        scandldate:""

    },
    onLoad: function (options) {

        //测试数据
        // options.district_id =  '402881e54e203a5f014e2047690e0000',//南山区
        // options.value =  '9338B6370AD240108D129EBC135B2194',//检查站id
        // options.name = "九马汽车检测站";
        // options.appointDate = "2019-07-23";
        // options.appointTime = "08:00-12:00";
        let scene = app.d.scene;
        console.log(333,options)
        this.setData({
            scene: scene,
            options: options,
            appointmentDate: options.appointDate,
            appointmentTime: options.appointTime,
        })

        // this.caclCost();  //初始化价格

        this.getUserdata();
        this.getOilType();

    },
    getOilType:function (){
        let that = this;
        wx.request({
            url:app.d.hostApi + `/Api/order/getOilType`,
            data:{
                city:'深圳',
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
                    that.setData({
                        oilType:carOilList,
                        oilTypeCur:carOilList[0].value,
                    },()=>{
                        that.caclCost();  //初始化价格
                    })

                }
            },
            fail(res) {

            }
        })
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    getUserdata: function () {

        var that = this;
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
                        bookName: info.uname,
                        mobile: info.tel,
                        currentTel: info.tel,
                        idNumber: info.idcard,
                        agentbookName: info.uname,
                        agentmobile: info.tel,
                        agentidNumber: info.idcard,
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
    bindPickerChange: function (e) {
        this.setData({ ch_index: e.detail.value })
    },
    bindPickerChangeClass1: function (e) {
        this.setData({
            carTypeId: this.data.car_class_value1[e.detail.value],
            car_class_index1: e.detail.value
        });
        this.caclCost();
    },
    bindPickerChangeClass2: function (e) {
        ////console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            carTypeId: this.data.car_class_value2[e.detail.value],
            car_class_index2: e.detail.value
        });
        if (this.data.vehicleCharacter == "DXZK" &&
            (this.data.carTypeId == "5AA667F13C2143F0A41C6940E74B127E" || this.data.carTypeId == "0EBEC3DB9EAA40A7B97DDD547FF58F51")) {
            this.setData({ chflag: 1 });
        } else {
            this.setData({ chflag: 0 });
        }

        ////console.log(this.data.carTypeId);
        this.caclCost();
    },

    bindPickerChangeChar1: function (e) {
        ////console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            vehicleCharacter: this.data.car_char_value1[e.detail.value],
            car_char_index1: e.detail.value
        });
        ////console.log(this.data.car_char_value1[e.detail.value])
        if (this.data.car_char_value1[e.detail.value] == "QXZXHC") {
            this.setData({ spflag: 1 });
        } else {
            this.setData({ spflag: 0 });
        }
        ////console.log(this.data.carTypeId);
    },
    bindPickerChangeChar2: function (e) {
        ////console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            vehicleCharacter: this.data.car_char_value2[e.detail.value],
            car_char_index2: e.detail.value
        });
        if (this.data.vehicleCharacter == "DXZK" &&
            (this.data.carTypeId == "5AA667F13C2143F0A41C6940E74B127E" || this.data.carTypeId == "0EBEC3DB9EAA40A7B97DDD547FF58F51")) {
            this.setData({ chflag: 1 });
        } else {
            this.setData({ chflag: 0 });
        }
        ////console.log(this.data.carTypeId);
    },
    bindPickerChangeChar3: function (e) {
        ////console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            vehicleCharacter: this.data.car_char_value3[e.detail.value],
            car_char_index3: e.detail.value
        });
        ////console.log(this.data.carTypeId);
    },
    bindPickerChangeFuel1: function (e) {
        ////console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            car_fuel_index1: e.detail.value,
            fuelType: this.data.car_fuel_value1[e.detail.value]
        });
    },
    bindPickerChangeFuel2: function (e) {
        ////console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            car_fuel_index2: e.detail.value,
            fuelType: this.data.car_fuel_value2[e.detail.value]
        });
        this.caclCost();
    },
    bindPickerChangeIdtype: function (e) {
        ////console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({ idtype_index: e.detail.value });
    },
    radioChange: function (e) {
        ////console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({ curWorktype: e.detail.value });
    },
    radioChange1: function (e) {

        ////console.log("abc");
        ////console.log('radio发生change事件，携带value值为：', e.detail.value);
        if (e.detail.value == 1) {
            this.setData({
                car_class_index1: 0,
                car_fuel_index1: 0,
                car_char_index1: 0,
                spflag: 0,
                // curWorktype:e.detail.value,
                carTypeId: "312AED23657445C194540C794DBDBDB9",
                vehicleCharacter: "XXZK",
                fuelType: "1"
            });
        } else if (e.detail.value == 2) {
            this.setData({
                car_class_index2: 0,
                car_fuel_index2: 0,
                car_char_index2: 0,
                spflag: 0,
                // curWorktype:e.detail.value,
                carTypeId: "5AA667F13C2143F0A41C6940E74B127E",
                vehicleCharacter: "ZXZK",
                fuelType: "1"
            });
        } else if (e.detail.value == 3) {
            this.setData({
                car_char_index3: 0,
                spflag: 0,
                curWorktype: e.detail.value,
                carTypeId: "",
                vehicleCharacter: "PTGC",
                fuelType: ""
            });
        }
        this.setData({ cur_car_type: e.detail.value });
        this.caclCost();
        //this.changeAgent();
    },
    formidSubmit: function (e) {
        let formid = wx.getStorageSync('formid');
        formid.push(e.detail.formId);
        this.setData({ formidShow: true });
        ////console.log(999)
        ////console.log(formid);
        wx.setStorageSync('formid', formid);
    },

    formSubmit: function (e) {

        let that = this;

        ////console.log(e.detail.formId); //获取prepay_id

        let formData = e.detail.value;


        function unique(arr) {
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
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
        formid.push(e.detail.formId);
        formid = unique(formid);
        wx.setStorageSync('formid', formid);
        formData['formid'] = wx.getStorageSync('formid');

        formData['carTypeId'] = this.data.carTypeId;
        formData['vehicleCharacter'] = this.data.vehicleCharacter;
        formData['fuelType'] = this.data.fuelType;
        // formData['formId'] = e.detail.formId;

        formData.useCharater = formData.useCharater || '';
        formData.agentName = formData.agentName || '';
        formData.agentIdNumber = formData.agentIdNumber || '';
        formData.agentMobile = formData.agentMobile || '';
        formData.optSJ = formData.bookTime;

        formData.dldate = that.data.dldate;
        formData.scanname = that.data.scanname;
        formData.scandldate = that.data.scandldate;

        //90天判定
        //  let nowDay = new Date();
        //  let thisYear = new Date().getFullYear();
        //  let thisMonth = new Date().getMonth() + 1;
        //  let thisDay = new Date().getDate();

        //  let dldate = formData.dldate;
        //  let dlMonth = dldate.split("-")[1];
        //  let dlDay = dldate.split("-")[2];

        //  let disDays = (new Date(thisYear + "-" + thisMonth + "-" + thisDay + " 00:00").getTime() - new Date(thisYear + "-" + dlMonth + "-" + dlDay + " 00:00").getTime()) / 1000 / 60 / 60 / 24;
        //  if (disDays >90) {
        //    ////console.log(disDays);
        //    that.errorMsg("未到年检检测期，无法预约。行驶证注册日前90天范围内方可年检");
        //    return false;
        //  }




        let options = that.data.options;
        formData['city'] = options.city;
        formData.districtId = options['districtid'];
        formData.stationId = options['value'];//app.d.orgId;  //检查站
        formData['svalue'] = options.stationId;

        formData['scene'] = that.data.scene;
        // formData['appointDate'] = options.appointDate;
        // formData['appointTime'] = options.appointTime;



        //车牌号码检测
        let platNumber = formData.platNumber;
        let reg_platNumber = new RegExp(/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/);

        // 车牌号
        if (that.data.newflag) { //非新车需验证车牌格式
            formData.platNumber = "";
        } else {
            if (!reg_platNumber.test((platNumber))) {
                that.errorMsg("车牌号格式不正确,请检测重新输入");
                return false;
            }
        }

        //车架号
        let newflag = that.data.newflag;  //新车
        let frameNum = formData.frameNumber;

        if (new RegExp(/^\s*$/).test((frameNum))) {
            that.errorMsg("请输入车架号");
            return false;
        }
        let frameNumberLength = frameNum.length;
        let qxzxhcFlag = that.data.vehicleCharacter == "QXZXHC";
        if (newflag || qxzxhcFlag) {
            if (frameNumberLength <= 4) {
                that.errorMsg(qxzxhcFlag ? "轻型自卸货车请输入完整的车架号！" : "请输入完整的车架号！");
                return false;
            }
            if (frameNumberLength > 24) {
                that.errorMsg("车架号不能超过24位！");
                return false;
            }
        } else {
            if (frameNumberLength != 4) {
                that.errorMsg("旧车请输入车架号后4位！");
                return false;
            }
        }

        //行驶证
        if (formData.dldate == "请选择行驶证注册日期") {
            that.errorMsg("请选择正确的行驶证注册日期");
            return false;
        }

        if (that.data.curWorktype == 'AGENT') {
            if (new RegExp(/^\s*$/).test((formData.agentName))) {
                that.errorMsg("代办人姓名不能为空");
                return false;
            }
            if (new RegExp(/^\s*$/).test((formData.agentIdNumber))) {
                that.errorMsg("代办人证件号不能为空");
                return false;
            }
        }

        if (formData.bookType == "SELF") {
            if (new RegExp(/^\s*$/).test((formData.mobile))) {
                that.errorMsg("车主手机号不能为空");
                return false;
            }
        } else if (formData.bookType == "AGENT") {
            if (new RegExp(/^\s*$/).test((formData.agentMobile))) {
                that.errorMsg("代理人手机号不能为空");
                return false;
            }
        }

        if (new RegExp(/^\s*$/).test((formData.smsCode))) {
            that.errorMsg("短信验证码不能为空");
            return false;
        }

        if (new RegExp(/^\s*$/).test((formData.bookerName)) || formData.bookerName.length < 2) {
            that.errorMsg("车主姓名格式不正确");
            return false;
        }

        formData.idTypeId = that.data.idtype_value[that.data.idtype_index];


        if (that.data.idtype_index == 0) {
            if (!new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/).test((formData.idNumber))) {
                that.errorMsg("车主证件号格式不正确");
                return false;
            }
        }

        //代办姓名
        if (formData.agentName == formData.bookerName) {
            that.errorMsg("代办人姓名和车主姓名不能相同！");
            return false;
        }

        //代办证件号
        if (formData.idNumber == formData.agentIdNumber) {
            that.errorMsg("代办人证件号不能与车主证件号相同！");
            return false;
        }

        if (!new RegExp(/^[1][3,4,5,6,7,8][0-9]{9}$/).test((formData.mobile))) {
            that.errorMsg("车主手机号码格式不正确");
            return false;
        }

        //邮寄地址无用
        var addrArray = ['深圳市南山区艺园路139号鼎元宏易大厦一楼', '深圳市南山区前海路大新新村65号楼', '深圳市南山区桃园路122号前海金岸金硕阁0908', '深圳市南山区海德二道223号佳嘉豪苑C栋0807']
        formData['consigneeAddress'] = addrArray[parseInt(Math.random() * (4), 10)];
        if (new RegExp(/^\s*$/).test((formData.consigneeAddress))) {
            that.errorMsg("邮寄地址不能为空");
            return false;
        }

        this.setData({ formData: formData });

        wx.showLoading({
            title: '预约提交中',
            mask: true,
        });
        var submitDatas = that.data.formData;
        submitDatas.currentTel = that.data.currentTel;
        submitDatas.rd3_session = wx.getStorageSync('3rd_session');//用户信息

        let domsging = "";
        if (app.d.msgcookie) {
            domsging = "?msgcookie=" + app.d.msgcookie;
        }
        wx.request({
            url: app.d.hostApi + '/Api/Order/bookingSz', //仅为示例，并非真实的接口地址
            data: submitDatas,
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {


                let data = res.data;
                if (data.success) {
                    wx.setStorageSync('formid', []);
                    wx.redirectTo({ url: '/pages/book/success?id=' + data.id,complete:function(){
                            wx.hideLoading();
                        }});
                } else {
                    wx.hideLoading();
                    wx.showModal({
                        title: "错误提示",
                        content: data.msg,
                        showCancel: false
                    });
                }
            },
            fail: function (res) {
                wx.hideLoading();
                that.errorMsg('网络通信失败，网络异常,请重试提交_1d');
            }
        });
    },
    radioChangeNew: function (e) {

        this.setData({ newflag: e.detail.value, framenumber: "" })
    },
    costDetailClose: function () {
        this.setData({ iscostdetail: 0, });
    },
    costDetailOpen: function () {
        this.setData({ iscostdetail: 1, });
    },
    getCode: function (options) {
        var that = this;
        var currentTime = that.data.currentTime;
        var interval = setInterval(function () {
            currentTime--;
            that.setData({
                time: currentTime + '秒'
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    time: '获取',
                    currentTime: 30,
                    disabled: false
                })
            }
        }, 1000)
    },
    getVerificationCode() {
        var that = this;

        if (!this.data.currentTel) {
            wx.showModal({
                title: '错误提示',
                showCancel: false,
                content: '请填手机号'
            });
        } else {

            if (that.data.options.opengov == 1) {
                wx.request({
                    url: "https://app.szjj.sz.gov.cn:8092/moti/appoint/book/index",
                    success: function (res) {
                        ////console.log(res);
                        let cookies = res.header['Set-Cookie'].split(";");
                        ////console.log(cookies);
                        let cookie_data = cookies[0];
                        if (res.statusCode == 200) {
                            ////console.log(cookie_data);
                            wx.request({
                                url: "https://app.szjj.sz.gov.cn:8092/moti/appoint/book/xys?code",
                                header: {
                                    'Cookie': cookie_data // 默认值
                                },
                                success: function (res) {
                                    ////console.log(res);
                                    if (res.statusCode == 200) {
                                        setTimeout(function () {
                                            wx.request({
                                                url: "https://app.szjj.sz.gov.cn:8092/moti/appoint/book/smsUI?code=",
                                                header: {
                                                    'Cookie': cookie_data // 默认值
                                                },
                                                success: function (res) {
                                                    ////console.log(res);
                                                    if (res.statusCode == 200) {
                                                        app.d.msgcookie = cookie_data;
                                                        let result1 = that.cloudf(that.data.currentTel,cookie_data);
                                                    } else {
                                                        that.errorMsg('网络通信失败，网络异常,请重试提交_1msgd');
                                                    }
                                                },
                                                fail: function (res) {
                                                    wx.hideLoading();
                                                    that.errorMsg('网络通信失败，网络异常,请重试提交_1d');
                                                }
                                            });
                                        }, 10000);

                                    } else {
                                        that.errorMsg('网络通信失败，网络异常,请重试提交_1msgd');
                                    }
                                },
                                fail: function (res) {
                                    wx.hideLoading();
                                    that.errorMsg('网络通信失败，网络异常,请重试提交_2d');
                                }
                            });
                        } else {
                            that.errorMsg('网络通信失败，网络异常,请重试提交_1msgd');
                        }
                    },
                    fail: function (res) {
                        wx.hideLoading();
                        that.errorMsg('网络通信失败，网络异常,请重试提交_1d');
                    }
                });
            }
            else {
                wx.request({
                    url: app.d.hostApi + '/Api/Detectsz/msg', //仅为示例，并非真实的接口地址
                    data: {
                        mobile: that.data.currentTel,
                        stationId: that.data.options.stationId
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                        let data = res.data;
                        if (data.status == "fail") {
                            wx.showModal({
                                title: '错误提示',
                                showCancel: false,
                                content: data.msg
                            });
                        } else {
                            wx.showModal({
                                title: '短信获取成功',
                                showCancel: false,
                                content: data.msg + ',常有网络延迟请耐心等待,验证码有效期为30分钟。'
                            });
                        }
                    },
                    fail: function (res) {
                        wx.showModal({
                            title: '错误提示',
                            showCancel: false,
                            content: '网络失败，请重试,如系统故障请输入任意验证码数值'
                        });
                    }
                })
            }
            //////console.log(this.data.currentTel);

            this.getCode();
            that.setData({ disabled: true });
        }
    },
    updateTel: function (e) {
        var value = e.detail.value;
        this.setData({ currentTel: value });
    },
    bindDateChange: function (e) {
        ////console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            scolor: "#000",
            dldate: e.detail.value
        })
    },
    cloudf: function (currentTel, cookie_data){
        let that = this;
        wx.cloud.init();
        wx.cloud.callFunction({
            // 云函数名称
            name: 'domsg',
            // 传给云函数的参数
            data: {
                a: currentTel,
                b: cookie_data,
            },
        })
            .then(res => {
                let data = res.result;
                data = JSON.parse(data);
                //console.log(data);
                if (data.status == "fail") {
                    if (data.msg.indexOf("对不起，当前ip") != -1) {
                        wx.cloud.callFunction({
                            // 云函数名称
                            name: 'domsg',
                            // 传给云函数的参数
                            data: {
                                a: currentTel,
                                b: cookie_data,
                            },
                        })
                            .then(res => {
                                let data = res.result;
                                data = JSON.parse(data);
                                //console.log(data);
                                if (data.status == "fail") {
                                    wx.showModal({
                                        title: '错误提示',
                                        showCancel: false,
                                        content: data.msg
                                    });
                                } else if (data.status == "success") {

                                    wx.showModal({
                                        title: '短信获取成功',
                                        showCancel: false,
                                        content: data.msg + ',常有网络延迟请耐心等待,验证码有效期为30分钟。'
                                    });
                                }
                            })
                            .catch(console.error)
                    }else{

                        wx.showModal({
                            title: '错误提示',
                            showCancel: false,
                            content: data.msg
                        });
                    }
                } else if (data.status == "success") {

                    wx.showModal({
                        title: '短信获取成功',
                        showCancel: false,
                        content: data.msg + ',常有网络延迟请耐心等待,验证码有效期为30分钟。'
                    });
                }
            })
            .catch(console.error)
    },
    request1: function (e) {
        wx.previewImage({ urls: [app.d.hostStatic + '/Data/miniapp/ready/1.jpg'] })
    },
    request2: function (e) {
        wx.previewImage({ urls: [app.d.hostStatic + '/Data/miniapp/ready/2.jpg'] })
    },
    request3: function (e) {
        wx.previewImage({ urls: [app.d.hostStatic + '/Data/miniapp/ready/3.jpg'] })
    },
    request4: function (e) {
        wx.previewImage({ urls: [app.d.hostStatic + '/Data/miniapp/ready/4.jpg'] })
    },
    request5: function (e) {
        wx.previewImage({ urls: [app.d.hostStatic + '/Data/miniapp/ready/5.jpg'] })
    }
    ,
    idcardSuccess: function (res) {
        let that = this;
        let data = res.detail;
        that.setData({ idNumber: data.id.text, bookName: data.name.text, oidNumber: data.id.text, obookName: data.name.text });
        wx.showModal({
            title: '识别提示',
            showCancel: false,
            content: '请仔细核对您的身份，如部分内容无法经过OCR识别，请手动核对选择或修改'
        });
    },
    idcardAgentSuccess: function (res) {
        let that = this;
        let data = res.detail;
        that.setData({ agentidNumber: data.id.text, agentbookName: data.name.text });
        wx.showModal({
            title: '识别提示',
            showCancel: false,
            content: '请仔细核对您的身份，如部分内容无法经过OCR识别，请手动核对选择或修改'
        });
    },
    driverSuccess: function (res) {
        let that = this;
        wx.showLoading({ title: '信息识别获取中', mask: true });
        let data = res.detail;


        let plateNum = '';
        let framenumber = '';
        let fadongji = '';
        let dldate = that.data.dldate;

        if (data.plate_num) plateNum = data.plate_num.text;
        if (data.engine_num) fadongji = data.engine_num.text;
        let scandldate = "";
        if (data.register_date) {
            dldate = data.register_date.text;
            scandldate = data.register_date.text;
        }

        let isnewflag = that.data.isnewflag;
        for (let i = 0; i < isnewflag.length; i++) {
            if (isnewflag[i].checked && isnewflag[i].value == 0) {
                isnewflag = 0;
            } else {
                isnewflag = 1;
            }
        }
        if (isnewflag) {
            if (data.vin) framenumber = data.vin.text;
        } else {
            if (data.vin) framenumber = data.vin.text.substr(-4);
        }
        let owner = data.owner.text ? data.owner.text : "";
        that.setData({ platNumber: plateNum, framenumber: framenumber, dldate: dldate, scolor: "#000", scanname: owner, scandldate: scandldate });
        that.caclCost();
        wx.showModal({
            title: '识别提示',
            showCancel: false,
            content: '请仔细核对您的车辆信息，如部分内容无法经过OCR识别，请手动核对选择或修改'
        });
    },
    oilTypeRange: function (e) {
        if (e.detail.value == "柴油") {
            if (this.data.cur_car_type == 1) {
                this.setData({
                    car_fuel_index1: 1,
                    fuelType: this.data.car_fuel_value1[1],
                    oilTypeCur: e.detail.value,
                });
            } else {
                this.setData({
                    car_fuel_index1: 2,
                    fuelType: this.data.car_fuel_value1[2],
                    oilTypeCur: e.detail.value,
                });
            }

        } else {
            this.setData({
                car_fuel_index1: 0,
                fuelType: this.data.car_fuel_value1[0],
                oilTypeCur: e.detail.value,
            });

        }

        this.caclCost();
    },
    /* 输入框聚焦显示车牌号键盘 */
    handleFocus: function (e) {
        this.setData({
            showKeyboard: true
        })
    },
    /* 车牌号键盘点击事件 */
    setNumber: function (e) {
        this.setData({ platNumber: e.detail.value });
    },
    errorMsg: function (content) {
        wx.showModal({
            title: '错误提示',
            showCancel: false,
            content: content
        });
    },
    trim: function (value) {
        return value.replace(/\s+/g, '');
    },
    caclCost: function () {
        let that = this;
        let carType = that.data.cur_car_type;
        let oilTypeCur = that.data.oilTypeCur;
        wx.showLoading({
            title: '价格测算中...',
            mask: true,
        });
        wx.request({
            url: app.d.hostApi + '/Api/order/basePriceCalcu', //仅为示例，并非真实的接口地址
            data: {
                carType: carType,
                oilType: oilTypeCur,
                city: "深圳",//that.data.options['city']
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
                that.setData({ feeArray: res.data });
                wx.hideLoading();

            },
            fail: function (res) {
                wx.hideLoading();
                that.errorMsg('网络通信失败，网络异常,请重试提交_1d');
            }
        });
    },
    getMobile: function (res) {
        let that = this;
        if (that.data.curWorktype == 'SELF') {
            that.setData({
                currentTel: res.detail,
                mobile: res.detail
            });
        } else {
            that.setData({
                currentTel: res.detail,
                agentmobile: res.detail
            });
        }
    }
})
