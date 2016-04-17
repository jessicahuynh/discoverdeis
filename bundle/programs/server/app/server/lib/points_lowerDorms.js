(function(){//ridgewood, ziv, villiage
points_lowerDorms = [
//ridgewood crossings
{
    "id":"ridgewoodA_c01",
    "coordinate":{"type":"Point","coordinates":[42.364193, -71.260578]},
    "type":"crossing"
},
{
    "id":"ridgewoodA_c02", //front of main entrance
    "coordinate":{"type":"Point","coordinates":[42.364145, -71.260441]},
    "type":"crossing"
},
{
    "id":"ridgewoodB_c01", //4-way between B and A
    "coordinate":{"type":"Point","coordinates":[42.364020, -71.260814]},
    "type":"crossing"
},
{
    "id":"ridgewoodB_c02", //near to main entrance of B
    "coordinate":{"type":"Point","coordinates":[42.363756, -71.261008]},
    "type":"crossing"
},
{
    "id":"ridgewoodB_c03", // behind Ridgewood B next to Ziv A
    "coordinate":{"type":"Point","coordinates":[42.363671, -71.261409]},
    "type":"crossing"
},
{
    "id":"ridgewoodC_c01", //big intersection between Ridgewoods
    "coordinate":{"type":"Point","coordinates":[42.363753, -71.260399]},
    "type":"crossing"
},
{
    "id":"ridgewoodC_c02", // behind Ridgewood C
    "coordinate":{"type":"Point","coordinates":[42.363542, -71.261121]},
    "type":"crossing"
},
// ziv crossings
{
    "id":"ziv127_c01", // in front near ridgewood
    "coordinate": {"type":"Point","coordinates":[42.363431, -71.261531]},
    "type":"crossing"
},
{
    "id":"ziv127_c02", // to the side
    "coordinate":{"type":"Point","coordinates":[42.363394, -71.261422]},
    "type":"crossing"
},
{
    "id":"ziv128_c01", // between 127 and 128
    "coordinate":{"type":"Point","coordinates":[42.363201, -71.261277]},
    "type":"crossing"
},
{
    "id":"ziv128_c02", //between ziv and epstein
    "coordinate":{"type":"Point","coordinates":[42.363039, -71.261277]},
    "type":"crossing"
},
{
    "id":"ziv129_c01", //between 129 and 130
    "coordinate":{"type":"Point","coordinates":[42.363171, -71.261106]},
    "type":"crossing"
},
{
    "id":"ziv130_c01", //middle of the intersections
    "coordinate":{"type":"Point","coordinates":[42.363351, -71.261227]},
    "type":"crossing"
},
{
    "id":"ziv130_c02", // right in front
    "coordinate":{"type":"Point","coordinates":[42.363331, -71.261072]},
    "type":"crossing"
},
// village crossings
{
    "id":"village_c01", //outside A
    "coordinate":{"type":"Point","coordinates":[42.363798, -71.260246]},
    "type":"crossing"
},
{
    "id":"village_c02", //outside B
    "coordinate":{"type":"Point","coordinates":[42.363583, -71.260288]},
    "type":'crossing'
},
{
    "id":"village_c03", //bottom of stairs next to ziv
    "coordinate":{"type":"Point","coordinates":[42.363284, -71.260549]},
    "type":"crossing"
},
{
    "id":"village_c04", //south entrance
    "coordinate":{"type":"Point","coordinates":[42.363010, -71.259947]},
    "type":"crossing",
    "getTo":"Head to the driveway next to the Village's overhead walkway and the Dunkin' Donuts."
},
{
    "id":"village_c05", //next to inspiration statue
    "coordinate":{"type":"Point","coordinates":[42.362443, -71.260404]},
    "type":"crossing"
},
// ridgewood
{
    "id":"ridgewoodA_e01", //main
    "coordinate":{"type":"Point","coordinates":[42.364108, -71.260479]},
    "type":"entrance",
    "getTo":"Head to Ridgewood A's main entrance in Ridgewood Commons."
},
{
    "id":"ridgewoodA_e02",
    "coordinate":{"type":"Point","coordinates":[42.364148, -71.260593]},
    "type":"entrance"
},
{
    "id":"ridgewoodA_e03",
    "coordinate":{"type":"Point","coordinates":[42.364005, -71.260684]},
    "type":"entrance"
},
{
    "id":"ridgewoodA_e04",
    "coordinate":{"type":"Point","coordinates":[42.363994, -71.260643]},
    "type":"entrance"
},
{
    "id":"ridgewoodA_e05",
    "coordinate":{"type":"Point","coordinates":[42.363962, -71.260562]},
    "type":"entrance"
},
{
    "id":"ridgewoodB_e01", //main
    "coordinate":{"type":"Point","coordinates":[42.363851, -71.260931]},
    "type":"entrance",
    "getTo":"Head to Ridgewood B's main entrance."
},
{
    "id":"ridgewoodB_e02", //back
    "coordinate":{"type":"Point","coordinates":[42.363798, -71.261373]},
    "type":"entrance"
},
{
    "id":"ridgewoodC_e01", //main
    "coordinate":{"type":"Point","coordinates":[42.363693, -71.260909]},
    'type':"entrance",
    "getTo":"Head to Ridgewood C's main entrance."
},
{
    "id":"ridgewoodC_e02", //back
    "coordinate":{"type":"Point","coordinates":[42.363521, -71.260831]},
    "type":"entrance"
},
// ziv
{
    "id":"ziv127_e01", // main
    "coordinate":{"type":"Point","coordinates":[42.363408, -71.261613]},
    "type":"entrance",
    "getTo":"Head to the main entrance of Ziv 127."
},
{
    "id":"ziv127_e02",
    "coordinate":{"type":"Point","coordinates":[42.363345, -71.261676]},
    "type":"entrance"
},
{
    "id":"ziv127_e03",
    "coordinate":{"type":"Point","coordinates":[42.363417, -71.261746]},
    "type":"entrance"
},
{
    "id":"ziv128_e01", //main
    "coordinate":{"type":"Point","coordinates":[42.363044, -71.261471]},
    "type":"entrance",
    "getTo":"Head to the main entrance of Ziv 128."
},
{
    "id":"ziv128_e02",
    "coordinate":{"type":"Point","coordinates":[42.363062, -71.261581]},
    "type":"entrance"
},
{
    "id":"ziv128_e03", //back
    "coordinate":{"type":"Point","coordinates":[42.362966, -71.261588]},
    "type":"entrance",
    "getTo":"Head to the entrance of Ziv 128 facing Epstein."
},
{
    "id":"ziv129_e01", //main
    "coordinate":{"type":"Point","coordinates":[42.362953, -71.261076]},
    "type":"entrance",
    "getTo":"Head to the main entrance of Ziv 129."
},
{
    "id":"ziv129_e02",
    "coordinate":{"type":"Point","coordinates":[42.362908, -71.260991]},
    "type":"entrance"
},
{
    "id":"ziv129_e03",
    "coordinate": {"type":"Point","coordinates":[42.362843, -71.261080]},
    "type":"entrance",
    "getTo":"Head to the entrance of Ziv 129 facing Epstein."   
},
{
    "id":"ziv130_e01", //main
    "coordinate":{"type":"Point","coordinates":[42.363293, -71.260951]},
    "type":"entrance",
    "getTo":"Head to the main entrance of Ziv 130."
},
{
    "id":"ziv130_e02",
    "coordinate":{"type":"Point","coordinates":[42.363287, -71.260837]},
    "type":"entrance"
},
{
    "id":"ziv130_e03", //back, facing Ridgewood
    "coordinate":{"type":"Point","coordinates":[42.363368, -71.260850]},
    "type":"entrance",
    "getTo":"Head to the entrance of Ziv 128 facing Ridgewood C."
},
// village
{
    "id":"villageA_e01", // to the commons
    "coordinate":{"type":"Point","coordinates":[42.363497, -71.260154]},
    "type":"entrance",
    'getTo':"Head to the entrance in the lobby between Village And and B with the double doors."
},
{
    "id":"villageA_e02", //courtyard
    "coordinate":{"type":"Point","coordinates":[42.363664, -71.260019]},
    "type":"entrance",
    "getTo":"Head to the Village A entrance leading out to the courtyard."
},
{
    "id":"villageA_e03", //courtyard side
    "coordinate": {"type":"Point","coordinates":[42.363692, -71.260061]},
    "type":"entrance"
},
{
    "id":"villageA_e04", //very top of stairs to fourth floor
    "coordinate":{"type":"Point","coordinates":[42.363681, -71.260001]},
    "type":"entrance",
},
{
    "id":"villageA_e05", //middle of stairs, third floor
    "coordinate": {"type":"Point","coordinates":[42.363703, -71.260074]},
    "type":"entrance"
},
{
    "id":"villageA_ie01", //between A and B
    "coordinate": {"type":"Point","coordinates":[42.363426, -71.260095]},
    "type":"ientrance"
},
{
    "id":"villageB_e01",//main in courtyard
    "coordinate":{"type":"Point","coordinates":[42.363312, -71.260235]},
    "type":"entrance",
    "getTo":"Head to the main courtyard entrance of Village B."   
},
{
    "id":"villageB_e02",
    "coordinate":{"type":"Point","coordinates":[42.363377, -71.260239]},
    "type":"entrance",
    "getTo":"Head to the side courtyard entrance for Village B."
},
{
    "id":"villageB_ie01", //between B and C
    "coordinate":{"type":"Point","coordinates":[42.363153, -71.260385]},
    "type":"ientrance",
},
{
    "id":"villageC_e01", //next to dunkins
    "coordinate":{"type":"Point","coordinates":[42.363150, -71.260377]},
    "type":"entrance",
    "getTo":"Head to the entrance of Village C next to Dunkin Donuts."
},
]
}).call(this);

//# sourceMappingURL=points_lowerDorms.js.map
