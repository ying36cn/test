//index.js
//获取应用实例
const app = getApp();

Page({
  onReady(){
    this.mapCtx = wx.createMapContext('map', this)

  },
  onShareAppMessage(){
    return {
      title:'萌宠交易平台',
      path:'/pages/index/index'
    }
  },
  data: {
    longitude: "",
    latitude: "",
    markers: [],
    controls: [{
      id: 1,
      iconPath: '/resources/map.png',
      position: {
        left: (app.globalData.windowWidth / 2)- 15,
        top: (app.globalData.windowHeight / 2) -50,
        width: 30,
        height:30
      },
    },
     {
        id: 2,
       iconPath: '/resources/location.png',
        position: {
          left: 20,
          top: app.globalData.windowHeight - 90,
          width: 30,
          height: 30
        },
        clickable: true
      }
    ]
  },
  onShow(){
    this.getLocation();    
    this.getMessages();
  }, 
  getMessages(){
    // wx.request({
    //   url: 'https://nuanwan.wekeji.cn/student/index.php/trade/get_list', //仅为示例，并非真实的接口地址
    //   data: {
    //     distinct: app.globalData.distinct
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: this.getMessagesSucc.bind(this)
    // })
    this.getMessagesSucc();
  },
  getMessagesSucc(res){   
     
    var res = {"data":{
      "data": [{
        iconPath: "/resources/sell.png",
        id: "00000000000000724",
        type: "sell",
        latitude: "23.13908",
        longitude: "113.28436",
        width: 30,
        height: 30
      },
       {
         iconPath: "/resources/buy.png",
         id: "00000000000000725",
         type: "buy",
         latitude: "23.147233",
         longitude: "113.270754",
         width: 40,
         height:40
       }
      ]

    }
     
    }
    
    const data = res.data.data;    
    const markers = data.map((value,index)=>{
     return {      
       iconPath: value.iconPath,
         id: value.id,
         latitude: value.latitude,
         longitude: value.longitude,
         width: 26,
         height: 26      
     }
    })
    console.log(markers)  
    this.setData({
      markers: markers
    })
 

  },
  getLocation(){
    wx.getLocation({
      type: 'gcj02',      
      success: this.handleGetLocationSucc.bind(this),
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  handleGetLocationSucc(res){
    this.setData({
      longitude: res.longitude,
      latitude: res.latitude
    })
    console.log(res);
  },
  controltap(){
    this.mapCtx.moveToLocation();
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  handleMarkerTap(e){
    wx.navigateTo({
      url: '/pages/detail/detail?id='+ e.markerId,
    })
  }
})
