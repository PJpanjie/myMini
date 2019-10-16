import Scratch from '../components/scratch/scratch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStart: true,
    txt: '开始刮奖'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.scratch = new Scratch(this, {
      canvasWidth: 197,
      canvasHeight: 72,
      imageResource: 'https://file.40017.cn/img140017cnproduct/cn/s/2018/miniprogram/dividemoney/head_img.jpg',
      maskColor: 'red',
      r: 4,
      awardTxt: '中大奖',
      awardTxtColor: '#3985ff',
      awardTxtFontSize: '24px',
      callback: () => {
        wx.showModal({
          title: '提示',
          content: `您中奖了`,
          showCancel: false,
          success: res => {
            this.scratch.reset()
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },

  onStart() {
    const { isStart } = this.data
    if (isStart) {
      this.scratch.start()
      this.setData({
        txt: '重新开始',
        isStart: false
      })
    } else {
      this.scratch.restart()
    }
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