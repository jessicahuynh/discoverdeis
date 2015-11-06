navigator.geolocation.watchPosition(function (position) {
	var current = new Point(position.coords.latitude, position.coords.longitude);
	Session.setPersistent("currentLocation", current);
	
	Meteor.call("searchLocations",
		Session.get("currentLocation"),
		function (error, data) {
			if (error) {
				console.log(error);
			}
			else {
				Session.setPersistent("inLocation",data);
			}
		}	
	);

	
	if (Session.get("currentLocation").x == null || Session.get("currentLocation").x == undefined) {
	    $("#permissionsAlert").show();
	}
	else {
	    console.log("hide");
		$("#permissionsAlert").hide();
	}
	
});