locations_arts = [
	pollack = {
		"id":"pollack",
		"name":"Pollack Fine Arts Teaching Center",
		"nickname":"Pollack",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.365328,-71.26243], 
			[42.365291,-71.262325], 
			[42.365122,-71.262435], 
			[42.365158,-71.262541]]
		]},
		"category":["academics","art"],
		"nearby":["spingold","roseart","goldman"],
		"entrances":['pollack_e01'],
		"area":["lower campus"],
		"function":"The Pollack Fine Arts Teaching Center provides a lecture hall as one of three teaching venues for the university’s fine arts department."
		},	
	slosberg = {
		"id":"slosberg",
		"name":"Slosberg Music Center",
		"nickname":"Slosberg",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.364412,-71.259683], 
			[42.364319,-71.2594], 
			[42.363891,-71.259666], 
			[42.363985,-71.259942]]
		]},
		"function":"Slosberg is home to the Brandeis Concert Series.",
		"description":"Slosberg Music Center, built in the shape of a grand piano with 88 windows to represent the 88 keys on a piano, is home to the music department. Inside you will discover a 225 seat concert hall where eight student ensembles and the internationally acclaimed Lydian String Quartet perform everything from Beethoven to original student-composed electronic music. Additionally, there are practice rooms open to all students including both music majors and non-music majors. The first piano of acclaimed composer Leonard Bernstein (faculty 1951-55) is displayed in the lobby. Each year, nearly 300 professional and student performances and exhibitions take place on campus, culminating in the annual Leonard Bernstein Festival for the Creative Arts, founded in 1952 by Bernstein himself. First Lady Eleanor Roosevelt, who was also a founding faculty member of Brandeis, had a television show in Slosberg, and it is said that on that show JFK confirmed he was running for President of the United States.",
		"category":["academics","art"],
		"entrances":["slosberg_e01","slosberg_e02","slosberg_e03","slosberg_e04"],
		"nearby":["admissions","bernstein-marcus","lemberg","village"],
		"area":["lower campus"]
		},
	spingold = {
		"id":"spingold",
		"name":"Spingold Theater Center",
		"nickname":"Spingold",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.364733, -71.261736], 
			[42.364701, -71.261636], 
			[42.364564, -71.261727], 
			[42.364437, -71.261598],
			[42.364222, -71.261593],
			[42.364060, -71.261870],
			[42.364113, -71.262185],
			[42.364328, -71.262309],
			[42.364550, -71.262137],
			[42.364589, -71.261813]]
		]},
		"function":"Spingold Theater Center serves as the performance home for the Brandeis Theater Company, which produces and performs several theatrical works a year. Built in 1965, the facility includes three different performance venues: a 750-seat main theater, the 175-seat thrust Laurie Theater and the 100-seat Merrick Theater.",
		"description":"Spingold Theater, is home to the theatre department. The cutting-edge Brandeis Theatre Company produces five productions each season. Debra Messing (Grace Adler) of Will & Grace, Steven Culp (Rex VanDe Camp) of Desperate Housewives, and Loretta Devine of the original Broadway cast of Dreamgirls, among many others, are graduates of the programs. Undergraduate students are encouraged to get involved with campus productions, whether that means assistant stage managing, costume designing, or acting in them!",
		"category":["academics","art"],
		"entrances":['spingold_e01','spingold_e02'],
		"nearby":["theaterparking","goldman","ridgewoodB"],
		"area":["lower campus"]
		},
	{
		"id":"roseart",
		"name": "The Rose Art Museum",
		"nickname": "The Rose",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.365986, -71.262427],
			[42.365909, -71.262201],
			[42.365627, -71.262362],
			[42.365555, -71.262220],
			[42.365439, -71.262283],
			[42.365561, -71.262668],
			[42.365437, -71.262762],
			[42.365498, -71.262956],
			[42.365797, -71.262774],
			[42.365739, -71.262582]]
		]},
		"function": "The Rose Art Museum showcases the university’s deep collection of modern and contemporary art. Founded in 1961, it has a permanent collection of 8,000 art pieces, with particular emphasis on 1960’s and 1970’s American Art.",
		"description":"The Rose Art Museum houses the largest collection of modern art in New England. Admission is free to students and many intern there during the year. For a fee of $10 per semester, Brandeis students can rent a piece from the Student Loan Collection to hang in their room. The Rose Art Museum houses works by artists such as Marc Chagall, Andy Warhol, and Wassily Kandinsky. Recent acquisitions in 2012 have included works by Bruce Conner and Mark Bradford. As one of the most daring and innovative contemporary art museums the Rose regularly showcases new and innovative exhibitions. It also hosts regular artist talks and its permanent collection is frequently used as a teaching tool both in and outside of the classroom.",
		"category":["art"],
		"entrances":['museum_e01'],
		"nearby":["lightofreason","goldman","pollack"],
		"area":["lower campus"]
	},
	goldman = {
		"id":"goldman",
		"name":"Goldman-Schwartz Fine Arts",
		"nickname":"Goldman-Schwartz",
		"function":"The Goldman-Schwartz Art Studios offers classroom and office space for the university's studio art program.",
		"description":"Goldman-Schwartz Fine Arts is home to the Department of Fine Arts. It welcomes students to experience art through scholarship and as a process of creation. By uniting intellectual inquiry with artist excellence, it affirms the importance of a broad education and prepare the students for creative participation in a changing society.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.365001,-71.263157], 
			[42.364799,-71.26258], 
			[42.364525,-71.262821], 
			[42.364628,-71.263304]]
		]},
		"category":["academics","art"],
		"entrances":['goldman_e01','goldman_e02'],
		"nearby":["pollack","ibs","sachar","samuellemberg"],
		"area":["lower campus"]
		},		
]