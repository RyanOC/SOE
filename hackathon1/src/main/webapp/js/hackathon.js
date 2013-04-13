/**
 * @author Edward H. Seufert
 */

//////////////////////////////////////////////////// Activities ////////////////////////////////////////////////////
var hackathonObj = new hackAthon();

function hackAthon(){
	this.ajaxFunc = "hunter";
	this.headerArea = null;
	this.hackathonArea = null;
	this.hackathonTab = null;
	this.member = null;
	this.members = null;
	this.receiverId = null;
	this.responseCache = null;
	this.radiusX = 1;
	
	/////////////////////////////////// init hackathon ////////////////////////
	this.init = function(){
		this.hackathonArea = document.createElement('div');
		this.hackathonArea.setAttribute("id","hackathon-area");
		this.hackathonArea.setAttribute("class","ui-boxColumn90");
		hackUtilsObj.containerContentObj.appendChild(this.hackathonArea);
		this.initHunter();
	}; // init
	
	this.initHunter = function(){
		var callUrl = hackUtilsObj.restUrl + this.ajaxFunc + "/init";
		var requestFacade = new Object();
		jQuery.ajax({ type: "POST",
			url: callUrl,
			data: JSON.stringify(requestFacade),
			contentType:"application/json; charset=utf-8",
			dataType: "json",
			success: function(JSONData){
				if (JSONData == null){
					hackUtilsObj.serverErrorMessage();
				} else if (JSONData.status == "ERROR"){
					hackUtilsObj.applicationErrorMessage(JSONData);
				} else if (JSONData.status == "INFO"){
					hackUtilsObj.applicationInfoMessage(JSONData);
				} else {
					hackUtilsObj.clearErrorMessages();
					hackathonObj.processInitMembers(JSONData);
				}
				//closeStatusDialog();
			},
			error: hackathonObj.errorMessage
		});
	}; // initBottles
	
	this.processInitMembers = function(JSONData){
		var iHTML = "";
		var members = JSONData.members;
		iHTML += "<div id='map_canvas'></div>";	
		this.hackathonArea.innerHTML = iHTML;
		this.refreshMap();
	}; // processInitMembers
	
	this.loadSchools = function(){
		var callUrl = hackUtilsObj.restUrl + this.ajaxFunc + "/kml/zombies";
		var requestFacade = new Object();
		jQuery.ajax({ type: "GET",
			url: callUrl,
		//	data: JSON.stringify(requestFacade),
			contentType:"application/json; charset=utf-8",
			dataType: "json",
			success: function(JSONData){
				if (JSONData == null){
					hackUtilsObj.serverErrorMessage();
				} else if (JSONData.status == "ERROR"){
					hackUtilsObj.applicationErrorMessage(JSONData);
				} else if (JSONData.status == "INFO"){
					hackUtilsObj.applicationInfoMessage(JSONData);
				} else {
					hackUtilsObj.clearErrorMessages();
					hackathonObj.drawMap(JSONData);
				}
				//closeStatusDialog();
			},
			error: hackathonObj.errorMessage
		});
	};
	
	this.drawMap = function(JSONData){
		var map = null;
        var colors = {strokeColor: "#0000FF",strokeOpacity: 0.3,strokeWeight: 4,fillColor: "#00FFFF",fillOpacity: 0.2};
        var div = document.getElementById("map_canvas");
        var center = new google.maps.LatLng(27.945469, -82.535316);
        map = new google.maps.Map(div, {
            zoom: 12,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        var bounds = null;
        //map.fitBounds(bounds);
        var things = JSONData;
        for (var i = 0; i < things.length; i++) {
            var path = [];
            var cords = things[i].cords;
            if (cords.length > 1){
            	for (var j = 0; j < cords.length; j++) {
            		var splitLL = cords[j].split(",");
            		if (jQuery.trim(splitLL[0]) != "") {
            			var lat = parseFloat(splitLL[0]);
            			var long = parseFloat(splitLL[1]);
            			var point = new google.maps.LatLng(long, lat);
            			path.push(point);
            		}
            	}

            	var shape = new google.maps.Polygon({
            		paths: path,
            		strokeColor: "gold",
            		strokeOpacity: 1.0,
            		strokeWeight: 3,
            		fillColor: "yellow",
            		fillOpacity: 0.8,
            		map: map
                	});

            	var name = things[i].name;
            	shape.setMap(map);
            } else {
            	var splitLL = cords[0].split(",");
            	jQuery.trim(splitLL[0]);
        		var lat = parseFloat(splitLL[0]);
        		var long = parseFloat(splitLL[1]);
        		var myLatLng = new google.maps.LatLng(long, lat);
        		var image = 'img/mb_zombie.png';
                var marker = new google.maps.Marker({ 
                	position: myLatLng, 
                	map: map,
                	icon: image
                	});
                
                marker.setMap(map);
                myRadius = this.radiusX * 200;
                var circle = new google.maps.Circle({
                    map: map,
                    center: myLatLng,
                    fillColor: "red",
                    fillOpacity: 0.2,
                    strokeColor: "orange",
                    strokeOpacity: 0.4,
                    strokeWeight: 2,
                    radius: myRadius
                });
            }
            
        }
        google.maps.event.addListenerOnce(map, 'idle', function () {
        	google.maps.event.trigger(map, 'resize');
        	});
        this.radiusX = this.radiusX + 1;
	}; // processCountyMap
	
	this.refreshMap = function(){
		this.loadSchools();
		setTimeout('hackathonObj.refreshMap()',10000);
	}; // refreshMap
};// HackAthon