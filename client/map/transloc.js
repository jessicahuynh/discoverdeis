Template.transloc.helpers({

    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            //console.log(Session.get("currentLocation").x,Session.get("currentLocation").y);
            return {
                center: new google.maps.LatLng(42.367014, -71.258943), // somewhere in Volen
                zoom:17
            };
        }
    },

})

Template.transloc.rendered = function() {

    GoogleMaps.load({ v: '3', key: 'AIzaSyAwMiihvoAy1lVcs8Z_4u5nbCHgV3yU4u4', libraries: 'geometry,places' });

    GoogleMaps.ready('transLocMap',function(map) {
        var allRoutes = Shuttles.find().fetch();
        console.log(allRoutes);
        allRoutes.forEach(function(route) {



            route.segments.forEach(function(segment) {

                var decode = google.maps.geometry.encoding.decodePath(segment);

                var poly = new google.maps.Polyline({
                    path: decode,
                    strokeColor: '#'+route.color,
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map.instance
                });

                poly.setMap(map.instance)
            });

        });






    })
}
		