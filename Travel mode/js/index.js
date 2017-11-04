
    function initMap(arr) {
    	var latlons = {
	        map: arr[0],  //纬度  经度
	        src1: arr[0],
	        trg1: arr[1]
        };
        var map = new L.map('map',{
    		attributionControl:false
	    }).setView(latlons.map, 14);
	    
	    // initialise the base map
      	r360.basemap({ style: 'basic', apikey: 'BOO57A0UOO26DZY3AVI9LO2' }).addTo(map);
      	
      	// create a target marker icon to be able to distingush source and targets
        var redIcon = L.icon({
          iconUrl: 'http://assets.route360.net/leaflet-extras/marker-icon-red.png',
          shadowUrl: 'http://assets.route360.net/leaflet-extras/marker-shadow.png',
          iconAnchor: [12, 45],
          popupAnchor: [0, -35]
        });
	    
        // create a source and a two target markers and add them to the map
        var sourceMarker1 = L.marker(latlons.src1,{draggable : true }).addTo(map);
        var targetMarker1 = L.marker(latlons.trg1, { icon: redIcon,draggable : true }).addTo(map);
      
        // add a layer in which we will paint the route
	      var routeLayer = L.featureGroup().addTo(map);
	
	      var getRoutes = function(type) {
	
	        routeLayer.clearLayers();
	
	        // you need to define some options for the polygon service
	        // for more travel options check out the other tutorials
	        var travelOptions = r360.travelOptions();
	        // we only have one source which is the marker we just added
	        travelOptions.addSource(sourceMarker1);
	        // add two targets to the options
	        travelOptions.addTarget(targetMarker1);
	        // set the travel type to transit
	        travelOptions.setTravelType(type); //walk  bike  car   transit
	        // no alternative route recommendations - this is for pro/advanced plans only
	        travelOptions.setRecommendations(-1);
	        // please contact us and request your own key
	        travelOptions.setServiceKey('BOO57A0UOO26DZY3AVI9LO2');
	        // set the service url for your area
	        travelOptions.setServiceUrl('https://service.route360.net/germany/');
	
	        // start the service
	        r360.RouteService.getRoutes(travelOptions, function(routes) {
	          // one route for each source and target combination
	          routes.forEach(function(route) {
//	          	console.log(route)
	          	console.log("距离："+route.getDistance()+"\n时间："+route.getTravelTime())
	            r360.LeafletUtil.fadeIn(routeLayer, route, 1000, "travelDistance");
	          });
	        });
	      }
	
	      
	      sourceMarker1.on('dragend', function(){
	      	getRoutes(type)
	      });
	      
     	  targetMarker1.on('dragend',  function(){
	      	getRoutes(type)
	      });
     	      
     	  var travelType = document.getElementById("Traveltype");
     	  var type;
     	  travelType.onchange = function(){
     	  	type = this.value; 
     	  	getRoutes(type)
     	  }
			
		  travelType.onchange();	
    }

    
    
    var arr = [
    	{
    		lat: 48.84850731,
            lng: 2.356224060
    	},
    	{
    		lat: 48.85054059,
            lng: 2.372617721
    	}
    ]
	initMap(arr)
	
