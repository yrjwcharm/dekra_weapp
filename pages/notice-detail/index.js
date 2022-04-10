// pages/my/index.js
const WxParse = require("../../wxParse/wxParse");
const util = require("../../utils/util");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        content: '',
        inputTime: '',
        photo: '',
        addr: "",
        isHidden: "",
        date: "",
        ewmUrl: "",
        info: "",
        wallpaperbg: app.d.hostStatic + "/Data/miniapp/wallpaper_newsbg.jpg",
        avatar: "",
        productname: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        const {id} = options;
        this._getNoticeDetail(id);
    },
    _getNoticeDetail(id) {
        let that = this;
        wx.request({
            url: app.d.hostApi + "/Api/Infos/noticeDetail?id=" + id,
            data: {},
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(333, res);
                const {success, data} = res.data;
                if (success) {
                    const {title, photo, content, inputtime} = data;
                    let image = '';
                    if (JSON.parse(photo)) {
                        image = JSON.parse(photo)[0];
                    }

                    // let image = photo&&JSON.parse(photo)[0];
                    console.log(333, app.d.hostStatic + image);
                    let inputTime = util.formatTime(new Date(inputtime * 1000));
                    that.setData({
                        title,
                        photo: app.d.hostStatic + image,
                        content,
                        inputTime
                    })
                }
            }
        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})
