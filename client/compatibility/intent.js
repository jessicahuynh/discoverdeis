function applyIntent(intent,entities,mic) {
    var r = "";
    console.log("applyIntent intent", intent);
    console.log("applyIntent entities", entities);

    if (intent == undefined) {
        numAttempts++;
        switch(numAttempts) {
            case 1: r+="Could you try that again?"; break;
            case 2: r+="Oh dear. Could you say that once more?"; break;
            case 3: r+="I'm sorry, but I haven't been able to understand you. Once more?"; break;
            case 4: r+="Oh dear, I couldn't get that this time either. You can also try 'help' or 'what do you do?' for a list of supported commands."; break;
            default: r+="Make sure your mic is working and either say 'help' or head over to the About page for a list of supported commands."; break;
        }
        $("#result").append("<p>"+r+"</p>");
        Session.set("micResponse",r);
        speak();
    }
    else {
       numAttempts = 0;
       switch ( intent ) {
            case "set_current_loc" :
                set_current_loc(r, entities);
                break;
            case "search_for_loc":
                search_for_loc(r, entities);
                break;
            case "navigate":
                navigate_(r, entities);
                break;
            case "navigate_back":
                navigate_back(r, entities);
                break;
            case "app_help":
                app_help(r, entities);
                break;
            case "get_current_loc":
                get_current_loc(r, entities);
                break;
            case "get_info_about_loc":
                get_info_about_loc(r, entities);
                break;
            case "start_tour":
                start_tour(r, entities);
                break;
            case "open_loc_list":
                open_loc_list(r, entities);
                break;
            case "read":
                read(r, entities);
                break;
            case "repeat_prev":
                repeat_prev(r, entities);
                break;
            case "park":
                park(r, entities);
                break;
            case "confirm":
                confirm_(r, entities);
                break;
            case "feature_confirm":
                feature_confirm(r, entities);
                break;
            default:
                break;
       }
    }
}

function set_current_loc(r, entities) {
    console.log("entities", entities);
    console.log("deis_loc", entities["deis_loc"]);
    if (entities["deis_loc"] != undefined) {
        var loc = Locations.findOne({"name":entities["deis_loc"].value});

        if (loc != undefined) {
            set_loc(loc, undefined);
        }
    }
}

function search_for_loc(r, entities) {
    var searchTerm;
    if (entities["deis_loc"] != undefined) {
       if (entities["deis_loc"].value == "this_loc") {
           $("#result").append("<p>Looking up this location...</p>");
           searchTerm = Session.get("inLocation")[0].name;
       }
       else {
           searchTerm = entities["deis_loc"].body;
            $("#result").append("<p>Searching for <span class='said'>" + searchTerm +"</span>...</p>");
       }
    }
    else if (entities["location_category"] != undefined) {
      searchTerm = entities["location_category"].body;
            $("#result").append("<p>Looking for <span class='said'>" + searchTerm +"</span>...</p>");
    }

    Session.set("searchTerm",searchTerm);
    Session.set("micResponse","Looking for " +searchTerm);
    speak();

    document.getElementById("searchBox").value = Session.get("searchTerm");

    $("#searchBox").show("slow");

    $("#searchBox").focus();

    Router.go('/search');
}


