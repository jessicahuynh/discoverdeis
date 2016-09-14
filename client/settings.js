Session.setDefault("unit","m");
Session.setDefault("deviceOrientation", true);
Session.setDefault("rate", 0.8);
Session.setDefault("readingmode",false);


Template.settings.rendered = function() {
	Session.set("pageTitle","Settings");
	Session.set("listenTo","Change settings for Discover Deis here.");

	$(".switch").bootstrapSwitch();
	$(".deviceSwitch").bootstrapSwitch();

	if (window.SpeechSynthesisUtterance === undefined) {
		$("#voiceSettingsDiv").hide();
	}

	$("#unit").on('switchChange.bootstrapSwitch', function(event, data) {
		if ($("#unit").is(":checked")) {
			Session.setPersistent("unit","m");
		}
		else {
			Session.setPersistent("unit","ft");
		}
	});


	$("#orientation").on('switchChange.bootstrapSwitch', function(event, data) {
		if ($("#orientation").is(":checked")) {
			Session.setPersistent("deviceOrientation",true);
		}
		else {
			Session.setPersistent("deviceOrientation",false);

		}
	});


	$('.slider').slider();
	$('#rate').slider()
		.on('slideStop', function(data){
			console.log(data);
			var rate = data.value;
			console.log(rate);
			Session.setPersistent("rate",rate);
		});
	$('#rate').slider('setValue', Session.get("rate", rate));


	$("#readingmode").on('switchChange.bootstrapSwitch',function(event,data) {
		Session.setPersistent("readingmode",$("#readingmode").is(":checked"));
	});

}

Template.settings.helpers({
	unitCheck:function() {
		if (Session.get("unit") == "m") {
			return true;
		}
		else {
			return false;
		}
	},
	readingmodeCheck:function() {
		return Session.get("readingmode");
	},

	deviceOrientation: function(){
		if (Session.get("deviceOrientation")) {
			return true;
		} else {
			return false;
		}
	},

});
