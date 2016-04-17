(function(){// points of gym, mailman, healthcenter and police station
points_gym = [
	{
		"id":"squirebridge_e01",
		"coordinate":{"type":"Point","coordinates":[42.365294, -71.255795]},
		"type":"entrance",
		"getTo":"Head to Squire Bridge's entrance on the side closest to the athletics complex."
	},
	{
		"id":"squirebridge_e02",
		"coordinate":{"type":"Point","coordinates":[42.365622, -71.256147]},
		"type":"entrance",
		"getTo":"Head to Squire Bridge's entrance next to Mailman House."
	},
	{
		"id":"squirebridge_c01", //sidewalk right before steps
		"coordinate":{"type":"Point","coordinates":[42.365992, -71.256324]},
		"type":"crossing"
	},
	//mods
	{
		"id":"uppermods_e01",
		"coordinate":{"type":"Point","coordinates":[42.366053, -71.253890]},
		"type":"entrance",
		"getTo":"Head to the road leading out of the Upper Mods."
	},
	{
		"id":"uppermods_c01",
		"coordinate":{"type":"Point","coordinates":[42.365980, -71.254080]},
		"type":"crossing"
	},
	{
		"id":"lowermods_e01",
		"coordinate":{"type":"Point","coordinates":[42.365694, -71.253384]},
		"type":"entrance",
		"getTo":"Head to the bend in the road next to the Lower Mods."
	},
	// fields and courts
	{
		"id":"rieger_e01", 
		"coordinate": {"type":"Point","coordinates":[42.364778, -71.253695]},
		"type":"entrance"
	},
	{
		"id":"rieger_e02",
		"coordinate":{"type":"Point","coordinates":[42.364462, -71.254299]},
		"type":"entrance"
	},
	{
		"id":"marcusfield_e01",
		"coordinate":{"type":"Point","coordinates":[42.363320, -71.256909]},
		"type":"entrance"
	},
	{
		"id":"marcusfield_e02",
		"coordinate":{"type":"Point","coordinates":[42.363398, -71.256647]},
		"type":"entrance"
	},
	{
		"id":"steindiamond_e01",
		"coordinate":{"type":"Point","coordinates":[42.364509, -71.256403]},
		"type":"entrance"
	},
	{
		"id":"steindiamond_e02",
		"coordinate":{"type":"Point","coordinates":[42.364370, -71.256830]},
		"type":"entrance"
	},
	{
		"id":"gordonfield_e01", // next to baseball
		"coordinate":{"type":"Point","coordinates":[42.364024, -71.257072]},
		"type":"entrance"
	},
	{
		"id":"gordonfield_e02",
		"coordinate":{"type":"Point","coordinates":[42.363988, -71.257985]},
		"type":"entrance"
	},
	{
		"id":"gordonfield_e03",
		"coordinate": {"type":"Point","coordinates":[42.362706, -71.258053]},
		"type":"entrance"
	},
	// athletics
	{
		"id":"gosman_c01",
		"coordinate":{"type":"Point","coordinates":[42.365305, -71.256108]},
		"type":"crossing"
	},
	{
		"id":"gosman_c02",
		"coordinate":{"type":"Point","coordinates":[42.364255, -71.254864]},
		"type":"crossing"
	},
	{
		"id":"gosman_e01",
		"coordinate":{"type":"Point","coordinates":[42.365142, -71.255437]},
		"type":"entrance",
		"getTo":"Head to the main entrance of Gosman."
	},
	{
		"id":"gosman_e02", // fieldhouse entrance next to mods
		"coordinate":{"type":"Point","coordinates":[42.365420, -71.254361]},
		"type":"entrance"
	},
	{
		"id":"gosman_e03", // fieldhouse entrance in back
		"coordinate":{"type":"Point","coordinates":[42.364945, -71.254048]},
		"type":"entrance"
	},
	{
		"id":"gosman_e04", // stairs at bridge to linsey
		"coordinate":{"type":"Point","coordinates":[42.365713, -71.254695]},
		"type":"entrance"
	},
	{
		"id":"gosman_e05",//one way out at the stairs
		"coordinate":{"type":"Point","coordinates":[42.365520, -71.254513]},
		"type":"entrance"
	},
	{
		"id":"gosman_ic01", // hallway between gym and concessions
		"coordinate":{"type":"Point","coordinates":[42.365131, -71.255133]},
		"type":"icrossing"
	},
	{
		"id":"gosman_ic02", //stairwell, second floor
		"coordinate":{"type":"Point","coordinates":[42.365424, -71.254586]},
		"type":"icrossing"
	},
	{
		"id":"fieldhouse_ie01", //entrance to convocation area
		"coordinate":{"type":"Point","coordinates":[42.365071, -71.255072]},
		"type":"ientrance"
	},
	{
		"id":"linsey_e01",
		"coordinate":{"type":"Point","coordinates":[42.365797, -71.254562]},
		"type":"entrance"
	},
	{
		"id":"linsey_e02", // linsey main entrance
		"coordinate":{"type":"Point","coordinates":[42.365980, -71.254454]},
		"type":"entrance"
	},
	
	{
		"id":"linsey_c01",
		"coordinate":{"type":"Point","coordinates":[42.365969, -71.254845]},
		"type":"crossing"
	},	
	{
		"id":"linsey_c02",
		"coordinate":{"type":"Point","coordinates":[42.365553, -71.254355]},
		"type":"crossing"
	},
	{
		"id":"linsey_c03",
		"coordinate":{"type":"Point","coordinates":[42.365810, -71.253929]},
		"type":"crossing"
	},
	{
		"id":"linsey_c04",
		"coordinate":{"type":"Point","coordinates":[42.366118, -71.254608]},
		"type":"crossing"
	},
	{
		"id":"linseyparkinglot_e01",
		"coordinate":{"type":"Point","coordinates":[42.365682, -71.253661]},
		"type":"entrance"
	},
	{
		"id":"gosmanparkinglot_e01",
		"coordinate":{"type":"Point","coordinates":[42.364890, -71.253780]},
		"type":"entrance"
	},
	{
		"id":"gosmanparkinglot_e02",
		"coordinate":{"type":"Point","coordinates":[42.365364, -71.253399]},
		"type":"entrance"
	},
	{
		"id":"athleticslot_e01",
		"coordinate":{"type":"Point","coordinates":[42.365022, -71.255865]},
		"type":"entrance"
	},
	{
		"id":"athleticslot_e02", //next to gordon field
		"coordinate":{"type":"Point","coordinates":[42.364224, -71.257695]},
		"type":"entrance"
	},
	{
		"id":"athleticslot_e03", // path
		"coordinate":{"type":"Point","coordinates":[42.364568, -71.256865]},
		"type":"entrance"
	},

	//across the bridge

	{
		"id":"mailman_e01",
		"coordinate":{"type":"Point","coordinates":[42.365801, -71.255926]},
		"type":"entrance"
	},
	{
		"id":"healthcenter_c01",
		"coordinate":{"type":"Point","coordinates":[42.366295, -71.255105]},
		"type":"crossing"
	},
	{
		"id":"healthcenter_e01",
		"coordinate":{"type":"Point","coordinates":[42.366189, -71.255242]},
		"type":"entrance"
	},
	{
		"id":"police_e01",
		"coordinate":{"type":"Point","coordinates":[42.366250, -71.255440]},
		"type":"entrance"
	},
	{
		"id":"castle_e01",
		"coordinate":{"type":"Point","coordinates":[42.367034, -71.255943]},
		"type":"entrance"
	},
	{
		"id":"castle_e02",
		"coordinate":{"type":"Point","coordinates":[42.367427, -71.256041]},
		"type":"entrance"
	},
	{
		"id":"superconducting_e01",
		"coordinate":{"type":"Point","coordinates":[42.365910, -71.255390]},
		"type":"entrance"
	},
	{
		"id":"superconducting_c01", // crosswalk at foot of stairs
		"coordinate":{"type":"Point","coordinates":[42.366058, -71.254896]},
		"type":"crossing"
	},


	// old south street
	{
		"id":"rabbSchool_c01", // intersection of south st and old south st
		"coordinate":{"type":"Point","coordinates":[42.362593, -71.260072]},
		"type":"crossing"
	},
	{
		"id":"rabbSchool_c02", // intersection, crossing the street uphill
		"coordinate": {"type":"Point","coordinates":[42.362764, -71.259952]},
		"type":"crossing"
	},
	{
		"id":"rabbSchool_c03", // driveway for boat house
		"coordinate":{"type":"Point","coordinates":[42.362760, -71.259653]},
		"type":"crossing"	
	},
	{
		"id":"rabbSchool_c04", //driveway start for rabb school
		"coordinate":{"type":"Point","coordinates":[42.362770, -71.259480]},
		"type":"crossing"
	},
	{
		"id":"rabbSchool_c05", // in front of main entrance
		"coordinate":{"type":"Point","coordinates":[42.362821, -71.259083]},
		"type":"crossing"
	},
	{
		"id":"rabbSchool_c06", // in front of grad entrance
		"coordinate":{"type":"Point","coordinates":[42.362870, -71.258973]},
		"type":"crossing"
	},
	// lemberg
	{
		"id":"lemberg_c01", // driveway of lemberg
		"coordinate":{"type":"Point","coordinates":[42.363239, -71.258606]},
		"type":"crossing"
	},
	{
		"id":"lemberg_c02", // next to shuttle stop
		"coordinate":{"type":"Point","coordinates":[42.363234, -71.258538]},
		"type":"crossing"
	},
	{
		"id":"lemberg_c03", //in front
		"coordinate":{"type":"Point","coordinates":[42.363434, -71.258563]},
		"type":"crossing"
	},
	{
		"id":"lemberg_c04", //south street, path to lemberg playground
		"coordinate":{"type":"Point","coordinates":[42.363340, -71.259448]},
		"type":"crossing"
	},
	{
		"id":"lemberg_c05", // next to playground
		"coordinate":{"type":"Point","coordinates":[42.363445, -71.259235]},
		"type":"crossing"
	},
	{
		"id":"lemberg_c06", // on the side, next to stairs
		"coordinate":{"type":"Point","coordinates":[42.363331, -71.258897]},
		"type":"crossing"
	},
	{
		"id":"lemberg_c07", // old south street meets south street, nearer train station
		"coordinate":{"type":"Point","coordinates":[42.364198, -71.258687]},
		"type":"crossing"
	},
	{
		"id":"lemberg_c08", // old south street meets south street, nearer the gym
		"coordinate":{"type":"Point","coordinates":[42.364279, -71.258580]},
		"type":"crossing"
	},
	
	// south street entrance stuff
	{
    	"id": 'sstreet_c01',
    	"coordinate":{"type":"Point","coordinates":[ 42.365759, -71.255193]},
    	"type": 'crossing',
	},
	{
		"id":"sstreet_c02",
		"coordinate": {"type":"Point","coordinates":[42.365136, -71.256888]},
		"type":"crossing"
	},
	{
		"id":"sstreet_c03",
		"coordinate": {"type":"Point","coordinates":[42.364974, -71.257233]},
		"type":'crossing'
	},
	{
		"id":"sstreet_c04",
		"coordinate": {"type":"Point","coordinates":[42.364476, -71.258539]},
		"type":"crossing"
	},
	{
		"id":"sstreet_c05",
		"coordinate": {"type":"Point","coordinates":[42.364348, -71.258715]},
		"type":"crossing"
	},
	{
		"id":"mainentrance_c01",
		"coordinate": {"type":"Point","coordinates":[42.364908, -71.258321]},
		"type":"crossing"
	},
	{
		"id":"mainentrance_c02", // double crosswalk along old south street
		"coordinate": {"type":"Point","coordinates":[42.364968, -71.258359]},
		"type":"crossing"
	},
	{
		"id":"mainentrance_c03",
		"coordinate":{"type":"Point","coordinates":[42.364837, -71.258586]},
		"type":"crossing"
	},
	{
		"id":"mainentrance_c04", // crosswalk on loop road across from double sidewalk
		"coordinate":{"type":"Point","coordinates":[42.365104, -71.258465]},
		"type":"crossing"
	},
	{
		"id":"mainentrance_c05",
		"coordinate":{"type":"Point","coordinates":[42.364971, -71.258734]},
		"type":"crossing"
	},
	//health
	{
	    "id": "mailman_c01",
	    "coordinate":{"type":"Point","coordinates":[42.365743, -71.256094]},
	    "type": "crossing",
	},
	{
	    "id":"stonemanlot_e01",
	    "coordinate":{"type":"Point","coordinates":[42.366425, -71.254895]},
	    "type":"entrance"
	},


	// single points
	{
		"id":"stop_lemberg_e01",
		"singlepoint":true
	}
]

}).call(this);

//# sourceMappingURL=points_gym.js.map