function navigate_(r, entities) {
    // entities – {end: [{type: "value", value: "Shapiro"}]}

    r = "Navigating to ";
    var rSay = "Navigating to ";
    var disDestination = "";
    if (entities["end"] != undefined) {
        console.log("entities[end]", entities["end"]);
        console.log("entities[end].value", entities["end"].value);
       disDestination = disambiguate(entities["end"].value);

       if (!disDestination) {
           // if the location is actually a location
           var loc = Locations.findOne({"name":entities["end"].value});
           if ( loc != undefined) {
                add_inferred_intent(loc);
                r += "<span class='said'>"+entities["end"].value+"</span>";
                Session.set("navigateTo",entities["end"].value);
                rSay += entities["end"].value;
                numClarify = 0;
           }
           else {
                clarifyLoc();
           }            
       }
    }
    else {
        if (entities["deis_loc"] != undefined) {
            //console.log(entities["deis_loc"]);
            disDestination = disambiguate(entities["deis_loc"].value);
            if (!disDestination) {
                var loc = Locations.findOne({"name":entities["deis_loc"].value});
                if (loc != undefined) {
                    add_inferred_intent(loc);
                    r += "<span class='said'>"+entities["deis_loc"].value+"</span>";
                    Session.set("navigateTo",entities["deis_loc"].value);
                    rSay += entities["deis_loc"].value;
                    numClarify = 0;
               }
               else {
                   clarifyLoc();
               }
           }
       }
       else {
           clarifyLoc();
       }
    }
    
    if (entities["start"] != undefined) {
        var disStart = disambiguate(entities["start"].value);
        if (!disStart) {
             if (entities["start"] == "this_loc") {
                 r+= " from <span class='said'>this location</span>";
                 Session.set("navigateFrom","(" + Session.get("currentLocation").x + ", " + Session.get("currentLocation").y + ")");
                 rSay += " from your current location."
                 numClarify = 0;
             }
             else {
                if (Locations.findOne({"name":entities["start"].value}) != undefined) {
                    r += " from <span class='said'>"+entities["start"].value+"</span>";
                    Session.set("navigateFrom",entities["start"].value);
                    rSay += " from " + entities["start"].value;
                    numClarify = 0;
                }
                else {
                    clarifyLoc();
                }
             }                 
        }
    }
    else {
        Session.set("navigateFrom","(" + Session.get("currentLocation").x + ", " + Session.get("currentLocation").y + ")");
    }
    
    if (disDestination || disStart) {
        //console.log(disambiguationChoices);        
    }
    else if (rSay != "Navigating to ") {
        numClarify = 0;
        Session.set("micResponse",rSay);
        speak();
        
        $("#result").append("<p>"+r+"...</p>");
        if (Router.current().route.path() == "/navigate") {
            document.getElementById("startpoint").value = Session.get("navigateFrom");
            document.getElementById("endpoint").value = Session.get("navigateTo");
            $("#navform").submit();
        }
        else {
             Router.go('/navigate');
        }  
    }
}

// loc is a Location entity
function add_inferred_intent( loc ) {
    if ( loc.telic != undefined ) {
        if (Session.get("inferred") == undefined) {
            Session.set("inferred", []);
        }

        var inferred_intents = Session.get("inferred");
        inferred_intents.push(loc.telic);
        Session.set("inferred", inferred_intents); 

        console.log("inferred", inferred_intents);
    } 
}

function navigate_back(r, entities ) {
    if ( "deis_loc" in entities ) {
        entities["deis_loc"].value = disambiguate_back(entities["deis_loc"].value);
    }
    if ( "start" in entities ) {
        entities["start"].value = disambiguate_back(entities["start"].value);
    }
    if ( "end" in entities ) {
        entities["end"].value = disambiguate_back(entities["end"].value);
    }
        
    navigate_(entities);
}

function app_help(r, entities) {
    r += "<p>So you need <span class='said'>help</span>? Here are some commands you can try:</p><ul>";
    
    r+= "<li>Search for <span class='arg'>science</span></li>";
    r+= "<li>How do I get to <span class='arg'>Admissions</span> from <span class='arg'>here</span>?</li>";
    r+= "<li>Take me to <span class='arg'>the SCC</span></li>";
    r+= "<li>Tell me about <span class='arg'>Volen</span></li>";
    //r+= "<li>When is <span class='arg'>the Faculty Club</span> open?</li>";
    r+= "<li>Start the <span class='arg'>self-guided tour</span></li>";
    r+= "<li>Show me the list of locations</li>";
    r+= "<li>Read this to me</li>"
    //r+= "<li>Open settings and <span class='arg'>switch to U.S. customary units</span></li>";
    r+= "<li>Where am I?</li>";
    //r+= "<li>What's nearby?</li>";
    //r+= "<li>What's happening <span class='arg'>here</span>?</li>";
    
    r+= "</ul>";
    
    $("#result").append(r);
    Session.set("micResponse","Here are some commands you can try.");
    speak();
}

function get_current_loc(r, entities) {
    r += "<p>You're currently at <span class='arg'>" + Session.get("inLocation")[0].name + "</span>.</p>";
    r += "<p>Welcome!</p>";
    
    Session.set("micResponse","You're currently at " + Session.get("inLocation")[0].name + "!");
    speak();
    
    $("#result").append(r);
    
    var loc = Locations.findOne({"name":Session.get("inLocation")[0].name});
    Session.set("viewLocation",loc.id);
    Router.go('/viewLocation/'+loc.id);
}

