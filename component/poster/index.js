const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    wallpaperbg: { // 图片
      type: String,
      value: ''
    },
    productpic: { // 图片
      type: String,
      value: ''
    },
    price: { // 价格
      type: String,
      value: ''
    },
    productname: { // 名称
      type: String,
      value: ''
    },
    codeimg: { // 二维码
      type: String,
      value: ''
    },
    gzhcodeimg: { // 二维码
      type: String,
      value: ''
    },
    title: { // 标题
      type: String,
      value: ''
    },
    addr: { // 地址
      type: String,
      value: ''
    },
    avatar: { // 用户头像
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    productCode: "",
    showpost: false,
    productCode: "" //二维码
  },

  ready: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下载产品图片
    getAvaterInfo: function() {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      that.setData({
        showpost: true
      })
      var productImage = that.data.wallpaperbg;
      if (productImage) {
        wx.downloadFile({
          url: productImage,
          success: function(res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var productSrc = res.tempFilePath;
              that.calculateImg(productSrc, function(data) {
                that.getProductInfo(productSrc, data);
              })
            } else {
              wx.showToast({
                title: '产品图片下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var productSrc = "";
                  that.getProductInfo(productSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var productSrc = "";
        that.getQrCode(productSrc);
      }
    },
    getProductInfo: function (productSrc, topdata) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      that.setData({
        showpost: true
      })
      var shopImage = that.data.productpic;
      //console.log(shopImage);
      if (shopImage) {
        wx.downloadFile({
          url: shopImage,
          success: function (res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var shopSrc = res.tempFilePath;
              that.getAvaInfo(productSrc, topdata, shopSrc);
              // that.calculateImg(shopSrc, function (data) {
                
              // })
            } else {
              wx.showToast({
                title: '产品图片下载失败！',
                icon: 'none',
                duration: 2000,
                success: function () {
                  var shopSrc = "";
                  that.getAvaInfo(productSrc, topdata, shopSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var shopSrc = "";
        that.getQrCode(productSrc, null, shopSrc);
      }
    },
    getAvaInfo: function (productSrc, topdata, shopSrc) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      that.setData({
        showpost: true
      })
      var avaImage = that.data.avatar;
      if (avaImage) {
        wx.downloadFile({
          url: avaImage,
          success: function (res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var avaSrc = res.tempFilePath;
              that.getQrCode(productSrc, topdata, shopSrc, avaSrc);
              // that.calculateImg(avaSrc, function (data) {

              // })
            } else {
              wx.showToast({
                title: '产品图片下载失败！',
                icon: 'none',
                duration: 2000,
                success: function () {
                  var avaSrc = "";
                  that.getQrCode(productSrc, null, shopSrc, avaSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var avaSrc = "";
        that.getAvaInfo(productSrc, topdata, shopSrc, avaSrc);
      }
    },
    //下载二维码
    getQrCode: function (productSrc, imgInfo = "", shopSrc, avaSrc) {
      //console.log(shopSrc);
      //console.log("shopSrc");
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      var productCode = that.data.codeimg;
      if (productCode) {
        wx.downloadFile({
          url: productCode,
          success: function(res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              that.getGzhQrCode(productSrc, codeSrc, imgInfo, shopSrc, avaSrc);
            } else {
              wx.showToast({
                title: '二维码下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var codeSrc = "";
                  that.getGzhQrCode(productSrc, codeSrc, imgInfo, shopSrc, avaSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var codeSrc = "";
        that.sharePosteCanvas(productSrc, codeSrc);
      }
    },

    //下载二维码
    getGzhQrCode: function (productSrc, codeSrc, imgInfo, shopSrc, avaSrc) {
      //console.log(shopSrc);
      //console.log("shopSrc");
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      var gzhcodeimg = that.data.gzhcodeimg;
      if (gzhcodeimg) {
        wx.downloadFile({
          url: gzhcodeimg,
          success: function (res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var gzhcodeimgUrl = res.tempFilePath;
              that.sharePosteCanvas(productSrc, codeSrc, imgInfo, shopSrc, avaSrc, gzhcodeimgUrl);
            } else {
              wx.showToast({
                title: '二维码下载失败！',
                icon: 'none',
                duration: 2000,
                success: function () {
                  var gzhcodeimgUrl = "";
                  that.sharePosteCanvas(productSrc, codeSrc, imgInfo, shopSrc, avaSrc, gzhcodeimgUrl);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var codeSrc = "";
        that.sharePosteCanvas(productSrc, codeSrc);
      }
    },

    //canvas绘制分享海报
    sharePosteCanvas: function (avaterSrc, codeSrc, imgInfo, shopSrc, avaSrc, gzhcodeimgUrl) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      })
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      var width = "";
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function(rect) {
        var height = rect.height;
        var right = rect.right;
        width = rect.width;
        var left = rect.left;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);

        //背景
        if (avaterSrc) {
          if (imgInfo) {
            var imgheght = parseFloat(imgInfo);
          }
          ctx.drawImage(avaterSrc, 0, 0, width, imgheght ? imgheght : width);
          ctx.setFontSize(14);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');
        }

        //头像
        if (avaSrc) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(width * 55 / 750 / 2 + width * 36 / 750, width * 55 / 750 / 2 + width * 22 / 750,  width*55/750 / 2, 0, Math.PI * 2, false);
          ctx.clip();
          ctx.drawImage(avaSrc, width * 36 / 750, width * 22 / 750, width * 55 / 750, width * 55 / 750);
          ctx.restore(); 
    
          //ctx.drawImage(avaSrc, width * 33 / 750, width * 20 / 750, width*55/750,width*55/750);
        }


        
        //商品图
        if (shopSrc) {
          ctx.drawImage(shopSrc, width*34/750, width*120/750, 677 / 750 * width, 466/750*width);
        }

        //标题
        if (that.data.title) {
          const CONTENT_ROW_LENGTH = 44; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.title).substr(0, 40), CONTENT_ROW_LENGTH);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#fff');
          ctx.setFontSize(14);
          let contentHh = 22 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], width * 35 / 750, width * 690 / 750+ contentHh * m);
          }
        }
        //设置地址
        if (that.data.addr) {
          const CONTENT_ROW_LENGTH = width * 2 * 0.6 / 10; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.addr).substr(0, 40), CONTENT_ROW_LENGTH);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#fff');
          ctx.setFontSize(10);
          let contentHh = 12 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], width * 35 / 750, width * 730 / 750 + contentHh * m);
          }
        }


        // //产品名称
        // if (that.data.productname) {
        //   const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
        //   let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.productname).substr(0, 40), CONTENT_ROW_LENGTH);
        //   ctx.setTextAlign('left');
        //   ctx.setFillStyle('#000');
        //   ctx.setFontSize(14);
        //   let contentHh = 22 * 1;
        //   for (let m = 0; m < contentArray.length; m++) {
        //     ctx.fillText(contentArray[m], 15, imgheght + 35 + contentHh * m);
        //   }
        // }


        // //产品金额
        // if (that.data.price || that.data.price == 0) {
        //   ctx.setFontSize(25);
        //   ctx.setFillStyle('#F57509');
        //   ctx.setTextAlign('left');
        //   var price = that.data.price;
        //   if (!isNaN(price)) {
        //     price = "¥" + that.data.price
        //   }
        //   ctx.fillText(price, left - 15, imgheght + 110); //电话
        // }


        


        //绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc, width * 460 / 750, width * 860 / 750, width / 3, width / 3)
          ctx.setFontSize(10);
          ctx.setFillStyle('#999999');
          ctx.fillText("微信扫码或长按保存图片", width * 460 / 750, width * 860 / 750 + 130);
        }
         //绘制二维码
        if (gzhcodeimgUrl) {
          ctx.drawImage(gzhcodeimgUrl, width * 525 / 750, width*600/750, width / 4, width / 4)
          // ctx.setFontSize(10);
          // ctx.setFillStyle('#000');
          // ctx.fillText("微信扫码或长按保存图片", width * 500 / 750 + 165, width*600/750 + 110);
        }
        ctx.draw();
        wx.hideLoading();
        //that.triggerEvent('myeventinit', "isHidden");
        
      }).exec();
      


    },

    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    //点击保存到相册
    saveShareImg: function() {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function(res) {
            wx.hideLoading();
            var tempFilePath = res.tempFilePath;

            // 图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (data) {
                wx.hideLoading()
                wx.showModal({
                  title: '图片已存入相册',
                  content: '好东西要分享，发给朋友们看看。',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      that.closePoste();
                    } 
                  }
                })
              },
              fail: function (err) {
                //console.log(err)
                if (err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' || err.errMsg === 'saveImageToPhotosAlbum:fail auth deny' || err.errMsg === 'saveImageToPhotosAlbum:fail authorize no response') {
                  // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                  wx.showModal({
                    title: '提示',
                    content: '需要您授权保存相册',
                    showCancel: false,
                    success: modalSuccess => {
                      wx.openSetting({
                        success(settingdata) {
                          //console.log('settingdata', settingdata)
                          if (settingdata.authSetting['scope.writePhotosAlbum']) {
                            wx.showModal({
                              title: '提示',
                              content: '获取权限成功,再次点击按钮即可保存',
                              showCancel: false
                            })
                          } else {
                            wx.showModal({
                              title: '提示',
                              content: '获取权限失败，将无法保存到相册！',
                              showCancel: false
                            })
                          }
                        },
                        fail(failData) {
                          //console.log('failData', failData)
                        },
                        complete(finishData) {
                          //console.log('finishData', finishData)
                        }
                      })
                    }
                  })
                }
              },
              complete(res) {
                wx.hideLoading()
              }
            })
          },
          fail: function(err) {
            //console.log(err)
          }
        }, that);
    },
    //关闭海报
    closePoste: function() {
      this.setData({
        showpost: false
      })
      // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', {
        showVideo: true
      })
      
    },


    //计算图片尺寸
    calculateImg: function(src, cb) {
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          wx.getSystemInfo({
            success(res2) {
              var ratio = res.width / res.height;
              var imgHeight = (res2.windowWidth * 0.85 / ratio);
              that.setData({
                imgHeight: imgHeight
              })
              cb(imgHeight);
            }
          })
        }
      })
    }
  }
})