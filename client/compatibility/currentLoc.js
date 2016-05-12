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


				// History handling
				history_point["loc"] = data[0];
		      	history_point["coords"] = current;
		      	history_point["type"] = "loc";

		      	var history = Session.get("history");
		      	history.push(history_point);
		      	Session.set("history", history);

		      	// Inferred intents handling
		      	if (Session.get("inferred") == undefined) {
                    Session.set("inferred", []);
                }

                var inferredIntents = Session.get("inferred");

                var inferredIntentIndex = -1;
                
                for (i = inferredIntents.length - 1; i >= 0 ; i -- ) {
		            var inferredIntent = inferredIntents[i];

		            if ( data[0].telic != undefined ) {
		            	if ( data[0].telic == inferredIntent ) {
		            		var r = "Do you want " + data[0].telic;
		            		
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
		}	
	);

	
	if (Session.get("currentLocation").x == null || Session.get("currentLocation").x == undefined) {
	    $("#permissionsAlert").show();
	}
	else {
	    //console.log("hide");
		$("#permissionsAlert").hide();
	}
	
});

function Point(x,y) {
	this.x = x;
	this.y = y;
}