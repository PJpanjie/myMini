// pages/canvas/saveCanvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // toast
  showToast(txt) {
    wx.showToast({
      title: txt,
      icon: 'none',
      mask: true,
      duration: 2500
    })
  },

  test() {
    console.log('hahahahah')
  },

  // 保存图片按钮
  saveImageToPhotosAlbumBtn(){
    Promise.all([
      this.getImageInfo('https://img1.40017.cn/cn/s/2018/miniprogram/hehuoren/index/save_photo_bg2.jpg?v=1'),
      this.getImageInfo('https://img1.40017.cn/cn/s/2018/miniprogram/hehuoren/index/source_img.jpg'),
      this.getImageInfo('http://pic5.40017.cn/03/000/44/7d/rB5oQFvo5MSAZt03AADHMn_9CAo347.png'),
      // this.getImageInfo('http://pic5.40017.cn/01/001/65/15/rBANC1vpTw2ANQ_jAAFIugzc8aA754.bmp'),
      this.downloadFile('http://pic5.40017.cn/01/001/65/15/rBANC1vpTw2ANQ_jAAFIugzc8aA754.bmp')
    ]).then(res => {
      if(res && res.length){
        this.drawSavePic(res);
      }
    })
  },

  // 绘图主函数
  drawSavePic(imgObj){
    // 获取绘图上下文 context
    const context = wx.createCanvasContext('myCanvas');
    const baseWidth = this.data.baseWidAndHei.baseWidth;
    const baseHeight = this.data.baseWidAndHei.baseHeight;

    // 绘制背景
    // 不支持网络图片的，只支持本地图片
    context.drawImage(imgObj[0], 0, 0, 640 / baseWidth, 856 / baseHeight);
    // 绘制分享主图
    context.save();
    this.roundRect(context, 51 / baseWidth, 93 / baseHeight, 531 / baseWidth, 284 / baseHeight, 8 / baseWidth, '#fff');
    // 从原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。
    // 可以在使用 clip 方法前通过使用 save 方法对当前画布区域进行保存，并在以后的任意时间通过restore方法对其进行恢复。
    context.clip();
    context.drawImage(imgObj[1], 51 / baseWidth, 93 / baseHeight, 531 / baseWidth, 284 / baseHeight);
    context.restore();

    // 绘制分享标题
    context.setFillStyle('#333');
    context.setFontSize(16);
    let lineNum = this.showTxtLine(3, context, '迪555士尼迪2222士尼乐55迪555士尼迪2222士尼乐555园乐园迪士尼乐园5园乐园迪555士尼迪2222士尼乐555园乐园迪士尼乐园迪士尼乐园', baseWidth);
    lineNum.forEach((item, index) => {
      context.fillText(item, 51 / baseWidth, (430 + 40 * (index + 1)) / baseHeight);
    })

    // 绘制一句话描述
    context.setFillStyle('#cb9120');
    context.setFontSize(14);
    let des = this.showTxtLine(1, context, '迪士尼是儿童的天堂啊', baseWidth);
    let desHeight = 430 + 40 * (lineNum.length + 1) + 10;
    context.fillText(des[0], 51 / baseWidth, desHeight / baseHeight);

    // 绘制网络价文字
    context.setFillStyle('#9d9a99');
    context.setFontSize(12);
    context.fillText('网络价', 51 / baseWidth, (desHeight + 50) / baseHeight);

    // 绘制网络价的¥
    context.setFillStyle('#d09520');
    let netPriceWidth = context.measureText('网络价').width * baseWidth;
    context.fillText('¥', (51 + netPriceWidth + 3) / baseWidth, (desHeight + 50) / baseHeight);

    // 绘制网络价
    context.setFillStyle('#d09520');
    context.setFontSize(19);
    // 在字体改变之前先获取字体的宽度，不然获取的宽度是下一个字体改变后的宽度，就会不准确
    // 注意动态获取的数字类型
    let priceTxt = context.measureText(128 + '').width * baseWidth;
    context.fillText('128', (51 + netPriceWidth + 20) / baseWidth, (desHeight + 50) / baseHeight);

    // 绘制起字
    context.setFillStyle('#9d9a99');
    context.setFontSize(12);
    context.fillText('起', (51 + netPriceWidth + 20 + priceTxt) / baseWidth, (desHeight + 50) / baseHeight);

    // 绘制优惠价
    context.setFillStyle('#d09520');
    let qiTxt = context.measureText('起').width * baseWidth;
    let fontHasYh = context.measureText('已优惠 ¥').width * baseWidth;
    context.fillText('已优惠 ¥', (51 + netPriceWidth + 20 + priceTxt + qiTxt + 20) / baseWidth, (desHeight + 50) / baseHeight);
    context.setFontSize(19);
    context.fillText('36', (51 + netPriceWidth + 20 + priceTxt + qiTxt + 20 + fontHasYh + 6) / baseWidth, (desHeight + 50) / baseHeight);

    // 绘制门市价文字
    context.setFillStyle('#9d9a99');
    context.setFontSize(12);
    context.fillText('门市价', 51 / baseWidth, (desHeight + 100) / baseHeight);

    // 绘制门市价的¥
    let msPriceWidth = context.measureText('门市价').width * baseWidth;
    context.fillText('¥', (51 + msPriceWidth + 3) / baseWidth, (desHeight + 100) / baseHeight);

    // 绘制网络价
    context.setFontSize(19);
    // 在字体改变之前先获取字体的宽度，不然获取的宽度是下一个字体改变后的宽度，就会不准确
    let msPriceTxt = context.measureText(138 + '').width * baseWidth;
    context.fillText('138', (51 + msPriceWidth + 20) / baseWidth, (desHeight + 100) / baseHeight);

    // 绘制起字
    context.setFontSize(12);
    context.fillText('起', (51 + msPriceWidth + 20 + msPriceTxt) / baseWidth, (desHeight + 100) / baseHeight);
    
    // 门市价划横线
    context.save();
    context.setStrokeStyle('#9d9a99');
    context.moveTo(140 / baseWidth, (desHeight + 85) / baseHeight);
    context.lineTo((140 + msPriceTxt + 14) / baseWidth, (desHeight + 85) / baseHeight);
    context.stroke();
    context.restore();

    // 绘制小程序码
    context.save();
    this.roundRect(context, 415 / baseWidth, 445 / baseHeight, 165 / baseWidth, 165 / baseHeight, 10 / baseWidth, '#edcd7f');
    context.clip();
    context.drawImage(imgObj[2], 415 / baseWidth, 445 / baseHeight, 165 / baseWidth, 165 / baseHeight);
    context.restore();

    // // 绘制二维码
    // // context.save();
    // // this.roundRect(context, 415 / baseWidth, 445 / baseHeight, 165 / baseWidth, 165 / baseHeight, 10 / baseWidth, '#edcd7f');
    // // context.clip();
    // // context.drawImage(imgObj[3], 415 / baseWidth, 445 / baseHeight, 165 / baseWidth, 165 / baseHeight);
    // // context.restore();

    // 扫码识别
    context.setFillStyle('#999');
    context.setFontSize(11);
    context.fillText('扫码识别', 460 / baseWidth, 645 / baseHeight);

    // 即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面
    // draw 方法是异步的
    context.draw(true, () => {
      setTimeout(()=>{
        this.canvasToTempFilePath();
      },200)
    });
  },

  // 文字根据要展示的长度处理成数组
  txtArr(context, text, baseWidth) {
    let charArr = text.split(''),
      temp = '',
      lastTxtArr = [];

    charArr.forEach((item, index) => {
      if (context.measureText(temp).width < (300 / baseWidth)) {
        temp += item;
      } else {
        lastTxtArr.push(temp);
        // 临界的最后一个字保存赋值
        temp = item;
      }
    })

    // 最后的一个数组，不超过展示长度的
    lastTxtArr.push(temp);
    return lastTxtArr;
  },

  // 要展示多少行文字+...
  showTxtLine(num, context, text, baseWidth) {
    let lastTxtArr = this.txtArr(context, text, baseWidth),
      lastLine = '';

    let cutTxtArr = lastTxtArr.length > num ? lastTxtArr.slice(0, num) : lastTxtArr;

    let lastLineArr = cutTxtArr[cutTxtArr.length - 1].split('');
    for (let item of lastLineArr) {
      if (context.measureText(lastLine).width < (280 / baseWidth)) {
        lastLine += item;
      }else {
        lastLine = lastLine + '...';
        break;
      }
    }

    cutTxtArr[cutTxtArr.length - 1] = lastLine;
    return cutTxtArr
  },

    // 绘制圆角矩形 开始位置，长宽，radius，边框颜色
  roundRect(context, x, y, w, h, r, c){
    context.setStrokeStyle(c);
    context.setLineWidth(3);

    context.beginPath();
    context.moveTo(x, y + r);
    context.arc(x + r, y + r, r, Math.PI, Math.PI * 3 / 2);
    context.lineTo(x + w - r, y);
    context.arc(x + w - r, y + r, r, -Math.PI / 2,0);
    context.lineTo(x + w, y + h - r);
    context.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    context.lineTo(x + r, y + h);
    context.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    context.closePath();

    context.stroke();
  },

  // 获取系统信息
  getSystemInfo() {
    // return new Promise((resolve, reject) => {
    //   wx.getSystemInfo({
    //     success(res) {
    //       let baseWidAndHei = {
    //         baseWidth: 750 / res.screenWidth,
    //         baseHeight: 1334 / res.screenHeight
    //       };
    //       resolve(baseWidAndHei);
    //     },
    //     fail(res) {
    //       reject(res);
    //     }
    //   })
    // })

    try {
      const res = wx.getSystemInfoSync()
      let baseWidAndHei = {
        baseWidth: 750 / res.screenWidth,
        baseHeight: 1334 / res.screenHeight
      };
      this.setData({
        baseWidAndHei: baseWidAndHei
      })
    } catch (e) {
      // Do something when catch error
    }
  },

  // 获取图片信息。网络图片需先配置download域名才能生效。
  getImageInfo(img) {
    img = img && img.replace('http:', 'https:');
    return new Promise((resolve,reject) => {
      wx.getImageInfo({
        src: img,
        success(res) {
          if (res && res.path){
            resolve(res.path);
          }
        },
        fail(res){
          reject(res)
        }
      })
    })
  },

  // 下载文件资源到本地
  downloadFile(img) {
    img = img && img.replace('http:', 'https:');
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: img,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          }
        },
        fail(res) {
          reject(res);
        }
      })
    })
  },

  // 把当前画布指定区域的内容导出生成指定大小的图片
  // 在 draw() 回调里调用该方法才能保证图片导出成功。
  canvasToTempFilePath() {
    const baseWidth = this.data.baseWidAndHei.baseWidth;
    const baseHeight = this.data.baseWidAndHei.baseHeight;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      // width: 640,
      // height: 856,
      // destWidth: 640,  
      // destHeight: 856,
      success: (res) => {
        if (res && res.tempFilePath){
          this.setData({
            canvasLink: res.tempFilePath
          },()=>{
            this.getSetting();
          })
          
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  // 查看是否授权
  getSetting(){
    wx.getSetting({
      success:(res) => {
        // 当用户授权过或者用户还没有开始进行授权操作的时候
        if (res.authSetting['scope.writePhotosAlbum'] || res.authSetting['scope.writePhotosAlbum'] == undefined){
          this.saveImageToPhotosAlbum();
        }else {
          // this.openSetting();
        }
      }
    })
  },

  // 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
  openSetting(){
    wx.openSetting({
      success: (res) => {
        if (res.authSetting && res.authSetting['scope.writePhotosAlbum']) {

        } else {
          console.log('授权失败')
        }
      }
    })
  },

  // 保存图片到系统相册
  saveImageToPhotosAlbum() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.canvasLink,  // 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})