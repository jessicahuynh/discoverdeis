Template.about.rendered = function() {
	Session.set("pageTitle","About");
	Meteor.call("transLocAPI");
}