Session.setDefault("inLocation",[Locations.findOne({"id":"volen"}),"in"]);
console.log("default:"+Session.get("inLocation")[0].name);

navigator.geolocation.watchPosition(function (position) {
	var current = new Point(position.coords.latitude, position.coords.longitude);
	Session.setPersistent("currentLocation", current);
	console.log(Session.get("currentLocation"));
	
	Meteor.call("searchLocations",
		Session.get("currentLocation"),
		function (error, data) {
			if (error) {
				console.log(error);
			}
			else {
				console.log(data);
				Session.setPersistent("inLocation", data);
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