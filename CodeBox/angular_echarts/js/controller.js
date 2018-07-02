//定义一个对象
var optionBox = new optionObject();
function optionObject(){
	this.chartsInfo ={
		    chartsLegend: undefined,
			chartsXdata	:  undefined,
			chartsSData: undefined,
			selectedBox: undefined
    }
}
(function(){
	angular.module("${appId}").controller("${unitId}Controller",["$scope","$http",
	      "unitsService","${unitId}Service","${appId}Service","dialogService","$location","$q","assemUtil","systemParamService","exDialog",
			function($scope,$http,unitsService,service,appService,dialogService,$location,$q,assemUtil,systemParamService,exDialog){
		var self = this;
		$scope.pinnedCols = [];	//冻结的数据项
		$scope.lastScrollLeft = 0; //记录上一次的滚动条距离
		$scope.savedParam = null;
		$scope.lastParam = null;
		$scope.userInfo = null;
		$scope.authList = {};
		$scope.$target = null;
		$scope.ratio = null;
		//查看辅单元标识
		$scope.viewAssistFlag = false;
		$scope.heightArr = [];
		$scope.mainUnitEle = null;
		//菜单授权对象
		$scope.operator = {};
		//4个按钮的事件对象
		$scope.buttonData = {};
		/*查询提示*/
		$scope.keywords;
		$scope.keywordsArray=[];
		/** 分页对象 */
		$scope.page={
			pageNo:1,
			pageSize:50
		};
		$scope.loadStatus = "数据加载中,请稍后...";
		$scope.condition = "";
		$scope.filter = "";
		$scope.buttonTip = "";
		//组合查询条件
		$scope.groupFilter = [];
		$scope.advancedFilter;//高级查询条件
		//高级查询缓存条件
		$scope.advancedParam = "";
		$scope.total;
		$scope.pageCount;

		$scope.tableName;
		$scope.colDefs;
		$scope.pKey;

		$scope.unitId = "${unitId}";
	
		$scope.callMethod = function(evt,param,current,line){
			switch (param.methodName) {
				
				case "commonQuery":
					if (param.data.data) {
						console.log("assit:");
						console.log(param);
						$scope.refColumInfo = param.commonData.refColumInfo;
						$scope.mainData = param.data.data;
						$scope.mainFieldMeta = param.data.fieldMeta;
						$scope.unitName = param.unitName;
						$('#myTabContent').css('visibility', 'visible');

						//获取已设置的X、Y轴
						var yAxisBox = new Array;
						var xAxisBox = "";
						var typeBox = "";
						$.ajax({
								url : '/form/showChart/queryByXY.do',
								type : 'post',
								async: false,//使用同步的方式,true为异步方式
								data : {'unit':$scope.unitName},//这里使用json对象
								success : function(data){
								console.log(data);
										yAxisBox = JSON.parse(data[0].y);
										xAxisBox = data[0].x;
										typeBox = data[0].lx;
								},
								fail:function(){
								//code here...
								}
								});
						console.log(xAxisBox,yAxisBox);

						//获取图表数据
						var chartsLegend = new Array;
						var chartsSField = new Array;
						var yAxisNameBox = new Array;
						var xAxisNameBox = "";
						var chartsXField = "";

						//X轴
						$.each($scope.refColumInfo,function(index,value){
							 	// for(var i=0;i < yAxisBox.length;i++){
							 	 	 if(value.column == xAxisBox ){
							 	 	 	chartsXField = value.showColumns[0].alias;
							 	 	 	console.log(chartsXField);
							 	 	 }else{
							 	 	 	chartsXField = xAxisBox;
							 	 	 }
							 	// }
						});

						//Y轴
						$.each($scope.mainFieldMeta,function(index,value){
							if(value.type == "N" || value.displayName.indexOf("率")>=0){
								if(value.displayName.indexOf("名")<0 && value.displayName.indexOf("号")<0){
                                 chartsLegend.push(value.displayName);
							 	 chartsSField.push(value.field);
							 	 console.log(yAxisBox);
							 	 for(var i=0;i < yAxisBox.length;i++){
							 	 	 if(value.field == yAxisBox[i] ){
							 	 	 	yAxisNameBox.push(value.displayName);
							 	 	 }
							 	 }
								}
							}
							if(value.field == chartsXField ){
							 	 	 	xAxisNameBox = value.displayName;
							 	 	 }
						});
						console.log(chartsXField);
						console.log(chartsSField);
						console.log(chartsLegend);
						var chartsXData = new Array;
						var chartsSDataAll = new Array;

						$.each($scope.mainData,function(index,value){
								chartsXData.push(value[chartsXField]);
						});
					    for(var i=0;i < chartsSField.length;i++){
								var chartsS = chartsSField[i];
								var chartsSData = new Array;
						   $.each($scope.mainData,function(index,value){
								chartsSData.push(parseFloat(value[chartsS]));
						    });
						   chartsSDataAll.push(chartsSData);
						};
						var echartsData = new Array;
						for(var j=0;j<chartsLegend.length;j++){
                            var echartsDataTemple = {
								            name:chartsLegend[j],
								            type:'bar',
								            data: chartsSDataAll[j],
								            barMaxWidth:100,//最大宽度
								            itemStyle:{
							                   // normal:{color:'#5b9bd5'}  //蓝
							                }
							};
							echartsData.push(echartsDataTemple);
						}
						console.log(echartsData);
                        $scope.item = chartsLegend;
                    	var selectedBox = {}; //定义一个对象
                       	for(var b = 0; b < $scope.item.length;b++){
                            var listVal = $scope.item[b];                    	    　
                    	    for(var a = 0; a < yAxisNameBox.length;a++){
                    	     	var selectedVal = yAxisNameBox[a];
                        	if(listVal == selectedVal){
                        		selectedBox[listVal] = true;
                        	}else{
                        		if(selectedBox[listVal] != true){
										 selectedBox[listVal] = false;
                        		 }

                        	}
                        	}
                        }

					    console.log(selectedBox);
						optionBox.chartsInfo.chartsLegend = chartsLegend;
						optionBox.chartsInfo.chartsSData = echartsData
                        optionBox.chartsInfo.chartsXdata = chartsXData;
                        optionBox.chartsInfo.selectedBox = selectedBox;
                        optionBox.chartsInfo.nameBox = xAxisNameBox;

						$scope.legend = chartsXData;
                        $scope.eData = echartsData;
                        $scope.selectedBox = selectedBox;
                        $scope.nameBox = xAxisNameBox;
			            //监听数据，数据有变 图形数据也变
			            function change_value() {
			                var option = {
									title : {
											      //  text: '学生（各课程）出勤统计',
											    },
								                // 提示框，鼠标悬浮交互时的信息提示
						            tooltip : {
											        trigger: 'axis'
											    },
								                // 图例
								     legend: {
											       data:$scope.item,
											       //selectedMode:'multiple',
											       selected:$scope.selectedBox
											        	//'应出次数':false

											       // data:optionBox.chartsInfo.chartsLegend
											    },
									toolbox: {
						                        show : true,
						                        feature : {
						                            mark : {show: true},
						                            //dataView : {show: true, readOnly: false},
						                            magicType : {show: true, type: ['line', 'bar']},
						                            //restore : {show: true},
						                            //saveAsImage : {show: true}
						                        }
						                    },
									xAxis :  [
								        {
								            type : 'category',
								            name : $scope.nameBox,
								            axisLabel:{
								            	interval:0,
								            	formatter:function(params){
								            		var newParamsName = "";//最终拼接成的字符串
								            		var parmasNameNumber = params.length;//实际标签的个数
								            		var provideNumber = 10;// 每行能显示的字的个数、
								            		var rowNumber = Math.ceil(parmasNameNumber / provideNumber);//换行的话，需要显示几行，向上取整
								            		//条件等同于rowNumber > 1
								            		if(parmasNameNumber > provideNumber){
								            			for(var p = 0;p < rowNumber;p++){
								            				var tempStr = "";//表示每一次截取的字符串
								            				var start = p * provideNumber;//开始截取的位置
								            				var end = start + provideNumber;//结束截取的位置
								            				//此处特殊处理最后一行的索引值
								            				if(p == rowNumber - 1){
								            					//最后一次不换行
								            					tempStr = params.substring(start,parmasNameNumber);
								            				}else{
								            					//每一次拼接字符串并换行
								            					tempStr = params.substring(start,end)+"\n";
								            				}
								            				newParamsName += tempStr;//最终拼成的字符串
								            			}
								            		}else{
								            			//将旧标签的值赋给新标签
								            			newParamsName = params;
								            		}
								            		//将最终的字符串返回
								            		return newParamsName
								            	},
								            	rotate:-20
								            },
								            data : $scope.legend
								        }
								    ]  ,
								    yAxis : [
								        {
								            type : 'value',
								           // axisLabel:{formatter:'{value} 次'},
								            //name : '次数'

								        }
								    ],
								    dataZoom:{
								    	show:true,
								    	realtime:true,
								    	y:36,
								    	height:18,
								    	start:0,
								    	end:18
								    },
					                // 数据内容数组
					                series : $scope.eData
					            };
                             console.log(option);
			                var myChart = echarts.init(document.getElementById("chartsBox"),'macarons');
			                //清空画布，防止缓存
			                 // myChart.clear();
					            myChart.setOption(option);
			            }
			            $scope.$watch('legend', change_value);
					}

					var className = $('[href="#' + $scope.unitId + '"]').parent().parent().attr('class');
					if(className == 'active'){
						$scope.commonQuery(param);
					}
					break;
				case "refresh":
				case "importData":
					$scope.refresh();
					break;
				default:
					//默认调用查询方法
					var className = $('[href="#' + $scope.unitId + '"]').parent().parent().attr('class');
					if(className == 'active'){
						$scope.simpleQuery(evt,param,current);
					}
					break;
			}
		};
		/**
		 * param = {
		 * 	methodName 调用的方法名
		 * 	fieldName  参数名
		 * 	data	   参数值
		 * }
		 */
		$scope.$on($scope.unitId+'_callMethod',function(evt,param,current){
			if(!$scope.savedParam){
				$scope.lastParam = $scope.savedParam = param;	//初始化
			}else {
				$scope.savedParam = param;
			}
			$scope.callMethod(evt,param,current);
		});

		self.waitObj;
		self.hideWait = function(){
			dialogService.hideWait(self.waitObj);
		};
		self.wait = function(){
			self.waitObj = dialogService.wait();
		};
	}]);

	//图表
        var appBigBox = angular.module('${appId}');
   		appBigBox.directive('line',["$timeout",function(timer){
          return{
            scope: {
		              id: "@",
		              legend: "=",
		              item: "=",
		              eData: "=",
		              selectedBox: "=",
		              nameBox: "="
		            },
	        restrict: 'E',
	        template: '<div style="margin-top:10px;width:860px;height:240px;"></div>',
	        replace: true,
		    link: function($scope,element, attrs, controller) {
		    		timer(function(){
		    			if($scope != undefined){
                        $scope.edata= optionBox.chartsInfo.chartsSData;
                        var option = {
									title : {
								       // text: '学生（各课程）出勤统计',
								    },
					                // 提示框，鼠标悬浮交互时的信息提示
			                        tooltip : {
								        trigger: 'axis'
								    },
					                // 图例
					                legend: {
								        data:$scope.item,
								        //selectedMode:'multiple'
								        selected :$scope.selectedBox
								       // data:optionBox.chartsInfo.chartsLegend
								    },
								    toolbox: {
						                        show : true,
						                        feature : {
						                            mark : {show: true},
						                            //dataView : {show: true, readOnly: false},
						                            magicType : {show: true, type: ['line', 'bar']},
						                            //restore : {show: true},
						                            //saveAsImage : {show: true}
						                        }
						            },
								    xAxis : [
								        {
								            type : 'category',
								            name : $scope.nameBox,
								            axisLabel:{
								            	interval:0,
								            	rotate:-20
								            },
								            data : $scope.legend
								           // data :optionBox.chartsInfo.chartsXdata
								             }
								    ],
								    yAxis : [
								        {
								            type : 'value',
								           // axisLabel:{formatter:'{value} 次'},
								            //name : '次数'
								        }
								    ],
								    dataZoom:{
								    	show:true,
								    	realtime:true,
								    	y:36,
								    	height:18,
								    	start:0,
								    	end:18
								    },
					                // 数据内容数组
					               series : $scope.eData
					               //series : optionBox.chartsInfo.chartsSData

                        };
            console.log(option);
            var myChart = echarts.init(document.getElementById($scope.id),'macarons');
            myChart.setOption(option);
            $('#myTabContent').css('visibility','visible');
       }

       },6300);
         }
      }
      }]);

	

})();
