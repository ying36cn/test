//获取用户信息
var userData = {
	userId: "",
	jgbm: "",
	zh: ""
};
//请求头信息
var userInfo = {
	"userName": "admin", //
	"userId": "0",  //
	"jgbm": "999000" //研发：10614,发布：999000
	
};

var userInf = JSON.parse(sessionStorage.getItem("nameZsf"));
if(userInf == null || userInf == "" || userInf == "undefined" || userInf == undefined || userInf == "null"){	
	userInf = JSON.parse(getCookie("nameZsf"));
}

if(userInf){
	userData = {
		userId: userInf.extendProperty.ryId,
		jgbm: userInf.jgbm,
		zh: userInf.extendProperty.zh
	}
	 userInfo = {
	    "userName": userInf.userName,
	    "userId": userInf.userId,	  
	    "jgbm": userInf.jgbm
    };
}

//服务器地址
var urlRuslt = {
	
	url:"http://192.168.70.99",  //研发
	url9011:"https://192.168.70.99:9011", //发布开门查询端口9011
	url9010:"https://192.168.70.99:9010"  //发布支付渠道端口9010
};

//查询接口的请求地址
var card = {
	//restfulUrl: "https://acs.smart-ecity.com"  
	restfulUrl: "https://192.168.70.99"		//研发
	//restfulUrl: "https://192.168.0.101"   //发布
};


var overTime = true;
var abcTime = false;
var objTime = false;
$(document).on("click", function() {

	overTime = true;
	objTime = true;
	overTimex = true;

})

//返回

$(".header_return").on("click",function(){
	var classVal = $(".header_return").attr("class");
	if(classVal.indexOf("home") != -1){
		window.location.href = "../01-InformationCommunication/index_release.html";//首页
	}else{		
		history.go(-1);//其它页
	}	
	
});
$(".back-link").on("click",function(){
	var classVal = $(".back-link").attr("class");
	if(classVal.indexOf("others") != -1){
		history.go(-1);//返回上一页
	}else{
		window.location.href = "../01-InformationCommunication/index_release.html";//首页
	}	
});

//number保留两位小数
function returnFloat(value) { 
	var value = Math.round(parseFloat(value) * 100) / 100; 
	var xsd = value.toString().split("."); 
	if(xsd.length == 1) { 
		value = value.toString() + ".00"; 
		return value; 
	} 
	if(xsd.length > 1) { 
		if(xsd[1].length < 2) {  
			value = value.toString() + "0"; 
		} 
		return value; 
	}
}

function getDaysInOneMonth(year, month) {
	month = parseInt(month, 10);
	var d = new Date(year, month, 0);
	return d.getDate();
}

//禁止浏览器全选、右键菜单与复制
document.oncontextmenu = function() {
	return false;
}

document.onselectstart = function() {
	return false;
}

document.oncopy = function() {
	return false;
}

function getTimeFn(time) {
	if(!time || time == 'null'|| time == 'undefined'){
		return ''
	}
	if(time.length == "14") {
		var dateTime = time.substring(0, 4) + "-" + time.substring(4, 6) + "-" + time.substring(6, 8) + " " + time.substring(8, 10) + ":" + time.substring(10, 12) + ":" + time.substring(12, 14);
		return dateTime
	} else if(time.length == "8") {
		var dateTime = time.substring(0, 4) + "-" + time.substring(4, 6) + "-" + time.substring(6, 8);
		return dateTime
	} else if(time.length == "6") {
		var dateTime = time.substring(0, 4) + "-" + time.substring(4, 6);
		return dateTime
	} else {
		var dateTime = time.substring(0, 4) + "-" + time.substring(4, 6) + "-" + time.substring(6, 8) + " " + time.substring(8, 10) + ":" + time.substring(10, 12) + ":" + time.substring(12, 14);
		return dateTime
	}

}
function getQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); 
  if (r != null) return decodeURI(r[2]); return null; 
};
//金额输入框
function clearNoNum(obj){ 
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数  
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        obj.value= parseFloat(obj.value); 
    } 
} 
var setTiemOut = false;
 //退出
$(".out_img").on("click",function(){
	
	outTimeFn(false);
     
});

$(document).on("click",function(){
	setTiemOut = true;
})


function outTimeFn(box){
	
	if(!box){
		sessionStorage.removeItem("validate"); 
		sessionStorage.removeItem("nameZsf");
		sessionStorage.removeItem("mediumType"); //交易方式
        sessionStorage.removeItem("outMoney");
        sessionStorage.removeItem("content");   
        //清除安卓原生生成的cookie
        if(platform.clearCookie()){
        	platform.clearCookie();
        }       
		validate = undefined;
		userInf ={};
		window.location.href = "../01-InformationCommunication/index_release.html"; //首页

	}else{
		setTimeout(function(){
			outTimeFn(setTiemOut);
		},90000);
		
	}
	setTiemOut = false;
};
outTimeFn(true);


//获取网址参数
function getURLString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return decodeURIComponent(r[2]); 
    return null; 
}

//判断是否是JSONstring
function isJSON(str) {
		    if (typeof str == 'string') {
		        try {
		            var obj=JSON.parse(str);
		            if(typeof obj == 'object' && obj ){
		                return true;
		            }else{
		                return false;
		            }
		
		        } catch(e) {
		            console.log('error：'+str+'!!!'+e);
		            return false;
		        }
		    }
		}

//获取cookie
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}
