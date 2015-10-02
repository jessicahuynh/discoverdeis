locations_scienceComplex = [
	{
		"id":"volen",
		"name": "Benjamin and Mae Volen National Center for Complex Systems",
		"nickname": "Volen",
		"coordinates": [
			new Point(42.367036,-71.259186), 
			new Point(42.367184,-71.259039),
			new Point(42.366944,-71.258458),
			new Point(42.366783,-71.258614)],
		"function": "Volen is home to Brandeis' computer science and linguistics departments.",
		"description": "The Volen Center, or National Center for Complex Systems, in which faculty \
						and students study the brain and intelligence. This center’s staff specialize \
						in artificial intelligence, cognitive science, and various neuroscience topics \
						(examples include experimental psychology, computational neuroscience, and cellular \
						and molecular neurobiology).",
		"category":["academics","offices"],
		"entrances":["volen_e01","volen_ie02","volen_ie03","feldberg_ie01"],
		"icrossings":["volen_ic02"],
		"nearby":["feldberg","gzang","goldsmith","chapelsfield"],
		"area":["upper campus","science complex"]
	},

	bassine = {
		"id":"bassine",
		"name": "Bassine Science Building",
		"nickname": "Bassine",
		"coordinates": [
			new Point(42.367122,-71.258208),
			new Point(42.366997,-71.258307),
			new Point(42.366656,-71.257562),
			new Point(42.366782,-71.257457), ],
		"function": "Bassine Science Building is home to biology at Brandeis.",
		"description":"There are many labs here.",
		"category":["academics","offices"],
		"entrances":["bassine_e01","bassine_e02","bassine_e03"],
		"area":["upper campus","science complex"]

	},

	feldberg = {
		"id":"feldberg",
		"name":"Feldberg Communications Center",
		"nickname":"Feldberg",
		"coordinates": [
			new Point(42.366985,-71.259075),
			new Point(42.366800,-71.258632),
			new Point(42.366546,-71.258833),
			new Point(42.366751,-71.259269)],
		"function":"Feldberg contains offices and is home to Library and Technology Services (LTS).",
		"category":["academics","offices"],
		"entrances":["feldberg_e01","feldberg_ie01"],
		"area":["upper campus","science complex"]
	},
	{
		"id":"rosensweig",
		"name":"Kosow-Wolfson-Rosensweig",
		"nickname":"Kosow",
		"function":"Kosow is home to biochemistry.",
		"coordinates":[
			new Point(42.366323, -71.256866), 
			new Point(42.366046, -71.257092), 
			new Point(42.366027, -71.257055),
			new Point(42.365949, -71.257121),
			new Point(42.365901, -71.257018),
			new Point(42.365947, -71.256925),
			new Point(42.366248, -71.256689),],
		"category":["academics"],
		"entrances":["rosensweig_e01","rosensweig_e02","rosensweig_e03"],
		"area":["upper campus","science complex"]
	},
	gerstenzang = {
		"id":"gerstenzang",
		"name":"Leo Gerstenzang Science Library",
		"nickname":"Gzang",
		"function":"Gzang is home to many large lecture halls, LTS, and genetic counseling, in addition to a library.",
		"coordinates":[
			new Point(42.366974, -71.258330), 
			new Point(42.366653, -71.257549), 
			new Point(42.366304, -71.257812), 
			new Point(42.366647, -71.258526)],
		"category":["library","academics"],
		"entrances":["gzang_e01","gzang_e02","gzang_ie01","gzang_ie02","gzang_ie03","volen_ie03"],
		"area":["upper campus","science complex"]
	},
	pearlman = {
		"id":"pearlman",
		"name":"Pearlman Hall",
		"nickname":"Pearlman",
		"function":"Pearlman is home to sociology.",
		"coordinates":[
			new Point(42.367619, -71.258118), 
			new Point(42.367577, -71.257855), 
			new Point(42.367302, -71.257938), 
			new Point(42.367367, -71.258206)],
		"category":["academics"],
		"entrances":["pearlman_e01","pearlman_e02"],
		"area":["upper campus"]
	},
	goldsmith = {
		"id":"goldsmith",
		"name":"Horace W. Goldsmith Mathematics Building",
		"nickname":"Goldsmith",
		"coordinates":[
			new Point(42.366987, -71.258249), 
			new Point(42.367149, -71.258613), 
			new Point(42.367281, -71.258526), 
			new Point(42.367103, -71.258148)],
		"function":"Goldsmith is home to the mathematics department.",
		"category":["academics"],
		"entrances":["goldsmith_e01","goldsmith_ie02"],
		"area":["upper campus","science complex"]
		},
	{
		"id":"edison",  //Rose and Herman Lecks Chemical building
		"name":"Edison-Lecks Science Building",
		"nickname":"Edison",
		"coordinates":[
			new Point(42.366392, -71.258480),
			new Point(42.366531, -71.258364),
			new Point(42.366321, -71.257893),
			new Point(42.366182, -71.258006)
		],
		"function":"Edison-Lecks is home to chemistry.",
		"category":["academics"],
		"entrances":["edison_e01","gzang_ie02"],
		"area":["upper campus","science complex"]
	},
	abelson = {
		"id":"abelson",
		"name":"Abelson-Bass-Yalem",
		"nickname":"Abelson",
		"coordinates":[
			new Point(42.366623, -71.258532), 
			new Point(42.366547, -71.258397), 
			new Point(42.366157, -71.258709), 
			new Point(42.366220, -71.258861)],
		"category":["academics"],
		"entrances":["abelson_e01","abelson_e02","abelson_c01","gzang_ie03"],
		"function":"Ableson is home to physics.",
		"area":["upper campus","science complex"]
		},
	scienceCenter = {
		"id":"ssc",
		"name":"Carl J. Shapiro Science Center",
		"nickname":"Science Center",
		"coordinates":[
			new Point(42.365962, -71.258665), 
			new Point(42.366050, -71.258434), 
			new Point(42.366101, -71.257962), 
			new Point(42.366146, -71.257913), 
			new Point(42.366045, -71.257711), 
			new Point(42.365870, -71.257891), 
			new Point(42.365841, -71.258311), 
			new Point(42.365741, -71.258570), 
		],
		"description":"The Carl J. Shapiro Science Center is home to many of our undergraduate science programs. The center is comprised of three main centers, the Gerstenzang Science Library (commonly referred to as G-Zang by students), and other research facilities. The first center is the Brandeis University National Center for Behavioral Genomics which focuses on brain function and behavior in addition to finding therapeutic strategies for brain disease and dysfunction. The second is The Volen Center, or National Center for Complex Systems, in which faculty and students study the brain and intelligence. This center’s staff specialize in artificial intelligence, cognitive science, and various neuroscience topics (examples include experimental psychology, computational neuroscience, and cellular and molecular neurobiology). The final center is The Brandeis Materials Research Science and Engineering Center which focuses on developing the relationship between biology and materials science via a top-down and bottom-up method. Each center was founded with interdisciplinary study in mind. In fact, a few classes are taught by faculty of varying disciplines – one class is even taught by three professors – a biologist, a chemist, and a physicist. This interdisciplinary approach is different from the instruction methods at most universities. Beyond the centers, faculty and students from many departments collaborate in research, in the classrooms and in the labs. The Leo Gerstenzang Complex has traditional lab areas as well as special classrooms for teaching math and science. Brandeis Students have many opportunities to engage in research during their undergraduate years. In fact, since 2003, undergraduate students have co-authored over one hundred and thirty published articles. ",
		"category":["academics","student life"],
		"entrances":["ssc_e01","ssc_e02","ssc_e03","ssc_ie01"],
		"area":["upper campus","science complex"]
		},
	{
		"id":"foster",
		"name":"Henry and Lois Foster Bio-Medical Research Center",
		"nickname":"Foster Bio-Medical Research Center",
		"coordinates":[
			new Point(42.366149, -71.256427), 
			new Point(42.365998, -71.256557), 
			new Point(42.366021, -71.256622),
			new Point(42.365893, -71.256732),
			new Point(42.365884, -71.256773),
			new Point(42.365947, -71.256925),
			new Point(42.366274, -71.256662),],
		"category":["academics"],
		"entrances":["foster_e01"],
		"area":["upper campus","science complex"]
	},
	roseMedical = {
		"id":"roseMedical",
		"name":"Rosenstiel Basic Medical Sciences Research Center",
		"nickname":"Rosenstiel",
		"coordinates":[
			new Point(42.366103,-71.257429), 
			new Point(42.365901,-71.257013), 
			new Point(42.365724,-71.257239), 
			new Point(42.365884,-71.257585)],
		"category":["academics"],
		"entrances":["rosenstiel_e01","rosenstiel_e02"],
		"area":["upper campus","science complex"]
		},
]

function Point(x,y) {
	this.x = x;
	this.y = y;
}