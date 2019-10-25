let configUrl = require("../utils/config.js");
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passengerId: 0,
    driverId: 0,
    status: -1,  // -1 全部订单、0-待出行、3-进行中
    listData: [],
    fromLocation: '',
    toLocation: '',
    date: '',
    userMessage: '',
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
    let { userMessage } = this.data;
    this.setData({
      status: index,
      listData: []
    },()=>{
      if (userMessage && userMessage.empRole == 0) {
        this.getIngOrder();
      } else {
        let num = -1;
        if(index == 3){
          num = 1;
        } else if (index == -1){
          num = 0;
        }else {
          num = -1;
        }
        this.getRecommendOrder(num);
      }
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

  // 车主获取推荐订单
  getRecommendOrder(sex){
    let { fromLocation, toLocation, userMessage, date } = this.data;
    let reqData = {
      FromLat: fromLocation.latitude,
      FromLng: fromLocation.longitude,
      ToLat: toLocation.latitude,
      ToLng: toLocation.longitude,
      IsSingle: '-1',
      SexType: sex,
      Date: date,
      UserId: userMessage.id
    }

    wx.showLoading({
      title: '加载中',
    })

    this.setData({
      listData: []
    })

    wx.request({
      url: `${configUrl.url}/Car/GetOrderListByDriver`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        // 成功后去列表页
        if (res && res.data && res.data.StateCode == 200) {
          this.setData({
            listData: res.data.OrderList
          })
        }
        wx.hideLoading();
      },
      fail: function (error) {
        wx.hideLoading();
      },
      complete: function () {

      }
    });
  },

  // 更改状态
  operateOrder(e){
    // 0-待接单，1-已接单、2-乘客已确认、3-进行中、4-已完成、5-已点评、6-取消
    let { driverId, status, userMessage } = this.data;
    let { item, type } = e.currentTarget.dataset;

    // 待支付 是取消订单
    if (item.status == 0) {
      status = 6;
    }

    // 取消订单时不需要 不需要传driverId
    else if (item.status == 6) {
      driverId = 0;
    } else if (userMessage.empRole == 1){
      status = 1;
    } else if (item.status == 1){
      if (type == 'refuse'){
        status = 0;
      } else if (type == 'sure'){
        status = 2;
      }
    }

    let reqData = {
      id: userMessage.empRole == 1 ? item.Id : item.id,
      driverId,  // 车主Id（取消订单时不需要）
      status
    }

    wx.request({
      url: `${configUrl.url}/Order/EditOrderStatus`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        // 成功后去列表页
        if (res && res.data && res.data.StateCode == 200) {
          wx.showLoading({
            title: '加载中',
          })

          setTimeout(() => {
            wx.hideLoading()
            if (userMessage.empRole == 0){
              this.getIngOrder();
            }else {
              this.getRecommendOrder();
            }
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
      passengerId: options.passengerId || 0,
      status: options.status || -1,
      driverId: options.driverId || 0
    })

    this.setData({
      fromLocation: app.globalData.fromLocation || '',
      toLocation: app.globalData.toLocation || '',
      date: app.globalData.date || '',
      userMessage: app.globalData.mydata || '',
    },()=>{
      console.log(app.globalData.mydata)
      if (app.globalData.mydata && app.globalData.mydata.empRole == 0) {
          this.getIngOrder();
        } else {
          this.getRecommendOrder(-1);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})