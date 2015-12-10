locations_presidential = [
	bernstein = {
		"id":"bernstein-marcus",
		"name":"Bernstein-Marcus Administration Center",
		"nickname":"Bernstein-Marcus",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.365077,-71.25998], 
			[42.365222,-71.259642], 
			[42.365046,-71.259492], 
			[42.36489,-71.259837]]
		]},
		"category":["administrative"],
		"entrances":["bernstein_e01"],
		"area":["lower campus"],
		"function":"The Bernstein-Marcus Administration Center houses several of Brandeis’ administration and development offices.",
		'nearby':["gryzmish","irving","scc","info"]
		},,
	gryzmish = {
		"id":"gryzmish",
		"name":"Ethel and Reuben Gryzmish Academic Center",
		"nickname":"Gryzmish",
		"description":"Gryzmish Center is home to Office of Communications, Department of Integrated Media, Office of Student & Enrollment, Planning & Institutional Rsrch, Division of Admin & Finance, Office of Human Resources, Investment Management, Office of the General Counsel and Department of Digital Communications.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.365593,-71.259553], 
			[42.365759,-71.25918], 
			[42.365577,-71.259025], 
			[42.365417,-71.259403]]
		]},
		"category":["administrative"],
		"entrances":["gryzmish_e01"],
		"area":["lower campus"],
		"nearby":["irving","bernstein-marcus","info","scc"]
		},

	irving = {
		"id":"irving",
		"name":"Julius and Matilda Irving Presidential Enclave",
		"nickname":"Irving",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.365209,-71.259623], 
			[42.365423,-71.259113], 
			[42.36529,-71.259006], 
			[42.365076,-71.259521]]
		]},
		"category":["administrative"],
		"entrances":["irving_e01","irving_e02"],
		"area":["lower campus"],
		"function":"The Irving Presidential Enclave houses administrative offices, including those for the university president, the provost, and the dean of arts and sciences, among others.",
		"nearby":["gryzmish","bernstein-marcus","info","scc","squirebridge"]
		},
	info = {
		"id":"info",
		"name":"Main Entrance Information Booth",
		"nickname":"Info Booth",
		"coordinates": {"type":"Polygon","coordinates":[
			[	[42.365015,-71.258721], 
			[42.365046,-71.258676], 
			[42.365007,-71.258634],
			[42.364978,-71.258681]]
		]},
		"category":["offices"],
		"entrances":["info_e01"],
		"area":["lower campus"],
		"function":"The Main Entrance Information Booth is the first stop at the entrance to Brandeis University before drivers access the peripheral road circling the upper campus. The booth can issue parking passes. The elusive BranVan can also be seen here.",
		"nearby":["squirebridge","irving","gryzmish","bernstein-marcus","slosberg"]
		},
	epstein = {
		"id":"epstein",
		"name":"Rubin and Ethel Epstein Center for Campus Services",
		"nickname":"Epstein",
		"function":"The Epstein Building is home to the Women's Studies Research Center, Hadassah-Brandeis Institute, the Kniznick Gallery, advancement services, and the university's facilities services.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.362457,-71.261636], 
			[42.362374,-71.260823], 
			[42.362134,-71.260864], 
			[42.362204,-71.261671]]
		]},
		"category":["academics","offices"],
		"entrances":["epstein_e01","epstein_e02"],
		"area":["lower campus"],
		"nearby":["inspiration","ss567","commuterrail","stop_trainstation","turner"]
		}
]
