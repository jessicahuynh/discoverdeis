navigator.geolocation.watchPosition(function (position) {
	var current = new Point(position.coords.latitude, position.coords.longitude);
	Session.setPersistent("currentLocation", current);
	
	var inLoc = null;
	Meteor.call("searchLocations",
		Session.get("currentLocation"),
		function (error, data) {
			if (error) {
				console.log(error);
			}
			else {
				inLoc = data;
				console.log("data"+data);
				console.log("inLoc"+inLoc);
			}
		}	
	);
	Session.setPersistent("inLocation",inLoc);
	console.log(Session.get("inLocation"));
	
	if (Session.get("currentLocation").x == null || Session.get("currentLocation").x == undefined) {
	    $("#permissionsAlert").show();
	}
	else {
	    console.log("hide");
		$("#permissionsAlert").hide();
	}
	
});