pointIncluded = function(vertices, current) {
	included = false;
	numVert = vertices.length;
	// create arrays of the x and y coordinates of the polygon
	var xArray = [];
	var yArray = [];

	for (var i = 0; i < numVert; i++) {
		xArray.push(vertices[i][0]);
		yArray.push(vertices[i][1]);
	}
	
	for (var i = 0, j = numVert - 1; i < numVert; j = i++) {
		if ((yArray[i] >= current.y) != (yArray[j] >= current.y) &&
			(current.x <= (xArray[j] - xArray[i]) * (current.y - yArray[i]) / (yArray[j] - yArray[i]) +xArray[i])) {
			included = !included;

		}
	}
	return included;
};

distance = function(start, end) {
	var theNearestDistance = 1000000000;
	//console.log(JSON.stringify(start)+JSON.stringify(end));
	var R = 6371000; // metres

	var lat1 = start.x;
	var lat2 = end.x;
	var lon1 = start.y;
	var lon2 = end.y;

	var p1 = lat1 * (Math.PI / 180);
	var p2 = lat2 * (Math.PI / 180);
	var dp = (lat2-lat1) * (Math.PI / 180);
	var dl = (lon2-lon1) * (Math.PI / 180);

	var a = Math.sin(dp/2) * Math.sin(dp/2) +
	        Math.cos(p1) * Math.cos(p2) *
	        Math.sin(dl/2) * Math.sin(dl/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;

	return d;
}


searchLocations = function(current) {
	var location = null;
	var locatedHere = null;	
	var allLocations = Locations.find().fetch();
    console.log("SL:"+ JSON.stringify(current));

	for (var i = 0; i < Locations.find().count(); i++) {

		// if the given Point is in the location, return the location
		if (pointIncluded(allLocations[i].coordinates.coordinates[0], current)) { 
			return [allLocations[i], "in"]; 
		}
	}
			
	if (!locatedHere) {
		var theNearest = CornerPoints.findOne({
			"coordinate":{
				$near: {
					$geometry: {
						"type": "Point" ,
						"coordinates": [ current.y , current.x ]
					}
				}
			}
		});
		// console.log(theNearest);
		var n = distance(current,{"x":theNearest.coordinate.coordinates[1],"y":theNearest.coordinate.coordinates[0]});
		return [Locations.findOne({"name":theNearest.name}),"near",n];
	}
}


const transLocRange = "42.377974, -71.230773|42.358200,-71.265297";
const transLocAgencyId = "483";
const apiKey = "hXZwntEpaZmshEJQIfoOujsCsDNBp1Qp8ypjsn3fdKn2fIPouS";
const url = "https://transloc-api-1-2.p.mashape.com/routes.json";
const urlSegment = "https://transloc-api-1-2.p.mashape.com/segments.json";

transLocAPI = function(){
HTTP.call("GET", url, {
	params: {
		"agencies": transLocAgencyId,
		"callback": "call",
		"geo_area": transLocRange,
	},
	headers: {
		"X-Mashape-Key": apiKey
	}

}, function(err, resp) {
	if(!err) {
		console.log("success, TRANS Loc Api Accessed")
		var result = JSON.parse(resp.content);

		var first = Object.keys(result.data)[0];
		
		result.data[first].forEach( function(element, index) {
			if(index == 1) {
				getSegment(element)
			}
		});
	} else {
		console.log( err );
	}
})


getSegment = function(element) {
	// var route = element.segments.filter(isForwardDirection).map(function(i) {
	// 	return i[0];
	// }).join();
	// console.log(route);
	console.log(element.route_id);
	HTTP.call("GET", urlSegment, {
		params: {
		"agencies": transLocAgencyId,
		"callback": "call",
		"geo_area": transLocRange,
		"routes": element.route_id,
	},
	headers: {
		"X-Mashape-Key": apiKey
	}

	}, function(err, resp) {
		if(!err) {
			console.log("success, got segments")
			var result = JSON.parse(resp.content);
			console.dir(result);
		} else {
			console.log(err)
		}

	})
}


function isForwardDirection(isForward) {
    return isForward[1] ==  "forward";
}

}

Meteor.methods({
	/* numVert: number of vertices
	 * vertices: array of vertices
	 * current: current location 
	 *
	 * Determines if a given Point is located within a polygon of n vertices
	 * Algorithm from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html */
	pointIncluded: pointIncluded,

	/* Search through all locations to see where you are */
	searchLocations: searchLocations, 


	/* returns the distance between two points 
	* adapted from http://www.movable-type.co.uk/scripts/latlong.html */
	distance: distance,

	transLocAPI: transLocAPI

	

});