function get_info_about_loc(r, entities) {
    var loc = null;
    if (entities["deis_loc"].value == "this_loc") {
        loc = Locations.findOne({"name":Session.get("inLocation")[0].name});
        //console.log(loc);
    }
    else {
        loc = Locations.findOne({"name":entities["deis_loc"].value});
    }
    
    if (loc != undefined && loc != null) {
        r += "<p>"+loc.function+"</p>";
        r += "<p>And here's more info for your perusal.";
        
        Session.set("micResponse",loc.function + "And here's more information for your perusal.");
        speak();
        $("#result").append(r);
        
        Session.set("viewLocation",loc.id);
        Router.go('/viewLocation/'+loc.id);
    }
    else {
        clarifyLoc();
    }
}

function start_tour(r, entities) {
    r += "<p>Starting up the <span class='said'>self-guided</span> tour...</p>";
            
    Session.set("micResponse","Starting up the self-guided tour.");
    speak();
    $("#result").append(r);
    
    Router.go('/selfguide');
}

function open_loc_list(r, entities) {
    r+= "<p>Taking you to the list of locations at Brandeis.</p>";
            
    Session.set("micResponse","Taking you to the list of locations at Brandeis.");
    speak();
    $("#result").append(r);
    
    Router.go('/locationList');
}

function read(r, entities) {
    r+= "<p>Reading.</p>";
            
    $("#listen").trigger("click");
    
    $("#result").append(r);
}

function repeat_prev(r, entities) {
    r+="<p>Once more.</p>"
            
    Session.set("micResponse","Once more: "+Session.get("micResponse"));
    speak();
    
    $("#result").append(r);
}

function park (r, entities) {
    var history = Session.get("history");

    for (i = history.length - 1; i >= 0 ; i -- ) {
        var history_point = history[i];

        if ( history_point["type"] == "loc" ) {
            var location = history_point['loc'];

            if ( location.category.indexOf("parking") > -1 ) {
                console.log("location.name", location.name);
                parking_entities = {"end": {"type": "value", "value" : location.name}};
                navigate_(r, parking_entities);
                break;
            }
        }
    }
}

function confirm_(r, entities) {
    if ( entities["on_off"] != undefined ) {
        if (entities["on_off"].value == "on") {
            r = "You can do that here";
                            
            Session.set("micResponse", r);
            $("#result").append("<p>"+r+"</p>");
            speak();
        }

        if (entities["on_off"].value == "off") {
            r = "OK";
                            
            Session.set("micResponse", r);
            $("#result").append("<p>"+r+"</p>");
            speak();
        }
    }
}

function feature_confirm(r, entities) {
    var history = Session.get("history");

    for (i = history.length - 1; i >= 0 ; i -- ) {
        var history_point = history[i];

        var des = undefined;

        if ( history_point["type"] == "mic" || history_point["type"] == "text") {
            var past_intent = history_point['intent'];
            var past_entities = history_point['entities'];

            if ( past_intent == 'navigate' || past_intent == 'navigate_back') {
                if (past_entities["end"] != undefined) {
                    des = past_entities["end"].value;
                    break;
                }
                
                if (past_entities["deis_loc"] != undefined) {
                    des = past_entities["deis_loc"].value;
                    break;
                }
            }
        }
    }

    console.log("des", des);
    if ( des != undefined ) {
        var loc = Locations.findOne({"name":des});

        if ( entities["feature"] != undefined ) {
            console.log("loc", loc);
            if ( loc != undefined ) {
                var semantic_props = [loc.color, loc.shape, loc.material];
                console.log("loc", semantic_props);
                for ( i = 0 ; i < semantic_props.length ; i ++ ){
                    semantic_prop = semantic_props[i];
                    if ( semantic_prop != undefined ) {
                        if ( semantic_prop.indexOf(entities["feature"].value) > -1 ) {
                            feature_confirm_produce(r, true);
                            return;
                        } 
                    }
                }
            }
        }

        if ( entities["spatial_link"] != undefined && entities["general_location"] != undefined ) {
            if ( loc != undefined ) {
                if (entities["spatial_link"].value == "next to") {
                    var general_location = entities["general_location"].value;

                    if (general_location.startsWith("a ")) {
                        general_location = general_location.substring(2);
                    }

                    if (loc.nearby != undefined) {
                        for ( i = 0 ; i < loc.nearby.length ; i ++ ){
                            var nearbyloc_name = loc.nearby[i];
                            var nearbyloc = Locations.findOne({"id":nearbyloc_name});


                            if (nearbyloc!= undefined && nearbyloc.category != undefined && nearbyloc.category.indexOf(general_location) > -1) {
                                feature_confirm_produce(r, true);
                                return;
                            }
                        }
                    }
                }
            }
        }
        feature_confirm_produce(r, false);
    }
}

