locations_massellChapels = [
	berlin = {
		"id":"berlin",
		"name":"Mendel and Leah Berlin Chapel",
		"nickname":"Berlin Chapel",
		"function":"Berlin is the Jewish house of worship and the largest of the three chapels.",
		"description":"Berlin Chapel can accommodate up to 130 guests. The chapel is used throughout the year for Orthodox Jewish student services, but is available on the weekend for bar/bat mitzvah services and Jewish wedding ceremonies. The chapel has its own Torah and 80 prayer books. Floor-to-ceiling windows on two walls bathe guests in a tremendous amount of sunlight, adding to the overall warmth of the facility.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368284,-71.260708], 
			[42.368244,-71.260593], 
			[42.368082,-71.260705], 
			[42.368135,-71.26081]]
		]},
		"category":["religious"],
		"entrances":["berlin_e01"],
		"area":["upper campus","chapels"],
		"nearby":["bethlehem","harlan","praying_human","chapelsfieldwetland","chapelsfield","renfield","magnalias","ruach_yisrael","holocaust_rememberance"]
		},
	bethlehem = {
		"id":"bethlehem",
		"name":"Bethlehem Chapel",
		"nickname":"Bethlehem Chapel",
		"function":"Bethlehem Chapel serves the Catholic faithful at Brandeis.",
		"description":"The Catholic chapel at Brandeis is a cozy place capable of accommodating up to 50 guests. Located furthest from the main road, Bethlehem Chapel provides a quiet place to host an intimate Catholic wedding ceremony or christening. The chapel has its own small piano and floor-to-ceiling window wall, providing a beautiful view of Chapel's Pond.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368343,-71.260178], 
			[42.368259,-71.259998], 
			[42.368196,-71.260047], 
			[42.368267,-71.260243]]
		]},
		"category":["religious"],
		"entrances":["bethlehem_e01"],
		"area":["upper campus","chapels"],
		"nearby":["berlin","harlan","praying_human","chapelsfield","chapelsfieldwetland"]
		},
	harlan = {
		"id":"harlan",
		"name":"John Marshall Harlan Chapel",
		"nickname":"Harlan Chapel",
		"function":"Harlan is the Protestant chapel at Brandeis.",
		"description":"The Protestant chapel on campus hosts a variety of Christian and nondenominational ceremonies during the year. Harlan Chapel, situated closest to the road for the maxium amount of accessibility, can accommodate up to 50 guests. Couples of any Christian faith or those who are not religiously affiliated are welcome to host their wedding ceremony here. Harlan Chapel also has its own small piano and floor-to-ceiling window wall that provides a beautiful backdrop directly across from the altar.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368776,-71.260739], 
			[42.368692,-71.260564], 
			[42.36865,-71.2606], 
			[42.368732,-71.260779]]
		]},
		"category":["religious"],
		"entrances":["harlan_e01"],
		"area":["upper campus","chapels"],
		"nearby":["berlin","bethlehem","praying_human","chapelsfield","chapelsfieldwetland"]
		},
	chapelsField = {
		"id":"chapelsfield",
		"name":"Chapels Field",
		"nickname":"Chapels Field",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368103,-71.260244], 
			[42.36763,-71.25901], 
			[42.367281,-71.259034], 
			[42.367681,-71.260542]]
		]},
		"description":"Chapels Field is usually bustling with student activities ranging from sports events, such as Quidditch practice, to concerts, such as Springfest. The three chapels on Chapel’s Field represent three different faiths and surround a heart shaped pond. They are built in such a way that no chapel casts its shadow over another chapel, symbolizing our respect for pluralism and diversity. The university has added a Muslim Prayer Room to campus and has connections with various other religious groups off-campus to address the spiritual needs of all. In total, the Brandeis community represents seventeen recognized world religions.",
		"category":["landscape"],
		"entrances":["chapelsfield_c04", "chapelsfield_c03","chapelsfield_c02","chapelsfield_c01"],
		"area":["upper campus","chapels"],
		"nearby":["chapelsfieldwetland","berlin","bethlehem","harlan","renfield","rosienorth","volen"]
		},
	{
		"id":"chapelsfieldwetland",
		"name":"Chapels Field Wetland",
		"nickname":"Chapels Field Wetland",
		"function":"The Chapels Field Wetland acts as a catchment basin for water from upper campus, preventing the flooding of Massell Quad and the Chapels.",
		"description":"",
		"category":["landscape"],
		"entrances":["bethlehem_c01"],
		"area":["upper campus","chapels"],
		"nearby":["chapelsfield","berlin","bethlehem","harlan","farber","heller","schneider"],
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368033, -71.259924],
			[42.367690, -71.259097],
			[42.368603, -71.258490],
			[42.369017, -71.260276],
			[42.368729, -71.260412],
			[42.368522, -71.259772]]
		]}
	},
	facultycenter = {
		"id":"facultycenter",
		"name":"Wien Faculty Center",
		"nickname":"Faculty Center",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.36569,-71.261466],
			[42.365817, -71.261193],
			[42.365860, -71.261227],
			[42.365840, -71.261266],
			[42.365916, -71.261331],
			[42.366147, -71.260813],
			[42.366072, -71.260751],
			[42.365878, -71.261179],
			[42.365834, -71.261142], 
			[42.365861,-71.261069], 
			[42.365651,-71.260898], 
			[42.36548,-71.2613]]
		]},
		"function":"The Wien Faculty Center houses the Faculty Club, which includes the main dining room, the president's dining room and the lounge. The Faculty Lodge is adjacent to the Wien Faculty Center and offers a limited number of rooms for overnight accommodations.",
		"description":"The Faculty Club is a restaurant that is open to faculty and students alike and is on the student meal plan. The Student Union hosts a program called “Take Your Professor to Lunch”, which encourages students to get to know faculty members outside the classroom. The Student Union distributes vouchers to the students in order to cover the cost of the meal. This opportunity aides in fostering Brandeis’ legacy of strong professor-student relationships. Mitch Albom, a Brandeis alum, wrote the famous book Tuesdays with Morrie, which chronicles his time with Morrie Schwartz, his life-long mentor and Brandeis professor.",
		"category":["dining"],
		"entrances":["facultycenter_e01","facultycenter_e02"],
		"area":["lower campus"],
		"nearby":["shermandining","scc"]
		},
]
