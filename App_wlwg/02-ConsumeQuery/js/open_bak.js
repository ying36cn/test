//用户消费金额
var strMoney = "";
//选择月份
$('.calendar_right').shijian({
	y: -5,
	Hour:false,
	Minute:false,
    Day:false,//是否显示日//
});
//锁
var timeCallback = true,allNum=0,chooseYear='',chooseMonth='';
function timeMoney(year, month, page) {

	$("#pageId").val(page);	
	year = year.toString();
	month = month.toString();
	var dqDate = getDaysInOneMonth(year,month);
		dqDate = dqDate.toString();
	var starTime = year + month + '01';
	var endTime = year + month + dqDate;
	if(parseInt(month) < 10){
		month = "0"+ parseInt(month);
	}
	//每次查询清空之前查询记录
	$('.fail_search').remove();
	var content = '';
	var dataJSON = {
		salaryNo: userData.userId, //学工号
		serviceCode: "Q30", //业务类型码			
		startDatetime: starTime,//开始时间
		endDatetime: endTime,//结束时间
		pageRecordCount: "10",//单页记录数
		pageIndex:page.toString() //查询页码
	};	
	$.ajax({
        url:card.restfulUrl+"/rest/services/irp/smart_city_b39_3600/consume/query", //smart0600a
        type: "post",
        data: JSON.stringify(dataJSON),
        headers: { 'userInfo': encodeURI(JSON.stringify(userInfo)) },
        contentType: "json",
        dataType: "json",
        async:true
	})
	.done(function(res) {	
		if(res.Return.ReturnCode =="0000"){
			var resData = res.Detail;
			if(resData){
				if(strMoney == "" || strMoney == null || strMoney == undefined){
					strMoney = 0;
			    }
				if(resData){					
					if(resData.data.length>0){
			            var content='';
			            $.each(resData.data, function(index,ele) {
			            	if(!ele.orgName){
			            		ele.orgName = "";
							}
							ele.dealDateTime = getTimeFn(ele.dealDateTime);
			            	//ele.dealMoney = returnFloat(ele.dealMoney);
							//总金额
							strMoney = strMoney + parseFloat(ele.dealMoney);
			            	content+='<li><p><span>'+ele.dealName+'</span><span>'+ele.dealMoney+'元</span></p>'+
				            		'<p><span class="color-gray" style="margin-top: 0.4rem;"> '+ele.orgName+'</span><span style="margin-top: 0.4rem;">'+ele.dealDateTime+'</span></p></li>';
			            });
			            delLoading();	
						allNum =resData.pageCount;
						if(page == 1){ $('#list').empty(); }
						$('#list').append(content);
						console.log(strMoney)
						$("#outMoney").find("span").html(resData.totalMoney);
					}else{
						$('#list').empty();
						$("#list").append('<p class="empty_record"></p>');
					    $("#outMoney").find("span").html(resData.totalMoney);
					}
				}else{
					$('#list').empty();
					$("#list").append('<p class="empty_record"></p>');
					$("#outMoney").find("span").html("0.00");
				}	
				myScroll.refresh();	
				setTimeout( function(){delLoading();},800);
				
			}
		}else{	
			delLoading();	
			console.log(res);
			$('#list').empty();
			$("#list").append("<div class='fail_search'>查询失败！<br/>"+ res.Return.ReturnMessage +"</div>");
		}		
	})
	.fail(function(res) {
		console.log("error",res);
		$('#list').empty();
		$("#list").append("<div class='fail_search'>查询失败！</div>");
		delLoading();
	});
};


	
