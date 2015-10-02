locations_ibs = [
	{
		"id":"samuellemberg",
		"nickname":"Lemberg",
		"name":"Samuel Lemberg Academic Center",
		"function":"",
		"description":"The focal point of Brandeis University’s growing International Business School, the Lemberg Center is home to a new 30-seat tiered lecture hall, a small library, conference areas, and offices. A popular, double-height cyber café, known as The World Court, is a dramatic space at the heart of the building, lit from floor-to-ceiling by windows overlooking wetlands and a wooded hillside. Built as an expansion to an existing circa 1972 building, the new academic complex nearly doubles the size of the school’s facilities. The program creates multiple overlapping points of activity throughout the building to stimulate interaction between students both academically and socially. Built as an expansion to an existing circa 1972 building, the new academic complex nearly doubles the size of the school’s facilities. The program creates multiple overlapping points of activity throughout the building to stimulate interaction between students both academically and socially. The Lemberg Center addition not only extends the educational program but also extends the aesthetic expression of the existing facility, blending seamlessly with the existing building to project a unified, distinct facility.",
		"coordinates":[
			new Point(42.364705, -71.264387),
			new Point(42.364670, -71.264192),
			new Point(42.364538, -71.264051),
			new Point(42.364373, -71.264029),
			new Point(42.364363, -71.264184),
			new Point(42.364425, -71.264190),
			new Point(42.364495, -71.264491),
		],
		"category":["academics"],
		"nearby":["sachar","goldman"],
		"entrances":['samuellemberg_e01','samuellemberg_e02'],
		"area":["lower campus"]
	},
	sachar = {
		"id":"sachar",
		"name":"Sachar International Center",
		"nickname":"Sachar",
		"coordinates":[
			new Point(42.364940, -71.265213), 
			new Point(42.364988, -71.265133), 
			new Point(42.365075, -71.265113), 
			new Point(42.365050, -71.264948), 
			new Point(42.365147, -71.264620), 
			new Point(42.365073, -71.264599), 
			new Point(42.364803, -71.264665), 
			new Point(42.364779, -71.264563), 
			new Point(42.364743, -71.264578), 
			new Point(42.364693, -71.264507), 
			new Point(42.364559, -71.264563), 
			new Point(42.364617, -71.264655), 
			new Point(42.364649, -71.264635), 
			new Point(42.364673, -71.264697), 
			new Point(42.364633, -71.264735), 
			new Point(42.364695, -71.264800), 
			new Point(42.364764, -71.264757), 
			new Point(42.364810, -71.264904), 
			new Point(42.364738, -71.265078), 
		],
		"category":["academics"],
		"entrances":['sachar_e01'],
		"area":["lower campus"]
		},

]

function Point(x,y) {
	this.x = x;
	this.y = y;
}