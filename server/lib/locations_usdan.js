locations_usdan = [
	usdan = {
		"id":"usdan",
		"name":"Nathaniel H. and Suzanne Usdan Student Center",
		"nickname":"Usdan",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368296,-71.256585], 
			[42.367852,-71.256794], 
			[42.367777,-71.256451], 
			[42.368243,-71.256259]]
		]},
		"function":"Usdan incorporates student social, cultural and recreational facilities, as well as student and some administrative services. It houses an assembly and banquet hall seating 1,000 people, mailroom, a convenience store, campus cafeteria, lounges, game room and conference rooms.",
		"description":"Usdan Student Center contains an a la carte style dining hall, a post office, an ATM, the Student Service Bureau (where you can lease microwaves or refrigerators, sign up for newspaper delivery, and rent movies, among other things], offices offices, and a variety of meeting spaces. It is a busy meeting place for students and faculty – especially between classes or at meals. The convenience store, also located inside Usdan, is open until 2am seven days a week and has everything from laundry detergent to midnight snacks available. Usdan also houses the Hiatt Career Center, Academic Services, Department of Community Living, and Student Financial Services. Services at the Hiatt Career Center are free to students and alumni. Services include one-on-one career counseling sessions, a network of over 25,000 internships, assistance in writing resumes and cover letters, and interview prep. Usdan is also home to the study abroad offices – over a third of the Junior class goes abroad every year! If you’d like to explore Usdan, you’ll find the dining hall, post office, and some offices on the lower level.",
		"entrances":["usdan_e01","usdan_e02","usdan_e03"],
		"category":["student life"],
		"area":["upper campus"],
		'nearby':["levin","stop_rabb","rabb","goldfarb","mandelpeacegarden","schwartz","crown","castle","kutz"]
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
		"area":["upper campus"],
		"function":"Levin Ballroom hosts many large student events and conferences, including APAHM, MELA, and the study abroad fair.",
		"nearby":["usdan","stop_rabb","goldfarb","farber","mandelpeacegarden"]
	},
	schwartz = {
		"id":"schwartz",
		"name":"Schwartz Hall",
		"nickname":"Schwartz",
		"function":"Schwartz Hall includes classrooms supporting the Crown Center for Middle East Studies and the psychology, sociology and biology departments. It also houses two psychology research laboratories.",
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
		"area":["upper campus"],
		"function":"The Brown Social Sciences Center is home to the school’s Aging, Culture and Cognition Laboratory. It also includes offices and classrooms for the psychology and anthropology departments, as well as the American studies and journalism programs.",
		"nearby":["schwartz","tree","goldsmith","mandelpeacegarden","farber","goldfarb"]
		},
	crown = {
		"id":"crown",
		"name":"Lemberg Hall - Crown Center for Middle East Studies",
		"nickname":"Crown",
		"coordinates":{"type":"Polygon","coordinates":[
			[[42.367353, -71.256519],
			[42.367314, -71.256338], 
			[42.367180, -71.256386], 
			[42.367212, -71.256574]]
		]},
		"category":["academics"],
		"entrances":["crown_e01"],
		"area":["upper campus"],
		"function":"Lemberg Hall houses the Crown Center for Middle East Studies and other faculty offices.",
		"nearby":["castle","schwartz","usdan"]
	},

]
