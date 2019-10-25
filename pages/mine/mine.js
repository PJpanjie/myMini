let app = getApp();
let configUrl = require("../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMessage: '',  // 用户的基本信息
  },

  // 跳转到首页
  goIndexPage() {
    wx.redirectTo({
      url: '../carShare/carShare'
    })
  },

  // 切换模式
  changeRole(){
    let { userMessage } = this.data;
    let reqData = {
      id: userMessage.id,
      role: 1 - userMessage.empRole
    }

    wx.request({
      url: `${configUrl.url}/Employee/SwitchRole`,
      data: reqData,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data && res.data.StateCode == 200) {
          wx.showLoading({
            title: '加载中',
          })

          setTimeout(() => {
            wx.hideLoading()
            // 回首页
            this.goIndexPage();
          }, 2000)
        }
      },
      fail: function (error) {

      },
      complete: function () {

      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userMessage: app.globalData.mydata
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})