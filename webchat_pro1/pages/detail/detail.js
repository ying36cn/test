/*detail*/
const app = getApp();
const header = require('../../components/header/header.js');
const data = Object.assign({},header.data,{
  address: "",
  type: "",
  message: "",
  contact: ""
})

const config = Object.assign({},header,{
  data:data,
  onLoad(options){
    this.getDetailInfo(options.id);
    console.log(options.id)
  },
  getDetailInfo(id){
    // wx.request({
    //   url: 'https://nuanwan.wekeji.cn/student/index.php/trade/get_items', //仅为示例，并非真实的接口地址
    //   data: {
    //     distinct: app.globalData.distinct,
    //     id: id
    //   },
    //   method:"post",
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: this.getDetailSucc.bind(this)
    // })
    this.getDetailSucc()
  },
  getDetailSucc(res){
    var res = {
      data:{
        data:{
          address: "广东省广州市越秀区府前路1号",
          latitude: 23.12908,
          longitude: 113.26436,
          name: "越秀区市政府广场(府前路北)",
          type:"sell",
          message: "交易说明",
          contact: "1523152"
        }
      }
     
    }
    const result = res.data.data;
    console.log(result)
    this.setData({
      address: result.address ? result.address : "",
      type: result.type ? result.type :"",
      message: result.message ? result.message :"",
      contact: result.contact ? result.contact :""
    })
    console.log(this.data)
       
  
     
  }
})
Page(config)