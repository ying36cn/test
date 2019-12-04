//锁
var timeCallback = true,allNum=0,chooseYear='',chooseMonth='';
var getDate = {
	timeMonth : '',
	timeYear : '',
	getDateFun : function (){
		var time = new Date();
		var timeMonth = time.getMonth() + time.getMonth()>10?(time.getMonth() + 1):"0"+(time.getMonth() + 1);
		var timeYear = time.getFullYear();
		$('.ca_date').html(timeYear + '年' + timeMonth + '月');
		getDate.timeMonth = timeMonth;
		getDate.timeYear = timeYear;
	}
}
//查询接口地址    	
var queryUrl = {
	consume : urlRuslt.url+'/rest/services/irp/smart_city_b39_3600/consume/query',       //消费记录查询
	recharge : urlRuslt.url+'/rest/services/irp/smart_city_b39_3600/recharge/query',     //充值记录查询
	pay : urlRuslt.url+'/rest/services/irp/smart_city_b39_3600/pay/query',              //缴费记录查询
	query : urlRuslt.url+'/rest/services/irp/smart_city_b39_3600/query/querySupply',     //补助记录查询
	withdraw : urlRuslt.url+'/rest/services/irp/smart_city_b39_3600/withdraw/query',     //提现记录查询
	queyLoss : urlRuslt.url+'/rest/services/irp/smart_city_b39_3600/card/queyLossList',    //挂失记录查询
	queryRelieve : urlRuslt.url+'/rest/services/irp/smart_city_b39_3600/card/queryRelieveList',   //解挂记录查询
	querySupplement : urlRuslt.url+'/rest/services/irp/smart_city_b39_3600/card/querySupplementList', //补卡记录查询
	getNewsUseCard : urlRuslt.url9011 + '/web_smart1300/rest/services/irp/smart1300/getNewsUseCardFlowsPage', //开门查询
	cardRecharge : urlRuslt.url+"/rest/services/irp/smart_city_b39_3600/cardRecharge/query", //实体卡充值明细
	coiling : urlRuslt.url+"/rest/services/irp/smart_city_b39_3600/coiling/query",  //圈存记录查询
}

	
function checkValue(val){
	var valNew = '';
	if(val && val != 'undefined'&& val != 'null'){
		valNew = val
	}
	return valNew;
}


(function($){
	//初始化选择月份
	$('.calendar_right').shijian({
		y: -5,
		Hour:false,
		Minute:false,
		Day:false,//是否显示日//
	});

	addLoading();
	//获取当前月份
		
	//获取信息
	$.fn.queryData=function(year, month, page,opt){
		$("#pageId").val(page);	
		year = year.toString();
		month = month.toString();
		var dqDate = getDaysInOneMonth(year,month);
			dqDate = dqDate.toString();
		var dataJSON = {};
		var starTime='',endTime='';
			if(opt.door == true){
				starTime = year + '-' + month;
				dataJSON = {
					userId: userData.userId, //学工号
			        date: starTime,//开始时间
			        order: 0,
			        pageSize: 10,//单页记录数
			        pageNum: page //查询页码
				}
				
			}else{
				starTime = year + month + '01';
				endTime = year + month + dqDate;
				dataJSON = {
					salaryNo: userData.userId, //学工号
					serviceCode: opt.serviceCode, //"Q30", //业务类型码			
					startDatetime: starTime,//开始时间
					endDatetime: endTime,//结束时间
					pageRecordCount: "10",//单页记录数
					pageIndex:page.toString() //查询页码
				}
			}
		
		
		if(parseInt(month) < 10){
			month = "0"+ parseInt(month);
		}
		//每次查询清空之前查询记录
		$('.fail_search').remove();
		var content = '';
		var def={			
			url:'',    //接口地址    
			data:{
				dataJSON : dataJSON      
			},
			headers: { 'userInfo': encodeURI(JSON.stringify(userInfo)) },
	        contentType: "json",	        
			contentHtml : function(resData,content,self){	
			},     //数据内容
			clearHtml :function(resData){				
				$("#outMoney").find("span").html(resData.totalMoney);
			}			
		}
		def=$.extend(def,opt)
		var self=this;
		$.ajax({
			type:"post",
			url:def.url,
			data:JSON.stringify(def.data.dataJSON),
			headers: def.headers,
	        contentType: def.contentType,
	        dataType: "json",
	        async:true,		
		}).done(function(res) {
			if(res.Return.ReturnCode =="0000"){
				var resData = res.Detail;				
				if(resData){
					if(resData.data.length>0){
			            var content='';
			            if(resData.data.length < 10 ){
			            	pullUpLock = false;
			            }			            
			    		def.contentHtml(resData,content,self,page);
			            
					}
					else{					
						self.empty().append('<p class="empty_record"></p>');
						def.clearHtml(resData);
					}	
					myScroll.refresh();	
					setTimeout( function(){delLoading();},800);
				}else{
						self.empty().append('<p class="empty_record"></p>');
						def.clearHtml(resData);
											
				}			
			}else{	
				delLoading();	
				console.log(res);
				self.empty();
				self.append("<div class='fail_search'>查询失败！<br/>"+ res.Return.ReturnMessage +"</div>");
			}	
	})
	.fail(function(res) {
		console.log("error",res);
		self.empty();
		self.append("<div class='fail_search'>查询失败！</div>");
		delLoading();
	});		
	}

})(jQuery)