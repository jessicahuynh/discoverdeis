//points of usdan, schwartz, brown, perlman
points_usdan = [
	{
	    "id": "schwartz_c01",
	    "coordinate":new Point(42.367527, -71.257568),
	    "type": "crossing",
	},
	// buildings behind usdan
	{
	    "id":"schwartz_e01",
	    "coordinate":new Point(42.367605, -71.257126),
	    "type":"entrance"
	},
	{
	    "id":"brown_e01",
	    "coordinate":new Point(42.367286, -71.257305),
	    "type":"entrance"
	},
	{
	    "id":"pearlman_e01",
	    "coordinate":new Point(42.367498, -71.257879),
	    "type":"entrance"
	},
	{
	    "id":"pearlman_e02",
	    "coordinate":new Point(42.367492, -71.258030),
	    "type":"entrance"
	},
	// usdan
	{
	    "id": "usdan_e01",
	    "coordinate":new Point(42.368067, -71.256704),
	    "type": "entrance",
	},
	{
	    "id": "usdan_c01",
	    "coordinate":new Point(42.367368, -71.256159),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c02",
	    "coordinate":new Point(42.367578, -71.256685),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c03",
	    "coordinate":new Point(42.367693, -71.257275),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c04",
	    "coordinate":new Point(42.367903, -71.256899),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c05",
	    "coordinate":new Point(42.368476, -71.256315),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c06",
	    "coordinate":new Point(42.368588, -71.256671),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c07",
	    "coordinate":new Point(42.368636, -71.256826),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c08",
	    "coordinate":new Point(42.368299, -71.256765),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c09",
	    "coordinate":new Point(42.368562, -71.257014),
	    "type": "crossing",
	},
	{
	    "id": "usdan_c10",
	    "coordinate":new Point(42.368353, -71.257438),
	    "type": "crossing",
	},
	{
	    "id":"levin_e01",
	    "coordinate":new Point(42.368117, -71.256926),
	    "type":"entrance"
	},
	{
	    "id":"levin_e02",
	    "coordinate":new Point(42.367992, -71.256964),
	    "type":"entrance"
	},
	{
		"id":"usdan_e02",
		"coordinate":new Point(42.368100, -71.257340),
		"type":"entrance"
	},
	{
		"id":"usdan_e03",
		"coordinate":new Point(42.368267, -71.257278),
		"type":"entrance"
	}
]
function Point(x,y) {
	this.x = x;
	this.y = y;
}