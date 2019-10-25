let configUrl = require("../utils/config.js");
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromLocation: {
      latitude: 0,
      longitude: 0,
    },
    toLocation: {
      latitude: 0,
      longitude: 0,
    },
    markers: [],
    polyline: [],
    // 上传图片
    // localUploadImg: [],
    date: '',  // 当前日期
    time: '',  // 当前时间
    peopleNum: [1,2,3,4],  // 人数列表数量
    rideNum: 1,  // 选择的乘车人数
    isTodayPara: true,  // 判断是否为今天
    showDateTimePannel: false,
    showSelectPeopleNumPannel: false,
    showSearchPannel: false,
    topMove: false,
    fromLocationName: '',  // 从哪里出发
    toLocation: '',  // 到哪里
    searchInputValue: '',  // 搜索的key值
    searchData: [],  // 搜索出来的数据列表
    labelSelect: null,  // 乘客选择司机性别
    pinPrice: 0,  // 获取拼车的价格
    userMessage: 0,  // 用户信息
    aftenLine: [],  // 常用线路
    noFinishData: [],  // 未完成订单
  },

  // 移动位置
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  // 移动标注
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },

  // 缩放视野
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },

  // 获取ip
  getIp(){
    var that = this;
    wx.request({
      url: 'http://ip-api.com/json',
      success: function (e) {
        console.log(e.data);
      }
    })
  },

  // 添加图片
  addImg: function () {
    let { localUploadImg} = this.data;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        localUploadImg = localUploadImg.concat(res.tempFilePaths);
        this.setData({
          localUploadImg
        })
      },
      fail: () => {
        
      }
    })
  },

  //删除图片
  deleteImg: function (e) {
    let { localUploadImg } = this.data;
    localUploadImg.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      localUploadImg
    })
  },


  // 获取用户位置
  getLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        let fromLocation = {
          latitude: res.latitude,
          longitude: res.longitude
        }

        let markers = [
          {
            latitude: res.latitude,
            longitude: res.longitude
          }
        ]

        this.setData({
          fromLocation,
          markers
        },()=>{
          this.getAddressBylnglat();
        })
      }
    })
  },

  // 逆地址解析
  getAddressBylnglat(){
    let { fromLocation } = this.data;
    let reqData = {
      Location: `${fromLocation.latitude},${fromLocation.longitude}`
    }

    wx.request({
      url: `${configUrl.url}/Car/GetAddressBylnglat`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data && res.data.Address){
          this.setData({
            fromLocationName: res.data.Address
          })
        }
      },
      fail: function (error) {

      },
      complete: function () {

      }
    });
  },

  // 输入事件
  searchingFn(e) {
    let value = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
    let { type } = e.currentTarget.dataset;

    if (type == 'fromInput'){
      this.setData({
        fromLocationName: value,
        topMove: true,
      });
    } else if (type == 'toInput'){
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
    }else {
      //  关闭面板
      this.setData({
        showSearchPannel: false
      })
    }
  },

  // 关键字输入提示
  getSuggestionList(value){
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

  // 选择搜索出来的数据
  selectSearchData(e){
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
    },()=>{
      // 开始和目的地都有数据
      if (fromLocationName.length && searchInputValue.length){
        this.dateTimePannelType();  // 打开日期和时间面板
      }
    })
  },

  // 打开日期时间面板
  dateTimePannelType(e) {
    let { showDateTimePannel, fromLocationName, searchInputValue, fromLocation, toLocation } = this.data;

    let item = '';
    if (e && e.currentTarget && e.currentTarget.dataset){
      item = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.item;
    }

    let polyline = [];

    if(item){
      this.setData({
        fromLocationName: item.startPoint,
        searchInputValue: item.endPoint,
        fromLocation: {
          latitude: item.origin.split(',')[0],
          longitude: item.origin.split(',')[1]
        },
        toLocation: {
          latitude: item.destination.split(',')[0],
          longitude: item.destination.split(',')[1]
        }
      })

      polyline = [{
        points: [{
          longitude: item.origin.split(',')[1],
          latitude: item.origin.split(',')[0]
        }, {
          longitude: item.destination.split(',')[1],
          latitude: item.destination.split(',')[0]
        }],
        color: "#FF0000DD",
        width: 6
      }]

    }else {
      this.setData({
        fromLocationName,
        searchInputValue,
        fromLocation: {
          latitude: fromLocation.latitude,
          longitude: fromLocation.longitude
        },
        toLocation: {
          latitude: toLocation.latitude,
          longitude: toLocation.longitude
        }
      })

      polyline = [{
        points: [{
          longitude: fromLocation.longitude,
          latitude: fromLocation.latitude
        }, {
            longitude: toLocation.longitude,
            latitude: toLocation.latitude
        }],
        color: "#FF0000DD",
        width: 6
      }]
    }

    this.setData({
      showDateTimePannel: !showDateTimePannel,
      polyline
    })
  },

  // 获取当前时间
  getTime() {
    let timeDate = new Date().toLocaleDateString();
    let date = timeDate.replace(/\//g, '-');
    let time = new Date().getHours() + ':' + new Date().getMinutes()

    let isTodayPara = this.isToday(date);
    this.setData({
      date,
      time,
      isTodayPara
    })
  },

  // 判断是否为今天
  isToday(str) {
    var d = new Date(str.replace(/-/g, "/"));
    var todaysDate = new Date();
    if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  },

  // 修改日期数据
  bindDateChange: function (e) {
    let isTodayPara = this.isToday(e.detail.value);
    this.setData({
      date: e.detail.value,
      isTodayPara
    })
  },

  // 修改时间数据
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  // 车主身份的话发起搜索
  startSearch(){
    let { fromLocation, toLocation, date} = this.data;
    app.globalData.fromLocation = fromLocation;
    app.globalData.toLocation = toLocation;
    app.globalData.date = date;
    
    this.goMyLinePage();

    // 关闭弹框
    this.setData({
      showDateTimePannel: false,
      showSelectPeopleNumPannel: false
    })
  },

  // 打开人数选择面板
  peopleNumSelectPannelType() {
    let { showSelectPeopleNumPannel, showDateTimePannel } = this.data;
    this.setData({
      showDateTimePannel: false,
      showSelectPeopleNumPannel: !showSelectPeopleNumPannel
    },()=>{
      this.getMoneyNumber();
    })
  },

  // 点击选择人数
  selectRideNum(e){
    let {index} = e.currentTarget.dataset;
    this.setData({
      rideNum: index + 1
    })
  },

  // 勾选标签
  selectLabel(e){
    let { type } = e.currentTarget.dataset;
    this.setData({
      labelSelect: type
    })
  },

  // 获取拼车价格
  getMoneyNumber(){
    let { fromLocation, toLocation } = this.data;
    let reqData = {
      FromLocation: `${fromLocation.latitude},${fromLocation.longitude}`,
      ToLocation: `${toLocation.latitude},${toLocation.longitude}`
    }

    wx.request({
      url: `${configUrl.url}/Car/GetMoneyNumber`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data) {
          this.setData({
            pinPrice: res.data.Money
          })
        }
      },
      fail: function (error) {

      },
      complete: function () {

      }
    });
  },

  // 获取人员信息
  getEmployeeById(){
    let reqData = {
      id: '1'
    }

    wx.request({
      url: `${configUrl.url}/Employee/GetEmployeeById`,
      data: reqData,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data && res.data.StateCode == 200){
          this.setData({
            userMessage: res.data.Employee
          },()=>{
            this.getLineListByEmpId(res.data.Employee.id);
            this.getIngOrder();

            // 存储信息到全局变量。方便在我的里面使用
            app.globalData.mydata = res.data.Employee;
          })
        }
      },
      fail: function (error) {

      },
      complete: function () {

      }
    });
  },

  // 获取常用线路
  getLineListByEmpId(empRole) {
    let reqData = {
      empId: empRole  // 0是乘客，1是车主
    }

    wx.request({
      url: `${configUrl.url}/Line/GetLineListByEmpId`,
      data: reqData,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data && res.data.StateCode == 200 && res.data.LineList && res.data.LineList.length) {
          let aftenLine = res.data.LineList;
          // 处理日期格式
          for (let item of aftenLine){
            if (item.takeTime && item.takeTime.split(' ').length > 1){
              item.takeTime = item.takeTime.split(' ')[1];
            }
          }
          this.setData({
            aftenLine
          })
        }
      },
      fail: function (error) {

      },
      complete: function () {

      }
    });
  },

  // 跳转我的页面
  goMyPage(){
    let { userMessage } = this.data;

    // 如果是乘客，传乘客参数，如果是车主，传车主参数
    let passengerId = 0;
    let driverId = 0;

    if (userMessage && userMessage.empRole == 0) {
      passengerId = userMessage.id
    } else if (userMessage.empRole == 1) {
      driverId = userMessage.id
    }
    wx.redirectTo({
      url: `../mine/mine?passengerId=${passengerId}&driverId=${driverId}`
    })
  },

  // 跳转我的订单页面
  goMyLinePage() {
    let { userMessage } = this.data;

    // 如果是乘客，传乘客参数，如果是车主，传车主参数
    let passengerId = 0;
    let driverId = 0;

    if (userMessage && userMessage.empRole == 0) {
      passengerId = userMessage.id
    } else if (userMessage.empRole == 1) {
      driverId = userMessage.id
    }
    wx.navigateTo({
      url: `../carLineList/carLineList?passengerId=${passengerId}&status=0&driverId=${driverId}`
    })
  },

  // 只有乘客可以发布行程，车主只可以查询
  passengerReleaseOrder(){
    let { userMessage, fromLocation, toLocation, fromLocationName, searchInputValue, rideNum, date, time, labelSelect} = this.data;
    let reqData = {
      "passengerId": userMessage.id,
      "startLon": fromLocation.longitude,
      "startLat": fromLocation.latitude,
      "endLon": toLocation.longitude,
      "endLat": toLocation.latitude,
      "startPoint": fromLocationName,
      "endPoint": searchInputValue,
      "passengerNum": rideNum,
      "startDateTime": `${date} ${time}`,
      "sex": labelSelect
    }

    wx.request({
      url: `${configUrl.url}/Order/AddOrder`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data && res.data.StateCode == 200){
          // 成功后去列表页
          this.goMyLinePage();
        }
      },
      fail: function (error) {

      },
      complete: function () {

      }
    });
  },

  // 获取正在进行的订单
  getIngOrder(){
    let { userMessage } = this.data;

    // 如果是乘客，传乘客参数，如果是车主，传车主参数
    let passengerId = 0;
    let driverId = 0;

    if (userMessage && userMessage.empRole == 0){
      passengerId = userMessage.id
    } else if (userMessage.empRole == 1){
      driverId = userMessage.id
    }

    let reqData = {
      passengerId,
      status: 3,
      driverId,
    }

    wx.request({
      url: `${configUrl.url}/Order/MyOrderList`,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res && res.data && res.data.stateCode == 200) {
          this.setData({
            noFinishData: res.data.list
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
    this.getLocation();
    this.getTime();
    this.getEmployeeById();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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