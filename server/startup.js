Meteor.startup(function() {
	IntersectionsYX._ensureIndex({"coordinate":"2dsphere"});
	CornerPoints._ensureIndex({"coordinate":"2dsphere"});
	
	if (Locations.find().count() == 0) {
		// list of all of the files containing location data
		var locFiles = [
			locations_admission,
			locations_arts,
			locations_athletics,
			locations_dorms,
			locations_east,
			locations_ibs,
			locations_mandelHellerLibrary,
			locations_massellChapels,
			locations_oldSt,
			locations_parking,
			locations_presidential,
			locations_scienceComplex,
			locations_transport,
			locations_usdan,
			locations_artinstallations,
			locations_rooms
		];
		
		locFiles.forEach(function(locFile) {
			locFile.forEach(function(location) {
				Locations.insert(location);
				
				var c = null;
				if (location.coordinates.type == "Point") {
					c = location.coordinates.coordinates;
				}
				else {
					// use first entrance
					c = location.coordinates.coordinates[0][0];
				}
				CornerPoints.insert({"coordinate":{"type":"Point","coordinates":[c[1],c[0]]},"name":location.name}); // need to flip x and y for geojson
				
			});
		});		
	}
	
	if (Intersections.find().count() == 0) {
		var intersectFiles = [
			points_centralCampus,
			points_lowerDorms,
			points_massellchapels,
			points_southcampus,
			points_gym,
			points_admin, 
			points_science,
			points_northrabb,
			points_mandelquad,
			points_library,
			points_usdan,
			points_east,
			points_grad,
			points_ibs,
			points_rooms
		];

		
		intersectFiles.forEach(function(intersectFile) {
			intersectFile.forEach(function(point) {
				if (point.singlepoint){
					point.type = "entrance";
					// the single point's entrance is always the same as its location coordinate
					point.coordinate = Locations.findOne({"id":point.id.replace('_e01','')}).coordinates;
				}
				
				Intersections.insert(point);
			
				var flipped = {"type":"Point","coordinates":[point.coordinate.coordinates[1],point.coordinate.coordinates[0]]};
			
				IntersectionsYX.insert({"id":point.id,"coordinate":flipped,"type":point.type,"getTo":point.getTo});
				
			});
		});
	}
	
	if (Paths.find().count() == 0) {
		var pathFiles = [
			paths_massellchapels,
			paths_lowerDorms, 
			paths_southcampus,	
			paths_gym,
			paths_admin, 
			paths_science,
			paths_northrabb,
			paths_mandelquad,
			paths_library,
			paths_east,
			paths_usdan,
			paths_grad,
			paths_ibs,
			paths_bernstein,
			paths_rooms
		];
		
		pathFiles.forEach(function(pathFile) {
			pathFile.forEach(function(path) {
				//console.log("path###############");
				//console.log(Intersections.findOne({"id":path.start}));
				//console.log(Intersections.findOne({"id":path.end}));
				Meteor.call("distance",
					{"x":Intersections.findOne({"id":path.start}).coordinate.coordinates[0],"y":Intersections.findOne({"id":path.start}).coordinate.coordinates[1]},
					{"x":Intersections.findOne({"id":path.end}).coordinate.coordinates[0],"y":Intersections.findOne({"id":path.end}).coordinate.coordinates[1]},
					function(error,data) {
						if (error) {
							console.log(error);
						}
						else {
							path.distance = data;
							Paths.insert(path);
							// console.log(path);	
						}
				});
			});
			
		});
	}

	if (Map.find().count() == 0) {
		var map = {};
		paths = Paths.find().fetch();
		/*console.log(paths);*/
		paths.forEach(function(path){
			var start = path.start;
			var end = path.end;
			var dist = path.distance;
			if (map[start] == undefined || map[start] == null){
				map[start] = {};
			}
			map[start][end] = dist;
		});
		
		/*console.log(map);*/
		Map.insert(map);
	}

	if (Hours.find().count()==0){
		var hoursFile=operationhours;
		hoursFile.forEach(function(hour) {
			//console.log(hour);
			Hours.insert(hour);
			
		});
	}

	if (Classes.find().count()==0){
		course.forEach(function( course) {
			Classes.insert(course);
	})

		instructor.forEach(function(instructor) {
			Instructors.insert(instructor)
		});

		section.forEach(function(section) {
			theCourse = Classes.findOne({ id: section.course});
			if(theCourse != undefined) {
				if( section.times[0] != undefined) {
					//console.log(section.times[0]);
					Classes.update({ id: section.course},
						{ $set: {   "times": section.times[0],
									"instructor": Instructors.findOne({id: section.instructors[0]}),
						 		} 
					});					
				}
			}
		})

		//Remove all the classes without building fields
		Classes.remove({"times.building": undefined})
	}


	
	console.log(Map.find().count());
	console.log("startup end");

});