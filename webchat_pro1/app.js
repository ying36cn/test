//app.js
App({
  globalData:{
    distinct:"ly_cource"
   },
  onLaunch: function () {
    try {
      const deviceInfo = wx.getStorageSync("deviceInfo")
      if(!deviceInfo){
        const res = wx.getSystemInfoSync()
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.windowWidth = res.windowWidth;
        wx.setStorageSync("deviceInfo", {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }else{
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.windowWidth = res.windowWidth;

      }
      
    } catch (e) {
      // Do something when catch error
    }



  },
 
})