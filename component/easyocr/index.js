const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    certificateType: {
         type: String
    },
    text: {
         type: String
    },
    class: {
         type: String
    },
    size: {
         type: String
    },
    type: {
         type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  ready: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    ocrAction:function(){
      let cardType = this.properties.certificateType;
      let that = this;
       wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
         sourceType: ['album','camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          wx.showLoading({ title: '图像上传并识别中',mask:true});
          wx.uploadFile({
            url: app.d.hostApi + '/Api/Ocr/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              'type': cardType
            },
            success: function (res) {
              let data = JSON.parse(res.data);
              if (data.success) {
                // wx.showLoading({ title: '图像识别中',mask:true});
                wx.request({
                  url: app.d.hostApi + '/Api/Ocr/ocring', //仅为示例，并非真实的接口地址
                  method: "POST",
                  data: {
                    url: app.d.hostApi + data.url,
                    type:cardType
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  success(res2) {
                    let data = res2.data;
                    if (data.success) {
                      wx.hideLoading();
                     that.triggerEvent('onSuccess',{"success":true,"data":data});
                    }
                    else {
                      wx.hideLoading();
                      that.triggerEvent('onSuccess',{"success":false,"msg":data.msg});

                    }
                  },
                  fail:function(){
                    wx.hideLoading();
                    that.triggerEvent('onSuccess',{"success":true,"msg":"网络请求失败"});
                  }
                  //,
                  // complete:function(){
                  //   wx.hideLoading();
                  // }
                })

              } else {
                wx.hideLoading();
                that.triggerEvent('onSuccess',{"success":false,"msg":data.msg});

              }
            },
            fail:function(){
              wx.hideLoading();
              that.triggerEvent('onSuccess',{"success":true,"msg":"网络请求失败"});
            },
           
          });
        }
      });
    },
  }
})