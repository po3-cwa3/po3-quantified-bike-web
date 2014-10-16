var bol = bol || {};

/**
 * This file serves as the controller and depends on everything in the js folder
 */

bol.controller = (function() {

    var assets; //all our ajax-loaded assets (templates and json data)

    function init() {


        $("#queryAll")
            .click(function( event ) {
                event.preventDefault();
                bol.controller.queryAll();
            });


        $("#GetDetail")
            .click(function(event){
                event.preventDefault();
                bol.controller.display_details_day($("#Day").val());
        });

        $("#ID_trip")
            .click(function(event){
                event.preventDefault();
                bol.controller.display_details($("#ID").val());
            });

        $("#all_trips_on_day").delegate("div","click" ,function(data){

                id = data.currentTarget.id;
                console.log(data);
                bol.controller.display_details(id);
        })


    }

    function queryAll(){
        $.ajax({
            url: "http://dali.cs.kuleuven.be:8080/qbike/trips",
            jsonp: "callback",
            dataType: "jsonp",

            success: function (json) {

                console.log(status);
                console.log(json);

                bol.controller.updateUL(json);
            }
        });

        console.log("querying all");
    }

    function display_details_day(day){
        console.log("getting details");
        $.ajax({
            url: "http://dali.cs.kuleuven.be:8080/qbike/trips",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (json) {

                $.each(json, function(index,value){
                    var tijd = value.startTime.substring(0,10);
                    if (tijd == day ){

                        $("#all_trips_on_day").append("<div class='knop' id='" + value._id +"'> trip: " + value.groupID+ index+ "</div><br>");
                    }
                    });

            }
        });

    }


    function display_details(id){
        console.log("displaying details");
        $("#Detail_view").empty();
        console.log("updating data");
        $.ajax({
            url: "http://dali.cs.kuleuven.be:8080/qbike/trips/"+id,
            jsonp: "callback",
            dataType: "jsonp",

            success: function (trip) {
                trip = trip[0];
                console.log(trip);
                if (trip.hasOwnProperty("startTime")){
                    starttijd = new Date(trip.startTime);
                    $("#Detail_view").append("<li>" + "Date:    " + starttijd.getDate() + starttijd.getMonth()+ "</li>");
                    $("#Detail_view").append("<li>" + "start time:  " + starttijd.getHours()+":"+starttijd.getMinutes()+ "</li>");
                }
                if (trip.hasOwnProperty("endTime")) {
                    eindtijd = new Date(trip.endTime);
                    $("#Detail_view").append("<li>" + "end time:  " + eindtijd.getHours() + ":" + eindtijd.getMinutes() + "</li>");
                }
                if (trip.hasOwnProperty("meta")){
                    if(trip.meta.hasOwnProperty("distance")){
                        $("#Detail_view").append("<li>" + "Distance:    " + trip.meta.distance/1000 + "km"+ "</li>");
                    }
                    if(trip.meta.hasOwnProperty("averageSpeed")){
                        $("#Detail_view").append("<li>" + "Average Speed:   " + trip.meta.averageSpeed+ "km/h"+ "</li>");
                    }
                    if(trip.meta.hasOwnProperty("maxSpeed")){
                        $("#Detail_view").append("<li>" + "Maximum speed:   " + trip.meta.maxSpeed+ "km/h" + "</li>");
                    }
                    if(trip.meta.hasOwnProperty("other[0].comment")){
                        $("#Detail_view").append("<li>" + "Comments:    " + trip.meta.other[0].comment+ "</li>");
                    }
                }

            }
        });

    }




    return {
        init: init,
        queryAll: queryAll,
        display_details_day: display_details_day,
        display_details: display_details


    };


})();

$(document).ready(bol.controller.init);
