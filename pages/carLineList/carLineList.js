let configUrl = require("../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passengerId: 0,
    driverId: 0,
    status: -1,  // -1 全部订单、0-待出行、3-进行中
    listData: []
  },

  // 拨打电话
  toCallTel(){
    wx.makePhoneCall({
      phoneNumber: '4007971717'
    })
  },

  //tab切换
  tabClick(e){
    let { index } = e.currentTarget.dataset;
    this.setData({
      status: index,
      listData: []
    },()=>{
      this.getIngOrder();
    })
  },

  // 获取正在进行的订单
  getIngOrder() {
    let { passengerId, status, driverId } = this.data;
    let reqData = {
      passengerId,
      status,
      driverId
    }

    wx.request({
      url: `${configUrl.url}/Order/MyOrderList`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        // 成功后去列表页
        if (res && res.data && res.data.stateCode == 200){
          console.log(res.data)
          let listData = res.data.list;
          for (let item of listData){
            item['statusName'] = '';
            switch (Number(item.status)){
              case 0:
                item.statusName = '待接单'
                break;
              case 1:
                item.statusName = '已接单'
                break;
              case 2:
                item.statusName = '乘客已确认'
                break;
              case 3:
                item.statusName = '进行中'
                break;
              case 4:
                item.statusName = '已完成'
                break;
              case 5:
                item.statusName = '已点评'
                break;
              case 6:
                item.statusName = '取消'
                break;
              default:
                item.statusName = ''
            }
          }
          this.setData({
            listData
          })
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
      passengerId: options.passengerId || 0,
      status: options.status || -1,
      driverId: options.driverId || 0
    },()=>{
      this.getIngOrder();
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