locations_usdan = [
	usdan = {
		"id":"usdan",
		"name":"Usdan Student Center",
		"nickname":"Usdan",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368296,-71.256585], 
			[42.367852,-71.256794], 
			[42.367777,-71.256451], 
			[42.368243,-71.256259]]
		]},
		"description":"Usdan Student Center contains an a la carte style dining hall, a post office, an ATM, the Student Service Bureau (where you can lease microwaves or refrigerators, sign up for newspaper delivery, and rent movies, among other things], offices offices, and a variety of meeting spaces. It is a busy meeting place for students and faculty – especially between classes or at meals. The convenience store, also located inside Usdan, is open until 2am seven days a week and has everything from laundry detergent to midnight snacks available. Usdan also houses the Hiatt Career Center, Academic Services, Department of Community Living, and Student Financial Services. Services at the Hiatt Career Center are free to students and alumni. Services include one-on-one career counseling sessions, a network of over 25,000 internships, assistance in writing resumes and cover letters, and interview prep. Usdan is also home to the study abroad offices – over a third of the Junior class goes abroad every year! If you’d like to explore Usdan, you’ll find the dining hall, post office, and some offices on the lower level.",
		"entrances":["usdan_e01","usdan_e02","usdan_e03"],
		"category":["student life"],
		"area":["upper campus"]
		},
	{
		"id":"levin",
		"name":"Levin Ballroom",
		"nickname":"Levin",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368350, -71.256863], 
			[42.368408, -71.257168], 
			[42.368260, -71.257223],
			[42.368273, -71.257331],
			[42.368280, -71.257333],
			[42.368109, -71.257388],
			[42.368090, -71.257274],
			[42.367938, -71.257330],
			[42.367883, -71.257026]]
		]},
		"category":["student life"],
		"entrances":["levin_e01","levin_e02"],
		"area":["upper campus"]
	},
	{
		"id":"mandelpeacegarden",
		"nickname":"Peace Circle",
		"name":"Mandel Peace Garden",
		"description":"The Brandeis University Peace Monument was first dedicated in May 2002. It is located in the circular seating area between Usdan and Pearlman and is surrounded by benches and a garden. In the very center of the monument is a beautiful mosaic of a dove — the international symbol of peace. Encircling the mosaic are tiles engraved with the word 'peace' in the languages spoken at Brandeis. There are approximately 40 different language bricks. Building for Peace set out to further the beauty and breadth of the Peace Monument by adding bricks and improving the garden. There are hopes to add approximately 20 more language bricks (including American Sign Language and Braile], various cultural symbols of peace, a dedication plaque and a 'peace tree.' Part of the financing for what we now call the Mandel Peace Garden, came from generous benefactor Jay A. Mandel '80 and his life partner, Jeffrey M. Scheckner, in memory of Jay's grandparents, Harry and Violet Mandel.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.367868, -71.257631], 
			[42.367728, -71.257779], 
			[42.367751, -71.257513]]
		]},
		"category":["landscape","art"],
		"entrances":["mandelpeacegarden_e01","mandelpeacegarden_e02"],
		"area":["upper campus"]
	},

	schwartz = {
		"id":"schwartz",
		"name":"Schwartz Hall",
		"nickname":"Schwartz",
		"function":"Schwartz contains many lecture halls.",
		"description":"",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.367642,-71.257438], 
			[42.367563,-71.257024], 
			[42.367418,-71.257072], 
			[42.367494,-71.257484]]
		]},
		"category":["academics"],
		"entrances":["schwartz_e01","brown_ie01"],
		"area":["upper campus"],
		"nearby":["brown","mandelpeacegarden","usdan","levin"]
		},
	brown = {
		"id":"brown",
		"name":"Brown Social Science Center",
		"nickname":"Brown",
		"coordinates": {"type":"Polygon","coordinates":[[
			[42.367383,-71.257225], 
			[42.36728,-71.256666], 
			[42.367169,-71.256718], 
			[42.367266,-71.257265]]]},
		"category":["academics"],
		"entrances":["brown_e01","brown_e02", "brown_ie01", "brown_e03"],
		"area":["upper campus"]
		},
	castle = {
		"id":"castle",
		"name":"Usen Castle",
		"nickname":"Castle",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.367726, -71.255875], 
			[42.367516, -71.256036], 
			[42.366953, -71.255936], 
			[42.366929, -71.255488],
			[42.367387, -71.255545]]
		]},
		"category":["dorm","landscape","art"],
		"description":"Usen Castle may seem out of place on our campus, and, in fact, it predates the university. The castle was built to look like many of the castles that one might find in Scotland; however, this castle was built based on rough exterior sketches drawn from the outside of an already-existing castle. As a result, the castle is filled with architectural mishaps including rogue staircases, trapdoors, and oddly shaped rooms. While it is now a national historic landmark, the castle is also a residence hall with singles, doubles, and suites available for students in their sophomore year. With its quirky character and spectacular view of Boston, the castle makes for a unique living experience.",
		"entrances":["castle_e01","castle_e02"],
		"area":["upper campus"]
	},
	crown = {
		"id":"crown",
		"name":"Lemberg Hall Crown Center for Middle East Studies",
		"nickname":"Crown",
		"coordinates":[
			new Point(42.367353, -71.256519),
			new Point(42.367314, -71.256338), 
			new Point(42.367180, -71.256386), 
			new Point(42.367212, -71.256574)],
		"category":["academics"],
		"entrances":["crown_e01"],
		"area":["upper campus"]
	},

]
