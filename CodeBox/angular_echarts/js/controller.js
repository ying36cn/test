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
		//导出数据所需要的列集合
		$scope.columns=[];

		//选择的行
		$scope.selectedRow=[];
		//字段元数据 key 为dal_fieldname;
		$scope.fieldMap = {};
		//方法Map key为name 方法名称;
		$scope.methods = [];
		//按钮Map key为name 方法按钮名称;
		$scope.buttons = [];
		//模块关联单元查询条件
		$scope.refFilter;
		//外键字段Map
		$scope.relatedMap = {};

		//环境参数
		$scope.envParams=[];
		$scope.arr=[];
		//表头设置
		$scope.selectFKColumnInfo = function(params){
			if(params){
				$scope.tableName = params.tableName;
				$scope.queryFields = [];
				var totalWidth = 0;
				var arr = [];
				$scope.relatedShowCfg = new Array();
				$scope.showColumns = new Array();
				var hasPKey = true;
				var refCount = 0;
				for(var i=0;i<params.fields.length;i++){
					/** TODO 判断是否为外键列
					 *  Y：查询关联表数据，获取该列信息
					 *  N: 跳过
					 */
					var tmpField = params.fields[i];
					//if(params.pkey == tmpField.field){
					//	hasPKey = false;
					//	var index = params.fields.indexOf(tmpField);
					//	params.fields.splice(index,1);
					//	i -= 1;
					//	continue;
					//}
					//计算表头长度
					var countResult = assemUtil.parseLength(tmpField.displayName);
					var fieldMeta = $scope.fieldMap[tmpField.field];
					var len = countResult.len;
					if(fieldMeta && fieldMeta.length){
						var fieldLen = fieldMeta.length;
						if(countResult){
							listLen = fieldLen > len ?fieldLen : len;
						}else{
							listLen = fieldLen;
						}
						if(listLen>12){
							tmpField.width=98;
						}else if(listLen<6){
							tmpField.width = 50;
						}else{
							tmpField.width = listLen*7;
						}
					}else{
						tmpField.width=98;
					}
					totalWidth += tmpField.width;

					if(tmpField.fk){
						var refAlias = "tb_" + refCount++;
						var obj = {
							column : tmpField.field,
							refTable : tmpField.fk.tablename,
							refTableAlias:refAlias,
							refColumn : tmpField.fk.primarykey,
							showColumns : [
							    {
							    	name : tmpField.fk.showColumn,
							    	alias : tmpField.fk.alias
							    }
							]
						};
						$scope.relatedShowCfg.push(obj);
						$scope.relatedMap[tmpField.fk.alias]= obj;
					}else{
						//判断列表参数是否存在有主键选项，如有则下面代码不需要在查询中加入主键
						if(params.pkey == tmpField.field){
							hasPKey = false;
						}
						$scope.showColumns.push(tmpField.field);
					}
					if(!tmpField.hidden){
						var oriFieldName=tmpField.field;
						if(tmpField.fk){
							tmpField.field = tmpField.fk.alias;
						}
						//添加进去查询列集合
						$scope.columns.push({alisaname:tmpField.field,oriFieldName:oriFieldName});
						//TODO 格式化显示处理
						var fieldName = tmpField.field;
						var cellTemplate = tmpField.cellTemplate;
						// 不存在显示模板，进行显示处理
						var fieldMeta = $scope.fieldMap[fieldName];
						var formParam = systemParamService.get().form;
						var filePath = formParam.fileManagerUrl;
						if (cellTemplate == undefined && fieldMeta) {
							var dataType = fieldMeta.dataType;
							var format = fieldMeta.displayFormat;
							var fileVal = fieldMeta.valuespace;
							/*
							* 如果format为空且fileVal能找到'gb/t 7408'
							* 	截取后面的字符
							* 	判断字符给format设置默认值
							* */
							if(fileVal){
								fileVal = fileVal.toLowerCase();
								if(!format && fileVal.indexOf('gb/t 7408') != -1){
									var fileValArray = fileVal.split('gb/t 7408 ');
									var vs = fileValArray[1];
									if(vs){
										vs = vs.toLowerCase();
									}
									switch (vs){
										case 'yyyy':
											format = 'yyyy';
											break;
										case 'yyyymm':
											format = 'yyyy-MM';
											break;
										case 'yyyymmdd':
											format = 'yyyy-MM-dd';
											break;
										case 'hhmmss':
											format = 'HH:mm:ss';
											break;
										case 'yyyymmddthhmmss':
										case 'yyyymmddhhmmss':
											format = 'yyyy-MM-dd HH:mm:ss';
											break;
										case 'yyyymmddhhmmsssss':
											format = 'yyyy-MM-dd HH:mm:ss SSS';
											break;
										default :
											console.info("值空间错误：" + fileVal);
											break;
									}
								}
								if(fileVal == 'file' && format == 'tp'){
									tmpField.cellTemplate = '<div style="text-align: right;"><image style="height: 22px; width: 22px;" ng-src="{{row.entity.' + fieldName + '}}" ng-show="\'{{row.entity.' + fieldName + '}}\'.length>10"/></div>';
								}
							}

							/*if(tmpField.format){//装配的格式化信息
								format = tmpField.format;
							}*/
							switch (dataType) {
							case "D":
								if (format == undefined || format.trim().length == 0) {
									format = "yyyy-MM-dd";
								}
								tmpField.cellTemplate = '<pre style="text-overflow: ellipsis;">{{row.entity.' + fieldName
									+ '|ibusFormat:"type":"D":"pattern": "' + format + '"}} </pre>';
								//delete tmpField.field;
								break;
							case "N":
								if (!format || format.trim().length == 0) {
									format = '';
								}else{
									format = ':"pattern": "'+format+'"';
								}
								tmpField.cellTemplate = '<pre style="text-overflow: ellipsis;text-align: right;">{{row.entity.' + fieldName
								+ '|ibusFormat:"type":"N"' + format + '}} </pre>';
								break;
							case "B":
								tmpField.cellTemplate = '<div style="text-align: right;"><image style="height: 22px; width: 22px;" ng-src="data:image/png;base64,{{row.entity.' + fieldName + '}}" ng-show="\'{{row.entity.' + fieldName + '}}\'.length>10"/></div>';
								break;
							case "C":
								if(fileVal == 'file' && format != 'tp') {
									tmpField.cellTemplate = '<div><a style="height: 22px; width: 22px;" ng-if="row.entity.' + fieldName+ '" href="'+filePath+'{{row.entity.'+fieldName+'}}" target="_blank"><i class="glyphicon glyphicon-file"></i></a></div>';
								}else if(fileVal != 'file' && format == 'tp'){
									tmpField.cellTemplate = '<div style="text-align: right;"><image style="height: 22px; width: 22px;" ng-src="{{row.entity.' + fieldName + '}}" ng-show="\'{{row.entity.' + fieldName + '}}\'.length>10"/></div>';
								}else if(fileVal && fileVal.indexOf('gb/t 7408') != -1 ){
									tmpField.cellTemplate = '<pre style="text-overflow: ellipsis;">{{row.entity.' + fieldName
										+ '|ibusFormat:"type":"D":"pattern": "' + format + '"}} </pre>';
								}else if(tmpField.format == "password"){
									tmpField.cellTemplate = '<pre style="text-overflow: ellipsis;">{{row.entity.' + fieldName
										+ '|ibusFormat:"type":"MM"}} </pre>';								}
								break;
							case "M":
								tmpField.cellTemplate = '<pre style="text-overflow: ellipsis;">{{row.entity.' + fieldName
									+ '|ibusFormat:"type":"M"}} </pre>';
								break;
							case "T":
								break;
							default:
							}
						}
						arr.push(tmpField);
					}else {
						var index = params.fields.indexOf(tmpField);
						params.fields.splice(index,1);
						i -= 1;
						continue;
					}
					//如果此字段为查询字段
					if(tmpField.queryField){
						$scope.queryFields.push(tmpField);
						if(tmpField.displayName.indexOf('图标') == -1){
							$scope.keywordsArray.push(tmpField.displayName);
						}
					}
				}
				/*
				 * 表头宽度自适应
				 * totalWidth:字段总宽度
				 * 25:复选框宽度
				 * 18:scroll-Y宽度
				 * 2:边框
				 * (*):ngGrid最后一列自适应的标识(总字段宽小于表宽的情况)
				 */
				//判断单栏式和两栏式
				var listWidth = $('#listDiv').width()?$('#listDiv').width():$(document).width();
				if(totalWidth < listWidth){
					//arr[arr.length - 1].width += listWidth - totalWidth - 25 - 18 - 2;
					if(arr.length>0){
						arr[arr.length - 1].width = "*";
					}
				}
				$scope.gridOptions.columnDefs = $scope.colDefs = arr;
				$scope.pKey = params.pkey;
				if(hasPKey){
					$scope.showColumns.push($scope.pKey);
				}
			}
		};

		// TODO 查询
		$scope.query = function() {
			self.wait();
			$scope.lastSelected = null;
			$('#gridDiv_'+$scope.unitId).find('.ngRow.selected').removeClass('selected');
			$('#gridDiv_'+$scope.unitId).find('.ngRow:first').addClass('selected');
			var selectAllCheckbox = $('#gridDiv_'+$scope.unitId).find("input.ngSelectionHeader");
			if(selectAllCheckbox[0] && selectAllCheckbox[0].checked){
				selectAllCheckbox.click();		//清空全选的checkbox
			}
			$scope.paginationConf.status = "数据加载中...";
			//指定返回字段
			$scope.page.filter = undefined;//清空查询条件
			$scope.search();//简单查询过滤条件
			if($scope.filter){
				$scope.page.filter = "(" + $scope.filter + ")";
			}
			if($scope.refFilter){ //辅单元条件
				if($scope.page.filter){
					$scope.page.filter =$scope.page.filter + " and ("+$scope.refFilter+")";
				}else{
					$scope.page.filter = "(" +$scope.refFilter+ ")";
				}
			}
			if($scope.initFilter){ //单元初始化条件
				if($scope.page.filter){
					$scope.page.filter = $scope.page.filter + " and (" +$scope.initFilter+")";
				}else{
					$scope.page.filter = "(" +$scope.initFilter+ ")";
				}
			}
			if($scope.fkfilter){ //外键查询条件
				if($scope.page.filter){
					$scope.page.filter = $scope.page.filter + " and (" + $scope.fkfilter+")";
				}else{
					$scope.page.filter = "(" +$scope.fkfilter+ ")";
				}
			}
			if($scope.advancedFilter){ //高级查询条件
				if($scope.page.filter){
					$scope.page.filter = $scope.page.filter + " and (" + $scope.advancedFilter+")";
				}else{
					$scope.page.filter = $scope.advancedFilter;
				}
			}
			if($scope.orders){
				$scope.page.orders = $scope.orders;
			}
			if($scope.page.filter){
				$scope.page.filter = encodeURI($scope.page.filter);
			}else{
				$scope.page.filter = undefined;
			}
			var relatedShowCfg = {
			    primeTableAlias:"p_00",
			    relatedTableCfgs: $scope.relatedShowCfg
			};

			var queryHttp = service.queryData($scope.tableName,$scope.page,JSON.stringify(relatedShowCfg));
			queryHttp.success(function (data,status){
				var jsonData = data;
				$scope.data = jsonData.data;
				$scope.paginationConf.curItems = $scope.data.length;
				if($scope.data.length && ${unitConfig}.id == "smart0011t_list"){
					$scope.data.forEach(function(data,i){
						if(data.smt_jsmc == "超级管理员"){
							data.C4 = "电子";
							data.C5 = "电子";
						}
					});
				}
				//填充空白行
				var validRows = parseInt((parseInt($scope.styleEntity.height)-24)/24) - 1;
				if($scope.viewAssistFlag){
					var maxHeight = Math.max.apply(null, $scope.heightArr);
					validRows = parseInt(maxHeight/24) - 1;
					$scope.viewAssistFlag = false;
				}
				while($scope.data.length < validRows){
					$scope.data.push({});
				}
				$scope.total = jsonData.totalCount;
				$scope.pageCount = jsonData.pageCount;
				$scope.page.pageNo = jsonData.pageNo;
				$scope.page.pageSize = jsonData.pageSize;
				$scope.page.orders = jsonData.orders;

				$scope.paginationConf.totalItems = $scope.total;
				$scope.paginationConf.pageCount = $scope.pageCount;
				//$scope.paginationConf.currentPage = $scope.page.pageNo;
				if($scope.data && JSON.stringify($scope.data[0]) == "{}"){
					$scope.paginationConf.status = "没有找到数据";
				}
				//清除之前选中的记录
				$scope.selectedRow.splice(0);
				if($scope.fkfilter){
					//默认选择第一条记录
					if($scope.data && JSON.stringify($scope.data[0]) != "{}"){
						 self.clickEvent($scope.data[0]);
					 }
					$scope.fkfilter = '';
				}
				//清除过滤条件
				$scope.advancedFilter = "";
				if($scope.lastParam){
					$('#myTabContent').css('visibility','visible');
				}
				//关闭所有对话框以免报错
				exDialog.closeAll('all');
				//console.log("main:");
				self.clickEvent({fieldMeta:$scope.queryFields, data: $scope.data});
			}).error(function (data,status){
				$scope.advancedFilter = "";
				$scope.loadStatus = "数据加载失败";
				$scope.paginationConf.status = data.describe;
				console.error('status:' + status + ',error:' + data.describe);
				//物理表不存在将按钮和文字置灰
				$scope.buttons.forEach(function(val,i){
					if(val.tb.indexOf("blue") != -1){
						val.tb = val.tb.replace('blue','gray');
					}
				});
				$scope.extbuttons.forEach(function(val,i){
					if(val.tb.indexOf("blue") != -1){
						val.tb = val.tb.replace('blue','gray');
						val.font = true;
					}
				});
				self.hideWait();
			});
		};

		// TODO 查询字段
		$scope.queryField = function() {
			var resp = service.getFieldsOfSync($scope.tableName);
			resp.success(function(data){
				var jsonData = data;
				if(jsonData.length>0){
					var fields = jsonData;
					for(var i=0;i<fields.length;i++){
						var tmp = fields[i];
						$scope.fieldMap[tmp.fieldName] = tmp;
					}
				}
			}).
			error(function(data){
				console.info("同步查询数据信息发生异常！");
			});
		};
		$scope.unitName;
		//TODO 初始化模块
		$scope.init = function(unitName,moduleId,ratio,position){
			if(!unitName){//第一次进入方法没有单元名称，不往下执行
				return;
			}
			ratio = $('#assistTab>li').length ? 2 : 1;
			self.setListDiv(ratio);
			$scope.ratio = ratio;
			$scope.moduleId = moduleId;
			$scope.unitName = unitName;
			var unitId = $scope.unitId;
			//把数据源告诉模块
			var unitCfg = ${unitConfig};
			var ds = '${dataSource}';
			//传4个按钮需要的参数
			$scope.buttonData.unitCfg = unitCfg;
			$scope.buttonData.dataSource = ds;
			var params = unitCfg.params;
			unitCfg.metaFields.map(function(val,i){
				$scope.fieldMap[val.fieldName] = val;
			});
			//初始化表头
			$scope.selectFKColumnInfo(params);
			var methods = ${methods};
			var buttons = ${buttons};
			$scope.userInfo = unitCfg.authTools;
			$scope.keywords = "请输入" + $scope.keywordsArray.slice(0,2).join('或');
			var unitcfg = {};
			unitcfg.dataSource = ds;
			unitcfg.cfg = unitCfg;
			unitcfg.relatedShowCfg = $scope.relatedShowCfg;
			unitcfg.primeTableAlias = "p_00";
			appService.setUnitCfg(unitName,unitcfg);
			if(params.filter){
				$scope.initFilter = "p_00."+params.filter;
			}
			if(params.orders){
				$scope.orders = "";
				if(params.orders.indexOf(",")!=-1){
					var orders = params.orders.split(',');
					orders.forEach(function(str,i){
						$scope.orders = "p_00."+str;
						if(i!=orders.length-1){
							$scope.orders += ", ";
						}
					});
				}else{
					$scope.orders = "p_00." + params.orders;
				}
			}else {
				if(params.pkey){
					$scope.orders = "p_00." + params.pkey + " desc";
				}
			}
			//设置单元配置
			//appService.setUnit(unitName,{params:params,methods:methods});
			service.setUserInfo(params.tableName,$scope.unitId);
			$scope.position = position;
			if(position=="main"){//如果是辅单元初始化不查询数据
				$scope.query();
				appService.setMainTip(unitCfg.name);
				$scope.unitChnName = unitCfg.name;
			}else {	//辅单元初始化提示
				$scope.paginationConf.status = "请点击主单元记录查询数据!";
			}
			$scope.authList = appService.newButtonAuth($scope.unitName);
			if(!$scope.authList){	//新版权限
				//authFlag取anqx的值
				$scope.authList = {};
				buttons.map(function(val,i){
					$scope.authList[val.name] = {authFlag:null};
					var btnName = val.name;
					if(btnName == 'refreshButton' || btnName == 'viewButton'){
						val.anqx = true;
					}
					$scope.authList[val.name]['authFlag'] = val.anqx;
				});
			}
			for(var i=0;i<methods.length;i++){
				var tmp = methods[i];
				$scope.methods[tmp.name] = tmp;
			}
			$scope.buttons = buttons;
			$scope.changeButtons($scope.buttons);
			$('#myTabContent').css('visibility','hidden');
		};
		self.setListDiv = function(ratio){
			/* === START 定义单元高度 === */
			var unitHeight;
			switch(ratio){
			case 1:
				unitHeight = $(document).height()/ratio - 76;
				break;
			case 2:
				unitHeight = ($(document).height()-2)/ratio - 19-24-32;
				break;
			}
			$scope.styleEntity = {height:unitHeight+"px"};
			/* ==== END 定义单元高度 ==== */
		};
		$scope.init();
		//滚动条按钮列宽移动
		$scope.$on("pinEvent",function(event,pinnedCols,scope){
			$scope.pinnedCols =  pinnedCols;
		});
		$scope.$on("reScroll",function(event,param,scope){
			var pinnedLeft = 0;
			var scrollLeft = param.scrollLeft();
			var colWidths = 0;
			var move = 0;
			var cols = null;
			cols = $scope.pinnedCols.length ? $scope.pinnedCols : $scope.colDefs;
			if(scrollLeft > $scope.lastScrollLeft){
				for(var i=0;i<cols.length;i++){
					var col = cols[i];
					if(!col.pinned){
						if(colWidths>=scrollLeft){
							move = colWidths;
							continue;
						}else {
							colWidths += col.width;
						}
					}
				}
			}else if(scrollLeft < $scope.lastScrollLeft){
				if(scrollLeft + param[0].clientWidth == param[0].scrollWidth){
					move = scrollLeft;
				}else {
					for(var i=0;i<cols.length;i++){
						var col = cols[i];
						if(!col.pinned){
							if(colWidths>=scrollLeft){
								if(i>=1){
									move = colWidths - cols[i-1].width;
									param.scrollLeft(move);
									$scope.lastScrollLeft = move;
									return false;
								}
							}else {
								colWidths += col.width;
							}
						}
					}
				}
			}else {
				return;
			}
			param.scrollLeft(move);
			$scope.lastScrollLeft = move;
		});
		//保存设置后的列
		$scope.$on("saveColsInfo",function(event,param,scope){
			if(param){
				console.log($scope.colDefs);
			}
		});
		//接收设置后的列
		$scope.$on("colsInfo",function(event,param,scope){
			$scope.colDefs = [];
			param.map(function(val,i){
				$scope.colDefs.push(val.colDef);
			});
			$scope.colDefs.shift();
			//console.log($scope.colDefs);
		});
		//保存高级查询条件
		$scope.$on("advancedFilter",function(event,param,scope){
			$scope.advancedParam = param;
		});
		//后台排序 & 组合排序
		$scope.$on("sortInfo",function(evt,param,current){
			var field = param.field;
			//转换外键字段
			if($scope.relatedMap[field]){
				field = $scope.relatedMap[field].column;
			}
			var dir = param.dir;
			if($scope.groupFilter[0]){
				if($scope.groupFilter[0].field !== field){
					$scope.groupFilter[1] = $scope.groupFilter[0];
					$scope.groupFilter[0] = {field:field,dir:dir};
					$scope.orders = "p_00." + $scope.groupFilter[0].field + " " + $scope.groupFilter[0].dir + ",p_00." + $scope.groupFilter[1].field + " " + $scope.groupFilter[1].dir;
				}else {
					$scope.groupFilter[0] = {field:field,dir:dir};
					$scope.orders = "p_00." + $scope.groupFilter[0].field + " " + $scope.groupFilter[0].dir;
				}
			}
			if($scope.groupFilter.length == 0){
				$scope.groupFilter[0] = {field:field,dir:dir};
				$scope.orders = "p_00." + $scope.groupFilter[0].field + " " + $scope.groupFilter[0].dir;
			}
			$scope.setChangePage();
		});
		$scope.func = function(){

		}
		//按钮控制单元高度
		$scope.$on('resizeUnit',function(e,param){
			var type = param.type;
			var docHeight = param.docHeight;
			var mainTable = $("#mainUnit").find("[ng-grid='gridOptions']");
			var $mainTable = $(mainTable);
			var $mainViewport = $mainTable.find(".ngViewport");
			var assistTable = $("#assistUnit").find("[ng-grid='gridOptions']");
			if(type == 'mainUnit'){
				$mainTable.height(docHeight-19-25-32-19-2);
				$mainViewport.height(docHeight-19-25-32-19-2-24);
				if(!$('#assistTab>li').length){
					$mainTable.height(docHeight-19-25-32-2);
					$mainViewport.height(docHeight-19-25-32-2-24);
				}
				$scope.refresh();
			}
			if(type == 'assistUnit'){
				$scope.heightArr = [];
				$.each(assistTable,function(i,val){
					var $assistTable = $(val);
					var $assistViewport = $assistTable.find(".ngViewport");
					$assistTable.height(docHeight-19-25-32-19-2);
					$assistViewport.height(docHeight-19-25-32-19-2-24);
					$scope.heightArr.push($assistViewport.height());
				});
				$scope.viewAssistFlag = true;
				$scope.refresh();
			}
			if(type == 'mean'){
				$scope.heightArr = [];
				var halfHeight = param.halfHeight;
				$mainTable.height(halfHeight-19-25-32);
				$mainViewport.height(halfHeight-19-25-32-24);
				$.each(assistTable,function(i,val){
					var $assistTable = $(val);
					var $assistViewport = $assistTable.find(".ngViewport");
					$assistTable.height(halfHeight-19-25-32);
					$assistViewport.height(halfHeight-19-25-32-24);
					$scope.heightArr.push($assistViewport.height());
				});
				$scope.viewAssistFlag = true;
				$scope.refresh();
			}
		});
		//拖拽控制单元宽度
		$scope.$on('resize_tree_width',function(evt,data){
			var treeWidth = data.treeWidth;
			var docWidth = data.docWidth;
			$('#treeDiv').width(treeWidth);
			$('#listDiv').width(docWidth - treeWidth - 22);
		});
		//拖拽控制单元高度
		$scope.$on("resize_context_unit",function(evt,param){
			var mainHeight = param.mainHeight;
			var assistHeight = param.assistHeight;
			var docHeight = param.docHeight;
			if($scope.position=='main'){
				var viewport = $('#gridDiv_'+$scope.unitId+'>div:eq(1)');
				$("#gridDiv_"+$scope.unitId).height(mainHeight-19-25-32);
				viewport.height(mainHeight-19-25-32-24);
			}
			if($scope.position=='assit'){
				var viewport = $('#gridDiv_'+$scope.unitId+'>div:eq(1)');
				$("#gridDiv_"+$scope.unitId).height(assistHeight-19-25-32);
				viewport.height(assistHeight-19-25-32-24);
			}
		});
		$scope.changeButtonColor = function(buttonTip){
			$scope.buttonTip = buttonTip;
			var buttons = $('#'+$scope.unitId).find('i');
			$.each(buttons,function(i,val){
				if($(val).attr("title") == buttonTip){
					if($(val).hasClass('gray')){
						return;
					}
					$scope.$target = $(val);
					$(val).css({'color':'#fff','background':'#add6ff'});
				}
			});
		};
		self.buttonMap = [];
		$scope.changeButtons = function(buttons){
			var btnLength = systemParamService.get().list.button;
			$scope.extbuttons = [];
			if(buttons.length<0) return ;
			var headButthon=[],extButton=[];
			for(var i=0;i<buttons.length;i++){
				var tmpButton =buttons[i];
				if(!tmpButton.optionCode){//兼容以前版本的按钮，没有操作符则以按钮名称截取
					tmpButton.optionCode = tmpButton.name.replace("Button","");
				}
				if($scope.authList){
					var auth = $scope.authList[tmpButton.name];
					if(auth && auth.authFlag==1){
						tmpButton.tb += " blue";
						tmpButton.font = false;
					}else{
						tmpButton.tb += " gray";
						tmpButton.font = true;
					}
				}else{
					tmpButton.tb += " gray";
					tmpButton.font = true;
				}
				//if(tmpButton.name=="delButton"){
				//	tmpButton.tb += " gray";
				//}
				self.buttonMap[tmpButton.event] = tmpButton;
				if(tmpButton.seat=="head"){
					headButthon.push(tmpButton);
				}else{
					extButton.push(tmpButton);
				}
			}
			buttons.splice(0);
			self.orderButton(headButthon,buttons);
			self.orderButton(extButton,$scope.extbuttons);
			if(buttons.length>btnLength){	//headButton过长就截取
				var dels = buttons.length - btnLength;
				Array.prototype.unshift.apply($scope.extbuttons,buttons.splice(btnLength-1,dels));
			}else if(buttons.length<btnLength){		//headButton过短就补长
				var dels = btnLength - buttons.length;
				Array.prototype.push.apply(buttons,$scope.extbuttons.splice(0,dels));
			}
		};
		//按钮排序
		self.orderButton = function(buttons,result){
			if(buttons.length>0){
				var min,tmp,index;
				for(var i=0;i<buttons.length;i++){
					tmp = buttons[i];
					if(min){
						if(parseInt(min.order)>parseInt(tmp.order)){
							min = tmp;
							index = i;
						}
					}else{
						min = tmp;
						index = i;
					}
				}
				buttons.splice(index,1);
				result.push(min);
				self.orderButton(buttons,result);
			}else{
				return result;
			}
		};
		//简单查询条件拼接
		$scope.search = function(){
			$scope.condition = $("#"+$scope.unitName+"condition").val();
			var filterStr = "";
			if($scope.condition){
				for(var i=0;i<$scope.queryFields.length;i++){
					var tmpField = $scope.queryFields[i];
					if(i!=0){
						filterStr += "or ";
					}
					if(tmpField.fk){
						var alias;
						if($scope.queryFields[i].fk){
							alias = $scope.queryFields[i].fk.alias;
						}
						var tableAlias = $scope.relatedMap[alias].refTableAlias;
						filterStr +=tableAlias+"."+tmpField.fk.showColumn + " like '%" + $scope.condition + "%' ";
					}else{
						filterStr +="p_00."+$scope.queryFields[i].field + " like '%" + $scope.condition + "%' ";
					}
				}
				$scope.filter = filterStr;
				$("#"+$scope.unitName+"condition").val("");
			}else{
				var event = window.event;
				if(!event){
					$scope.filter = "";
				}else {
					var target = event.target || event.srcElement;
					if(target.title == "查询" || $scope.buttonTip == "刷新") {
						$scope.filter = "";
					}
				}
			}
		};

		//回车事件
		$scope.keydown = function($event){
			if($event.keyCode == 13){
				$scope.query();
			}
		};

		$scope.queryStatus = "没有数据";
		/** 分页对象 */
		$scope.paginationConf = {
			curItems: 0,
            currentPage: $scope.page.pageNo,
            totalItems: $scope.total,
            itemsPerPage: $scope.page.pageSize,
            pagesLength: 7,
            status:$scope.queryStatus,
            onChange: function(jumpPageNum,type){
				if(type == 'page'){
					if($scope.page.pageNo===jumpPageNum){
						return ;
					}
					$scope.page.pageNo = jumpPageNum;
					$scope.setChangePage();
				}else if(type == "pageSize"){
					if($scope.page.pageSize == jumpPageNum){
						return;
					}
					$scope.page.pageSize = jumpPageNum;
					$scope.page.pageNo = 1;
					$scope.setChangePage();
				}
			}
        };
		//抽象分页跳转动作
		$scope.setChangePage = function(){
			var viewport = $('#gridDiv_'+$scope.unitId+'>div:eq(1)');
			$(viewport).scrollTop(0,0);
			//高级查询分页跳转条件
			if($scope.advancedParam){
				$scope.advancedFilter = $scope.advancedParam;
			}
			$scope.query();
		};
		$scope.gridOptions={
			data: 'data',
			selectedItems: $scope.selectedRow,
			afterSelectionChange:function(row ,evt){
				row.type = evt.target.type != 'checkbox' ? 'cell' : 'checkbox';
				if(!$scope.lastClickedRow){
					$scope.lastClickedRow = row;
					if(row.type == 'cell'){
						$scope.lastSelected = row;
					}
				}else {
					if($scope.lastClickedRow.type == 'checkbox' && row.type != 'checkbox'){
						$scope.lastSelected = row;
					}else if($scope.lastClickedRow.type != 'checkbox' && row.type != 'checkbox'){
						$scope.lastSelected = row;
					}
					$scope.lastClickedRow = row;
				}
				setTimeout(function(){
					$(evt.target).parents('[ng-grid="gridOptions"]').find('.ngRow.selected').removeClass('selected');
					if($scope.lastSelected){
						$($scope.lastSelected.elm).addClass('selected');
					}else {
						$(evt.target).parents('[ng-grid="gridOptions"]').find('.ngRow:first').addClass('selected');
					}
				},0);
				if(row.entity && JSON.stringify(row.entity) != "{}" && evt.target.type != 'checkbox'){
					self.clickEvent(row.entity);
					$scope.$apply();
				}
			},
			showColumnMenu: true,
			enableColumnReordering: true,
			enablePinning: true,
			enableColumnResize: true,
			showFilter: false,
			multiSelect: true,
			showSelectionCheckbox: true,
			columnDefs: $scope.colDefs
		};

		self.clickEvent = function(entity){
			if($scope.tableName == 'smart00189' && $scope.selectedRow.length>0){	//如果是菜单授权
				$scope.selectedRow = [] ;
			}
			var param = {"param":entity};
			param.optionCode = "rowClick";
			param.envParams = $scope.envParams;
    		param.commonData = {};
    		param.commonData.tableName = $scope.tableName;
    		param.commonData.refColumInfo = $scope.relatedShowCfg;
    		$scope.$emit('eventDispatcher',{unit:$scope.unitName,
    			event:"rowClick",data:param});
		};
		/**
		 * 更多查询方法
		 */
		$scope.moreSearch = function(){
			var param = {};
			param.tableName = $scope.tableName;
			param.ds = $scope.buttonData.dataSource;
			param.field = $scope.colDefs;
			param.condition = $scope.advancedFilter;
			param.relatedMap = $scope.relatedMap;
			param.fieldMeta =  $scope.fieldMap;
			var dialog = dialogService.createDialog('units/templates/globalList/moreSearch.html',
					'${unitId}SearchController',param,{});
			dialog.closePromise.then(function(data){
				$scope.advancedFilter = data;
				$scope.$emit("advancedFilter",$scope.advancedFilter);
				$scope.setChangePage();
			});
		};

		/*
		$scope.optionsConf = {
			colDefs : $scope.colDefs,
			moduleId : $scope.moduleId,
			unitId : $scope.unitId,
			queryFields : $scope.queryFields,
			onChange : function(colDefs){
				$scope.colDefs = colDefs;
				$scope.flag = true;
				$scope.init($scope.unitName,$scope.moduleId);
			}
		};
		*/

		$scope.showOrHideColumn = function(){
			var unitHttp = unitsService.getSelfdomConfig($scope.moduleId,$scope.unitId,"${userId}");
			unitHttp.success(function(response1, status){
				var primaryModule = {};
				if(status == 200){
					if(response1){
						primaryModule.moduleId = $scope.moduleId;
						primaryModule.moduleInfo = response1;
						var dialog = dialogService.createDialog('assemble/list/showOrHide.html',
								'showOrHideController',primaryModule,{});
						dialog.closePromise.then(function(cfgResponse){
							console.info(cfgResponse);
						},function(error){
							//取消调用
							console.info("cancel" + error);
						});
					}else{
						unitHttp = unitsService.get($scope.unitId);
						unitHttp.success(function(response2, status){
							if(status == 200){
								primaryModule.moduleId = $scope.moduleId;
								primaryModule.moduleInfo = response2;
							}
							var dialog = dialogService.createDialog('assemble/list/showOrHide.html',
									'showOrHideController',primaryModule,{});
							dialog.closePromise.then(function(cfgResponse){
								console.info(cfgResponse);
							},function(error){
								//取消调用
								console.info("cancel" + error);
							});
						});
					}
				}
			}).error(function(data, status){
				dialogService.respError(data,status);
			});
		};

		$scope.solidify = function(){
			var userId = "${userId}";
			//用于记录顺序
			var fieldsOrder = [];
			$("div[kn-columnItem^=columnItem]").each(function(){
				var columnItem = $(this);
				//TODO 已经获取到包含controller的DIV
				for(var i=0;i<$scope.colDefs.length;i++){
					if($scope.colDefs[i].displayName == columnItem.text().trim()){
						$scope.colDefs[i].width = columnItem.width();
						fieldsOrder.push($scope.colDefs[i]);
						break;
					}
				}
			});

			//Select module info by $scope.moduleId
			var unitHttp = unitsService.getSelfdomConfig($scope.moduleId,$scope.unitId,userId);
			unitHttp.success(function(moduleInfo){
				if(moduleInfo){
					var moduleFields = moduleInfo.params.fields;
					for(var i=0;i<moduleFields.length;i++){
						for(var j=0;j<fieldsOrder.length;j++){
							if(moduleFields[i].field == fieldsOrder[j].field){
								moduleFields[i] = "";
								break;
							}
						}
					}
					//删除空元素
					for(var i=0;i<moduleFields.length;){
						if(!moduleFields[i]){
							moduleFields.splice(i,1);
						}else{
							i++;
						}
					}
					//重新排序
					for(var i=0;i<fieldsOrder.length;i++){
						moduleFields.push(fieldsOrder[i]);
					}

					moduleInfo.params.fields = moduleFields;

					/** 保存unit */
					var promise = unitsService.saveSelfdomConfig($scope.moduleId,$scope.unitId,moduleInfo,userId);
					promise.then(function() {
						/** 关闭当前窗口 */
//						$scope.cancel();
					}, function(reason) {
						//失败
						dialogService.openMsg({msg:'保存模块失败',icon:"error"});
					});
				}else{
					var unitHttp = unitsService.get($scope.unitId);
					unitHttp.success(function(moduleInfo){
						var moduleFields = moduleInfo.params.fields;
						for(var i=0;i<moduleFields.length;i++){
							for(var j=0;j<fieldsOrder.length;j++){
								if(moduleFields[i].field == fieldsOrder[j].field){
									moduleFields[i] = "";
									break;
								}
							}
						}
						//删除空元素
						for(var i=0;i<moduleFields.length;){
							if(!moduleFields[i]){
								moduleFields.splice(i,1);
							}else{
								i++;
							}
						}
						//重新排序
						for(var i=0;i<fieldsOrder.length;i++){
							moduleFields.push(fieldsOrder[i]);
						}

						moduleInfo.params.fields = moduleFields;

						/** 保存unit */
						var promise = unitsService.saveSelfdomConfig($scope.moduleId,$scope.unitId,moduleInfo,userId);
						promise.then(function() {
							/** 关闭当前窗口 */
//							$scope.cancel();
						}, function(reason) {
							//失败
							dialogService.openMsg({msg:'保存模块失败',icon:"error"});
						});
					});
				}
			});
		};

		$scope.clickEvent = function(eventName,tb){
			if($scope.$target)
				$scope.$target.css({'color':'#55B1DF','background':'#fff'});
			if(tb && tb.indexOf('gray') != -1){
				console.info('该按钮无权限!');
				return;
			}
			if($scope.paginationConf.status.indexOf('不存在') != -1){
				console.error('物理表不存在!!');
				return;
			}
			var button = self.buttonMap[eventName];
			var eventData = {};
			eventData.optionCode = button.optionCode;
			if($scope.authList){//有权限才做授权控制
				var auth = $scope.authList[button.name];
				if(auth && auth.authFlag==0){//没有授权信息、没有权限就退出
					return;
				}
			}else{
				return;
			}
			eventData.envParams = $scope.envParams;
			$scope.impAndExport = function(){
				var p = {};
				p.pageNo = $scope.page.pageNo;
				p.pageSize = $scope.page.pageSize;
				p.filter = $scope.page.filter;
				p.tableName = $scope.tableName;
				var refFilter = $scope.refFilter; // 过滤条件
				if (refFilter && refFilter != '') {
					refFilter = refFilter.substr(5);  // 去除 p00. 表前缀
				} else if($scope.fkfilter) {
					refFilter = $scope.fkfilter.substr(5); // 去除 p00. 表前缀
				}
				//取标签值
				var moduleUnitCfg = appService.getUnit($scope.unitName);
				var titleName;
				if(moduleUnitCfg){
					titleName = moduleUnitCfg.chnName;
				}else{
					titleName = $scope.unitChnName;
				}
				$scope.buttonData.selectRow = $scope.selectedRow;
				$.tempdata = {
					"buttonData":$scope.buttonData,
					"cols":$scope.colDefs,
					"page":p,
					"titleName":titleName,
					"oricolumns":$scope.columns,
					//"selectedRow": $scope.selectedRow[0], // 选中记录
					"refFilter": refFilter, // 外键过滤条件
					"orders": $scope.orders, // 排序
					"relatedShowCfg": {
						primeTableAlias:"p_00",
						relatedTableCfgs: $scope.relatedShowCfg
					}
				};
				eventData.param = $.tempdata;
				$scope.$emit("eventDispatcher",{unit:$scope.unitName,event:eventName,data:eventData});
			};

			//测试通用单据生成
//			$scope.commonCreatForm = function(){
//				//取标签值
//				var moduleUnitCfg = appService.getUnit($scope.unitName);
//				var titleName;
//				if(moduleUnitCfg){
//					titleName = moduleUnitCfg.chnName;
//				}else{
//					titleName = $scope.unitChnName;
//				}
//				$scope.buttonData.selectRow = $scope.selectedRow;
//				$.tempdata = {
//					"unitCfg":$scope.buttonData.unitCfg,
//					"titleName":titleName
//				};
//				eventData.commonData = $.tempdata;
//				$scope.$emit("eventDispatcher",{unit:$scope.unitName,event:eventName,data:eventData});
//			};
//			if($scope.selectedRow.length > 1){
//				eventName  = "batchUpdate";
//			}
			switch (eventName) {
			case "addEvent":
			case "addButton":
				if($scope.unitName == "smart0011u_list"){
					$scope.toUpdate(eventData);
					return true;
				}
				$scope.$emit("eventDispatcher",{unit:$scope.unitName,event:"addEvent",data:eventData});
//				$scope.commonCreatForm();
				break;
			case "batchUpdate":
				$scope.batchUpdate(eventData);
				break;
			case "updateEvent":
			case "updateButton":
				$scope.toUpdate(eventData);
				break;
			case "delEvent":
			case "delButton":
				//暂时停用删除按钮
				$scope.deleteRecord(eventData);
				break;
			case "refreshEvent":
			case "refreshButton":
				$scope.refresh();
//				$scope.query();
				break;
			case "printEvent":
			case "printButton":
				$scope.printData(eventData);
				break;
			case "viewEvent":
				$scope.preview();
				break;
			case "impEvent":
			case "impButton":
			case "publishButton":
			case "submitButton":
			case "testButton":
			case "upgradeButton":
			case "exportDataEvent":
			case "exportDataButton":
				$scope.impAndExport();
				break;
			case "queryEvent":
				$scope.moreSearch();
				break;
			default:
				eventData.param = $scope.selectedRow[0];
				$scope.$emit("eventDispatcher",{unit:$scope.unitName,
					event:eventName,data:eventData});
				break;
			}
		};

		$scope.batchUpdate = function(eventData){
			eventData.param = $scope.selectedRow;
			$scope.$emit("eventDispatcher",{unit:$scope.unitName,
				event:"updateEvent",data:eventData});
		};

		$scope.preview = function(){
//			if($scope.authList){//有权限才做授权控制
//				var auth = $scope.authList["preViewButton"];
//				if(auth && auth.authFlag==0){//没有授权信息、没有权限就退出
//					return;
//				}
//			}
//			if($scope.selectedRow.length==0 || $scope.selectedRow.length>1){
//				dialogService.openMsg({msg:"请选择一条预览记录！！",icon:"error"});
//				return;
//			}
//			dialogService.openMsg({msg:'记录不是单元或模块,不能预览!!!'});
//				return;
		};
		//刷新
		$scope.refresh =  function() {
			var unitCfg = ${unitConfig};
			//如果是按钮调节单元高度,就不重置单元高度
			if(!$scope.viewAssistFlag){
				self.setListDiv($scope.ratio);
			}
			var unitId = $scope.unitId;
			//把数据源告诉模块
			var ds = unitCfg.dataSource;
			var params = unitCfg.params;
			//初始化表头
			$scope.selectFKColumnInfo(params);
			var methods = unitCfg.methods;
			var buttons = unitCfg.buttons;
			var position = $scope.position;
			var unitcfg = {};
			unitcfg.dataSource = ds;
			unitcfg.cfg = unitCfg;
			unitName = $scope.unitName;
			unitcfg.relatedShowCfg = $scope.relatedShowCfg;
			appService.setUnitCfg($scope.unitName,unitcfg);
			$scope.keywords = "请输入" + $scope.keywordsArray.slice(0,2).join('或');
			if(params.filter){
				$scope.initFilter = "p_00."+params.filter;
			}
			if(params.orders){
				$scope.orders = "";
				if(params.orders.indexOf(",")!=-1){
					var orders = params.orders.split(',');
					orders.forEach(function(str,i){
						$scope.orders = "p_00."+str;
						if(i!=orders.length-1){
							$scope.orders += ", ";
						}
					});
				}else{
					$scope.orders = "p_00."+params.orders;
				}
			}
			//设置单元配置
			//appService.setUnit(unitName,{params:params,methods:methods});
			service.setUserInfo(params.tableName,$scope.unitId);
			$scope.query();
			//appService.setMainTip(unitCfg.name);
			$scope.authList = appService.newButtonAuth($scope.unitName);
			if(!$scope.authList){	//新版权限
				//authFlag取anqx的值
				$scope.authList = {};
				buttons.map(function(val,i){
					$scope.authList[val.name] = {authFlag:null};
					$scope.authList[val.name]['authFlag'] = val.anqx;
				});
			}
			for(var i=0;i<methods.length;i++){
				var tmp = methods[i];
				$scope.methods[tmp.name] = tmp;
			}
			$scope.button = {};
			$scope.changeButtons(buttons);
			//TODO
			//appService.setMainUnitTitle();
		};

		//打印
		
		$scope.printData =  function(eventData){
			//$scope.$emit("eventDispatcher",{unit:$scope.unitName,
			//	event:"printEvent",data: $scope.colDefs});
			dialogService.createDialog('units/templates/globalList/print.html','${unitId}printController',$scope.colDefs);
		};

		// 修改
		$scope.toUpdate=function(eventData){
			//取标签值
			var moduleUnitCfg = appService.getUnit($scope.unitName);
			var titleName;
			if(moduleUnitCfg){
				titleName = moduleUnitCfg.chnName;
			}else{
				titleName = $scope.unitChnName;
			}
			if($scope.selectedRow.length==0 || $scope.selectedRow.length>1){
				if($scope.operator && $scope.operator.authFlag) {	//机构授权
					$scope.operator.titleName = titleName;
					eventData.operator = $scope.operator;
				}else
				if($scope.operator && $scope.operator.mc) {//菜单授权
					$scope.operator.titleName = titleName;
					eventData.operator = $scope.operator;
				}else {
					dialogService.openMsg({msg:"请选择一条修改记录！！",icon:"error"});
					return ;
				}
			}
			if($scope.selectedRow.length==1 && $scope.operator && $scope.operator.mc){
				$scope.operator.titleName = titleName;
				eventData.operator = $scope.operator;
			}
			eventData.param = $scope.selectedRow[0];
			$scope.$emit("eventDispatcher",{unit:$scope.unitName,
				event:"updateEvent",data:eventData});
		};

		$scope.deleteRecord = function(eventData){
			if($scope.selectedRow.length==0){
				dialogService.openMsg({msg:"请选择要删除的记录！！",icon:"error"});
				return ;
			}
			var dialog = dialogService.confirm("","是否要删除该记录！！",{});
			dialog.then(function(data){
				self.wait();
				var promiseArray = [];
				for(var i=0;i<$scope.selectedRow.length;i++){
					var id = $scope.selectedRow[i][$scope.pKey];
					promiseArray.push(service.deleteRecord($scope.tableName,id));
				}
				$q.all(promiseArray).then(function(datas){
					self.hideWait();
					console.info(datas);
					dialogService.openMsg({msg:"删除成功！！",icon:"info"})
					.closePromise.then(null,function(){
						$scope.query();
					});
				},function(errorDatas){
					self.hideWait();
					console.info(errorDatas);
					dialogService.openMsg({msg:errorDatas.describe,icon:"error"})
					.closePromise.then(null,function(){
						$scope.query();
					});
				
				});
				/*deleteService.success(function (data,status){
					self.hideWait();
					dialogService.openMsg({msg:"删除成功！！",icon:"info"})
					.closePromise.then(null,function(){
						$scope.query();
					});
				}).error(function (data,status){
					self.hideWait();
					if(status=="409"){
						dialogService.openMsg({msg:jsonData.describe,icon:"info"});
					}
				});*/
			});
		};

		$scope.addRecord = function(evt,param,current){
			var data = param.data;
			var filter = "";
			var field = $scope.fieldMap[$scope.pKey];
			var encodeVal = encodeURIComponent(data[$scope.pKey]);
			if(field.dataType=="N"){
				filter = "p_00." + $scope.pKey + "=" + encodeVal;
			}else if(field.dataType=="C"){
				filter = "p_00." + $scope.pKey + "='" + encodeVal + "'";
			}
			var page = {
				pageNo : 1,
				pageSize : 5000,
				filter : filter,
				columns : $scope.page.columns
			};
			//TODO find data by id
			var relatedShowCfg = {
			    primeTableAlias:"p_00",
			    relatedTableCfgs: $scope.relatedShowCfg
			};
			$scope.paginationConf.totalItems += 1;
			var queryHttp = service.queryData($scope.tableName,page,JSON.stringify(relatedShowCfg));
			queryHttp.success(function(data){
				if(data.data.length==0){
					return ;
				}
				var newData = data.data[0];
				$scope.data.unshift(newData);
				$scope.selectedRow[0] = newData;
				$('#gridDiv_'+$scope.unitId).find('.ngRow.selected').removeClass('selected');
				$('#gridDiv_'+$scope.unitId).find('.ngRow:first').addClass('selected');
				setTimeout(function(){
					$.each($("img.ng-hide"),function(i,val){
						if($(val).attr("ng-show").length>20){
							$(val).removeClass("ng-hide");
						}
					});
				},500);

			}).error(function(data,status){
				dialogService.respError(data,status);
			});
		};

		$scope.updateRecord = function(evt,param,current){
			//兼容授权管理定制页面:回调刷新页面
			if(param.optionCode == 'refresh'){
				$scope.refresh();
				return ;
			}
			var jsonData = param.data;
			var data = $scope.data;
			// 绑定关系没有改变
			// 改变了数组内容后，控件绑定的值仍然为旧的值，所以就值不会刷新到列表上

			var filter = "";
			var field = $scope.fieldMap[$scope.pKey];
			var encodeVal = encodeURIComponent(jsonData[$scope.pKey]);
			if(field.dataType=="N"){
				filter = "p_00." + $scope.pKey + "=" + encodeVal;
			}else if(field.dataType=="C"){
				filter = "p_00." + $scope.pKey + "='" + encodeVal + "'";
			}
			var page = {
				pageNo : 1,
				pageSize : 5000,
				filter : filter,
				columns : $scope.page.columns
			};
			//TODO find data by id
			var relatedShowCfg = {
			    primeTableAlias:"p_00",
			    relatedTableCfgs: $scope.relatedShowCfg
			};
			var queryHttp = service.queryData($scope.tableName,page,JSON.stringify(relatedShowCfg));
			queryHttp.success(function(respdata){
				if(respdata.data.length==0){
					return ;
				}
				var newData = respdata.data[0];
				for(var i=0;i<data.length;i++){
					var tmp = data[i];
					if(tmp[$scope.pKey] == newData[$scope.pKey]){
						for(var key in newData){
							data[i][key] = newData[key];
						}
						break;
					}
				}
			}).error(function(data,status){
				dialogService.respError(data,status);
			});
		};

		/**
		 * 外键查询
		 */
		$scope.fkQuery = function(evt,param,current){
			$scope.page.pageNo = 1;
			$scope.fkfilter = param.envParams.filter;
			$scope.query();
		};

		$scope.simpleQuery = function(evt,param,current){
			var methodName = param.methodName;
			if(!methodName) return;
			var data = param.data;
			var envParams = param.envParams;
			for(var key in envParams){
				$scope.envParams[key] = envParams[key];
			}
			var method = $scope.methods[methodName];
			var filter = "";
			//取参数
			if(!method || !method.accessParam){//没有参数不执行方法
				return ;
			}
			var p = method.accessParam[0];
			var fieldname ="";
			if(p.name.indexOf(" ")>0){
				fieldname = p.name.split(" ")[1];
			}else{
				fieldname = p.name;
			}
			var field = $scope.fieldMap[fieldname];
			if(!field){
				var resp = service.getFieldsOfSync($scope.tableName);
				resp.success(function(resp){
					if(resp.length>0){
						$scope.fieldMap = {};
						resp.map(function(val,i){
							$scope.fieldMap[val.fieldName] = val;
						});
						field = $scope.fieldMap[fieldname];
						filter = self.explanFilter(p.name,data,"p_00",field.dataType);
						//保存环境参数
						$scope.envParams[fieldname] = {value:data,meta:field};
						//end
						$scope.refFilter = filter;
						$scope.query();
					}else {
						dialogService.openMsg({msg:"参数配置错误！！",icon:"error"});
						return;
					}
				}).
				error(function(data){
					console.info("同步查询数据信息发生异常！");
				});
			}else {
				filter = self.explanFilter(p.name,data,"p_00",field.dataType);
				//保存环境参数
				$scope.envParams[fieldname] = {value:data,meta:field};
				//end
				$scope.refFilter = filter;
				$scope.query();
			}
		};

		//通用查询
		$scope.commonQuery = function(queryData){
			//传参给授权管理controller
			queryData.data.smt_jsid = queryData.data.smt_jsbm;
			queryData.data.smt_mc = queryData.data.smt_jsmc;
			if(queryData.data && queryData.data.smt_jsid && queryData.data.smt_mc){	//菜单授权传参
				var operatorData = queryData.data;
				$scope.operator = {};
				$scope.operator.id = operatorData.smt_jsid;
				$scope.operator.mc = operatorData.smt_mc;
			}else if(queryData.authFlag){	//机构授权传参
				var operatorData = queryData.data;
				$scope.operator = {};
				$scope.operator.id = operatorData.smt_id;
				$scope.operator.authFlag = queryData.authFlag;
			}
			//1 是否有参数 Y:go on ,N:tips return
			if(!queryData){
				dialogService.openMsg({msg:queryData.unitName+"没有参数!!",icon:"error"})
					.closePromise.then(null,function(){
					self.hideWait();
				});
			}
			//2 是否有refField Y:go on ,N:tips return
			if(!queryData.refField){
				dialogService.openMsg({msg:queryData.unitName + "没有关联字段!!",icon:"error"})
					.closePromise.then(null,function(){
						self.hideWait();
				});
			}
			//4
			var refFlag = false;	//true为主单元,false为辅单元
			var refObj = null;
			//3 使用queryData.refField值在queryData.refColumInfo中查找存在column等于refField的对象
			angular.forEach(queryData.commonData.refColumInfo,function(val,key){
				if(val == queryData.refField){
					refFlag = true;
					refObj = val;
				}
			})
			//5 使用queryData.tableName值在$scope.relatedShowCfg中查找refTable等于tableName的对象
			if(!refObj){
				angular.forEach($scope.relatedShowCfg,function(val,key){
					if(val.refTable == queryData.commonData.tableName){
						refObj = val;
					}
				})
			}
			//6
			var queryVal,queryField;
			if(refObj==null){
				$scope.paginationConf.status = "没有关联字段!!";
				$scope.data = [];
				//填充空白行
				var validRows = parseInt($(".ngViewport").height()/24) - 1;
				while($scope.data.length < validRows){
					$scope.data.push({});
				}
				//清除之前选中的记录
				$scope.selectedRow.splice(0);
				//默认选择第一条记录
				/*if($scope.data && JSON.stringify($scope.data[0]) != "{}"){
					self.clickEvent($scope.data[0]);
				}*/
				return;
			}else{
				if(refFlag){
					//使用queryData.refField在queryData.data中取相同的字段值
					queryVal = queryData.data[queryData.refField];
				}else{
					//使用关联对象的refColumn属性在queryData中取相同的字段值
					queryVal = queryData.data[refObj.refColumn];
				}
				// 查询字段为关联对象的column属性
				queryField = refObj.column;
				if($scope.operator.id){
					queryField = refObj.refColumn;
				}
			}
			//7
			var filterArray = [];
			var filterObj = {};
			filterObj.field = queryField;
			filterObj.option = "=";
			filterObj.value = queryVal;
			filterObj.refFilter = "";
			filterArray.push(filterObj);
			var fieldMetaArray = [];
			for(key in $scope.fieldMap){
				fieldMetaArray.push($scope.fieldMap[key]);
			}
			filterObj = assemUtil.getFilterSQL(fieldMetaArray,filterArray);	//生成查询条件
			//8 查询条件付值到$scope.refFilter中，并调用$scope.query()方法
			if(filterObj.result == true){
				$scope.refFilter = filterObj.filter;
			}else {
				dialogService.openMsg({msg:filterObj.msg,icon:"error"}).closePromise.then(null,function(){
					self.hideWait();
				});
			}
			$scope.query();
		};

		self.explanFilter = function(cfg,value,alias,dataType){
			if(!cfg || cfg.length<1){
				return ;
			}
			var option="",field="",filter;
			if(cfg.indexOf(" ")>0){
				option = cfg.split(" ")[0];
				field = cfg.split(" ")[1];
			}else{
				option = "=";
				field = cfg ;
			}
			if(option=="under"){
				if(dataType=="C"){
					if($scope.fieldMap['smt_parent_id']){//根据smt_parent_id判断是否为树结构表
						filter = alias+"."+field + " like '" + value + "%' or "
						+ alias+"."+ $scope.pKey +" = '" + value+"'";
					}else{
						filter = alias+"."+field + " like '" + value + "%' or "
						+ alias+"."+ field +" = '" + value+"'";
					}
				}
				return filter;
			}
			if(dataType=="C"){
				filter = alias+"."+field + " "+ option + " '" + value+"'";
			}else{
				filter = alias+"."+field + " "+ option + " " + value;
			}
			return filter;
		};
		$('#assistTab a').click(function(e){
			e.preventDefault();
			$(this).tab('show');
			$('#myTabContent').css('visibility','visible');
			if(!$scope.lastParam && !$scope.savedParam && $scope.position != 'main'){
				return;
			}
			if($scope.lastParam && $scope.savedParam && $scope.lastParam != $scope.savedParam){
				$scope.callMethod(null,$scope.savedParam,null);
				$scope.lastParam = $scope.savedParam;
			}else {
				if(!$scope.data){
					$scope.callMethod(null,$scope.savedParam,null);
				}else {
					return ;
				}
			}
		});
		$scope.callMethod = function(evt,param,current,line){
			switch (param.methodName) {
				case "addRecord":
					$scope.addRecord(evt,param,current);
					break;
				case "updateRecord":
					$scope.updateRecord(evt,param,current);
					break;
				case "deleteRecord":
					$scope.deleteRecord(evt,param,current);
					break;
				case "fkQuery":
					$scope.fkQuery(evt,param,current);
					break;
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

	//打印
	angular.module("${appId}").controller("${unitId}printController",["$scope","${unitId}Service",
		"dialogService","${appId}Service","assemUtil","ibusSelectService",
		function($scope,moduleFormService,dialogService,appService,assemUtil,ibusSelectService){
			$scope.data = $scope.dialogData;

			$scope.submit = function(){
				console.log($scope.data);
			};
			$scope.closeWin = function(){
				dialogService.dismiss($scope);
			};
		}]);


	//TODO 高级查询控制器
	angular.module("${appId}").controller("${unitId}SearchController",["$scope","${unitId}Service",
		"dialogService","${appId}Service","assemUtil","ibusSelectService",
		function($scope,moduleFormService,dialogService,appService,assemUtil,ibusSelectService){
			var self = this;
			$scope.field = [];
			$scope.fieldMeta = {};
			$scope.fieldMetaObj = {};
			$scope.metas = [];
			$scope.queryData = {};
			$scope.queryHead = [];
			$scope.treeCfg={};
			$scope.fkfield = "";
			//表元数据
			$scope.tableMap = {};
			//控件缓存
			$scope.controllerMap = {};
			$scope.optionStr = [
				{key:'=',value:'等于'},
				{key:'like',value:'包含'},
				{key:"moreThen",value:'大于等于'},
				{key:'<=',value:'小于等于'},
				{key:'more',value:'大于'},
				{key:'<',value:'小于'},
				{key:'!=',value:'不等于'},
				{key:'null',value:'为空值'},
				{key:'notnull',value:'不为空值'}
			];
			$scope.comboFilter = [
				{key:"and" ,value:"并且"},
				{ key:"or",value:"或者"}
			];
			$scope.conditionArray = [{selectVal:"",condition:"",showType:"input",inputVal:"",format:"",list:"",relation:""}];
			$scope.delDisable = true;
			$scope.init = function(){
				var data = $scope.dialogData;
				$scope.field = data.field;
				$scope.fieldMeta = data.fieldMeta;
				$scope.relatedMap = data.relatedMap;
				$scope.tableName = data.tableName;
				$scope.ds = data.ds;
				//$scope.fieldMeta对象转数组
				for(var i in $scope.fieldMeta){
					$scope.metas.push($scope.fieldMeta[i]);
				}
				//设置表头数组
				$scope.field.map(function(val){
					$scope.queryHead.push({field:val.field,displayName:val.displayName});
				});
			};

			//数据项联动控件
			$scope.chooseType = function(index){
				var fieldVal= $("#queryHead_" + index).val();
				var displayName = "";
				var fieldName = fieldVal;
				var fieldMetaObj = $scope.fieldMeta[fieldVal];
				if(fieldVal && !fieldMetaObj){
					$scope.fkfield = fieldName = $scope.relatedMap[fieldVal].column;
					//关联下拉树,下拉表
					$scope.field.map(function(val){
						if(val.fk){
							var refObj = $scope.relatedMap[val.field];
							var fieldName = refObj.column;
							if($scope.fkfield == fieldName){
								var fieldMetaObj = $scope.fieldMeta[fieldName];
								var tableName = val.fk.tablename;
								//调用getTableMeta方法判断是下拉表还是下拉树
								var tableMeta = moduleFormService.getTableMetaOfSync(tableName)[0];
								$scope.tableMap[tableName] = tableMeta;
								if(tableMeta.tableType == "SX"){//下拉树
									$scope.controllerMap[fieldName] = {showType : "dropTree"};
									$scope.treeCfg[val.field] ={
										id:val.fk.primarykey,
										pid:tableMeta.parentField,
										rootPId:tableMeta.rootId,
										showName:val.fk.showColumn,
										defaultVal:null,
										ds:'${dataSource}',
										service:tableName
									};
								}else{//下拉表
									var queryHttp = moduleFormService.queryData(tableName);
									queryHttp.success(function(data,status){
										var fkArray = data.data;
										var key = val.fk.primarykey;
										var value = val.fk.showColumn;
										var tmpfkArray = [];
										fkArray.map(function(val){
											var obj = {};
											obj.key = val[key];
											obj.value = val[value];
											tmpfkArray.push(obj);
										});
										$scope.conditionArray[index] = {
											selectVal:fieldVal,
											condition:$("#queryCondition_" + index).val(),
											inputVal:"",
											showType : 'dropFrame',
											fkArray: tmpfkArray,
											format: '',
											relation:$("#queryRelation_" + index).val()
										};
										changeCss();
									});
								}
							}
						}
					});
					fieldMetaObj = $scope.fieldMeta[fieldName];
				}

				if(!(fieldMetaObj && fieldMetaObj.chnName)){
					$scope.conditionArray[index] = {
						selectVal:fieldVal,
						condition:"=",
						inputVal:"",
						format:"",
						list:"",
						showType:"input",
						relation:"or"
					};
					return;
				}
				if(fieldMetaObj.valuespace){
					fieldMetaObj.valuespace = fieldMetaObj.valuespace.toLowerCase();
				}
				if(!fieldMetaObj.format){
					if(fieldMetaObj.dataType =="D"){
						fieldMetaObj.format = "yyyy-MM-dd";
						//D类型有显示格式就按照显示格式来显示
						if(fieldMetaObj.displayFormat){
							fieldMetaObj.format = fieldMetaObj.displayFormat;
						}
					}else if(fieldMetaObj.dataType =="C"){
						if(fieldMetaObj.valuespace == "file"){
							fieldMetaObj.format = "";
						}else if(fieldMetaObj.valuespace == "gb/t 7408 yyyy"){
							fieldMetaObj.format = "yyyy";
						}else if(fieldMetaObj.valuespace == "gb/t 7408 yyyymm"){
							fieldMetaObj.format = "yyyy-MM"
						}else if(fieldMetaObj.valuespace == "gb/t 7408 yyyymmdd"){
							fieldMetaObj.format = "yyyy-MM-dd"
						}else if(fieldMetaObj.valuespace == "gb/t 7408 hhmmss"){
							fieldMetaObj.format = "HH:mm:ss"
						}else if(fieldMetaObj.valuespace == "gb/t 7408 yyyymmddthhmmss"){
							fieldMetaObj.format = "yyyy-MM-dd HH:mm:ss"
						}else if(fieldMetaObj.valuespace == "gb/t 7408 yyyymmddhhmmsssss"){
							fieldMetaObj.format = "yyyy-MM-dd HH:mm:ss"
						}else{
							fieldMetaObj.format = "";
						}
					}else  {
						fieldMetaObj.format = "";
					}
				}
				var showType = "input" ;
				var tmpMap = $scope.controllerMap[fieldName];
				if(tmpMap && tmpMap.showType){
					showType = tmpMap.showType;
				}
				if(fieldMetaObj.format){
					showType = "date";
				}
				$scope.conditionArray[index] = {
					selectVal:fieldVal,
					condition:$("#queryCondition_" + index).val(),
					inputVal:"",
					showType : showType,
					fkArray:tmpMap?tmpMap.fkArray :null,
					format:fieldMetaObj.format,
					relation:$("#queryRelation_" + index).val()
				};
				function changeCss(){
					//等待视图刷新获取元素改变下拉列表样式
					setTimeout(function(){
						$('div#inputCdt____index___chosen.chosen-container.chosen-container-single a.chosen-single').css('width','150px');
						$('div#inputCdt____index___chosen.chosen-container.chosen-container-single div.chosen-drop').css('width','150px');
					},100);
				}
			};
			//查询字段
			$scope.queryField = function() {
				var jsonData = $scope.metas;
				if(jsonData.length>0){
					var fields = jsonData;
					for(var i=0;i<fields.length;i++){
						var tmp = fields[i];
						$scope.fieldMap[tmp.fieldName] = tmp;
					}
				}
			};

			//查询按钮
			$scope.queryCons = function(){
				$scope.filter = [];
				try {
					$scope.conditionArray.map(function(val,index){
						var singleFilter = {};
						//转换外键字段
						var fieldVal = $("#queryHead_" + index).val();
						var fieldMetaObj = $scope.fieldMeta[fieldVal];
						if(fieldVal && !fieldMetaObj){
							fieldVal = $scope.relatedMap[fieldVal].column;
						}
						singleFilter.field = fieldVal;
						singleFilter.option = $("#queryCondition_" + index).val();
						singleFilter.value = $("#inputCdt_" + index).val();
						singleFilter.refFilter = $("#queryRelation_" + index).val();
						if(singleFilter.field && singleFilter.option){
							$scope.filter.push(singleFilter);
						}else if(!singleFilter.field && singleFilter.option){
							throw("数据项不能为空！！");
						}else if(singleFilter.field && !singleFilter.option){
							throw("条件不能为空！！");
						}else if(!singleFilter.field && !singleFilter.option){
							throw("数据项和条件不能为空！！");
						}
					});
					var filter = "";
					var filterObj = assemUtil.getFilterSQL($scope.metas,$scope.filter,$scope.relatedMap,moduleFormService);
					if(filterObj.result == true){
						filter = filterObj.filter;
						dialogService.close($scope,filter);
					}else {
						throw(filterObj.msg);
					}
				} catch (e) {
					dialogService.openMsg({msg:e,icon:"error"});
				}

			};

			//添加一行查询条件
			$scope.addCons = function(){
				$scope.conditionArray.push({selectVal:"",condition:"",showType:"input",inputVal:"",format:"",list:"",relation:""});
				if($scope.conditionArray.length >= 1){
					$scope.delDisable = false;
				}
				$scope.$apply();
			};
			//删除一行查询条件
			$scope.delCons = function(index){
				if($scope.conditionArray.length > 1){
					$scope.conditionArray.splice(index,1);
				}
				if($scope.conditionArray.length == 1){
					$scope.delDisable = true;
				}else {
					$scope.delDisable = false;
				}
			};

			$scope.close = function(data){
				dialogService.dismiss($scope,"closeAll");
			};
			$scope.cancel = function(){
				dialogService.dismiss($scope);
			};
			self.hideWait = function(){
				dialogService.hideWait(self.waitObj);
			};
			self.wait = function(){
				self.waitObj = dialogService.wait();
			};
		}]);
})();
