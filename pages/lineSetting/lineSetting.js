let configUrl = require("../utils/config.js");
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMessage: '',
    fromLocationName: '',  // 从哪里出发
    fromLocation: {
      latitude: 0,
      longitude: 0,
    },
    toLocation: {
      latitude: 0,
      longitude: 0,
    },
    date: new Date().toLocaleDateString().replace(/\//g, '-'),   // 当前日期
    workTime: '09:15',
    offWorkTime: '06:15',
    showSearchPannel: false,
    topMove: false,
    fromLocationName: '',  // 从哪里出发
    toLocation: '',  // 到哪里
    searchInputValue: '',  // 搜索的key值
    searchData: [],  // 搜索出来的数据列表
  },

  // 修改上班时间数据
  bindWorkTimeChange: function (e) {
    this.setData({
      workTime: e.detail.value
    })
  },

  // 修改下班时间数据
  bindOffWorkTimeChange: function (e) {
    this.setData({
      offWorkTime: e.detail.value
    })
  },

  // 输入事件
  searchingFn(e) {
    let value = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
    let { type } = e.currentTarget.dataset;

    if (type == 'fromInput') {
      this.setData({
        fromLocationName: value,
        topMove: true,
      });
    } else if (type == 'toInput') {
      this.setData({
        searchInputValue: value,
        topMove: false
      });
    }

    if (value && value.length > 0) {
      // 展示面板
      this.setData({
        showSearchPannel: true
      })

      setTimeout(() => {
        value = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
        if (this.data.searchInputValue == value || this.data.fromLocationName == value) {
          this.getSuggestionList(value);
        }
      }, 500)
    } else {
      //  关闭面板
      this.setData({
        showSearchPannel: false
      })
    }
  },

  // 选择搜索出来的数据
  selectSearchData(e) {
    let { title, location } = e.currentTarget.dataset;
    let { fromLocation, fromLocationName, searchInputValue, topMove } = this.data;

    let polyline = [{
      points: [{
        longitude: fromLocation.longitude,
        latitude: fromLocation.latitude
      }, {
        longitude: location.Lng,
        latitude: location.Lat
      }],
      color: "#FF0000DD",
      width: 6
    }]

    if (topMove) {
      this.setData({
        fromLocationName: title,
        fromLocation: {
          latitude: location.Lat,
          longitude: location.Lng
        },
      });
    } else {
      this.setData({
        searchInputValue: title,
        toLocation: {
          latitude: location.Lat,
          longitude: location.Lng
        },
      });
    }

    this.setData({
      toLocation: {
        latitude: location.Lat,
        longitude: location.Lng
      },
      showSearchPannel: false, // 关闭面板
      polyline
    }, () => {
      // 开始和目的地都有数据
      if (fromLocationName.length && searchInputValue.length) {
        this.dateTimePannelType();  // 打开日期和时间面板
      }
    })
  },

  // 关键字输入提示
  getSuggestionList(value) {
    let reqData = {
      Keyword: value,
      Location: ''
    }

    wx.request({
      url: `${configUrl.url}/Car/GetSuggestionList`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data && res.data.StateCode == 200 && res.data.List) {
          this.setData({
            searchData: res.data.List
          })
        }
      },
      fail: function (error) {

      },
      complete: function () {

      }
    });
  },

  // 打开日期时间面板
  dateTimePannelType(e) {
    let { showDateTimePannel } = this.data;

    this.setData({
      showDateTimePannel: !showDateTimePannel
    })
  },

  // 提交行程设置
  setLineSetting(){
    let { userMessage, fromLocation, toLocation, date, workTime, offWorkTime, fromLocationName, searchInputValue } = this.data;
    let reqData = {
      empId: userMessage.id,
      origin: `${fromLocation.latitude},${fromLocation.longitude}`,
      destination: `${toLocation.latitude},${toLocation.longitude}`,
      publishTime: '',
      takeTime: '',
      startPoint: fromLocationName,
      endPoint: searchInputValue,
      workTime: `${date} ${workTime}`,
      overTime: `${date} ${offWorkTime}`,
    }

    wx.request({
      url: `${configUrl.url}/Line/AddLine`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data && res.data.StateCode == 200) {
          wx.navigateBack({
            delta: 1
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