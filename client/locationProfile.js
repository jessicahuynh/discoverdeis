Template.locationProfile.helpers({
	location:function() {

		var full_url = document.URL; // Get current url
		var url_array = full_url.split('/') // Split the string into an array with / as separator
		var last_segment = url_array[url_array.length-1];  // Get the last part of the array (-1)
		Session.set("currentSite", full_url);
		Session.set("currentName", last_segment);
		thisLoc = Locations.findOne({id:last_segment});
		// console.log("^^^^^^^^"+thisLoc.coordinates);
		Session.setPersistent("thisLoc",thisLoc);
		return thisLoc;
	},

	currentSiteShare:function() { //Returns current URL for MailTo
		link = Session.get("currentSite");
		return link;
	},

	categories:function() {
		var c = "";
		var catArray = this.category;
		for (var i = 0; i < catArray.length - 1; i++) {
			c += catArray[i] + ", ";
		}
		c+=catArray[i];
		return c;
	},
	locMapOptions:function() {
		if (GoogleMaps.loaded()) {
			return {
				center:new google.maps.LatLng(42.367014, -71.258943),
				zoom:17
			}
		}
	},
	id:function() {
		return Session.get("thisLoc").id;
	}
});

Template.locationProfile.events({
	'click .go-to-navigate':function(event) {
		Session.set("navigateTo",thisLoc.name);
	}
});

Template.locationProfile.rendered = function() {
	// this.autorun(function() {
	// 	Session.get("viewLocation");
	// 	var data=Template.currentData();
	// 	Session.set("pageTitle","Viewing " +thisLoc.nickname);
	// });
	var thisLoc = Session.get("thisLoc");
	Session.set("pageTitle","Viewing " +thisLoc.nickname);	
	
	GoogleMaps.load();
	GoogleMaps.ready('locMap',function(map) {
		if (thisLoc.coordinates.type == "Polygon") {
			var bounds = new google.maps.LatLngBounds();
			var coords = [];
			var thisLocCoords = thisLoc.coordinates.coordinates[0];
			thisLocCoords.forEach(function(coord) {
				coords.push(new google.maps.LatLng(coord[0],coord[1]));
				bounds.extend(new google.maps.LatLng(coord[0],coord[1]));
			});
			//repeat the first to close
			coords.push(new google.maps.LatLng(thisLoc.coordinates.coordinates[0][0],thisLoc.coordinates[0][1]));
			bounds.extend(new google.maps.LatLng(thisLoc.coordinates.coordinates[0][0],thisLoc.coordinates[0][1]));
			
			var polygon = new google.maps.Polygon({
				paths:coords,
				strokeColor:'#0000FF',
				strokeOpacity: 0.8,
			    strokeWeight: 3,
			    fillColor: '#0000FF',
			    fillOpacity: 0.35,
			});
			
			polygon.setMap(map.instance);
			
			map.instance.setCenter(bounds.getCenter())
;		}
		else {
			// just a point
			var marker = new google.maps.Marker({
				position:new google.maps.LatLng(thisLoc.coordinates.coordinates[0][0],thisLoc.coordinates.coordinates[0][1]),
				map:map.instance,
				title:thisLoc.name,
				icon:'/GoogleMapsMarkers/blue_MarkerL.png'
			});
			
			map.instance.setCenter(new google.maps.LatLng(thisLoc.coordinates.coordinates[0][0],thisLoc.coordinates.coordinates[0][1]));
		}
	});
	
	var listen = thisLoc.name + ". " + thisLoc.function + thisLoc.description;
	Session.set("listenTo",listen);
	
	if ($(window).width() > 768) {
		$(".page-header").prepend("<a href='#' id='returnToList' class='back'><span class='glyphicon glyphicon-menu-left'></span></a>");
	}
	
}