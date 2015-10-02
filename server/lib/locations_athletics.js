locations_athletics = [
	{
		"id":"rieger",
		"name":"Rieger Tennis Courts",
		"nickname":"Rieger",
		"function":"The Rieger Tennis Courts are home to Brandeis Tennis.",
		"description":"",
		"coordinates":[new Point(42.364942, -71.253357),
			new Point(42.363792, -71.255513),
			new Point(42.363529, -71.255267),
			new Point(42.364682, -71.253104)],
		"category":["athletics"],
		"area":["athletics","athletic complex"],
		"nearby":["uppermods","lowermods","linsey","linseyparkinglot","gosmanparkinglot"],
		"entrances":["rieger_e01","rieger_e02"]
	},
	{
		"id":"marcusfield",
		"name":"Marcus Field",
		"nickname":"Marcus",
		"function":"Marcus Field is home to Brandeis softball.",
		"description":"",
		"coordinates":[new Point(42.363429, -71.256845),
			new Point(42.363353, -71.256063),
			new Point(42.363087, -71.256150),
			new Point(42.362893, -71.256535),
			new Point(42.362844, -71.256953)],
		"category":["athletics"],
		"area":["athletics","athletic complex"],
		"nearby":["rieger","steindiamond","gordonfield","athleticslot","gosman"],
		"entrances":["marcusfield_e01","marcusfield_e02"]
	},
	{
		"id":"steindiamond",
		"name":"Stein Diamond",
		"nickname":"Stein Diamond",
		"function":"The Stein Diamond is home to Brandeis baseball.",
		"description":"",
		"coordinates":[new Point(42.364459, -71.256743),
			new Point(42.364375, -71.255428),
			new Point(42.364094, -71.255409),
			new Point(42.363619, -71.255634),
			new Point(42.363390, -71.256349),
			new Point(42.363507, -71.256827)],
		"category":["athletics"],
		"area":["athletics","athletic complex"],
		"nearby":["rieger","marcusfield","gordonfield","athleticslot","gosman"],
		"entrances":["steindiamond_e01","steindiamond_e02"]
	},
	{
		"id":"gordonfield",
		"name":"Gordon Field",
		"nickname":"Gordon Field",
		"function":"Gordon Field is home to Brandeis soccer.",
		"description":"",
		"category":["athletics"],
		"area":["athletics","athletic complex"],
		"nearby":["marcusfield","steindiamond","athleticslot","commuterrail"],
		"coordinates":[new Point(42.364005, -71.257901),
			new Point(42.364009, -71.257982),
			new Point(42.362726, -71.258113),
			new Point(42.362737, -71.257996),
			new Point(42.362573, -71.257753),
			new Point(42.362557, -71.257396),
			new Point(42.362821, -71.257032),
			new Point(42.363855, -71.256946),
			new Point(42.364076, -71.257145),
			new Point(42.364171, -71.257560)],
		"entrances":["gordonfield_e01","gordonfield_e02","gordonfield_e03"]
	},
	gosman = {
		"id":"gosman",
		"name":"Gosman Sports and Convocation Center",
		"nickname":"Gosman",
		"coordinates":[
			new Point(42.365193,-71.255688), 
			new Point(42.365761,-71.25482), 
			new Point(42.364998,-71.253952), 
			new Point(42.364449,-71.254864)],
		"category":["athletics"],
		"description":"Gosman is one of the largest, best-equipped sports and recreation facilities in New England. Gosman was, until recently, the practice facility for the Boston Celtics. The complex is a state-of- the-art facility for all students, not just varsity athletes. The 70,000 square-foot field house contains basketball, volleyball, tennis, and squash courts, a six-lane indoor track, batting cages, workout rooms complete with personal trainers, and a fencing room. Each year, Gosman hosts athletic competitions (including NCAA Division III national contests), big-name concerts, and the graduation ceremony. Since it has opened, performers have included Adam Sandler, Jerry Seinfeld, Live, Blues Traveler, Counting Crows, Ben Harper, Indigo Girls, John Mayer, and The Steve Miller Band. The Dalai Lama and former presidents Jimmy Carter and Bill Clinton visited as speakers.",
		"function":"Gosman contains many practice facilities, a dance studio, a gym, and the Fieldhouse.",
		"entrances":["gosman_e01"],
		"area":["athletics","athletic complex"]
		},
	linsey = {
		"id":"linsey",
		"name":"Joseph M. Linsey Sports Center",
		"nickname":"Linsey",
		"function":"Linsey contains Linsey Pool and is home to the Brandeis swim team.",
		"coordinates":[
			new Point(42.366071, -71.254290), 
			new Point(42.365863, -71.254620), 
			new Point(42.365636, -71.254366),
			new Point(42.365844, -71.254032), ],
		"category":["athletics"],
		"entrances":["linsey_e01","linsey_e02"],
		"area":["athletics","athletic complex"]
	},
]

function Point(x,y) {
	this.x = x;
	this.y = y;
}