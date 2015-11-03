points_northrabb = [
	{
		"id":"scheffres_ie01",
		"coordinate":new Point(42.369414, -71.256207),
		"type":"ientrance"
	},
	{
		"id":"scheffres_e01",
		"coordinate":new Point(42.369052, -71.256483),
		"type":"entrance"
	},
	{
		"id":"scheffres_e02",
		"coordinate":new Point(42.369466, -71.256239),
		"type":"entrance"
	},
	{
		"id":"scheffres_c01",
		"coordinate":new Point(42.369330, -71.255962),
		"type":"crossing"
	},
	{
		//**
		"id":"scheffres_c02",
		"coordinate":new Point(42.369054, -71.256582),
		"type":"crossing"
	},
	{
		//**
		"id":"mandelHQuad_c01",
		"coordinate":new Point(42.369398, -71.256887),
		"type":"crossing"
	},
	{
		"id":"gordon_e01",
		"coordinate":new Point(42.369847, -71.255814),
		"type":"entrance"
	},
	{
		"id":"gordon_e02",
		"coordinate":new Point(42.369413, -71.256134),
		"type":"entrance"
	},
	{
		"id":"gordon_e03",
		"coordinate":new Point(42.369508, -71.255938),
		"type":"entrance"
	},
	{
		"id":"gordon_ie01",
		"coordinate":new Point(42.369588, -71.256014),
		"type":"ientrance"
	},
	
	{
		"id":"gordon_c01",
		"coordinate":new Point(42.369705, -71.255763),
		"type":"crossing"
	},
	////
	{
		"id":"gordon_c02",
		"coordinate":new Point(42.369351, -71.256109),
		"type":"crossing"
	},
	////
	{
		"id":"cable_e01",
		"coordinate":new Point(42.368953, -71.255415),
		"type":"entrance"
	},
	{
		"id":"cable_e02",
		"coordinate":new Point(42.369454, -71.255164),
		"type":"entrance"
	},
	{
		"id":"cable_c01",
		"coordinate":new Point(42.368872, -71.255327),
		"type":"crossing"
	},
	{
		"id":"cable_c02",
		"coordinate":new Point(42.369462, -71.254854),
		"type":"crossing"
	},
	{
		"id":"reitman_e01",
		"coordinate":new Point(42.369595, -71.254962),
		"type":"entrance"
	},
	{
		"id":"reitman_e02",
		"coordinate":new Point(42.369792, -71.255698),
		"type":"entrance"
	},
	{
		"id":"reitman_e03",
		"coordinate":new Point(42.369564, -71.255098),
		"type":"entrance"
	},
	{
		"id":"reitman_c01",
		"coordinate":new Point(42.370021, -71.255610),
		"type":"crossing"
	},
	{
		"id":"kutzlot_e01",
		"coordinate":new Point(42.368793, -71.256466),
		"type":"entrance"
	},
	{
		"id":"northquadlot_e01",
		"coordinate":new Point(42.369641, -71.254727),
		"type":"entrance"
	},
	{
		"id":"northquadlot_e02",
		"coordinate":new Point(42.370306, -71.256963),
		"type":"entrance"
	},
	{
	    "id": "kutz_e01",
	    "coordinate":new Point(42.369029, -71.256103),
	    "type": "entrance",
	},
	{
	    "id": "kutz_e02",
	    "coordinate":new Point(42.368952, -71.255629),
	    "type": "entrance",
	},
	{
	    "id": "kutz_c01",
	    "coordinate":new Point(42.368811, -71.256215),
	    "type": "crossing",
	},
	{
	    "id": "kutz_c02",
	    "coordinate":new Point(42.368776, -71.256561),
	    "type": "crossing",
	},
	{
	    "id": "kutz_c03",
	    "coordinate":new Point(42.368711, -71.256959),
	    "type": "crossing",
	},
	{
	    "id":"kutz_c04",
	    "coordinate":new Point(42.368973, -71.256367),
	    "type":"crossing"
	},
	{
	    "id":"kutz_c05",
	    "coordinate":new Point(42.368438, -71.256215),
	    "type":"crossing"
	},
	/////
	{
	    "id":"kutz_c06",
	    "coordinate":new Point(42.368683, -71.256710),
	    "type":"crossing"
	},
	/////
	{
	    "start":"northquadlot_e01",
	    "end":"reitman_c01",
	    "description": "Walk straight to the end of the building on your left.",
	},
	{
	    "start":"reitman_c01",
	    "end":"northquadlot_e01",
	    "description": "Walk past the stairs to the end of the parking lot.",
	},
	{
	    "start":"reitman_c01",
	    "end":"northquadlot_e02",
	    "description": "Walk straight to the end of the parking lot.",
	},
	{
	    "start":"northquadlot_e02",
	    "end":"reitman_c01",
	    "description": "Walk straight until you see a set of stairs on your right.",
	},

]

function Point(x,y) {
    this.x = x;
    this.y = y;
}
