//sherman,
locations_admission = [
	{
		"id":"shermanfunctionhall",
		"name":"Sherman Function Hall",
		"nickname":"Sherman",
		"function":"Sherman Function Hall holds conferences and has a dining hall downstairs",
		"description":"",
		"category":["dining","student life"],
		"area":["lower campus"],
		"nearby":["facultycenter","scc","rosiesouth","shapirodorm","usen"],
		"coordinates":[new Point(42.366599, -71.260741),
			new Point(42.366687, -71.260541),
			new Point(42.366545, -71.260425),
			new Point(42.366525, -71.260473),
			new Point(42.366325, -71.260309),
			new Point(42.366253, -71.260473),
			new Point(42.366260, -71.260901),
			new Point(42.366355, -71.260985),
			new Point(42.366438, -71.260810),
			new Point(42.366627, -71.260942),
			new Point(42.366688, -71.260810)],
		"entrances":["shermanfunctionhall_e01","shermanfunctionhall_e02"]
	},
	admissions = {
		"id":"admissions",
		"name":"Carl and Ruth Shapiro Admissions Center",
		"nickname":"Admissions",
		"coordinates":[
			new Point(42.364604, -71.260664), 
			new Point(42.364611, -71.260819),
			new Point(42.364489, -71.260878), 
			new Point(42.364150, -71.261231), 
			new Point(42.364074, -71.261022),
			new Point(42.364386, -71.260705)],
		"function":"Admissions hosts tours and provides information about Brandeis to any interested parties.",
		"category":["offices"],
		"entrances":["admissions_e01","admissions_e02"],
		"nearby":["spingold","slosberg","greatlawn","bernstein-marcus","ridgewoodA","ridgewoodB","ridgewoodC","village"],
		"area":["lower campus"]
	},
{
		"id":"scc",
		"name": "Carl and Ruth Shapiro Campus Center",
		"nickname": "SCC",
		"coordinates": [
			new Point(42.365528, -71.260574),
			new Point(42.365736, -71.260538),
			new Point(42.365733, -71.260315),
			new Point(42.365894, -71.260192),
			new Point(42.366005, -71.260338),
			new Point(42.366120, -71.260064),
			new Point(42.365793, -71.259663),
			new Point(42.365548, -71.259941),
		],
		"function": "The SCC is home to many of Brandeis' media clubs, the bookstore, and the Student Union. Students can access the SCC 24/7 and many can be found studying here.",
		"description":"The Shapiro Campus Center opened in 2002 and is the hub of student life on campus. The SCC is open to students 24 hours a day, seven days a week. Many student organizations, including Student Union, Waltham Group, Student Events, WBRS (a radio station),the newspaper offices, BTV offices, and many others can be found within the campus center. It continues to be the most student-centered, “out of the classroom building on campus. Although it is also home to the offices of the Dean of Student Life, Student Activities, and Department of Student Rights and Community Standards, students primarily utilize this building for social and extra curricular activities. It also contains Einstein Bros. Cafe, the campus Brandeis Bookstore, student art exhibition space, rehearsal spaces, meeting rooms, a computer library and the 250 seat Carl J. Shapiro Theater. This theater is home to the Undergraduate Theatre Collective, our student run theatre organization. They produce, act in and build sets for over ten shows a year, ranging from straight plays to musical theater to sketch comedy!",
		"category":["student life"],
		"entrances":["scc_e01","scc_e02","scc_e03","scc_e04"],
		"area":["lower campus"]
	},
	{
		"id":"fellowsgarden",
		"name": "Fellows Garden",
		"nickname": "Fellows Garden",
		"coordinates": [
			new Point(42.366813,-71.259628),
			new Point(42.366375,-71.260151),
			new Point(42.365813,-71.259543),
			new Point(42.366023,-71.259101)],
		"function": "Fellows Garden is a nice place to hangout with friends in nice weather",
		"description":"Fellows Garden was dedicated on the occasion of Brandeis University's twenty-fifth commencement.",
		"category":["landscape"],
		"entrances":['fellowsgarden_c01','fellowsgarden_c02','fellowsgarden_c03'],
		"area":["lower campus"]
	},
	{
		"id":"greatlawn",
		"name": "The Great Lawn",
		"nickname": "Great Lawn",
		"coordinates": [
			new Point(42.365256, -71.260295),
			new Point(42.364860, -71.260703),
			new Point(42.365101, -71.261341),
			new Point(42.365428, -71.260770),],
		"function": "Great Lawn is a nice place to hangout with friends in nice weather",
		"description":"The Great Lawn is one of students’ favorite expanses of green on campus. Here you will typically see students doing their homework, playing frisbee, or just catching some afternoon sunshine between classes. It is also the setting for our activities fair, which takes place at the beginning of each semester, when over 260 clubs recruit first-years and continuing undergrads to their groups.",
		"category":["landscape"],
		"entrances":['scc_c07','scc_c08','scc_c09','scc_c10'],
		"area":["lower campus"]
	},
]

function Point(x,y) {
	this.x = x;
	this.y = y;
}