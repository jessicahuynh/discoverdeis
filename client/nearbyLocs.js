Template.nearbyLocs.helpers({
	nearbyname:function() {
		var loc = Locations.findOne({"id":JSON.stringify(this).replace(/"([^"]+(?="))"/g, '$1')});
		if (loc.name) {
			if (loc.nickname != undefined) {
				return loc.nickname + " ("+loc.name+")";
			}
			else {
				return loc.name;
			}
			
		}
		else {
			return "N/A";
		}
	},
	nearbyid:function() {
		var loc = Locations.findOne({"id":JSON.stringify(this).replace(/"([^"]+(?="))"/g, '$1')});
		return loc.id;
	},
	nearbyindex:function() {
		return "nearbydist"+this;
	},
	dist:function() {
		var loc = Locations.findOne({"id":JSON.stringify(this).replace(/"([^"]+(?="))"/g, '$1')});
		if (loc.entrances != null && loc.entrances != undefined) {
			var end = Intersections.findOne({"id":loc.entrances[0]}).coordinate.coordinates;
			Meteor.call("distance",
				Session.get("currentLocation"),
				new Point(end[0],end[1]),
				function(error,data) {
					if (error) {
						console.log(error);
					}
					else {
						var classname = ".nearbydist"+loc.id;
						if (Session.get("unit") == "m") {
							$(classname).html("about "+ Math.floor(data)+"m");
						}
						else {
							$(classname).html("about "+Math.round(Math.floor(data*3.28))+"ft");
						}
					}
				});
		}
		else {
			var classname = ".nearbydist"+loc.id;
			$(classname).append("N/A");
			return "N/A";
		}
	}
});


Template.nearbyLocs.events({
	'click .visitnearby':function(event) {
		event.preventDefault();
		var loc = Locations.findOne({"id":JSON.stringify(this).replace(/"([^"]+(?="))"/g, '$1')});
		
		var currentPage = Router.current().route.path();
		if (currentPage == "/selfguide") {
			Session.set("prev","/selfguide");
		}
		else {
			Session.set("prev","/locationList");
		}
		
		Session.set("viewLocation",loc.id);
		
		Router.go("/viewLocation/"+loc.id);
		
		Session.set("pageTitle","Viewing " + loc.nickname);
	}
});