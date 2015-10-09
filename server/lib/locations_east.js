//health center, public safety, icc, mailman
locations_east = [
	{
		"id":"safety",
		"name":"Stoneman Infirmary and Public Safety",
		"nickname":"Public Safety",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366291, -71.255616], 
			[42.366332, -71.255391], 
			[42.366273, -71.255372],
			[42.366256, -71.255452],
			[42.366163, -71.255420],
			[42.366194, -71.255245],
			[42.366161, -71.255235],
			[42.366148, -71.255283],
			[42.366087, -71.255263],
			[42.365993, -71.255795],
			[42.366084, -71.255826],
			[42.366143, -71.255511],
			[42.366241, -71.255544],
			[42.366228, -71.255598]]
		]},
		"category":["health"],
		"description":"Stoneman Public Safety, Stoneman is home to Brandeis Police.",
		"entrances":["police_e01"],
		"area":["upper campus"]
	},
	{
		"id":"healthcenter",
		"nickname":"Health Center",
		"name":"Golding Health Center",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366174, -71.255160], 
			[42.366151, -71.255285], 
			[42.366057, -71.255249],
			[42.366043, -71.255312],
			[42.365981, -71.255289],
			[42.366011, -71.255133],
			[42.366046, -71.255147],
			[42.366054, -71.255118]]
		]},
		"category":["health"],
		"description":"The Health Center offers confidential health services. In the case of an emergency, there is a nurse or doctor on call at all times. The Brandeis Emergency Medical Corps (BEMCO) is a student-operated, certified EMT service, trained to respond to student’s calls 24/7.",
		"entrances":["healthcenter_e01"],
		"area":["upper campus"]
	},
	icc = {
		"id":"icc",
		"name":"Intercultural Center",
		"nickname":"ICC",
		"description":"The Intercultural Center is dedicated to creating a haven of respect, education, and celebration that fosters growth and awareness of the myriad cultures of Brandeis.",
		"function":"The ICC serves as an umbrella organization for sixteen student organizations, providing a venue where students can learn and demonstrate social responsibility and diverse leadership; the organizations provide events that focus on issues of culture, ethnicity and social justice.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.367807, -71.254980], 
			[42.367790, -71.255139], 
			[42.367576, -71.255094], 
			[42.367591, -71.254939]]
		]},
		"category":["student life"],
		"entrances":["icc_e01"],
		"area":["upper campus","east"]
	},
	mailman = {
		"id":"mailman",
		"name":"Mailman House",
		"nickname":"Mailman",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.365936, -71.255702], 
			[42.365895, -71.255935], 
			[42.365766, -71.255962],
			[42.365809, -71.255654]]
		]},
		"category":["health"],
		"entrances":["mailman_e01"],
		"area":["upper campus"]
	},
	{
		"id":"superconducting",
		"nickname":"Landsman",
		"name":"Landsman Research Facility",
		"description":"Landsman Research Facility, is the campus home to a 15,000-pound superconducting magnet used by scientists to search for clues to solving the riddles of neurodegenerative diseases and cancer.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366049, -71.255343], 
			[42.366031, -71.255433], 
			[42.365898, -71.255424],
			[42.365927, -71.255305]]
		]},
		"category":["academics","offices"],
		"entrances":["superconducting_e01"],
		"area":["upper campus"]
	},
]

function Point(x,y) {
	this.x = x;
	this.y = y;
}