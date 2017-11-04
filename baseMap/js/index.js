
    /*** 存放关于地图信息	***/
	var mapData = {
	    locationMarker: undefined,   //当前位置的点
	    markers: [],  //所有的markers数组
	    popup:{},	//提示面板
	    localGroup: [], //当前位置的数组
	    initMap:{},  //初始地图信息
	    operationData: undefined,  //预约的数据
	    opeBikeNumber: undefined,   //预约的车辆编号
	    position: true,  //不能多次定位
	    curPosition: null   //当前的位置经纬度
	}
	

	var map;  //地图的实例
	function getInitLocation(){
		
		var data = {
			retCode: 1,
			info:{
				lat: "36.3818763",
				lon: "111.6789793",
				zoom: 12
			}
		};
		var info = data.info;
		if( data.retCode == 1 ){
			mapData.initMap = info;
			/*  地图的实例   */
		    map = new L.map('map',{
		    	attributionControl:false,
		    	center: [info.lat, info.lon],
		    	zoom: info.zoom
		    });
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
//			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//				maxZoom: 17,
//				attribution: '',
//				id: 'mapbox.streets'
//			}).addTo(map);
			
			//设置当前位置
			onLocationFound({
				latlng: [info.lat, info.lon]
			})
		
			//获取附近的车辆
   			getMarker();
		}
	}
	
	getInitLocation()
	
    /***	清除地图	***/
	function clearMap(){
	  	//清空当前点
       var local = mapData.localGroup;
       (local.length != 0) && local.clearLayers();
//     //清空所有的maskers
//     var markers = mapData.markers;
//     (markers.length != 0) && markers.clearLayers();
	}

    /****  获取定位信息   ****/    
    function getGeolocation(callback) {
		//开始定位
//		map.locate({setView: true,maxZoom: 20,timeout: 100000});		
//  	//注册事件
//	    map.on('locationfound', onLocationFound); 
//		map.on('locationerror', handleLocationError);
		if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
           var point = {
           		latlng:{
           			lat: position.coords.latitude,
           			lng: position.coords.longitude
           		}
           }
          },
          function(state) {
            handleLocationError(true);
          },{
          	enableHighAccuracy: true
          });
          //获取移动时的位置
		  navigator.geolocation.watchPosition(showMovePosition);
        } else {
          handleLocationError(false);
        }
    }
    
    //成功的回调
	function onLocationFound(e) {
		//清空地图
		clearMap()
		   
	    var icon = new L.icon({
	    	iconUrl: 'img/positionPoint.png'
	    });
	    var marker = new L.marker(e.latlng,{icon:icon});

	    var layers = [];
	    layers.push(marker);
	    var myGroup=L.layerGroup(layers); 
	    map.addLayer(myGroup); 
	    mapData.localGroup = myGroup;
	    map.setView(e.latlng,mapData.initMap.zoom)  
	  }
	
    //错误信息的回调函数
    function handleLocationError(browserHasGeolocation) {      	
      	var content = '';
        browserHasGeolocation? content = "定位失败":content = "您的浏览器不支持定位"
        confirm({
        	content: content,
        	yes:function(index){
        		browserHasGeolocation && getGeolocation()
        		layer.close(index);
        	}
        })
    }
      
    //移动的位置 5s 获取一次
    var showLock = true;
    function showMovePosition(position){  
      	var end = {
		      	    lat: position.coords.latitude,
		      	    lng: position.coords.longitude
		      	 };
		mapData.curPosition = end;  	    
	}
      
    /***	获取附近的车辆 	***/
    function getMarker(){
      	var marker = [
				        {lat: 36.3805903,lng:111.7249225,pnum: '10',bnum: "5"},
				        {lat: 36.3639853,lng:111.7088426,pnum: '10',bnum: "2"},
					    {lat: 36.3504984,lng:111.6561121,pnum: '10',bnum: "6"},
					    {lat: 36.3997555,lng:111.6615553,pnum: '10',bnum: "8"}			   
      	  			];
      	  			  
	    for( var i= 0; i<marker.length; i++ ){
	    	//单个的masker点
      	 	var point = [
      	 		marker[i].lat,  //纬度
      	 		marker[i].lng   //经度
      	 	]
      	 	//自执行函数
      	 	!function(point,data,i){
      	 		addMarker(point,data,i)
      	 	}(point,marker[i],i)
      	} 
      	
      	// 所有的markers 添加到地图
      	var layers = mapData.markers;
      	var myGroup=L.layerGroup(layers); 		  
		map.addLayer(myGroup);
		mapData.markers = myGroup;
		
		//设置地图的视图
		var arr = [mapData.initMap.lat, mapData.initMap.lon];
  	    var zoom = mapData.initMap.zoom;
  	    map.setView(arr,zoom);  			  
      	
		//设置提示面板的字符串
		function setTipHtml(data){
		    var tipHtml  = '<div class="inner">';
		 	tipHtml += '<p class="top">'+data.pnum+'</p>';
		 	tipHtml += '<p class="bot">'+data.bnum+'</p>';
		 	tipHtml += '</div>';
		 	return tipHtml;
		}
		
		//单个的marker
      	function addMarker(point,data,i){
	        var icon = new L.icon({
		    	iconUrl: 'img/zhu.png'
		    });    
	        var layer = new L.marker(point, {icon: icon});
	        layer.addTo(map);
	    	layer.bindPopup(setTipHtml(data),{
	    		className: "adaTipPan",
	    		offset:[20,0],
	    		closeButton: false
	    	});
	    	//默认打开第一个提示面板
	    	if(i == 0){
	    		layer.openPopup()
	    	}
	        mapData.markers.push(layer);  
      	}
      	   
      }
       
    //定位的调用             
    getGeolocation() 
           