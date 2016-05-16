offCampus = {
	"name":"off campus",
	"nickname":"off campus",
	"function":"There's lots to do off campus but unfortunately I can't tell you all that much about it."
}

Template.welcome.helpers({
	inLocation: function () {
		var inLoc = Session.get("inLocation");		
		if (typeof inLoc != undefined && inLoc != null && inLoc[0] != null) {
			var closestLocation = Locations.findOne({ "name": inLoc[0].name });
			if (closestLocation != undefined) { 
				if(inLoc[1] == "in") {
					return closestLocation.name;
				}
				else {
					if (Session.get("unit") == "m") {
						return Math.round(inLoc[2]) + "m from " + closestLocation.name;
					}
					else {
						return Math.floor(Math.round(inLoc[2]*3.28)) + "ft from " + closestLocation.name;
					}
				}
			}	
		}
		else {
			return "You're off campus! There's lots to do off campus, but unfortunately I can't tell you about it.";
		}
		
	},
	locationMapOptions: function() {
		if (GoogleMaps.loaded()) {
			//console.log(Session.get("currentLocation").x,Session.get("currentLocation").y);
			return {
				center:new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y),
				zoom:16	
			}
			
		}
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
});

Template.welcome.rendered = function() {
	graph = new Graph(Map.findOne());
	Session.set("pageTitle","Discover Deis");
	Session.set("listenTo","Welcome to Discover Dice! You can navigate to any location on campus here and find out more.");
	
	GoogleMaps.load();	
	
	GoogleMaps.ready('locationMap',function(map) {
		var marker = new google.maps.Marker({
			position: map.options.center,
			map: map.instance
		});
		Tracker.autorun(function() {
			var theLatLng = new google.maps.LatLng(Session.get("currentLocation").x,Session.get("currentLocation").y);
			
			map.instance.setCenter(theLatLng);
			
			marker.setPosition(theLatLng);
		})
	});
	
}

Template.welcome.events({
	'submit #navform':function(event) {
		event.preventDefault();
		

		Session.set("navigateTo",document.getElementById("endpoint").value);
		Router.go('/navigate');
	},

	'submit #doform':function(event) {
		event.preventDefault();
		
		var inputText = document.getElementById("commandTxt").value;
		
		console.log("inputText", inputText);

		if (Session.get("history") == undefined) {
        	Session.set("history", []);
        }

		// Create history for session if not yet defined
		console.log("history", Session.get("history"));

		
		var history_point = {"input": inputText, "intent": "", "entities": "", "type": "text"};

		$.ajax({
			url: 'https://api.wit.ai/message',
			data: {
				'q': inputText,
				'access_token' : 'ANATOUXNLPGVGPTGWPN7RXQHFYYSPGPP'
			},
			dataType: 'jsonp',
			method: 'GET',
			success: function(response) {
				console.log("success!", response);

				var intent = response.outcomes[0].intent;
				var entities = response.outcomes[0].entities;
				var new_entities = {}

				// Only select one entity if two entities of the same role return
				// Select the first entity only
				for (key in entities)
				{
					new_entities[key] = entities[key][0];
				}	

				history_point["intent"] = intent;
				history_point["entities"] = new_entities;
				history_point["type"] = "text";

				// Insert into meteor Session a new history checkpoint
				var history = Session.get("history");
				history.push(history_point);
				Session.set("history", history);

				console.log("history", Session.get("history"))

				applyIntent(intent, new_entities, undefined);
			},

		  error: function(response) {
		  	  console.log("error!");

		  	  // Insert into meteor Session a new history checkpoint
		      var history = Session.get("history");
		      history.push(history_point);
		      Session.set("history", history);

		  }
		});
	},
	'click #editCurrent':function(event) {
		Session.set("navigateTo",document.getElementById("endpoint").value);
	}
});