//消费记录查询
getDate.getDateFun();
var defQuery={
	url: queryUrl.consume,
	serviceCode: 'Q02', //业务类型码
	contentHtml : function(resData,content,self,page){
		$.each(resData.data, function(index,ele) {	    	 	
	    	content+='<li><div><span>'+ checkValue(ele.orgName) +'</span><span>'+ checkValue(ele.dealMoney) +'元</span></div>'+
	    			'<div><span>'+ checkValue(ele.dealName) +'</span><span>'+ checkValue(ele.paychannel) +'</span></div>'+
	        		'<div><span class="color-gray" > '+ checkValue(ele.orgPlace) +'</span><span >'+ getTimeFn(ele.dealDateTime) +'</span></div></li>';
	    });
	    delLoading();	
		allNum =resData.pageCount;
		if(page == 1){ self.empty(); }
		self.append(content);				
		$("#outMoney").find("span").html(resData.totalMoney);		
	}
}

$('#list').queryData(getDate.timeYear,getDate.timeMonth,1,defQuery);

