//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        carnum: '',
        scene: app.d.scene,
        carClass: [
            {name: '客车', value: '客车', checked: true},
            {name: '货车', value: '货车'},
            {
                name: '摩托车', value: '摩托车'
            }
        ],
        payType: [
            {
                name: '付费', value: '付费', checked: true
            },
            {
                name: '免费', value: '免费'
            }
        ],
        curPayType: '付费',
        channelChoice: [
            {
                name: '线上大客户', value: '线上大客户', checked: true
            },
            {
                name: '线下大客户', value: '线下大客户'
            },
            {
                name: '代金券客户', value: '代金券客户'
            },
            {
                name: '线下转换', value: '线下转换'
            },
            {
                name: '其他散客', value: '其他散客'
            },
        ],
        curChannel: '线上大客户',
        carClassCur: '客车',
        ch_area: ['粤', '鄂', '豫', '皖', '赣', '冀', '鲁', '浙', '苏', '湘', '闽', '蒙', '京', '辽', '渝', '沪', '陕', '川', '黑', '晋', '桂', '吉', '宁', '贵', '琼', '甘', '青', '津', '云', '藏', '新'],
        ch_index: 12,
        carType1: [
            {name: '小（微）型', value: '1', checked: true},
            {name: '中（轻）型', value: '2'},
            {name: '大（重）型', value: '3'},
        ],
        carType: "小（微）型",
        carType2: [
            {name: '轻型', value: '1', checked: true},
            {name: '中型', value: '2'},
            {name: '重型', value: '3'},
        ],
        carType3: [
            {name: '普通正三轮', value: '1', checked: true},
            {name: '轻便正三轮', value: '2',},
            {name: '正三轮载客', value: '3',},
            {name: '正三轮载货', value: '4',},
            {name: '侧三轮', value: '5',},
            {name: '普通二轮', value: '6',},
            {name: '轻便二轮', value: '7',},
            {name: '特殊车型', value: '8',},
        ],
        cur_car_type: 1,
        feeTotal: 0,   //总费用

        redetect: [],

    },

    //     {
    //   type: "人工检验", stype: [
    //     { name: "车辆唯一性检查", sprice: "20", mprice: "20", bprice: "20", num: "0" }, { name: "车辆特征参数检查", sprice: "20", mprice: "30", bprice: "30", num: "0" }, { name: "车辆外观检查", sprice: "35", mprice: "50", bprice: "70", num: "0" }, { name: "安全装置检查", sprice: "25", mprice: "40", bprice: "60", num: "0" }, { name: "底盘动态检验", sprice: "10", mprice: "10", bprice: "10", num: "0" }, { name: "车辆底盘部件检查", sprice: "10", mprice: "10", bprice: "10", num: "0" }
    //   ]
    // },

    // {
    //   type: "仪器设备", stype: [
    //     { name: "行车制动", sprice: "35", mprice: "40", bprice: "50", num: "0" }, { name: "驻车制动", sprice: "20", mprice: "20", bprice: "30", num: "0" }, { name: "前车灯发光强度", sprice: "25", mprice: "30", bprice: "40", num: "0" }, { name: "前车灯远近光束垂直偏移", sprice: "10", mprice: "20", bprice: "30", num: "0" }, { name: "车速表指示误差", sprice: "5", mprice: "10", bprice: "20", num: "0" }, { name: "转向轮横向", sprice: "5", mprice: "10", bprice: "20", num: "0" }
    //   ]
    // },

    // {
    //   type: "尾气排放", stype: [
    //     { name: "一般工况", sprice: "100", mprice: "130", bprice: "180", num: "0" }, { name: "双怠速法 自由加速法", sprice: "100", mprice: "130", bprice: "180", num: "0" }
    //   ]
    // },
    // {
    //   type: "其他收费", stype: [
    //     { name: "其他收费", sprice: "30", mprice: "30", bprice: "30", num: "0" }
    //   ]
    // }
    //事件处理函数
    bindViewTap: function () {

    },
    onInput: function (e) {

    },
    onLoad: function (options) {
        let that = this;
        const {city} = options;
        that.setData({
            carnum: '京'
        })

        wx.request({
            url: app.d.hostApi + '/Api/Redetect/getRedetectInfo', //仅为示例，并非真实的接口地址
            data: {
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
                    let redetect = data.infos;
                    console.log(333, data);
                    /*let pricesArray = data.price.split(",");
                    let redetect = [
                      {
                        type: "人工检验", stype: [
                          { name: "车辆唯一性检查", sprice: pricesArray[0], mprice: pricesArray[1], bprice: pricesArray[2], num: "0" }, { name: "车辆特征参数检查", sprice: pricesArray[3], mprice: pricesArray[4], bprice: pricesArray[5], num: "0" }, { name: "车辆外观检查", sprice: pricesArray[6], mprice: pricesArray[7], bprice: pricesArray[8], num: "0" }, { name: "安全装置检查", sprice: pricesArray[9], mprice: pricesArray[10], bprice: pricesArray[11], num: "0" }, { name: "底盘动态检验", sprice: pricesArray[12], mprice: pricesArray[13], bprice: pricesArray[14], num: "0" }, { name: "车辆底盘部件检查", sprice: pricesArray[15], mprice: pricesArray[16], bprice: pricesArray[17], num: "0" }
                        ]
                      },

                      {
                        type: "仪器设备", stype: [
                          { name: "行车制动", sprice: pricesArray[18], mprice: pricesArray[19], bprice: pricesArray[20], num: "0" }, { name: "驻车制动", sprice: pricesArray[21], mprice: pricesArray[22], bprice: pricesArray[23], num: "0" }, { name: "前车灯发光强度", sprice: pricesArray[24], mprice: pricesArray[25], bprice: pricesArray[26], num: "0" }, { name: "前车灯远近光束垂直偏移", sprice: pricesArray[27], mprice: pricesArray[28], bprice: pricesArray[29], num: "0" }, { name: "车速表指示误差", sprice: pricesArray[30], mprice: pricesArray[31], bprice: pricesArray[32], num: "0" }, { name: "转向轮横向", sprice: pricesArray[33], mprice: pricesArray[34], bprice: pricesArray[35], num: "0" }
                        ]
                      },

                      {
                        type: "尾气排放", stype: [
                          { name: "一般工况", sprice: pricesArray[36], mprice: pricesArray[37], bprice: pricesArray[38], num: "0" }, { name: "双怠速法 自由加速法", sprice: pricesArray[39], mprice: pricesArray[40], bprice: pricesArray[41], num: "0" }
                        ]
                      },
                      {
                        type: "其他收费", stype: [
                          { name: "其他收费", sprice: pricesArray[42], mprice: pricesArray[43], bprice: pricesArray[44], num: "0" }
                        ]
                      }


                    ];*/
                    that.setData({redetect: redetect});
                } else {
                    console.log(333, data)
                    wx.showModal({
                        title: "错误提示",
                        content: data.msg,
                        showCancel: false
                    });
                }

            }, fail: function () {
                wx.hideLoading();
                wx.showModal({
                    title: "错误提示",
                    content: '网络请求超时，请重试!',
                    showCancel: false
                });
            }
        });

    },
    carClassRange: function (e) {
        if (e.detail.value == "客车") {
            this.setData({carClassCur: e.detail.value, carType: "小（微）型", cur_car_type: 1});
        }
        if (e.detail.value == "货车") {
            this.setData({carClassCur: e.detail.value, carType: "轻型", cur_car_type: 1});
        }
        if (e.detail.value == '摩托车') {
            this.setData({
                carClassCur: e.detail.value, carType: "普通正三轮", cur_car_type: 1
            })
        }

        this.caclCost();
    },
    payTypeRange: function (e) {
        this.setData({
            curPayType: e.detail.value
        })
    },
    radioChange1: function (e) {
        let that = this;
        this.caclCost();
        this.setData({carType: that.data.carType1[e.detail.value - 1].name, cur_car_type: e.detail.value}, () => {
            this.caclCost();
        });
    },
    radioChange2: function (e) {
        let that = this;
        this.caclCost();
        this.setData({carType: that.data.carType2[e.detail.value - 1].name, cur_car_type: e.detail.value}, () => {
            this.caclCost();
        });
    },
    radioChange3: function (e) {
        let that = this;
        this.caclCost();
        this.setData({carType: that.data.carType3[e.detail.value - 1].name, cur_car_type: e.detail.value}, () => {
            this.caclCost();
        })
    },
    formReset: function () {
        //console.log('form发生了reset事件')
    },


    /* 点击减号 */
    bindMinus: function (e) {
        let index = e.target.dataset.index.split("-");
        let num = e.target.dataset.num;
        let redetect = this.data.redetect;
        if (num > 0)
            num--;
        redetect[index[0]].stype[index[1]].num = num;
        this.setData({
            redetect: redetect
        });
        this.caclCost();
    },
    /* 点击加号 */
    bindPlus: function (e) {
        let index = e.target.dataset.index.split("-");
        let num = e.target.dataset.num;
        let redetect = this.data.redetect;
        num++;
        redetect[index[0]].stype[index[1]].num = num;
        this.setData({
            redetect: redetect
        });
        this.caclCost();
    },
    caclCost: function () {
        let redetect = this.data.redetect;
        let cur_car_type = this.data.cur_car_type;
        let curCarClass = this.data.carClassCur;
        let totalPrice = 0;
        if(curCarClass==='客车'||curCarClass==='货车') {
            if (cur_car_type == 1) {
                for (let i = 0; i < redetect.length; i++) {
                    for (let j = 0; j < redetect[i].stype.length; j++) {
                        totalPrice += parseInt(redetect[i].stype[j].sprice) * parseInt(redetect[i].stype[j].num);
                    }
                }
            }
            if (cur_car_type == 2) {
                for (let i = 0; i < redetect.length; i++) {
                    for (let j = 0; j < redetect[i].stype.length; j++) {
                        totalPrice += parseInt(redetect[i].stype[j].mprice) * parseInt(redetect[i].stype[j].num);
                    }
                }
            }
            if (cur_car_type == 3) {
                for (let i = 0; i < redetect.length; i++) {
                    for (let j = 0; j < redetect[i].stype.length; j++) {
                        totalPrice += parseInt(redetect[i].stype[j].bprice) * parseInt(redetect[i].stype[j].num);
                    }
                }
            }
        }else {
            for (let i = 0; i < redetect.length; i++) {
                for (let j = 0; j < redetect[i].stype.length; j++) {
                    totalPrice += parseInt(redetect[i].stype[j].cprice) * parseInt(redetect[i].stype[j].num);
                }
            }
        }
        console.log(333,totalPrice)
        this.setData({feeTotal: totalPrice});
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
        //console.log(res);
        let data = res.detail.data;
        let plateNum = data.plate_num;
        this.setData({carnum: plateNum});
    },
    formSubmit: function (e) {

        let that = this;
        //车牌号码检测
        let carnum = that.data.carnum;
        let reg_carnum = new RegExp(/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/);

        // if (!reg_carnum.test((carnum))) {
        //   wx.showModal({
        //     title: '错误提示',
        //     showCancel: false,
        //     content: "车牌号格式不正确,请检测重新输入"
        //   });
        //   return false;
        // }
        // if (that.data.feeTotal == 0) {
        //     wx.showModal({
        //         title: '错误提示',
        //         showCancel: false,
        //         content: "费用为0，请重新选择检测项"
        //     });
        //     return false;
        // }
        wx.showLoading({
            title: '预约提交中',
            mask: true,
        });
        wx.request({
            url: app.d.hostApi + `/Api/Redetect/firstPassOrderInfo`,
            data: {
                carNum: that.data.carnum,
                rd3_session: wx.getStorageSync('3rd_session'),
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                let data = res.data;
                if (data.success) {
                    let scene = data.data.scene;
                    wx.request({
                        url: app.d.hostApi + '/Api/Redetect/booking', //仅为示例，并非真实的接口地址
                        data: {
                            carnum: that.data.carnum,
                            feeTotal: that.data.feeTotal,
                            carClass: that.data.carClassCur,
                            cur_car_type: that.data.carType,
                            redetect: JSON.stringify(that.data.redetect),
                            rd3_session: wx.getStorageSync('3rd_session'),
                            scene,
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        method: 'POST',
                        success: function (res) {
                            console.log(333,res);
                            let data = res.data;
                            if (data.success) {
                                wx.hideLoading();
                                wx.showModal({
                                    title: "下单成功",
                                    content: data.msg,
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            wx.navigateBack({delta: 1});
                                        }
                                    }
                                });
                            } else {
                                wx.hideLoading();
                                wx.showModal({
                                    title: "错误提示",
                                    content: "下单失败，可能未存在初检订单",
                                    showCancel: false
                                });
                            }

                        }, fail: function () {
                            wx.hideLoading();
                            wx.showModal({
                                title: "错误提示",
                                content: '网络请求超时，请重试!',
                                showCancel: false
                            });
                        }
                    });
                } else {
                    wx.hideLoading();
                    wx.showModal({
                        title: "错误提示",
                        content: "下单失败，可能未存在初检订单",
                        showCancel: false
                    });
                }
                //console.log(that.data.carnum);
                //console.log(that.data.feeTotal);
            }, fail(res) {

            }
        })
    },
    jumpto: function () {
        wx.redirectTo({
            url: '/pages/book/checkstand?city=%E5%8C%97%E4%BA%AC'
        })
    }
})
