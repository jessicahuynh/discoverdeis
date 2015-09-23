// bernstein and gryzmish by qxx

points_bernstein = [
	{
		"id":"irving_e01",
		"coordinate":new Point(42.365245, -71.259522),
		"type":"entrance"
	},
	{
		"id":"gryzmish_e01",
		"coordinate":new Point(42.365498, -71.259496),
		"type":"entrance"
	},
	{
		"id":"bernstein_c01",
		"coordinate":new Point(42.365466, -71.259706),
		"type":"crossing"
	},
	{
		"id":"bernstein_c02",
		"coordinate":new Point(42.364993, -71.259953),
		"type":"crossing"
	},
	{
		"id":"bernstein_c03",
		"coordinate":new Point(42.365181, -71.259063),
		"type":"crossing"
	},
	{
		"id":"gryzmish_c01",
		"coordinate":new Point(42.365755, -71.258997),
		"type":"crossing"
	},
	{
		"id":"gryzmish_c02",
		"coordinate":new Point(42.365613, -71.258398),
		"type":"crossing"
	},
	{
		"id":"bernstein_e01",
		"coordinate":new Point(42.365151, -71.259527),
		"type":"entrance"
	},
	{
		"id":"bernstein_c04",
		"coordinate":new Point(42.365429, -71.259935),
		"type":"crossing"
	},
	{
		"id":"gryzmish_c03",
		"coordinate":new Point(42.365601, -71.259648),
		"type":"crossing"
	},
	{
		"id":"gryzmish_c04",
		"coordinate":new Point(42.365668, -71.257984),
		"type":"crossing"
	},
	{
		"id":"gryzmish_c05",
		"coordinate":new Point(42.365790, -71.259432),
		"type":"crossing"
	},
	{
		"id":"bernstein_c05",
		"coordinate":new Point(42.365351, -71.259656),
		"type":"crossing"
	}

]


function Point(x,y) {
	this.x = x;
	this.y = y;
}