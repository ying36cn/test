(function() {
	angular.module("${appId}").factory("${unitId}Service", function($http, $q,authTools,$rootScope) {
		var ibusDevRestServiceBaseURL = '${ibusDevRestServiceBaseURL}';
		var restFulBaseUrl = '${dataSource}';
		var authUrl = "${authBaseURL}";
		var init = function(){
			$rootScope.userInfo = ${userJson};
		}();
		var userInfo = ${userJson};
		var findDataOfSync = function(tableName,obj){
			var response,url;
			if(tableName){
				url = restFulBaseUrl + "/" + tableName;
			}else{
				url = restFulBaseUrl;
			}
			$.ajax({
				url : url,
				headers: {'Authorization': 'Basic Qzsda231231','userInfo': encodeURI('${userJson}')},
				type : "GET",
				dataType : "json",
				data:obj,
				async : false,
				success : function(data){response = data.data;},
				error : function(resource){response = [];}
			});
			return response;
		};
		var query = function (service,cfg){
			var url = "";
			if(service && service.length>0){
				url = restFulBaseUrl + "/" + service;
			}else{
				url = restFulBaseUrl;
			}
			return $http({
				method:"GET",
				cache:true,
				headers: {
					'Authorization': 'Basic Qzsda231231',
					'userInfo':encodeURI(JSON.stringify(userInfo))
				},
				url: url,
				params:cfg
			});
		};
		var leftJoinQuery = function (service,cfg,refInfo){
			var url = "";
			if(service && service.length>0){
				url = restFulBaseUrl + "/" + service;
			}else{
				url = restFulBaseUrl;
			}
			return $http({
				method:"GET",
				headers: {
					'Authorization': 'Basic Qzsda231231',
					'userInfo':encodeURI(JSON.stringify(userInfo)),
					'relatedShowCfg':refInfo
				},
				url: url,
				params:cfg
			});
		};
		var del = function (service,id){
			var url = "";
			if(service && service.length>0){
				url = restFulBaseUrl + "/" + service;
			}else{
				url = restFulBaseUrl;
			}
			var deferred = $q.defer();
			$http({
				method:"DELETE",
				headers: {'userInfo': encodeURI(JSON.stringify(userInfo))},
				url: url +"/"+id
			}).success(function(data,status){
				deferred.resolve(data);
			}).error(function(data,status){
				console.error('status:' + status + ',error:' + data);
				deferred.reject(data);
			});
			return deferred.promise;
		};
		var queryMeta = function (service,cfg){
			var url = restFulBaseUrl + "/" + service + "/meta";
			return $http({
				method:"GET",
				cache:true,
				headers: {
					'Authorization': 'Basic Qzsda231231',
					'userInfo':encodeURI(JSON.stringify(userInfo))
				},
				url: url,
				params:cfg
			});
		};
		
		var getFieldsOfSync = function(service,obj){
			var url = restFulBaseUrl + "/" + service + "/meta?orders='xspx'";
			return $.ajax({
				url : url,
				type : "GET",
				data:obj,
				headers: {'Authorization': 'Basic Qzsda231231','userInfo': encodeURI(JSON.stringify(userInfo))},
				dataType : "json"
			});
		};
		return {
			getTableMetaOfSync : function(tableName){
				var obj = {};
				obj.filter = "tableName = '" + tableName+"'";
				return findDataOfSync(null,obj);
			},
			queryData : function(tableName,obj,refInfo) {
				//userInfo = authTools.queryAuth(userInfo);
				//调用查询方法查询数据
				if(refInfo){
					return leftJoinQuery(tableName,obj,refInfo);
				}else{
					return query(tableName,obj);
				}
			},
			queryMeta : function(tableName) {
				return queryMeta(tableName);
			},
			deleteRecord : function(tableName,obj) {
				return del(tableName,obj);
			},
			getFieldsOfSync : function(service,obj){
				return getFieldsOfSync(service,obj);
			},
			setUserInfo:function(tableName,unitId){
				userInfo.extendProperty.tableName = tableName;
				//userInfo.extendProperty.unitId = unitId;
			}
			
		};
	});
})();