function feature_confirm_produce(r, confirm) {
    if (confirm) {
        r = "That's the right one.";    
    } else {
        r = "That is not the right one. Please follow the direction.";
    }
    
    Session.set("micResponse", r);
    speak();

    $("#result").append("<p>"+r+"</p>");
}

function clarifyLoc() {
    numClarify += 1;
    
    r = "";   
    switch(numClarify) {
        case 1:r+="I didn't quite get that name. Could you try that again?"; break;
        case 2:r+="I didn't get it this time either. Again?"; break;
        case 3:r+="We seem to be having an issue. Could you try that once more?"; break;
        case 4:r+="We didn't get that this time around either. Remember, you can also look at the list of locations to look at what's on campus."; break;
        default:r+="Sorry, I can't seem to identify what location you're referring to. You can try a search or looking at the list of locations to get where you're going."; break;
    }
    
    Session.set("micResponse",r);
    $("#result").append("<p>"+r+"</p>");
    speak();
}

function disambiguate(entity_str) {    
    var dis = "";
    var disambiguated = false;
    if (entity_str == "Shapiro") {
        disambiguationChoices = ["Carl J. Shapiro Science Center","Carl and Ruth Shapiro Admissions Center","Carl and Ruth Shapiro Campus Center","Abraham Shapiro Academic Complex","Shapiro Hall"];
        dis = "Did you mean the <span class='said'>Shapiro Science Center</span>, <span class='said'>Carl and Ruth Shapiro Admissions Center</span>, <span class='said'>Shapiro Campus Center</span>, <span class='said'>Abraham Shapiro Academic Complex</span>, or <span class='said'>Shapiro Hall</span> in Massell Quad?";
        
        Session.set("micResponse","Did you mean the Shapiro Science Center, Carl and Ruth Shapiro Admissions Center, Shapiro Campus CEnter, Abraham Shapiro Academic Complex, or Shapiro Hall in Massell Quad?");
        
        Session.set("disambiguationChoices",disambiguationChoices);
        
         disambiguated = true;
    }
    if (entity_str == "Rabb") {
        disambiguationChoices = ["The Rabb School of Continuing Studies","Rabb Graduate Center"];
        dis = "Did you mean the <span class='said'>Rabb School of Continuing Studies</span> or <span class='said'>Rabb Graduate Center</span>?";
        
        Session.set("micResponse","Did you mean the Rabb School of Continuing Studies or Rabb Graduate Center?");
        
        Session.set("disambiguationChoices",disambiguationChoices);
        
         disambiguated = true;
    }
   

    if (disambiguated) {
       speak();
       $("#result").append("<p>"+dis+"</p>");
    }
    return disambiguated;
}

function disambiguate_back (entity_str) {
    var history = Session.get("history");
    var disambiguate_choices = {
        "Shapiro" : ["Carl J. Shapiro Science Center","Carl and Ruth Shapiro Admissions Center","Carl and Ruth Shapiro Campus Center","Abraham Shapiro Academic Complex","Shapiro Hall"],
        "Rabb" : ["The Rabb School of Continuing Studies","Rabb Graduate Center"]
    }

    if ( entity_str in disambiguate_choices ) {
        choices = disambiguate_choices[entity_str];
        console.log( "choices" , choices );

        for (i = history.length - 1; i >= 0 ; i -- ) {
            var history_point = history[i];

            if ( history_point["type"] == "mic" || history_point["type"] == "text") {
                var intent = history_point['intent'];
                var entities = history_point['entities'];

                if ( intent == 'navigate' ) {
                    for ( key in entities ) {
                        if (choices.indexOf(entities[key].value) > -1) {
                            return entities[key].value;
                        } 
                    }
                }
            }
        }
    } 
        
    return entity_str;
}

