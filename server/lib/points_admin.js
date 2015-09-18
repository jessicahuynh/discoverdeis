points_admin = [
	{
		"id":"info_e01",
		"coordinate":new Point(42.365038, -71.258642),
		"type":"entrance"
	},
	{
		"id":"info_c01",
		"coordinate":new Point(42.364682, -71.259332),
		"type":"crossing"
	},
	{
		"id":"info_c02", // loop road meets the big road leading up to front of science center
		"coordinate":new Point(42.365521, -71.257735),
		"type":"crossing"
	},
	{
    	"id":"bernsteinparkinglot_e01",
    	"coordinate":new Point(42.364892, -71.260169),
    	"type":"entrance"
	},
	{
		"id":"bernsteinparkinglot_c01",
		"coordinate":new Point(42.364784, -71.260249),
		"type":"crossing"
	}
]


function Point(x,y) {
	this.x = x;
	this.y = y;
}