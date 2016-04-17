(function(){locations_scienceComplex = [
	{
		"id":"volen",
		"name": "Benjamin and Mae Volen National Center for Complex Systems",
		"nickname": "Volen",
		"coordinates": {"type":"Polygon","coordinates":[ 
			[[42.367036,-71.259186], 
			[42.367184,-71.259039],
			[42.366944,-71.258458],
			[42.366783,-71.258614]]
		]},
		"function": "Primarily a research facility, the Volen National Center for Complex Systems is home to an interdisciplinary group of neuroscientists and the Computer Science and Linguistics departments. The center includes offices, classrooms and lab space.",
		"description": "This center’s staff specialize \
						in artificial intelligence, cognitive science, and various neuroscience topics \
						(examples include experimental psychology, computational neuroscience, and cellular \
						and molecular neurobiology).",
		"category":["academics","offices"],
		"entrances":["volen_e01","volen_ie02","volen_ie03","feldberg_ie01", "volen_e02"],
		"icrossings":["volen_ic01","volen_ic02", "volen_ic03"],
		"nearby":["feldberg","gzang","goldsmith","chapelsfield"],
		"area":["upper campus","science complex"]
	},

	bassine = {
		"id":"bassine",
		"name": "Bassine Science Building",
		"nickname": "Bassine",
		"coordinates": {"type":"Polygon","coordinates":[ 
			[[42.367122,-71.258208],
			[42.366997,-71.258307],
			[42.366656,-71.257562],
			[42.366782,-71.257457]]
		]},
		"function": "The Bassine Science Building houses teaching and research laboratories and the Biology Department Office.",
		"description":"It is home to biology at Brandeis.",
		"category":["academics","offices"],
		"entrances":["bassine_e01","bassine_e02","bassine_e03", "bassine_ie01"],
		"area":["upper campus","science complex"],
		"nearby":["goldsmith","sciencespeciallot","gzang"]
	},

	feldberg = {
		"id":"feldberg",
		"name":"Feldberg Communications Center",
		"nickname":"Feldberg",
		"coordinates": {"type":"Polygon","coordinates":[ 
			[[42.366985,-71.259075],
			[42.366800,-71.258632],
			[42.366546,-71.258833],
			[42.366751,-71.259269]]
		]},
		"function":"The Feldberg Communications Center houses the main university's server room and offices for some members of Library and Technology Services (LTS).",
		"category":["academics","offices"],
		"entrances":["feldberg_e01","feldberg_ie01"],
		"area":["upper campus","science complex"],
		"nearby":["volen","gzang","fellowsgarden","scc"]
	},
	{
		"id":"rosensweig",
		"name":"Kosow-Wolfson-Rosensweig",
		"nickname":"Kosow",
		"function":"The Kosow-Wolfson-Rosensweig Building houses the Foster Bio-Medical Research Labs and other research groups. In particular, it is known for biochemistry.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366323, -71.256866], 
			[42.366046, -71.257092], 
			[42.366027, -71.257055],
			[42.365949, -71.257121],
			[42.365901, -71.257018],
			[42.365947, -71.256925],
			[42.366248, -71.256689]]
		]},
		"category":["academics"],
		"entrances":["rosensweig_e01","rosensweig_e02","rosensweig_e03"],
		"area":["upper campus","science complex"],
		'nearby':["foster","sciencespeciallot","bassine","ssc","edison"]
	},
	gerstenzang = {
		"id":"gzang",
		"name":"Leo Gerstenzang Science Library",
		"nickname":"Gzang",
		"function":"The Leo Gerstenzang Science Library, nicknamed Gzang, located in the Science Complex, houses print resources in the sciences, the Genetic Counseling program, and large science classrooms.",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366974, -71.258330], 
			[42.366653, -71.257549], 
			[42.366304, -71.257812], 
			[42.366647, -71.258526]]
		]},
		"category":["library","academics"],
		"entrances":["gzang_e01","gzang_e02","volen_ie03"],
		"area":["upper campus","science complex"],
		"nearby":["volen","bassine","goldsmith","abelson","edison","sciencespeciallot","sciencevisitorlot"]
	},
	pearlman = {
		"id":"pearlman",
		"name":"Pearlman Hall",
		"nickname":"Pearlman",
		"function":"Home to the university’s sociology department, Pearlman Hall contains classrooms and office space",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.367619, -71.258118], 
			[42.367577, -71.257855], 
			[42.367302, -71.257938], 
			[42.367367, -71.258206]]
		]},
		"category":["academics"],
		"entrances":["pearlman_e01","pearlman_e02","pearlman_e03"],
		"area":["upper campus"],
		"nearby":["farber","goldfarb","goldsmith","mandelpeacegarden"]
	},
	goldsmith = {
		"id":"goldsmith",
		"name":"Horace W. Goldsmith Mathematics Building",
		"nickname":"Goldsmith",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366987, -71.258249], 
			[42.367149, -71.258613], 
			[42.367281, -71.258526], 
			[42.367103, -71.258148]]
		]},
		"function":"The Goldsmith Building houses classrooms and office space for both the undergraduate and graduate math departments.",
		"category":["academics"],
		"entrances":["goldsmith_e01","goldsmith_ie02"],
		"area":["upper campus","science complex"],
		"nearby":["bassine","volen","gzang","pearlman","farber"]
		},
	{
		"id":"edison",  //Rose and Herman Lecks Chemical building
		"name":"Edison-Lecks Science Building",
		"nickname":"Edison",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366392, -71.258480],
			[42.366531, -71.258364],
			[42.366321, -71.257893],
			[42.366182, -71.258006]]
		]},
		"function":"Edison-Lecks is home to chemistry.",
		"category":["academics"],
		"entrances":["edison_e01", "edison_e02", "edison_ie01", "edison_ie02"],
		"area":["upper campus","science complex"],
		"nearby":["gzang","abelson","volen","bassine"]
	},
	abelson = {
		"id":"abelson",
		"name":"Abelson-Bass-Yalem Physics",
		"nickname":"Abelson",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366623, -71.258532], 
			[42.366547, -71.258397], 
			[42.366157, -71.258709], 
			[42.366220, -71.258861]]
		]},
		"category":["academics"],
		"entrances":["abelson_e01","abelson_e02","abelson_c01","abelson_e03"],
		"area":["upper campus","science complex"],
		"function":"The Abelson-Bass-Yalem Building houses the Martin Fisher School of Physics for both undergraduate and graduate students. The building includes office space, classrooms and research laboratories.",
		"description":"",
		"nearby":["edison","gzang","volen","rosensweig","roseMedical","ssc"]
		},
	scienceCenter = {
		"id":"ssc",
		"name":"Carl J. Shapiro Science Center",
		"nickname":"Science Center",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.365962, -71.258665], 
			[42.366050, -71.258434], 
			[42.366101, -71.257962], 
			[42.366146, -71.257913], 
			[42.366045, -71.257711], 
			[42.365870, -71.257891], 
			[42.365841, -71.258311], 
			[42.365741, -71.258570]]
		]},
		"function":"The Carl J. Shapiro Science Center features 175,000 square feet of biology and chemistry teaching and research lab space overlooking the Brandeis campus. The center houses the university’s National Center for Behavioral Genomics. Seminar and conference areas and an atrium with study space round out the Shapiro Science Center’s interior.",
		"description":"The Carl J. Shapiro Science Center is home to many of our undergraduate science programs. The center is comprised of three main centers, the Gerstenzang Science Library (commonly referred to as G-Zang by students], and other research facilities. The first center is the Brandeis University National Center for Behavioral Genomics which focuses on brain function and behavior in addition to finding therapeutic strategies for brain disease and dysfunction. The second is The Volen Center, or National Center for Complex Systems, in which faculty and students study the brain and intelligence. This center’s staff specialize in artificial intelligence, cognitive science, and various neuroscience topics (examples include experimental psychology, computational neuroscience, and cellular and molecular neurobiology). The final center is The Brandeis Materials Research Science and Engineering Center which focuses on developing the relationship between biology and materials science via a top-down and bottom-up method. Each center was founded with interdisciplinary study in mind. In fact, a few classes are taught by faculty of varying disciplines – one class is even taught by three professors – a biologist, a chemist, and a physicist. This interdisciplinary approach is different from the instruction methods at most universities. Beyond the centers, faculty and students from many departments collaborate in research, in the classrooms and in the labs. The Leo Gerstenzang Complex has traditional lab areas as well as special classrooms for teaching math and science. Brandeis Students have many opportunities to engage in research during their undergraduate years. In fact, since 2003, undergraduate students have co-authored over one hundred and thirty published articles. ",
		"category":["academics","student life"],
		"entrances":["ssc_e01","ssc_e02","ssc_e03","ssc_e04","ssc_ie01"],
		"area":["upper campus","science complex"],
		"nearby":["rosensweig","edison","gzang","sciencespeciallot","sciencevisitorlot","fellowsgarden","scc"]
		},
	{
		"id":"foster",
		"name":"Henry and Lois Foster Bio-Medical Research Center",
		"nickname":"Foster Bio-Medical Research Center",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366149, -71.256427], 
			[42.365998, -71.256557], 
			[42.366021, -71.256622],
			[42.365893, -71.256732],
			[42.365884, -71.256773],
			[42.365947, -71.256925],
			[42.366274, -71.256662]]
		]},
		"category":["academics"],
		"entrances":["foster_e01"],
		"area":["upper campus","science complex"],
		"function":"The Foster Bio-Medical Research Center is located in the Kosow-Wolfson-Rosensweig Building.",
		"nearby":["rosensweig"]
	},
	roseMedical = {
		"id":"roseMedical",
		"name":"Rosenstiel Basic Medical Sciences Research Center",
		"nickname":"Rosenstiel",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.366103,-71.257429], 
			[42.365901,-71.257013], 
			[42.365724,-71.257239], 
			[42.365884,-71.257585]]
		]},
		"category":["academics"],
		"entrances":["rosenstiel_e01","rosenstiel_e02"],
		"area":["upper campus","science complex"],
		"function":"The Rosenstiel Basic Medical Sciences Research Center conducts interdisciplinary research on the molecular mechanisms of human disease.",
		"nearby":["rosensweig","foster","ssc","sciencevisitorlot","sciencespeciallot"]
	}
]

}).call(this);

//# sourceMappingURL=locations_scienceComplex.js.map
