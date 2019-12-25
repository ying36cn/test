/*search*/
const app = getApp();
Page({
  data:{
    list:[]    
  }, 
  staticData:{
    inputValue: ""
  },
  onLoad(){
    this.getSearchResult();
  },
  getSearchResult(){
    // wx.request({
    //   url: 'https://nuanwan.wekeji.cn/student/index.php/trade/get_search', //仅为示例，并非真实的接口地址
    //   data: {
    //     distinct: app.globalData.distinct,
    //     keyword: this.staticData.inputValue
    //   },
    //   method: "post",
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: this.getSearchResultSucc.bind(this)
    // })
    this.getSearchResultSucc();
  },
  getSearchResultSucc(res){
    if(res && res.data && res.data.ret){
      const result = res.data.data;
      this.setData({
        list:result
      })
    }else{
      this.setData({
        list:[]
      })
    }
    //测试数据
    // var res = {
    //   ret:true,
    //   data:{
    //     data:[
    //       {
    //       id:"12131",
    //       address: "广东省广州市越秀区府前路1号",
    //       latitude: 23.12908,
    //       longitude: 113.26436,
    //       name: "越秀区市政府广场(府前路北)",
    //       type: 'sell',
    //       message: "交易说明",
    //       contact: "1523152"

    //     },{
    //       id:"12132",
    //       address: "广东省广州市越秀区府前路2号",
    //       latitude: 23.12908,
    //       longitude: 113.26436,
    //       name: "越秀区市政府广场(府前路北)",
    //       type: 'sell',
    //       message: "交易说明",
    //       contact: "1523152"

    //     }
    //     ]
    //   }
    // }
  
    const result = res.data.data;
    this.setData({
      list:result
    })    
  },
  handleInputChange(e){
    console.log(e);
    this.staticData.inputValue = e.detail.value;

  },
  handleSearch(){
    this.getSearchResult();
  },
  handleItemTap(e){
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.id,
    })
   
  }
  
  
})