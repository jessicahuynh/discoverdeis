var disambiguationChoices = [];
var numAttempts = 0;
var numClarify = 0;

// I moved all the other stuffs to intent.js

function startAudio() {
    navigator.getUserMedia = (navigator.getUserMedia || 
                          navigator.webkitGetUserMedia || 
                          navigator.mozGetUserMedia || 
                          navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
        mic = new Wit.Microphone(document.getElementById("microphone"));
        
        var info = function (msg) {
            document.getElementById("info").innerHTML = msg;
        };
        var error = function (msg) {
            document.getElementById("error").innerHTML = msg;
        };
        mic.onready = function () {
            info("Microphone is ready to record");
        };
        mic.onaudiostart = function () {
            info("Recording started");
            error("");
           
            $("#speechText").show("slow");
            $("#result").append("<h4>I'm listening! <small>Tap again to stop listening and start processing</small></h4>")
        };
        mic.onaudioend = function () {
            info("Recording stopped, processing started");
        };
        mic.onresult = function (intent, entities) {
            console.log("Before modifying");
            console.log("intent", intent);
            console.log("entities", entities);
            
            var r = kv("intent", intent);
    
            for (var k in entities) {
                var e = entities[k];
    
                if (!(e instanceof Array)) {
                    r += kv(k, e.value);
                } else {
                    for (var i = 0; i < e.length; i++) {
                        r += kv(k, e[i].value);
                    }
                }
            }
    
            document.getElementById("result").innerHTML = "";
            
            console.log("After modifying");
            console.log("intent", intent);
            console.log("entities", entities);

            // Create history for session if not yet defined
            if (Session.get("history") == undefined) {
                Session.set("history", []);
            }

            var history_point = {"input": "", "intent": intent, "entities": entities, "type": "mic"};
            
            applyIntent(intent,entities,mic);

            // Insert into meteor Session a new history checkpoint
              var history = Session.get("history");
              history.push(history_point);
              Session.set("history", history);

        };
        
        mic.onerror = function (err) {
            error("Error: " + err);
        };
        
        mic.onconnecting = function () {
            info("Microphone is connecting");
        };
        
        mic.ondisconnected = function () {
            info("Microphone is not connected");
        };
    	
        // mic.start();
        //mic.stop();
    }
}


function kv(k, v) {
    if (toString.call(v) !== "[object String]") {
        v = JSON.stringify(v);
    }
    return k + "=" + v + "\n";
}

function speak() {
    var msg = new SpeechSynthesisUtterance(Session.get("micResponse"));
    msg.rate = parseFloat(Session.get("rate"));
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

