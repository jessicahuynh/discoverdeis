//currentLocation
//route:array of stops
//routeToTake:array of paths
//routeStartStop: one sentence info about "from ...to ..."
//routeToTake : description of current step
//routeDist: route distance
//startstop : start entrance
//laststop : end entrance
//navigateTo : start building
//navigateFrom : end building
//countRefresh: next step
//countPrev: previous step
//arrowDirection
//listenTo
//inLocation

count = 0;
Session.set("countPrev",count);
Session.set("countNext",count);
$( window ).load(function() { //Wait for window to load so DeviceOrientationEvent can work
	if (window.DeviceOrientationEvent) {
	  // Listen for the deviceorientation event and handle the raw data
	  window.addEventListener('deviceorientation', function(eventData) {
	    // alpha is the compass direction the device is facing in degrees
	    var dir = eventData.alpha
//Depending on the Compass Direction Angle an arrow will be pointing to the corrected direction and will be set as a session variable
	if(dir >= 348)
	  Session.set("arrowDirection", "/arrows/arrowNBW.png")
	else if(dir >= 337)
		Session.set("arrowDirection", "/arrows/arrowNNW.png")
	else if(dir >= 326)
		Session.set("arrowDirection", "/arrows/arrowNWBN.png")
	else if(dir >= 315)
	  Session.set("arrowDirection", "/arrows/arrowNW.png")
	else if(dir >= 303)
		Session.set("arrowDirection", "/arrows/arrowNWBW.png")
	else if(dir>= 292)
	  Session.set("arrowDirection", "/arrows/arrowWNW.png")
	else if(dir>= 281)
		Session.set("arrowDirection", "/arrows/arrowWBN.png")
	else if(dir>= 270)
		Session.set("arrowDirection", "/arrows/arrowW.png")
	else if(dir>= 258)
		Session.set("arrowDirection", "/arrows/arrowWBS.png")
	else if(dir>= 247)	
		Session.set("arrowDirection", "/arrows/arrowWSW.png")
	else if(dir>= 236)
		Session.set("arrowDirection", "/arrows/arrowSWBW.png")
	else if(dir>= 225)		
		Session.set("arrowDirection", "/arrows/arrowSW.png")
	else if(dir>= 213)
		Session.set("arrowDirection", "/arrows/arrowSWBS.png")
	else if(dir>= 202)
		Session.set("arrowDirection", "/arrows/arrowSSW.png")
	else if(dir>= 191)
		Session.set("arrowDirection", "/arrows/arrowSBW.png")
	else if(dir>= 180)
		Session.set("arrowDirection", "/arrows/arrowS.png")
	else if(dir>= 168)	
		Session.set("arrowDirection", "/arrows/arrowSBE.png")
	else if(dir>= 157)
		Session.set("arrowDirection", "/arrows/arrowSSE.png")
	else if(dir>= 146)
		Session.set("arrowDirection", "/arrows/arrowSEBS.png")
	else if(dir>= 135)
		Session.set("arrowDirection", "/arrows/arrowSE.png")
	else if(dir>= 123)
		Session.set("arrowDirection", "/arrows/arrowSEBE.png")
	else if(dir>= 112)
		Session.set("arrowDirection", "/arrows/arrowESE.png")
	else if(dir>= 101)
		Session.set("arrowDirection", "/arrows/arrowEBS.png")
	else if(dir>= 90)
		Session.set("arrowDirection", "/arrows/arrowE.png")
	else if(dir>= 78)
		Session.set("arrowDirection", "/arrows/arrowEBN.png")
	else if(dir>= 67)
		Session.set("arrowDirection", "/arrows/arrowENE.png")
	else if(dir>= 56)
		Session.set("arrowDirection", "/arrows/arrowNEBE.png")
	else if(dir>= 45)	
		Session.set("arrowDirection", "/arrows/arrowNE.png")
	else if(dir>= 33)	
		Session.set("arrowDirection", "/arrows/arrowNEBN.png")
	else if(dir>= 22)
		Session.set("arrowDirection", "/arrows/arrowNNE.png")
	else if(dir>= 11)
		Session.set("arrowDirection", "/arrows/arrowNBE.png")
	else
	  	Session.set("arrowDirection", "/arrows/arrowN.png")
	  	}, false);
	} 
});
Session.setDefault("routeStartStop","Enter a start and end location to get started!");
Template.change.rendered = function () {
	Session.set("pageTitle","Navigate");
	Session.set("listenTo","");
	var navTo = Session.get("navigateTo");
	if (navTo != "" && navTo != null) {
		document.getElementById("endpoint").value = navTo;
	}
	var navFrom = Session.get("navigateFrom");
	if (navFrom != "" && navFrom != null) {
		if (navFrom == "this_loc") {
			document.getElementById("startpoint").value = "(" + Session.get("currentLocation").x +", "+Session.get("currentLocation").y+")";
		}
		else {
			document.getElementById("startpoint").value = navFrom;
		}
	}	
	if (navTo != "" && navTo != null && navFrom != null && navFrom != "") {	
		$("#navform").submit();
	}
	else {
		if (navTo != "" && navTo != null) {
			Session.set("navigateFrom","(" + Session.get("currentLocation").x + ", " + Session.get("currentLocation").y + ")");
			document.getElementById("startpoint").value = Session.get("navigateFrom");
			$("#navform").submit();
		}
	}
};
Template.change.onCreated(function () {
	graph = new Graph(Map.findOne());
	route = null;
	routes = [];
	routesForStep = [];
	startstop = null;
	laststop = null;
	GoogleMaps.load();
	GoogleMaps.ready('naviMap',function(map) {
		var markerStart = new google.maps.Marker({
			position: new google.maps.LatLng(Session.get("currentLocation").x, Session.get("currentLocation").y),
			icon: '/GoogleMapsMarkers/green_MarkerA.png',
			map: map.instance
		});
		var markerEnd = new google.maps.Marker({
			position: new google.maps.LatLng(Session.get("currentLocation").x, Session.get("currentLocation").y),
			icon: '/GoogleMapsMarkers/red_MarkerB.png',
			map:map.instance
		});
		var markerCurrent = new google.maps.Marker({
			position: new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y),
			icon: Session.get("arrowDirection"), //Here directional arrow
			map:map.instance
		});
		//if the route is changed, redraw the map
		Tracker.autorun(function() {
			route = Session.get("route");
			deleteRoutes(routes);
			routes = [];			
			if (route != null){
				for(var j = 0; j<route.length - 1; j++){
					if(j == count){
						addRoutes(route[j],route[j+1],"naviMap", map,'#00FFFF',routes);
					} else {
						addRoutes(route[j],route[j+1],"naviMap", map,'#000000',routes);
					}
				}
			}
		})
		//move the Start Marker
		Tracker.autorun(function() {
			startstop = Session.get("startstop");
			if (startstop != null) {
				var startstopCor = findId(startstop);
				var theLatLng1 = new google.maps.LatLng(startstopCor[0],startstopCor[1]);
				map.instance.setCenter(theLatLng1);
				markerStart.setPosition(theLatLng1);
			}
		})	
		//move the End Marker
		Tracker.autorun(function() {
			laststop = Session.get("laststop");
			if (laststop != null) {
				var laststopCor = findId(laststop);
				var theLatLng2 = new google.maps.LatLng(laststopCor[0],laststopCor[1]);
				markerEnd.setPosition(theLatLng2);	
			}
		})
		//move the current marker when current location or angle is changed
		Tracker.autorun(function() {
			//console.log("currentLocation changes");
			var theLatLng = new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y);
			map.instance.setCenter(theLatLng);
			markerCurrent.setPosition(theLatLng);
			if (Session.get("deviceOrientation")) {
				markerCurrent.setIcon(Session.get("arrowDirection")); //Resets the icon so that we can get a different directional
			} else {
				markerCurrent.setIcon("currentPosition.png");
			}
		})
	})	
});
Template.change.helpers({
	stops: function() {
		return Session.get("routeToTake");
	},
	startLoc:function() {
		return Session.get("navigateFrom");	
	},
	endLoc: function() {
		return Session.get("navigateTo");	
	},
	settings:function() {
		return {
			position:"bottom",
			limit:10,
			rules:[{
				collection:Locations,
				matchAll:true,
				field:"name",
				template:Template.suggestions,
				selector: function(match) {
                   var regex;
                   regex = new RegExp(match, 'i');
                   return {
                       $or: [
                          {
                              'name': regex
                          }, {
                              'nickname': regex
                          }, {
							  'category': regex
						  }, {
							  'function':regex
						  }
                       ]
                   };
                },
			}]
		};
	},
	stopDescription:function() {
		return this;
	},
	currentDescription:function() {
		currDescript=Session.get("step")[count];
		return currDescript;
	},
	naviMapOptions: function() {
		if (GoogleMaps.loaded()) {
			//console.log(Session.get("currentLocation").x,Session.get("currentLocation").y);
			return {
				center: new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y),
				zoom:17
			};
		}
	},
	routeStartStop:function() {	
		return Session.get("routeStartStop");
	},
	routeEstimate:function() {
		if (Session.get("routeToTake")[0][0] == "Y") {
				return "no walking needed"
		}
		else {
				if (Session.get("routeDist") == "" || Session.get("routeDist")== null || Session.get("routeDist") == undefined || Session.get("routeDist") == NaN) {
				return "enter a start and end location to get started";
			}
			else {	
				return "about "+Math.ceil(Session.get("routeDist")*0.02)+ " minutes of walking";								
			}
		}
		return "about "+Math.ceil(Session.get("routeDist")*0.02)+ " minutes of walking";		
	},
	step: function() {
		return Session.get("step");
	},
	current: function() {
		return Session.get("currentLocation");
	}
});
Template.change.events({
	"click #prevStep" : function(event) {
		event.preventDefault();
		if (count > 0){
			count --;
			Session.set("countPrev", count);
		} else {
			alert("You are at the first step.");
		}		
		//change one step discription
		currDescript=Session.get("step")[count];
		$("#descriptionText").html(currDescript);
		//change route color
		for(var i = 0; i<route.length - 1; i++){
			routes[count].setOptions({strokeColor: '#00FFFF'});
		}
		routes[count+1].setOptions({strokeColor: '#000000'});
	},
	"click #nextStep" : function(event) {
		event.preventDefault();
		if (count < (route.length - 2)){
			count ++;
			Session.set("countNext", count);
		} else {
			alert("You reached your destination.");
		}
		//change one step discription
		currDescript=Session.get("step")[count];
		$("#descriptionText").html(currDescript);
		//change route color
		for(var i = 0; i<route.length - 1; i++){
			routes[count].setOptions({strokeColor: '#00FFFF'});
		}
		routes[count-1].setOptions({strokeColor: '#000000'});
	},
	"click #exchangeButton":function(event) {
		var starts = document.getElementById("startpoint").value;
		var ends = document.getElementById("endpoint").value;
		count=0;
		document.getElementById("endpoint").value = starts;
		document.getElementById("startpoint").value = ends;
		deleteRoutes(routesForStep);
		routesForStep = [];
	},
	"submit #navform": function(event){
		event.preventDefault();
		//console.log("before start: " + Session.get ("currentLocation").x + "," + Session.get ("currentLocation").y);
		var starts = document.getElementById("startpoint").value;
		var ends = document.getElementById("endpoint").value;
		// if starting is empty, assume current location
		if (starts == "") {
			document.getElementById("startpoint").value = "(" + Session.get("currentLocation").x +", "+Session.get("currentLocation").y+")";
			starts = "(" + Session.get("currentLocation").x +", "+Session.get("currentLocation").y+")";
		}
		Session.set("route",getRoute(starts, ends));
		if (Session.get("route") != null) {
			setStops();
		}
		// if it can't get the route right away, because you're not in a building
		// then delay for three seconds
		else {
			$("#loadingPanel").css("display","block");
			setTimeout(function() {
				setStops();
				$("#loadingPanel").css("display","none");
			}, 4000);

		}		
		displayRouteStartStop();
		// $("#routeTab").tab('show');
		window.scrollBy(0,240);
	},
	"click input":function(event) {
		event.target.value = '';
	},
	"click #getCurrentLoc":function(event) {
		event.preventDefault();		
		document.getElementById("startpoint").value = "getting current location...";		
		document.getElementById("startpoint").value = "(" + Session.get("currentLocation").x + ", " + Session.get("currentLocation").y + ")";		
	}
});
function setStops() {
	Session.set("startstop", Session.get("route")[0]);
	Session.set("laststop", Session.get("route")[Session.get("route").length - 1]);		
	//session variable for steps.js
	Session.set("routeForStep",Session.get("route"));
	Session.set("destination", document.getElementById("endpoint").value);
	getRouteDescription(Session.get("route"));
	Session.set("step",Session.get("routeToTake"));
	console.log(Session.get("routeToTake"));
	$("#loadingPanel").css("display","none");		
}
function displayRouteStartStop() {
	var info = "Enter a start and end location to get started.";
	var start = null;
	var end = null;	
	if (document.getElementById("startpoint") != null && document.getElementById("endpoint") != null) {
		info = "From ";
		if (document.getElementById("startpoint").value[0] == "(") {
			start = Session.get("inLocation")[0].name;
			if (Session.get("inLocation")[1] == "in") {
				info += Session.get("inLocation")[0].name;
			} else {
				info += "your current location near " + Session.get("inLocation")[0].name;
			}
		} else {
			start = document.getElementById("startpoint").value;
			info+=document.getElementById("startpoint").value;
		}		
		if (document.getElementById("endpoint").value != "") {
			end = document.getElementById("endpoint").value;
			info += " to "+document.getElementById("endpoint").value;
		}
	} else {
		if (Session.get("navigateTo") != "" && Session.get("navigateTo") != null) {
			info = "From ";
			if (Session.get("navigateFrom")[0] == "(") {
				start = Session.get("inLocation")[0].name;
				if (Session.get("inLocation")[1] == "in") {
					info += "your current location in " +Session.get("inLocation")[0].name;
				} else {
					info += "your current location near " + Session.get("inLocation")[0].name;
				}
			} else {
				start = Session.get("navigateFrom");
				info+=Session.get("navigateFrom");
			}			
			if (Session.get("navigateTo") != "")
				end = Session.get("navigateTo");
				info += " to "+Session.get("navigateTo");
		}
	}	
	if (start == end) {
		info = "You're already at "+end;
	}			
	Session.set("routeStartStop",info);
}
function getRoute(starts, ends) {
		// if it starts with a (, it's your current location
		if (starts[0] == "(") {
			// if you're in a building, return that building and go on as before
			if (Session.get("inLocation")[1] == "in") {
				starts = Locations.findOne({"name":Session.get("inLocation")[0].name}).name;
				console.log(starts);				
				if (Session.get("inLocation")[0].name == ends) {
					route = ["You're already here!"];
				}
				else {
					route = getShortestRoute(Locations.findOne({"name":starts}).icrossings,Locations.findOne({"name":starts}).entrances,Locations.findOne({"name":ends}).entrances);
				}				
			}
			// else, go from the nearest intersection
			else {
				var nearestIntersection = IntersectionsYX.find({
					"coordinate":{
						$near: {
							$geometry: {
								"type":"Point",
								"coordinates": [Session.get("currentLocation").y, Session.get("currentLocation").x ]
							}
						}
					}
				});
				var theNearest = nearestIntersection.fetch()[0].id;
				
				route = getShortestRoute(null, [theNearest], Locations.findOne({"name":ends}).entrances);
				console.log(route);	
			}
		}
		// a location searched for
		else {
			if (starts == ends) {
				route = ["You're already here!"];
			} else {
				route = getShortestRoute(Locations.findOne({"name":starts}).icrossings,Locations.findOne({"name":starts}).entrances,Locations.findOne({"name":ends}).entrances);
			}
		}
		return route;
}
function getShortestRoute(icrossings,startEntrances,endEntrances) {
	var theShortestDist = 1000000000;
	var shortestRoute = null;	
	if (icrossings != undefined && icrossings != null && icrossings.length > 0) {
		startEntrances = icrossings;
	}	
	if (startEntrances != undefined && endEntrances != undefined) {
		shortestRoute = graph.findShortestPath(startEntrances[0],endEntrances[0]);
		console.log(shortestRoute);
				
		var currentRouteDist = 0;	
		if (startEntrances.length > 0 && endEntrances.length > 0) {
			startEntrances.forEach(function (startEntrance) {
				endEntrances.forEach(function (endEntrance) {
					var currentRoute = graph.findShortestPath(startEntrance, endEntrance);
					console.log(startEntrance + " " + endEntrance);
					// if there's no route between the entrances, skip
					if (currentRoute != null) {
						for (var i = 0; i < currentRoute.length - 2; i++) {
							currentRouteDist += Paths.findOne({ "start": currentRoute[i], "end": currentRoute[i + 1] }).distance;
						}
						//console.log(currentRoute + " " + currentRouteDist);		
						if (currentRouteDist < theShortestDist) {
							theShortestDist = currentRouteDist;
							shortestRoute = currentRoute;							
							// for the shortest path
							Session.set("routeDist",theShortestDist);
						}
						Session.set("routeDist",theShortestDist);
					}
					currentRouteDist = 0;
				});
			});
			
		}
	}	
	
	return shortestRoute;
}
function findId(idToLookFor) {
	var all_points=Intersections.find().fetch();
    for (var i = 0; i < all_points.length; i++) {
        if (all_points[i].id == idToLookFor) {
            return(all_points[i].coordinate.coordinates);
        }
    }
}
var markers = [];
function addMarkers(loc,mapOpt, map){	
	var point = findId(loc);
	//GoogleMaps.ready(mapOpt,function(map) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(point[0],point[1]),
			map:map.instance
		});
		markers.push(marker);
	//})
}
function addRoutes(startloc, endloc, mapOpt, map, lineColor, routes){		
	var start= findId(startloc);
	var end = findId(endloc);
	var theRoute = [
		new google.maps.LatLng(start[0],start[1]),
		new google.maps.LatLng(end[0],end[1]),
	];
	var drawr = new google.maps.Polyline({
		path:theRoute,
		geodesic:true,
		strokeColor: lineColor,
		strokeOpacity: 1.0,
		strokeWeight: 4,
		map: map.instance
	});
	routes.push(drawr);
}
function deleteRoutes(routes){
	for(var j=0;j<routes.length;j++){
		//console.log("null"+j);
		routes[j].setMap(null);
	}
	routes = [];
}
function getRouteDescription(route) {
	var r = [];	
	// push getTo of starting point if it exists
	if (route[0] == "You're already here!") {
		Session.set("routeToTake",route);
	}
	else {
		if (Intersections.findOne({"id":route[0]}).getTo != undefined) {
			r.push(Intersections.findOne({"id":route[0]}).getTo);
		}			
		if (route != null && route != undefined) {
			for (var i = 0; i < route.length - 1; i++) {
				var thePath = Paths.findOne({"start":route[i],"end":route[i+1]});
				r.push(thePath.description);
			}
		} else {
			r.push("We don't seem to be able to get the routing data between these two!");
		}		
		Session.set("routeToTake",r);
	}	
}
function getStepDescription(route) {
	var r = [];		
	if (route != null && route != undefined && route.length != 1) {
		var getToPath = "";
		//if there's a getTo
		if (count == 0 && Intersections.findOne({"id":route[count]}).getTo != undefined) {
			getToPath += Intersections.findOne({"id":route[count]}).getTo;
		}		
		var thePath = Paths.findOne({"start":route[count],"end":route[count+1]});
		r.push(getToPath + " " + thePath.description);			
	} else if (route.length == 1){
		r.push("You have reached your destination!");
	} else {
		r.push("We don't seem to be able to find the routing data!");
	}	
	Session.set("step",r);
	Console.log("getStepDescription");
	Console.log(r);
	Session.set("listenTo",r);
}
function Point(x,y) {
	this.x = x;
	this.y = y;
}
