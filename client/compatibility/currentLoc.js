navigator.geolocation.watchPosition(function (position) {
	var currentPosition = new Point(position.coords.latitude, position.coords.longitude);
	changePosition(currentPosition);
});

function changePosition ( current ) {
	Session.setPersistent("currentLocation", current);
	
	Meteor.call("searchLocations",
		Session.get("currentLocation"),
		function (error, data) {
			if (error) {
				console.log(error);
			}
			else {
				Session.setPersistent("inLocation",data);

				var loc = data[0];

				set_loc(loc, current);
			}
		}	
	);

	
	if (Session.get("currentLocation").x == null || Session.get("currentLocation").x == undefined) {
	    $("#permissionsAlert").show();
	}
	else {
	    //console.log("hide");
		$("#permissionsAlert").hide();
	}
}

function set_loc ( loc, current ) {
	history_point = {};
	// History handling
	history_point["loc"] = loc;
  	history_point["coords"] = current;
  	history_point["type"] = "loc";

  	if (Session.get("history") == undefined) {
    	Session.set("history", []);
    }

  	var history = Session.get("history");
  	history.push(history_point);
  	Session.set("history", history);

  	// Inferred intents handling
  	if (Session.get("inferred") == undefined) {
        Session.set("inferred", []);
    }

    var inferredIntents = Session.get("inferred");

    var inferredIntentIndex = -1;

    console.log("loc", loc);
    console.log("loc.telic", loc.telic);

    for (i = inferredIntents.length - 1; i >= 0 ; i -- ) {
        var inferredIntent = inferredIntents[i];

        if ( loc.telic != undefined ) {
        	if ( loc.telic.indexOf(inferredIntent) > -1 ) {
        		var r = "Do you want " + inferredIntent;
        		
        		Session.set("micResponse", r);
				speak();

				$("#result").append("<p>"+r+"</p>");

				inferredIntentIndex = i;
				break;
        	}
        }
    }

    if (inferredIntentIndex != -1) {
    	inferredIntents.splice(inferredIntentIndex, 1);
    }
}

function Point(x,y) {
	this.x = x;
	this.y = y;
}