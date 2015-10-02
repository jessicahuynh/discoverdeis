locations_presidential = [
	bernstein = {
		"id":"bernstein-marcus",
		"name":"Bernstein-Marcus Administration Center",
		"nickname":"Bernstein-Marcus",
		"coordinates":[
			new Point(42.365077,-71.25998), 
			new Point(42.365222,-71.259642), 
			new Point(42.365046,-71.259492), 
			new Point(42.36489,-71.259837)],
		"category":["administrative"],
		"area":["lower campus"]
		},
	epstein = {
		"id":"epstein",
		"name":"Rubin and Ethel Epstein Center for Campus Services",
		"nickname":"Epstein",
		"function":"Epstein is home to facilities, the Women's Studies Research Center, and the Kniznick Gallery.",
		"coordinates":[
			new Point(42.362457,-71.261636), 
			new Point(42.362374,-71.260823), 
			new Point(42.362134,-71.260864), 
			new Point(42.362204,-71.261671)],
		"category":["academics","offices"],
		"entrances":["epstein_e01","epstein_e02"],
		"area":["lower campus"]
		},
	gryzmish = {
		"id":"gryzmish",
		"name":"Ethel and Reuben Gryzmish Academic Center",
		"nickname":"Gryzmish",
		"description":"Gryzmish Center is home to Office of Communications, Department of Integrated Media, Office of Student & Enrollment, Planning & Institutional Rsrch, Division of Admin & Finance, Office of Human Resources, Investment Management, Office of the General Counsel and Department of Digital Communications.",
		"coordinates":[
			new Point(42.365593,-71.259553), 
			new Point(42.365759,-71.25918), 
			new Point(42.365577,-71.259025), 
			new Point(42.365417,-71.259403)],
		"category":["administrative"],
		"area":["lower campus"]
		},

	irving = {
		"id":"irving",
		"name":"Julius and Matilda Irving Presidential Enclave",
		"nickname":"Irving",
		"coordinates":[
			new Point(42.365209,-71.259623), 
			new Point(42.365423,-71.259113), 
			new Point(42.36529,-71.259006), 
			new Point(42.365076,-71.259521)],
		"category":["administrative"],
		"area":["lower campus"]
		},
]

function Point(x,y) {
	this.x = x;
	this.y = y;
}