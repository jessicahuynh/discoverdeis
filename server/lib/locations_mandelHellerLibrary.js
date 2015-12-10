locations_mandelHellerLibrary=[
	{
		"id":"schneider",
		"name":"Irving Schneider and Family Building (Heller School)",
		"nickname":"Heller (Schneider)",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369303, -71.259773], 
			[42.369452, -71.259208], 
			[42.369298, -71.259200],
			[42.369289, -71.259155],
			[42.369278, -71.259090],  
			[42.369169, -71.259145],
			[42.369148, -71.259343],
			[42.369258, -71.259346],
			[42.369166, -71.259735]]
		]},
		"category":["offices","academics"],
		"entrances":["schneider_e01", "schneider_e02", "schneider_e03"],
		"area":["upper campus"],
		"function":"Home to the Heller School for Social Policy and Management, the Irving Schneider and Family Building contains classroom and lecture space, study areas, student lounges and the public atrium known as the Zinner Forum. The building also houses the Schneider Institute for Health Policy.",
		"nearby":["heller","chapelsfieldwetland","abraham","olin-sang","mandel","mandelJewish"]
	},
	heller = {
		"id":"heller",
		"name":"Heller-Brown Building",
		"nickname":"Heller (Brown)",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369326,-71.259107], 
			[42.369187,-71.258417], 
			[42.369025,-71.258474], 
			[42.369158,-71.259171]]
		]},
		"function":"The Heller-Brown Building is one of two buildings making up the Heller School for Social Policy and Management. The building holds classrooms, conference rooms, offices, a library and Geographic Information Systems lab.",
		"description":"Heller-Brown is home to the Heller School for Social Policy and Management, one of the top ten schools of social policy in the United States and one of the eight approved U.S. training institutions for World Bank Scholars.",
		"category":["academics"],
		"entrances":["heller_e01", "heller_e02", "starbucksHeller_ie01"],
		"area":["upper campus"],
		"nearby":["schneider","abraham","chapelsfieldwetland","mandel","mandelJewish","olin-sang"]
		},
	{
		"id":"lown",
		"name":"Lown School of Near Eastern and Judaic Studies",
		"nickname":"Lown",
		"function":"The Lown Center for Judaica Studies is home to the Maurice & Marilyn Center for Modern Jewish Studies, the Near Eastern & Judaic Studies program, the Hornstein Jewish Professional Leadership Program and the university’s National Center for Jewish Film. It also contains many courses in Near Eastern and Judaic Studies (NEJS) and Islamic and Middle Eastern Studies (IMES).",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.370321, -71.257312], 
			[42.370185, -71.257497], 
			[42.369941, -71.257161],
			[42.370076, -71.256976]]
		]},
		"category":["academics","offices"],
		"entrances":["lown_e01", "lown_e02"],
		"area":["upper campus","mandel"],
		"nearby":["golding","shiffman","olin-sang","mandel","rabb","gordon","stop_rabb"]
	},
	{
		"id":"abraham",
		"name":"Abraham Shapiro Academic Complex",
		"nickname":"Shapiro Academic Complex",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369827, -71.259680], 
			[42.369761, -71.259332], 
			[42.369684, -71.259351],
			[42.369666, -71.259279],  
			[42.369609, -71.259300],
			[42.369722, -71.259721]]
		]},
		"category":["offices","academics"],
		"entrances":["abraham_e01"],
		"area":["upper campus"],
		"function":"The Abraham Shapiro Academic Complex houses the International Center for Ethics, Justice and Public Life and the Education Program. The building includes classrooms, offices, seminar and conference room space, as well as a graduate-student study area.",
		"nearby":["mandelJewish","mandel","heller","schneider","chapelsfieldwetland"]
	},
	{
		"id":"mandelJewish",
		"name":"Jack, Joseph, and Morton Mandel Center for Studies in Jewish Education",
		"nickname":"Mandel Center",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369615, -71.259750], 
			[42.369553, -71.259402], 
			[42.369590, -71.259387],
			[42.369577, -71.259318],
			[42.369605, -71.259309],  
			[42.369609, -71.259300],
			[42.369722, -71.259721]]
		]},
		"category":["offices","academics"],
		"entrances":["mandelJewish_e01"],
		"area":["upper campus"],
		"function":"The Mandel Center for Studies in Jewish Education is located on the Brandeis University campus in the Abraham Shapiro Academic Complex. It pursues Jewish educational scholarship in service to the Jewish community in order to promote deeper understanding of the purposes and practices of Jewish education.",
		'nearby':["abraham","mandel","heller","schneider","chapelsfieldwetland","stop_rabb","olin-sang"]
	},
	olinsang = {
		"id":"olin-sang",
		"name":"Olin-Sang American Civilization Center",
		"nickname":"Olin-Sang",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369899, -71.257850], 
			[42.369778, -71.258012], 
			[42.369392, -71.257481], 
			[42.369507, -71.257322]]
		]},
		"category":["academics"],
		"entrances":["olin-sang_e01", "olin-sang_ie01", "olin-sang_e02", "olin-sang_e03"],
		"area":["upper campus","mandel"],
		"function":"The Olin-Sang American Civilization Center holds classrooms and offices for various university departments including History, Latin American and Latino Studies, and the Film, Television and Interactive Media program, along with many lecture halls.",
		"nearby":["mandel","rabb","golding","lown","shiffman","tree","stop_rabb","heller","mandelJewish","schneider"]
	},
	goldfarb = {
		"id":"goldfarb",
		"name":"Goldfarb Library",
		"nickname":"Goldfarb",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.368789, -71.258209], 
			[42.368123, -71.258451], 
			[42.367935, -71.258283], 
			[42.367945, -71.258188],
			[42.367892, -71.258129],
			[42.367823, -71.258152],
			[42.367790, -71.257981],
			[42.367993, -71.257914], 
			[42.368135, -71.257891],
			[42.368118, -71.257811],
			[42.368674, -71.257622]]
		]},
		"category":["academics"],
		"function":"The Goldfarb Library is the main library on campus where students may access 30,000 electronic journals and 250 scholarly databases, group study rooms and computer tech support from Library Technology Services. It also houses university archives, special collections of rare books and manuscripts and its Judaica Collection of Jewish history, religious and cultural documents.",
		"description": "Goldfarb/Farber Libraries house ever growing collections and reference resources in creative arts, humanities, government documents, Judaica, and social sciences. Research materials are extremely accessible to students due to the online availability of resources, and additional resources are made available through the Boston Library Consortium and the Interlibrary Loan system. The library offers services for students including a listening center, computer labs, study rooms, a media lab that helps students edit their films and soundtracks, as well as the Writing Center. The Writing Center assists students in all aspects of writing their papers, from brainstorming to editing. Recently, a new café was added to the Green Room section of the library.",
		"entrances":["goldfarb_e01","goldfarb_e02", "library_ie01"],
		"area":["upper campus","libraries"],
		"nearby":["farber","usdan","chapelsfieldwetland","heller","schneider"]
	},
	farber = {
		"id":"farber",
		"name":"Leonard L. Farber Library",
		"nickname":"Farber",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.367907,-71.258866], 
			[42.368046,-71.25855], 
			[42.367823,-71.258354], 
			[42.367688,-71.25867]]
		]},
		"category":["library"],
		"entrances":["farber_e01", "farber_ie01"],
		"area":["upper campus","libraries"],
		"function":"One of three libraries on campus, the Leonard L. Farber Library houses resources and services supporting the humanities, the social sciences, Judaica and creative arts. The university’s Getz Multimedia Lab is also located here.",
		"nearby":["goldfarb","usdan","chapelsfield","chapelsfieldwetland"]
		},
	rabb = {
		"id":"rabb",
		"name":"Rabb Graduate Center",
		"nickname":"Rabb Graduate Center",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369289,-71.25762], 
			[42.369127,-71.256792], 
			[42.368996,-71.256845],
			[42.36915,-71.257674]]
		]},
		"category":["academics"],
		"entrances":["rabb_e01"],
		"area":["upper campus","mandel"],
		"function":"Rabb Graduate Center houses seminar rooms, faculty and administrative offices, and small offices for graduate students in study areas such as English, Romance Studies, Philosophy, and Environmental Studies.",
		"nearby":["olin-sang","shiffman","golding","mandel","stop_rabb","usdan"]
		},
	mandel = {
		"id":"mandel",
		"name":"Jack, Joseph, and Morton Mandel Center for the Humanities",
		"nickname":"Mandel",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369854, -71.258567], 
			[42.369817, -71.258603], 
			[42.369811, -71.258588], 
			[42.369757, -71.258614],
			[42.369751, -71.258594],
			[42.369739, -71.258596],
			[42.369728, -71.258563],
			[42.369705, -71.258573],
			[42.369575, -71.258092],
			[42.369444, -71.258020],
			[42.369496, -71.257939],
			[42.369476, -71.257872],
			[42.369467, -71.257794],
			[42.369479, -71.257751],
			[42.369491, -71.257723],
			[42.369513, -71.257705],
			[42.369535, -71.257709],
			[42.369570, -71.257757],
			[42.369589, -71.257849],
			[42.369607, -71.257813],
			[42.369629, -71.257896],
			[42.369663, -71.257879]]
		]},
		"function": "Mandel is the main facility for liberal arts education, including humanities, social sciences, literature, language and philosophy. The four-story center, made up of multiple buildings linked with an outdoor quadrangle, has a 90-seat theater/lecture hall, classrooms, seminar rooms, offices and open workstations.",
		"description": "The Mandel Center for the Humanities was created as an interdisciplinary building \
						that specifically combines subjects in order for students to have a better understanding \
						of the major themes of the human experience. The Center’s courses include languages, \
						literature, philosophy, history, anthropology, sociology, and are \
						intended for undergraduate students, graduate students, faculty, and visitors. This \
						building regularly hosts an interdisciplinary seminar taught by several professors from \
						different areas of study. Classes in this building are taught in a round-table setting \
						as well as in lecture halls.",
		"category":["academics"],
		"entrances":["mandel_e01", "mandel_e02", "olin-sang_ie01"],
		"nearby":["olin-sang","golding","rabbGrad", "heller"],
		"area":["upper campus","mandel"]
	},
	golding = {
		"id":"golding",
		"name":"Golding Judaic Center",
		"nickname":"Golding",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.370371, -71.257649], 
			[42.370013, -71.258116], 
			[42.369876, -71.257926], 
			[42.370232, -71.257451]]
		]},
		"category":["academics"],
		"entrances":["golding_e01", "golding_e02"],
		"nearby":["olin-sang","mandel","lown","shiffman"],
		"area":["upper campus","mandel"],
		"function":"The Golding Judaica Center holds classrooms for subject areas including East Asian Studies, Near Eastern and Judaic Studies (NEJS), and African and Afro-American Studies (AAAS)."
	},
	shiffman = {
		"id":"shiffman",
		"name":"Shiffman Humanities Center",
		"nickname":"Shiffman",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369937, -71.257230], 
			[42.369831, -71.257372], 
			[42.369475, -71.256876], 
			[42.369583, -71.256729]]
		]},
		"category":["academics"],
		"entrances":["shiffman_e01", "shiffman_e02", "shiffman_e03"],
		"area":["upper campus","mandel"],
		"function":"On the north side of campus, Shiffman Humanities Center houses offices and classrooms for the departments of Romance Studies, German Studies, Russian Studies, European Cultural Studies, and the Comparative Literature Program.",
		"nearby":["tree","golding","rabb","lown","olin-sang","gordon","kutz"]
	},
	kutz = {
		"id":"kutz",
		"name":"Kutz Hall",
		"nickname":"Kutz",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.369162, -71.256163], 
			[42.369043, -71.256226], 
			[42.369012, -71.256130], 
			[42.368903, -71.256184],
			[42.368807, -71.255841],
			[42.368912, -71.255787],
			[42.368880, -71.255647],
			[42.368997, -71.255590],
			[42.369113, -71.256013],
			[42.369151, -71.255997],
			[42.369151, -71.256053],
			[42.369131, -71.256053]]
		]},
		"category":["administrative","offices","student life"],
		"entrances":["kutz_e01","kutz_e02"],
		"area":["upper campus"],
		"function":"Kutz Hall houses offices for the Graduate School of Arts and Sciences, the registrar, and Conference and Events Services, as well as the International Students & Scholars Office and the Campus Card Office. The Graduate Student Center on the first floor gives students use of a day locker and a lounge/study site.",
		"nearby":["gordon","usen","reitman","cable","usdan","shiffman","stop_rabb"]
	},

]
