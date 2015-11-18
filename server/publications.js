Meteor.publish("theLocations", function(){return Locations.find()});

Meteor.publish("theCornerPoints",function() {return CornerPoints.find()});

Meteor.publish("theIntersections",function() {return Intersections.find()});

Meteor.publish("theIntersectionsYX",function() {return IntersectionsYX.find()});

Meteor.publish("thePaths",function() {return Paths.find()});

Meteor.publish("theMap",function() {return Map.find()});

Meteor.publish("theHours",function() {return Hours.find()});

