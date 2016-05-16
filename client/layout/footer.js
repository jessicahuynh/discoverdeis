// Session.setDefault("voiceInputText","Waiting...");
// Session.setDefault("runningMic",false);

// Template.footer.helpers({
//    voiceInput:function() {
//        return Session.get("voiceInputText");
//    } 
// });

Template.footer.helpers({
   inLocation:function() {
       if ($(window).width() > 768) {
           return this.name;
       }
       else {
           return this.nickname;   
       }       
   },
   loc:function() {
       return Locations.findOne({"name":Session.get("inLocation")[0].name});
   },
   inLocationId:function() {
       return this.id;
   },
   inOrNear:function() {
       if (Session.get("inLocation")[1] == "in") {
           return "current location";
       }
       else {
           if (Session.get("unit") == "m") {
               return Math.floor(Session.get("inLocation")[2]) + "m away";
           }
           else {
               return Math.round(Math.floor(Session.get("inLocation")[2])*3.28) + "ft away";
           }
       }
   }
});


Template.footer.events({
    'click #currentLocLink':function(event) {
        Session.set("prev",Router.current().route.path());
        Session.set("viewLocation",this._id);
        Session.set("thisLoc",this);  
    },
    'click #listen':function(event) {
        event.preventDefault();
        
        var msg = new SpeechSynthesisUtterance();
        
        msg.text = Session.get("listenTo");
        console.log(Session.get("listenTo"));
        msg.lang = 'en-US';
        msg.rate = parseFloat(Session.get("rate"));
        
        
        msg.onend = function(e) {
          console.log('Finished in ' + event.elapsedTime + ' seconds.');
        };
        window.speechSynthesis.speak(msg);
    },
    'click #type': function(event) {
        event.preventDefault();
        
        $('#typeText').toggle('slow');    
    },
    'click .wit-microphone':function(event){
        event.preventDefault();
        
        if (navigator.getUserMedia || 
          navigator.webkitGetUserMedia || 
          navigator.mozGetUserMedia || 
          navigator.msGetUserMedia) {
              mic.connect("ANATOUXNLPGVGPTGWPN7RXQHFYYSPGPP");
          }
        
    },
    'mouseover .wit-microphone':function(event) {
       $(".mic").css("color","#FF3F4E");
    },
    'mouseout .wit-microphone':function(event) {
        if ($(".wit-microphone").hasClass("active")) {
            $(".mic").css("color","#FF3F4E");
        }
        else {
            if ($(window).width() > 768) {
                $(".mic").css("color","#333333");
            }
            else {
                $(".mic").css("color","#eeeeee");
            }
        }
    },
    'click #close-popover':function(event) {
        event.preventDefault();
        $("#speechText").toggle("medium");
    },
    'click #close-text-popover':function(event) {
        event.preventDefault();
        $("#typeText").toggle("medium");
    },
    'click .v-roleButton':function(event) {
        event.preventDefault();
        Session.set("userRole","visitor");
        console.log('visitor');
    },
    'click .s-roleButton':function(event) {
        event.preventDefault();
        Session.set("userRole","student");
        console.log('student');
    },
    'click .roleButton':function(event) {
        event.preventDefault();
                
        $("#firstVisit").hide();
        $("#textDialog").append("Great! Try typing something!");
    },
    'submit #typedInputForm':function(event) {
        event.preventDefault();
		
		var inputText = document.getElementById("typedInput").value;
		
		console.log("inputText", inputText);

		if (Session.get("history") == undefined) {
        	Session.set("history", []);
        }

		// Create history for session if not yet defined
		console.log("history", Session.get("history"));

		
		var history_point = {"input": inputText, "intent": "", "entities": "", "type": "text"};

		$.ajax({
			url: 'https://api.wit.ai/message',
			data: {
				'q': inputText,
				'access_token' : 'ANATOUXNLPGVGPTGWPN7RXQHFYYSPGPP'
			},
			dataType: 'jsonp',
			method: 'GET',
			success: function(response) {
				console.log("success!", response);

				var intent = response.outcomes[0].intent;
				var entities = response.outcomes[0].entities;
				var new_entities = {}
				for (key in entities)
				{
					new_entities[key] = entities[key][0];
				}	

				history_point["intent"] = intent;
				history_point["entities"] = new_entities;
				history_point["type"] = "text";

				// Insert into meteor Session a new history checkpoint
				var history = Session.get("history");
				history.push(history_point);
				Session.set("history", history);

				console.log("history", Session.get("history"))

				applyIntent(intent, new_entities, undefined);
            },
  		    error: function(response) {
		  	  console.log("error!");

		  	  // Insert into meteor Session a new history checkpoint
		      var history = Session.get("history");
		      history.push(history_point);
		      Session.set("history", history);
		    }
        });
    }
});

Template.footer.rendered = function() {
    startAudio();
    
    if (Session.get("userRole") != undefined) {
        $("#firstVisit").css("display","none");
    }
    
    if (window.SpeechSynthesisUtterance === undefined) {
        $("#listenBox").css("display","none");
        console.log("no");
    }
    else {
        $("#listenBox").css("display","block");
        console.log("yay");
    }
}

