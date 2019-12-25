//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    address: "点击选择，要勾选哦~",
    success:false 
  },
  staticData:{
    type:"buy"
  },
  onLoad: function () {
   
  },
  handleAddressClick: function() {
    wx.chooseLocation({
      success: this.handleChooseLocationSucc.bind(this)
    })
  },
  handleChooseLocationSucc(res){
    console.log(res);
    this.setData({
      address:res.address
    });
    Object.assign(this.staticData,{
        latitude: res.latitude,
        longitude: res.longitude
    })
  },
  handleTypechange(e){
    this.stacticData.type = e.detail.value;  
  },
  handleContactChange(e){
    this.staticData.contact = e.detail.value;
    console.log(e.detail.value)
  },
  handleMessageChange(e){
    this.staticData.message = e.detail.value;
  },
  handelSubmit(){
    if (this.data.address === "点击选择，要勾选哦~" || !this.data.address){
      wx.showToast({
        title: '请填写地址',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    if(!this.staticData.message){
      wx.showToast({
        title: '请填写说明信息',
        icon: 'loading',
        duration: 2000
      })
      return; 
  }
    if (!this.staticData.contact) {
      wx.showToast({
        title: '请填写联系人信息',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    const data = Object.assign({}, this.stacticData,{
        address: this.data.address,
        distinct:'ly_cource'
    })
    wx.request({
      url: 'https://nuanwan.wekeji.cn/student/index.php/trade/add_item', //仅为示例，并非真实的接口地址
      data: data,
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: this.handelSubmitSucc.bind(this)
    })
  },
  handelSubmitSucc(res){
   if(res.data && res.data.ret){
     this.setDta({
       success:true
     })
   }
  },
  handleBackTap(){
    wx.navigateBack({     
    })
  }
})
