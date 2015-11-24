Template.class.helpers({
	course:function(){
		return Classes.find({"times.building": this.building}, {sort: { "code": 1}}).fetch(); //_id: "bzicPp9cuf5noRvQa"
	},

	instructor:function() {
		var instructor = this.instructor
		console.log("Prof. " + instructor.first + " " + instructor.last)
		return "Prof. " + instructor.first + " " + instructor.last
	},

	classTime:function(){

		var times = this.times;
		var getDays = sortDays(times.days);
		var getTimes = sortTime(times);
		console.log(getTimes);
		return getDays  + getTimes;
	},
})


function sortTime(times) {
	isPM = false
	start = times.start
	end = times.end
	return start+"-"+end
}


function sortDays(arr) {
	a = new Array(5)
	for(i = 0; i<arr.length; i++) {
		switch(arr[i]) {

			case "m":
				a[0] = 1;
				break;
			case "tu":
				a[1] = 1;
				break;
			case "w":
				a[2] = 1;
				break;
			case "th":
				a[3] = 1;
				break;
			case "f":
				a[4] = 1;
				break;
		}
	}
	return makeDateString(a)
}

function makeDateString(arr) {
	var str = ""
	if(arr[0] == 1)
		str = str + " m "
	if(arr[1] == 1) 
		str = str + " tu "
	if (arr[2] == 1)
		str = str + " w "
	if (arr[3] == 1)
		str = str + " th "
	if (arr[4] == 1)
		str = str + " f "
	return str
}