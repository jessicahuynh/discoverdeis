locations_transport = [
	{
		"id":"stop_charlesriver",
		"name":"Lower Charles River Road Bus Stop",
		"nickname":"Grad bus stop",
		"coordinates":{"type":"Point","coordinates":[42.359553, -71.256634]},
		"function":"The Grad stop services both the campus and Waltham BranVan.",
		"category":["transportation"],
		"area":["lower campus","charles river"],
		"nearby":["charlesrivercommons"],
		"entrances":["stop_charlesriver_e01"]
	},
	{
		"id":"stop_c-lot",
		"name":"Charles River Lot shuttle stop",
		"nickname":"C-Lot stop",
		"coordinates":{"type":"Point","coordinates":[42.359316, -71.258342]},
		"function":"The C-Lot stop services the campus BranVan.",
		"category":["transportation"],
		"area":["lower campus","charles river"],
		"entrances":["stop_c-lot_e01"],
		"nearby":["charlesriverlot"]
	},
	{
		"id":"stop_567",
		"name":"567 shuttle stop",
		"nickname":"567 shuttle stop",
		"coordinates":{"type":"Point","coordinates":[42.361128, -71.261215]},
		"function":"The 567 shuttle stop serves the campus BranVan.",
		"category":["transportation"],
		"area":["lower campus"],
		"entrances":["stop_567_e01"],
		"nearby":["ss567"]
	},
	{
		"id":"stop_trainstation",
		"name":"Train station shuttle stop",
		"nickname":"Train station stop",
		"coordinates":{"type":"Point","coordinates":[42.361712, -71.260823]},
		"function":"The shuttle stop across from the train station serves the campus BranVan.",
		"category":["transportation"],
		"area":["lower campus"],
		"entrances":["stop_trainstation_e01"],
		"nearby":["commuterrail","epstein"]
	},
	{
		"id":"commuterrail",
		"name":"Brandeis/Roberts Commuter Rail Station",
		"nickname":"Brandeis/Roberts",
		"coordinates": {"type":"Polygon","coordinates":[
			[[42.361970, -71.260281],
			[42.361833, -71.260277],
			[42.361942, -71.258913],
			[42.362388, -71.257145],
			[42.362498, -71.257250],
			[42.362066, -71.259011]]
		]},
		"function":"Brandeis/Roberts station is on the Fitchburg line and is in MBTA fare zone 2.",
		"description":"The inbound platform towards Boston is on the side furthest from campus. Outbound is on the side closest to campus.",
		"category":["transportation"],
		"entrances":["commuterrail_e01","commuterrail_e02"],
		"nearby":["stop_trainstation","epstein","ss567","grad111","grad112","grad113","grad114"],
		"area":["lower campus"]
	},
	{
		"id":"stop_admissions",
		"name":"Admissions Bus Shelter",
		"nickname":"Admissions shuttle stop",
		"coordinates":{"type":"Point","coordinates":[42.364636, -71.260225]},
		"function":"The Admissions bus shelter serves the campus and Waltham BranVans, along with the Boston and Riverside shuttles.",
		"description":"The bus shelter itself was a gift of the Student Union 2013-2014.",
		"category":["transportation"],
		"nearby":["admissions","slosberg","bernstein-marcus","greatlawn","scc","ridgewoodA"],
		"area":["lower campus"],
		"entrances":["stop_admissions_e01"]
	},
	{
		"id":"stop_lemberg",
		"name":"Lemberg Shuttle Stop",
		"nickname":"Lemberg stop",
		"coordinates":{"type":"Point","coordinates":[42.363194, -71.258541]},
		"function":"The Lemberg stop serves the campus BranVan.",
		"category":["transportation"],
		"nearby":["lemberg","rabbSchool","gordonfield"],
		"area":["lower campus"],
		"entrances":["stop_lemberg_e01"]
	},
	{
		"id":"stop_rabb",
		"name":"Rabb Bus Shelter",
		"nickname":"Rabb shuttle stop",
		"coordinates":{"type":"Point","coordinates":[42.368683, -71.257204]},
		"function":"The Rabb bus stop serves the campus and Waltham BranVans, along with the Cambridge/Boston shuttles.",
		"category":["transportation"],
		"nearby":["rabb","usdan","goldfarb"],
		"area":["upper campus"],
		"entrances":["stop_rabb_e01"]
	}
]