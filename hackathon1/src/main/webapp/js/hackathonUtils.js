/**
 * Author Ed Seufert
 */

var hackUtilsObj = new hackathonUtils();

function hackathonUtils(){
	this.statusDialogContainer = null;
	this.restUrl = null;
	this.containerMenuObj = null;
	this.containerContentObj = null;
	this.containerErrorObj = null;
	this.containerSuccessObj = null;
	this.clientType = 'full';
	this.lang = 'en';
	this.imageDir = "/img/";
	this.cssDir = "/css/";
	this.contextPath = null;
	
	
	this.init = function(containerMenu,containerContent,containerError,containerSuccess,restUrl){
		this.restUrl = restUrl;
		this.containerMenuObj = document.getElementById(containerMenu);
		this.containerContentObj = document.getElementById(containerContent);
		this.containerErrorObj = document.getElementById(containerError);
		this.containerSuccessObj = document.getElementById(containerSuccess);
	}; // init
	
	
	this.fillSelect = function(list,selectObj,first){
		//var selectObj = document.getElementById(select);
		selectObj.length = 0;
		// add initial option
		var newOpt = document.createElement('option');
		newOpt.text = first;
		newOpt.value = -1;
		try {
			selectObj.add(newOpt,null); //Standard
		} catch(ex){
			selectObj.add(newOpt);  //IE Only
		}
		if (list != null && list.length > 0){
			// add the option from the server
			for (var i in list){
				if (list.hasOwnProperty(i)) {
					var itemObj = list[i];
					var newOpt = document.createElement('option');
					newOpt.text = itemObj.name;
					newOpt.value = itemObj.id;
					try {
						selectObj.add(newOpt,null); //Standard
					} catch(ex){
						selectObj.add(newOpt);  //IE Only
					}
				}
			}
		}
	}; //fillSelect
	this.checkAuth = function(){
		// user in role
		if(userRoles.view != null && userRoles.view == true){
			return true;
		} else if(userRoles.contrib != null && userRoles.contrib == true){
			
		} else if(userRoles.admin != null && userRoles.admin == true){
			
		} else {
			this.hide(addProjectObj);
			this.hide(addProjectGrpObj);
			this.hide(addLaneObj);
			this.hide(addGateObj);
			this.hide(addPostObj);
			
		}
	}; // checkauth
	this.show = function(container){
		container.style.display = "inline-block";
	}; // show
	this.hide = function(container){
		container.style.display = "none";
	}; // hide
	
	this.errorMessage = function(errorStatus){
		if (errorStatus.status == 200){
			// this is for errors that give a false 200 send to login
			redirectUrl = errorStatus.getResponseHeader("Location");
			var newItem = document.createElement('div');
			newItem.id = "errorText";
			newItem.innerHTML = "Your session has Expired";
			this.pluginArea.appendChild(newItem);
			jQuery("#errorDialog").dialog( "option", "buttons", { "Ok": function() { 
				window.location.href = redirectUrl;
				jQuery(this).dialog("close"); } });
		} else {
			//openErrorDialog();
			//var newItem = document.createElement('div');
			//newItem.id = "errorText";
			//newItem.innerHTML = "Error: "+ errorStatus.statusText +"!! Please try and perform your action again. If this happens again contact the system administrator.";
			//this.pluginArea.appendChild(newItem);
			window.location.href = "home.fly";
		}
	}; // errorMessage
	
	this.serverErrorMessage = function(){
		this.containerErrorObj.innerHTML = "JSON data is missing";
		this.containerErrorObj.style.display = "inline-block";
	}; //serverErrorMessage

	this.applicationErrorMessage = function(JSONData){
		this.containerErrorObj.innerHTML = JSONData.statusMessage;
		this.containerErrorObj.style.display = "inline-block";
	}; // applicationErrorMessage
	
	this.applicationInfoMessage = function(JSONData){
		this.containerErrorObj.innerHTML = JSONData.statusMessage;
		this.containerErrorObj.style.display = "inline-block";
	}; // applicationInfoMessage
	
	this.clearErrorMessages = function(){
		this.containerErrorObj.innerHTML = "";
		this.containerErrorObj.style.display = "none";
	}; //clearErrorMessages
	
	this.applicationSuccessMessage = function(JSONData){
		this.containerSuccessObj.innerHTML = JSONData.statusMessage;
		this.containerSuccessObj.style.display = "inline-block";
		setTimeout("esUtilsObj.clearSuccessMessages()", 1000);
	}; // applicationStatusMessage
	
	this.clearSuccessMessages = function(){
		this.containerSuccessObj.innerHTML = "";
		jQuery(this.containerSuccessObj).fadeOut();
		//this.containerSuccessObj.style.display = "none";
	}; //clearSuccessMessages
	
	this.statusDialog = function(type){
		if (type == "open"){
			soeComponentUtils.show(this.statusDialogContainer);
		} else if(type == "create"){
			if(this.statusDialogContainer == null){
				this.statusDialogContainer = document.createElement('div');
				this.statusDialogContainer.id = this.main + "-status";
				this.statusDialogContainer.style.display = "none";
				var iHTML = "<p>Processing...</p><img src='"+this.imgHome+"spinner.gif'/>";
				this.statusDialogContainer.innerHTML = iHTML;
				var pluginArea = document.getElementById(this.main);
				pluginArea.appendChild(this.statusDialogContainer);
			}
		} else {
			soeComponentUtils.hide(this.statusDialogContainer);
		}
    }; // statusDialog
    
    this.createErrorMessage = function(id,message){
    	if (!document.getElementById("error-"+id)){
    		var mySpan = document.createElement('span');
    		mySpan.id = "error-"+id;
    		mySpan.className = "ui-error-message";
    		mySpan.innerHTML = message;
    		document.getElementById("wrap-"+id).appendChild(mySpan);
    	}
	}; // createErrorMessage
	
	this.removeErrorMessage = function(id){
		var child = document.getElementById("error-"+id);
		if (child){
			document.getElementById("wrap-"+id).removeChild(child);
		}
	}; //removeErrorMessage
	
	this.getMouseXY = function(event) {
		var coords = new Array();
		coords[0] = 0;
		coords[1] = 0;
		var e = null;
		if (!event){
			e = window.event;
		} else {
			e = event;
		}
		var IE = document.all ? true : false ;
		if (IE && (e.clientX || e.clientY)) { // grab the x-y pos.s if browser is IE
		    coords[0] = e.clientX + document.body.scrollLeft;
		    coords[1] = e.clientY + document.body.scrollTop;
		} else if (e.pageX || e.pageY) {  // grab the x-y pos.s if browser is NS
		    coords[0] = e.pageX;
		    coords[1] = e.pageY;
		}  
		return coords;
	}; //getMouseXY
	
	this.getQueryStringValue = function(paramName){
		var p = escape(unescape(paramName));
	    var regex = new RegExp("[?&]" + p + "(?:=([^&]*))?","i");
	    var match = regex.exec(window.location.search);
	    var value = null;
	    if( match != null ){
	    	value = match[1];
	    }
	    return value;
	};
	
	this.adjustStyle = function(width,cssname,contextPath) {
		width = parseInt(width);
	    if (width < 471 || (navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1)) {
	        jQuery("#page-stylesheet").attr("href", contextPath + this.cssDir + cssname + "/small.css");
	        jQuery("#jquery-stylesheet").attr("href", "http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css");
	        this.clientType = 'mobile';
	    } else if ((width >= 472) && (width < 900) || (navigator.userAgent.indexOf('iPad') != -1)) {
	        jQuery("#page-stylesheet").attr("href", contextPath + this.cssDir + cssname + "/medium.css");
	        jQuery("#jquery-stylesheet").attr("href", "http://code.jquery.com/ui/1.8.17/themes/ui-lightness/jquery-ui.css");
	        this.clientType = 'tablet';
	    } else {
	       jQuery("#page-stylesheet").attr("href", contextPath + this.cssDir + cssname + "/full.css");
	       jQuery("#jquery-stylesheet").attr("href", "http://code.jquery.com/ui/1.8.17/themes/ui-lightness/jquery-ui.css");
	       this.clientType = 'full';
	    }
	}; // adjustStyle
	
	this.moveAnimate = function(container,px){
		$(container).animate({
			'marginLeft' : px
		});
	}; // moveAnimate
	
	this.getInternetExplorerVersion = function(){
		// Returns the version of Internet Explorer or a -1
		// (indicating the use of another browser).
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer'){
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null){
				rv = parseFloat( RegExp.$1 );
			}
		}
		return rv;
	}; // getInternetExplorerVersion
	this.checkVersion = function(){
		//var msg = "You're not using Internet Explorer.";
		var ver = this.getInternetExplorerVersion();
		if ( ver > -1 ){
			if ( ver >= 9.0 ){
				return true;
	    		//msg = "You're using a recent copy of Internet Explorer."
	    	} else {
	    		return false;
	    		//msg = "You should upgrade your copy of Internet Explorer.";
	    	}
		} else {
			return true;
		}
		//alert( msg );
	}; // checkVersion
	this.alternateBrowser = function(){
		
	}; // alternateBrowser
	
	// zipCodeFormat
    this.zipCodeFormat = function(fieldName,event){
        var field = document.getElementById(fieldName);
        var fieldValue = field.value;
        if(!(event.keyCode==8 || event.keyCode==46 || (event.keyCode>=33 && event.keyCode<=40) )){
            fieldValue = fieldValue.replace("-","");
            part1 = "";
            part2 = "";
            if(fieldValue.length<9 ){
                part1=fieldValue.substring(0,5);
                if(fieldValue.length>5){
                    part2 = "-" + fieldValue.substring(5);
                }

                field.value = part1 + part2;
            }
        }
    }; // zipCodeFormat
   
    this.phoneNumberFormat = function(fieldName,event){
        var field = document.getElementById(fieldName);
        var fieldValue = field.value;
        if(!(event.keyCode==8 || event.keyCode==46 || (event.keyCode>=33 && event.keyCode<=40) )){
            fieldValue = fieldValue.replace("(","");
            fieldValue = fieldValue.replace(")","");
            fieldValue = fieldValue.replace("-","");
            part1 = "";
            part2 = "";
            part3 = "";
            if(fieldValue.length<10 ){
                if(fieldValue.length>2){
                    part1="("+fieldValue.substring(0,3)+")";
                    if(fieldValue.length>5){
                        part2 = fieldValue.substring(3,6);
                        part3 = "-" + fieldValue.substring(6);
                    }else{
                        part2 = fieldValue.substring(3);
                    }
                    field.value = part1 + part2 + part3;
                }
            }

        }
    }; // phoneNumberFormat
   
    this.validateEmail = function(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }; // validateEmail
    
    this.dateFormat = function(fieldName,event){
        var field = document.getElementById(fieldName);
        var fieldValue = field.value;
        if(!(event.keyCode==8 || event.keyCode==46 || (event.keyCode>=33 && event.keyCode<=40) )){
            //fieldValue = fieldValue.replace(/[^0-9]/g,"");
            var patt = /\d*\/\d*\//;
            if (patt.test(fieldValue) && fieldValue.length < 10){
                return true;
            }
           
            fieldValue = fieldValue.replace(/\//g,"");
            //part1 = "";
            var part2 = "";
            var part3 = "";
            //alert("length " + fieldValue.length);
            //if (fieldValue.length < 10){
                var part1 = fieldValue.substring(0,2);
                if(fieldValue.length>1){                   
                    part2 = "/"+fieldValue.substring(2,4);
                    //alert("part2 " + part2 + " length " + fieldValue.length);
                    if (fieldValue.length>3){
                        part3 = "/"+fieldValue.substring(4,7);
                        //alert("part3" + part3);
                    }
                    field.value = part1 + part2 + part3;
                }
            //}
        }
    }; // dateFormat
    
    this.firstTimeClear = function(element,reportType){
        var patt = /^-.*-$/;
        if (patt.test(element.value)){
            element.value = "";
            element.style.color = "black";
        }
    }; // firstTimeClear
	
    this.paging = function(container,JSONData,clickCallBack){
    	
    	var imgFirst = "First";
        var imgPrevious = "Previous";
        var imgNext = "Next";
        var imgLast = "Last";
        var current = JSONData.pageStart + 1;
        var next = JSONData.pageStart + JSONData.pageLimit;
        var nextItem = next;
        var last = JSONData.count - JSONData.pageLimit;
        if (last < 0){
        	last = 0;
        }
        var previous = JSONData.pageStart - JSONData.pageLimit;
        if (previous < 0){
        	previous = 0;
        }
        if (next > JSONData.count){
        	nextItem = JSONData.count;
        }
  
    	var pagingContext = "<table><tr><td>";
        if (JSONData.pageStart < 1) {
            pagingContext += imgFirst;
        } else {
            pagingContext += "<a href='#' onClick='"+clickCallBack+"(0);return false;' >" + imgFirst +"</a>";
        }
        pagingContext += "</td><td>";
        if (JSONData.pageStart < 1) {
            pagingContext += imgPrevious;
        } else {
            pagingContext += "<a href='#' onClick='"+clickCallBack+"("+ previous +") ;return false;' >" +imgPrevious + "</a>";
        }
        
        pagingContext += "</td><td nowrap><span class='pageNumbers'>"+ current +" - "+ nextItem +" of " + JSONData.count + "</span> </td>";
        pagingContext += "<td>";

        if ( next < JSONData.count ) {
            pagingContext += "<a href='#' onClick='"+clickCallBack+"("+ next +");return false;' >" +imgNext + "</a>";
        } else {
            pagingContext += imgNext;
        }

        pagingContext += "</td><td>";

        if ( next > JSONData.count ) {
            pagingContext += imgLast;
        } else {
            pagingContext += "<a href='#' onClick='"+clickCallBack+"("+ last +");return false;' >" +imgLast + "</a>";
        }

        pagingContext += "</td></tr> </table>";
        document.getElementById(container).innerHTML = pagingContext;
    }; // paging
}

