//获取网址参数
var urlVal = getQueryString("url");
if(urlVal){
	$('.back-link').addClass("others");
}
//初始化iscroll
var myScroll = "";
pullUpEl = document.getElementById('pullUp');
pullUpOffset = 10;
pullUpLock = true;
myScroll = new iScroll('wrapper', {
	preventDefault: false,
	vScrollbar: false,
	freeScroll: true,
	probeType: 2,
	click: false,
	useTransition: true,
	// topOffset: pullDownOffset,
	onRefresh: function() {
		if(pullUpEl.className.match('loading')) {
			pullUpEl.className = '';
			pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
		}
		document.getElementById("pullUp").style.display = "none";
	},
	onScrollMove: function() {		
		if(this.scrollerH < this.wrapperH && this.y < (this.minScrollY - pullUpOffset) || this.scrollerH > this.wrapperH && this.y < (this.maxScrollY - pullUpOffset)) {
			document.getElementById("pullUp").style.display = "";
			pullUpEl.className = 'flip';
			pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
			
		}
		if(this.scrollerH < this.wrapperH && this.y > (this.minScrollY - pullUpOffset) && pullUpEl.className.match('flip') || this.scrollerH > this.wrapperH && this.y > (this.maxScrollY - pullUpOffset) && pullUpEl.className.match('flip')) {
			document.getElementById("pullUp").style.display = "none";
			pullUpEl.className = '';
			pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
		}
		if(!pullUpLock){			
			$("#footerTitle").show();
			$("#pullUp").hide();
		}

		
	},
	onScrollEnd: function() {
		if(pullUpEl.className.match('flip') && pullUpLock) {
			pullUpEl.className = 'loading';
			pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
			// pullUpAction(); // Execute custom function (ajax call?)
			var num = parseInt($("#pageId").val()) + 1;
			console.log(defQuery);
			if(allNum >= num) {
				var foYear = $('.ca_date').html();
				//获取年
				var yyy = foYear.split('年')[0];
				//获取月
				var ddd = foYear.split('年')[1].toString().split('月')[0];
	            addLoading();
	            
	            $('#list').queryData(yyy,ddd,num,defQuery);
	            
	    		// timeMoney(yyy, ddd,num);
			} else {
				$("#footerTitle").show();
				$("#pullUp").hide();
			}
		}
	}
});
document.addEventListener('touchmove', function(e) {
	e.preventDefault();
}, isPassive() ? {
	capture: false,
	passive: false
} : false);

function isPassive() {
	var supportsPassiveOption = false;
	try {
		addEventListener("test", null, Object.defineProperty({}, 'passive', {
			get: function() {
				supportsPassiveOption = true;
			}
		}));
	} catch(e) {}
	return supportsPassiveOption;
}

function addLoading() {
	var content = '<div id="loading"><div class="loading-dailog"></div><div class="loading"><p><span class="loading-img"></span></p><p style="color:#fff;font-size: .5rem;"><span>加载中</span></p></div></div>';
	$('body').append(content);
}

function delLoading() {
	$('#loading').remove();
}
/*$('#back').on('click', function(event) {
	event.preventDefault();
	// window.location.href = "/smart-micro-wisdom/view/home/appList.html";
	history.go(-1);
});*/

function getDaysInOneMonth(year, month){
  month = parseInt(month, 10);
  var d= new Date(year, month, 0);
  return d.getDate();
}

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
