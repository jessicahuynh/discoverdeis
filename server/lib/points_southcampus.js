/*some points of south campus, data from brandeisgps*/
points_southcampus = [
//lemberg
{
    "id":"lemberg_e01", //main
    "coordinate":{"type":"Point","coordinates":[42.363525, -71.258831]},
    "type":"entrance",
    "getTo":"Head to Lemberg's main entrance."
},
//rabb school
{
    "id":"rabbSchool_e01", //main
    "coordinate":{"type":"Point","coordinates":[42.362924, -71.259146]},
    "type":"entrance",
},
{
    "id":"rabbSchool_e02", //grad
    "coordinate":{"type":"Point","coordinates":[42.362937, -71.259009]},
    "type":"entrance"
},
{
    "id":"rabbSchool_e03", //ide
    "coordinate":{"type":"Point","coordinates":[42.363010, -71.258962]},
    "type":"entrance"
},

// admissions
{
    "id": "admissions_c01", //back corner near great lawn
    "coordinate":{"type":"Point","coordinates":[42.364743, -71.260767]},
    "type": "crossing",
},
{
    "id":"admissions_e01", // the main one
    "coordinate": {"type":"Point","coordinates":[42.364413, -71.260716]},
    "type":"entrance",
    "getTo":"Head to the main entrance of Admissions."
},
{
    "id":"admissions_e02", // secondary
    "coordinate":{"type":"Point","coordinates":[42.364535, -71.260677]},
    "type":"entrance",
    "getTo":"Head to Admissions's smaller entrance, in the area with the displays."
},
//slosberg
{
    "id":"slosberg_e01", // main
    "coordinate":{"type":"Point","coordinates":[42.364098, -71.259915]},
    "type":"entrance",
    "getTo":"Head to Slosberg's main entrance."
},
{
    "id":"slosberg_e02", //side entrance closest to admissions
    "coordinate":{"type":"Point","coordinates":[42.364428, -71.259636]},
    "type":"entrance"
},
{
    "id":"slosberg_e03", //other side entrance
    "coordinate":{"type":"Point","coordinates":[42.364369, -71.259453]},
    "type":"entrance"
},
{
    "id":"slosberg_e04", //back entrance
    "coordinate":{"type":"Point","coordinates":[42.364191, -71.259483]},
    "type":"entrance"
},
// crossings in front of admissions-slosberg
{
    "id":"admissions_c02", //front,
    "coordinate":{"type":"Point","coordinates":[42.364417, -71.260673]},
    "type":"crossing"
},
{
    "id":"admissions_c03", //front near small path
    "coordinate":{"type":"Point","coordinates":[42.364571, -71.260588]},
    "type":"crossing"
},
{
    "id":"admissions_c04", //loop road meets admissions path
    "coordinate":{"type":"Point","coordinates":[42.364696, -71.260409]},
    "type":"crossing"
},
{
    "id":"admissions_c05", //loop road across from admissions
    "coordinate":{"type":"Point","coordinates":[42.364798, -71.260408]},
    "type":"crossing"
},
{
    "id":"admissions_c06", //crossroads at foot of steps
    "coordinate":{"type":"Point","coordinates":[42.364400, -71.260579]},
    "type":"crossing"
},
{
    "id":"admissions_c07", //between admissions and ridgewood A
    "coordinate":{"type":"Point","coordinates":[42.364143, -71.260737]},
    "type":"crossing"
},
{
    "id":"admissions_c08", //between admissions and ridgewood B
    "coordinate":{"type":"Point","coordinates":[42.364069, -71.261048]},
    "type":"crossing"
},
{
    "id":"slosberg_c01", // middle of the intersections
    "coordinate":{"type":"Point","coordinates":[42.364379, -71.260385]},
    "type":"crossing"
},
{
    "id":"slosberg_c02", // middle intersection in front of parking lot
    "coordinate":{"type":"Point","coordinates":[42.364352, -71.260179]},
    "type":'crossing'
},
{
    "id":"slosberg_c03", //between Ridgewood A and slosberg
    "coordinate":{"type":"Point","coordinates":[42.364177, -71.260290]},
    "type":"crossing"
},

// single points
{
    "id":"stop_admissions_e01",
    "singlepoint":true
}

]