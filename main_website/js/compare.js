

compareController = (function() {

    var items_to_compare = [];
    var month = new Date().getMonth() + 1;
    var data_for_circle = []; // deze array bevat de duur van elke trip in seconden uitgedrukt.
    var km_for_circle = [];
    var temperature = [];
    var humidity = [];
    var heartbeat = [];
    var coordinates = [];
    var speed_for_graph = [];
    var days = [];
    var colors = ["rgba(255,174,27,1)","rgba(151,187,205,1)","rgba(126,116,133,1)","rgba(54,255,187,1)"];


    var month_data;
    var month_data_fetched = false;

    function init() {

        dataController.queryDataForMonth(month, function(data) {

            month_data = data;
            month_data_fetched = true;


            console.log(month_data);

            $("#loading_popover").css("display", "none");
            $("#loading_popover-2").css("display", "none");

            $("#calendar").datepicker("refresh");
            $("#calendar-2").datepicker("refresh");
        });

        $("#calendar").datepicker({

            onSelect: function (dateText, datepicker) {

                var elements = dateText.split("/");

                var day = elements[1];

                setTableToTrips(month_data[day-1]);


            },

            onChangeMonthYear: function (newYear, newMonth, datepicker) {

                console.log("Datepicker changed month to " + newMonth);

                month_data_fetched = false;

                month = newMonth;

                $("#trip_lister ul").empty();

                $("#loading_popover").css("display", "block");

                dataController.queryDataForMonth(month, function(data) {

                    month_data = data;
                    month_data_fetched = true;

                    console.log(month_data);

                    $("#loading_popover").css("display", "none");
                    $("#calendar").datepicker("refresh");
                });
            },

            beforeShowDay: function (day) {

                var day_month = day.getMonth() + 1;

                if (month_data_fetched && day_month == month) {

                    var day_number = day.getDate();

                    var trips_present = month_data[day_number-1].average.nrOfTrips > 0;

                    if (trips_present) console.log("Trips present on " + day);

                    return [trips_present, ""];
                }

                return [false, ""];
            }
        });

        $("#calendar-2").datepicker({

            onSelect: function (dateText, datepicker) {
                console.log(dateText);
                var elements = dateText.split("/");

                var day = elements[1];

                days.push(month_data[day-1]);

            },

            onChangeMonthYear: function (newYear, newMonth, datepicker) {

                console.log("Datepicker changed month to " + newMonth);

                month_data_fetched = false;

                month = newMonth;

                $("#loading_popover-2").css("display", "block");

                dataController.queryDataForMonth(month, function(data) {

                    month_data = data;
                    month_data_fetched = true;

                    console.log(month_data);

                    $("#loading_popover-2").css("display", "none");
                    $("#calendar-2").datepicker("refresh");
                });
            },

            beforeShowDay: function (day) {

                var day_month = day.getMonth() + 1;

                if (month_data_fetched && day_month == month) {

                    var day_number = day.getDate();

                    var trips_present = month_data[day_number-1].average.nrOfTrips > 0;

                    if (trips_present) console.log("Trips present on " + day);

                    return [trips_present, ""];
                }

                return [false, ""];
            }
        });

        $("#trips").click(function(){
            $("#choose-compare-sort").slideUp("fast");
            $("#compare-trips").slideDown("fast");
            $("#start_comparing").slideDown("fast");
            $("#compare-other-trips").slideDown("fast");
        });

        $("#days").click(function(){
            $("#choose-compare-sort").slideUp("fast");
            $("#compare-days").slideDown("fast");
            $("#compare-other-trips").slideDown("fast");
        });


        $("#start_comparing").click(function () {

            //$("#compare-trips").slideUp("fast");

            compare_items();

            $("#select_day").empty();
            $("#select_trip").empty();
        });

        $("#start_comparing_days").click(function () {

            console.log(days);
            compare_days();
        });

        // button is clicked when the user wants to choose other trips.
        $("#compare-other-trips").click(function(){
            $("#compare-trips").slideDown("fast");
            $("#start_comparing").slideDown("fast");
            $("#calendar-1").slideDown("fast");
            $("#enough-entries").slideUp("fast");
            delete_current_data();

        });

    }

    function delete_current_data(){
        var tripLister = $("#trip_lister ul");
        tripLister.empty();

        var arrays = [items_to_compare,data_for_circle, km_for_circle, temperature, humidity, heartbeat, coordinates, speed_for_graph];
        $.each(arrays, function(){
            while ( this.length > 0){
                this.pop();
            };
        });

        var rows_of_table = ["elements_to_compare","table_day","km","duration"];

        $.each(rows_of_table,function(){
            var element = document.getElementById("table_compare").rows;
            $.each(element, function(){
                while (this.cells.length > 0){
                    console.log(this + " row");
                    this.deleteCell(0);
                };
            });

        });

        $("#first_chart").slideUp("fast");
        $("#second_chart").slideUp("fast");
        $("#speed_chart").slideUp("fast");
        $("#heartbeat_chart").slideUp("fast");

    }

    function make_chart(data_trip,sort){
        console.log(data_trip + sort);
        var fill_choiche = data_trip.length;
        if (sort == "hum"){
            var fill = 0;
        } else if (fill_choiche < 4){
            var fill = 0.2;
        } else {
            var fill =  0.1;
        }
        console.log("making chart");
        var trip_2 = {
            label: "first trip",
            title: "first trip",
            fillColor: "rgba(151,187,205, "+fill+")",
            strokeColor: "#47a3da",
            lineColor: "#47a3da",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: []
        }

        var trip_1 = {
            label: "second trip",
            title: "second trip",
            fillColor: "rgba(255,174,27,"+fill+")",
            strokeColor: "rgba(255,174,27,1)",
            pointColor: "rgba(255,174,27,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }

        var trip_3 = {
            label: "Third trip",
            title: "Third trip",
            fillColor: "rgba(126,116,133,"+fill+")",
            strokeColor: "rgba(126,116,133,1)",
            pointColor: "rgba(126,116,133,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }

        var trip_4 = {
            label: "Third trip",
            title: "Third trip",
            fillColor: "rgba(54,255,187,"+fill+")",
            strokeColor: "rgba(54,255,187,1)",
            pointColor: "rgba(54,255,187,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }


        var data = {
            labels: [],
            datasets: []
        };
        $.each(data_trip,function(index,value){
            var lengte = data.datasets.length;
            if (lengte == 0){
                var trip = trip_1;
            } else if (lengte == 1 ){
                var trip = trip_2;
            } else if(lengte == 2) {
                var trip = trip_3;
            } else {
                var trip = trip_4;
            }
            trip.label = "trip "+(parseInt(index)+1).toString();
            trip.title = "trip "+(parseInt(index)+1).toString();
            trip.data = value;

            data.datasets.push(trip);

            if (value.length > data.labels.length){
                data.labels = [];

                // the length of the trip with this data is stored in data_for_circle
                var duration_trip = data_for_circle[index];
                console.log(duration_trip);
                var number_of_labels = Math.round(duration_trip/30)+1;
                console.log(number_of_labels);
                var i ;
                var labels = [];
                for (i=0; i < number_of_labels; i++){
                    labels.push(30*i);
                }
                console.log(labels + "these are the labels");
                var labels_interval = Math.round(value.length/number_of_labels);
                var j ;
                var number = 0;
                for (j=0; j < value.length; j++ ){
                    if ( j % labels_interval ==0 ){
                        if (number > number_of_labels -1){
                            var label = "";
                        } else {
                            var label = labels[number];
                            number += 1;
                        }



                    } else {
                        var label = "";
                    }
                    data.labels.push(label.toString());
                }
            }
        });


        var options = {
            graphTitle: "Temperature during the trip",
            showTooltips: true,
            annotateDisplay: true,
            legend: true,
            yAxisMinimumInterval : 1,
            xAxisLabel: "Seconds",
            xAxisBottom: true,
            scaleXGridLinesStep: 15,
            pointDot: false,
            scaleOverride: false,
            scaleStepWidth : 1,
            scaleStartValue: 10,
            scaleSteps: 20,
            yAxisUnit : "°C",
            yAxisUnitFontSize: 16,
            yAxisLabel: "Temperature"

        };

        if (sort == "hum"){
            options.graphTitle = "humidity during the trip";
            options.yAxisLabel = "humidity";
            options.yAxisUnit = "%";
            options.scaleOverride = true;
            options.scaleStartValue = 0;
            options.scaleStepWidth = 5;
            options.scaleSteps = 20;
        } else if ( sort == "speed"){
            options.graphTitle = "speed during the trip";
            options.yAxisLabel = "speed";
            options.yAxisUnit = "m/s";
        } else if (sort =="heart"){
            options.graphTitle = "heartbeat during the trip";
            options.yAxisLabel = "heartbeats";
            options.yAxisUnit = "";
            //options.xAxisBottom = false;
        }
        console.log(data.datasets);
        if (sort == "temp"){
            var ctx = $("#first_chart").get(0).getContext("2d");
            $("#first_chart").slideDown("fast");
        } else if (sort == "hum") {
            var ctx = $("#second_chart").get(0).getContext("2d");
            $("#second_chart").slideDown("fast");
        } else if (sort == "heart") {
            var ctx = $("#heartbeat_chart").get(0).getContext("2d");
            $("#heartbeat_chart").slideDown("fast");
        } else {
            var ctx = $("#speed_chart").get(0).getContext("2d");
            $("#speed_chart").slideDown("fast");
        }


        ctx.canvas.width = 1000;
        ctx.canvas.height = 500;
        var myNewChart = new Chart(ctx).Line(data,options);


    }

    function calculate_size_circle(procent,sort,index,value){

        procent = Math.round(procent);
        var radius = 75;
        var angle = procent* 2*Math.PI/100;
        var svg = "<svg id='circle_"+index+sort+"' class='pie'><circle cx='75' cy='75' r='74' fill='white' stroke="+colors[index]+"></circle><circle class='inner' cx='75' cy='75' r='40' fill="+colors[index]+"></circle></svg>"
        if (sort =="time") {
            $("#duration").append("<td>" + svg + "</td>");
        } else {
            $("#km").append("<td>" + svg + "</td>");
        }
        svg = document.getElementById("circle_"+index+sort);
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        var text2 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        angle = angle - Math.PI/2;


        if (procent > 50){
            var path_1 = "M75,75 L75,0 A75,75 1 0,1 75,150 z";
            var newElement_1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            newElement_1.setAttribute("d",path_1);
            newElement_1.setAttributeNS(null,"fill",colors[index]);
            svg.appendChild(newElement_1);
            var x = radius + radius*Math.cos(angle);
            var y = radius + radius*Math.sin(angle);
            var path = "M75,75 L75,150 A75,75 1 0,1 "+Math.round(x)+","+Math.round(y)+" z";

            newElement.setAttribute("d",path);
            newElement.setAttributeNS(null,"fill",colors[index]);
            svg.appendChild(newElement);
        }

        else {
            var x = radius + radius * Math.cos(angle);
            var y = radius + radius * Math.sin(angle);
            var path = "M75,75 L75,0 A75,75 1 0,1 " + Math.round(x) + "," + Math.round(y) + " z";

            newElement.setAttribute("d", path);
            newElement.setAttributeNS(null,"fill",colors[index]);
            svg.appendChild(newElement);

        }
        text.setAttributeNS(null,"x",75);
        text.setAttributeNS(null,"y",85);
        text.setAttributeNS(null,"font-size","30");
        text.setAttributeNS(null,"fill","#fff");
        text.setAttributeNS(null,"font-family","'Lato', Calibri, Arial, sans-serif");
        text.setAttributeNS(null,"text-anchor","middle");
        text2.setAttributeNS(null,"x",75);
        text2.setAttributeNS(null,"y",175);
        text2.setAttributeNS(null,"font-size","20");
        text2.setAttributeNS(null,"fill",colors[index]);
        text2.setAttributeNS(null,"font-family","'Lato', Calibri, Arial, sans-serif");
        text2.setAttributeNS(null,"text-anchor","middle");
        var textNode = document.createTextNode(procent+"%");
        if (sort == "time"){
            var display_text = ~~(value/3600)+"h"+ Math.round((value%3600)/60)+"m";
        } else {
            var display_text = Math.round(value) + "m";
        }
        var textNode2 = document.createTextNode(display_text);

        text.appendChild(textNode);
        text2.appendChild(textNode2);
        svg.appendChild(text);
        svg.appendChild(text2);

    }

    function create_circles_time(){
        var total = 0;
        $.each(data_for_circle, function(){
            total += this;
        });

        $.each(data_for_circle,function(index,value){
            procent = value/total;
            calculate_size_circle(procent*100,"time",index,value);
        });
        items_to_compare = [];

    }

    function create_circles_distance() {
        var total = 0;
        $.each(km_for_circle, function(){
            total += this;
        });
        console.log(total + "total");
        if (total == 0){
            $.each(km_for_circle,function(){
                $("#km").append("<td>not recorded</td>");
            });
        } else {
            $.each(km_for_circle, function (index, value) {
                procent = value / total;
                calculate_size_circle(procent * 100, "distance", index, value);
            });
        }
    }

    function setTableToTrips(data) {

        console.log("Setting table to data: " + data);

        // Empty the lister ul
        var tripLister = $("#trip_lister ul");
        tripLister.empty();

        // Function to pad zeros to integer, this function is used for date formatting
        function pad (str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
        }

        // Loop through trips and add to lister ul
        $.each(data.trips, function (index, trip) {

            var startTime = new Date(trip.startTime);
            var endTime = new Date(trip.endTime);

            var begin = pad(startTime.getHours(), 2) + ":" + pad(startTime.getMinutes(), 2);
            var end = pad(endTime.getHours(), 2) + ":" + pad(endTime.getMinutes(), 2);

            tripLister.append("<li datum='"+startTime+"' index='" + index + "'  trip_id='" + trip._id + "'>" + begin + "  tot  " + end + "</li>");
        });

        // Once the new items have been added to the lister ul, set the click function for these items
        $("#trip_lister ul li").click(function() {

            var tripID = $(this).attr("trip_id");
            var tripdatum = $(this).attr("datum");
            var tripindex = $(this).attr("index");
            console.log(tripdatum);
            addTripToComparison(tripdatum,tripindex);

            // if the user has chosen 4 items to compare, the calendar and list dissapear
            if (items_to_compare.length > 3 ){
                $("#calendar-1").slideUp("fast");
                $("#enough-entries").slideDown("fast");
            }
        });
    }
   /* function addTripToComparison(tripID) {

        items_to_compare.push(tripID);

        var elementsToCompare = $("#elements_to_compare");

        if ( document.getElementById("table_compare").rows[0].cells.length == 0){
            elementsToCompare.append("<td width='140px' id='title_1'>id:</td>");
        }

        elementsToCompare.append("<td width='200px' id='" + items_to_compare.length + "'> trip: " +  document.getElementById("table_compare").rows[0].cells.length+ " </td>");
    }*/
    function addTripToComparison(tripdatum, tripindex) {
        tripdatum = new Date(tripdatum)
        console.log(tripdatum.getDate()+ ":" + tripindex);
        var element = month_data[tripdatum.getDate() -1 ].trips[tripindex];
        console.log(element);
        items_to_compare.push(element);

        var elementsToCompare = $("#elements_to_compare");

        if ( document.getElementById("table_compare").rows[0].cells.length == 0){
            elementsToCompare.append("<td width='140px' id='title_1'>id:</td>");
        }

        elementsToCompare.append("<td width='200px' id='" + items_to_compare.length + "'> trip: " +  document.getElementById("table_compare").rows[0].cells.length+ " </td>");
    }

    function compare_items(){
        console.log(month_data);
        if (items_to_compare.length ==0){
            alert("please select at least one item!");

        } else {
            $("#compare-trips").slideUp("fast");
            $("#start_comparing").slideUp("fast");


            $.each(items_to_compare, function (index, value) {
                create_table(value);
            });

            console.log(data_for_circle);
            var max_of_array = Math.max.apply(Math, data_for_circle);
            console.log(max_of_array);

            make_chart(humidity,"hum");
            create_circles_time();
            make_chart(temperature,"temp");
            make_chart(heartbeat,"heart");
            $.each(coordinates, function(index,value){
                calculate_speed(value[0],index);
            });
            console.log(coordinates);
            console.log("above are the coordinates");
            // coordinates geeft een array met daarin arrays die elk een waarde bevatten, namelijk nog een
            // array met daarin de waarden --> de tweede waarde is altijd gelijk aan 0.
            console.log(km_for_circle);
            console.log(speed_for_graph + "speed_for_graph");

            setTimeout(function(){
                make_chart(speed_for_graph,"speed");
                create_circles_distance();
            },500);





        }

        var data = [];
/*        setTimeout(function () {
            $.each(coordinates, function(index,value){
                calculate_speed(value[0],index);
            });
            console.log(coordinates);
            console.log("above are the coordinates");
            // coordinates geeft een array met daarin arrays die elk een waarde bevatten, namelijk nog een
            // array met daarin de waarden --> de tweede waarde is altijd gelijk aan 0.
            console.log(km_for_circle);
            console.log(speed_for_graph + "speed_for_graph");
            *//*$.each(km_for_circle,function(){
                $("#km").append("<td>"+ Math.round(this)  +" meter </td>");
            });*//*
        },500);*/

    }

    function calculate_speed(coordinates,index){
        var total_length = coordinates.length-1;
        var distances = [];

        var i;
        for (i = 0; i < total_length; i++){
            var value = new google.maps.LatLng(coordinates[i].lat,coordinates[i].lng); // zet coordinaten om in door google maps
            // bruikbaar formaat
            var value_2 = new google.maps.LatLng(coordinates[i+1].lat,coordinates[i+1].lng);
            var distance = google.maps.geometry.spherical.computeDistanceBetween (value, value_2); // returns the distance in meters
            //console.log(distance);
            distances.push(distance);
        };
        if (distances.length > 0){
            var total_distance = distances.reduce(function(a, b) { return a + b });
            var interval = data_for_circle[index]/total_length;
            var speed = distances.map(function(x) {return x/ interval;});
        } else {
            var speed = [];
            var total_distance = 0;
        }

        km_for_circle.push(total_distance);
        speed_for_graph.push(speed);

    }

    function create_table(value){

            if (document.getElementById("table_compare").rows[1].cells.length == 0){
                $("#table_day").append("<td id='title_2' >start day:  </td>");
                $("#km").append("<td id='title_3' > total distance:   </td>");
                $("#duration").append("<td id='title_4' > duration:   </td>");
            }
            if (value.hasOwnProperty("startTime") && value.hasOwnProperty("endTime")) {
                date = new Date(value.startTime);
                end_date = new Date(value.endTime);
                var duration = (end_date.getTime() - date.getTime()) / 1000;
                data_for_circle.push(duration);
            } else {
                $("#duration").append("<td> not recorded </td>");
            }
            var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];

            $("#table_day").append("<td>" +date.getDate() +" "+ monthNames[date.getMonth()] +"</td>");
            /*if (json[0].hasOwnProperty("meta.distance")) {
                var distance = json[0].meta.distance/1000;
                $("#km").append("<td>" + distance + " km "  + "</td>");
                km_for_circle.push(distance);
            } else {
                $("#km").append("<td> not recorded  </td>");
            }*/
            console.log(value)
            var readings = dataController.getAveragesFromTrips([value]);
            console.log(readings);
            temperature.push(readings.temparature);
            humidity.push(readings.humidity);
            coordinates.push(readings.routes);
            heartbeat.push(readings.heart);

        }

       /* function create_table(id){
            $.ajax({
                url: "http://dali.cs.kuleuven.be:8080/qbike/trips/"+id,
                jsonp: "callback",
                dataType: "jsonp",

                success: function (json) {
                    if (document.getElementById("table_compare").rows[1].cells.length == 0){
                        $("#table_day").append("<td id='title_2' >start day:  </td>");
                        $("#km").append("<td id='title_3' > total distance:   </td>");
                        $("#duration").append("<td id='title_4' > duration:   </td>");
                    }
                    if (json[0].hasOwnProperty("startTime") && json[0].hasOwnProperty("endTime")) {
                        date = new Date(json[0].startTime);
                        end_date = new Date(json[0].endTime);
                        var duration = (end_date.getTime() - date.getTime()) / 1000;
                        data_for_circle.push(duration);
                    } else {
                        $("#duration").append("<td> not recorded </td>");
                    }
                    var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];

                    $("#table_day").append("<td>" +date.getDate() +" "+ monthNames[date.getMonth()] +"</td>");
                    *//*if (json[0].hasOwnProperty("meta.distance")) {
                     var distance = json[0].meta.distance/1000;
                     $("#km").append("<td>" + distance + " km "  + "</td>");
                     km_for_circle.push(distance);
                     } else {
                     $("#km").append("<td> not recorded  </td>");
                     }*//*
                    var readings = dataController.getAveragesFromTrips(json);
                    temperature.push(readings.temparature);
                    humidity.push(readings.humidity);
                    coordinates.push(readings.routes);
                    heartbeat.push(readings.heart);

                }
            });*/





    function compare_days(){
        var hum = [];
        var temp = [];
        var trips = [];
        $.each(days, function(){
            console.log(this);
            temp.push([this.average.averageTemperature]);
            hum.push([this.average.averageHumidity]);
            trips.push([this.average.nrOfTrips]);
        });
        create_graph_days(hum, "hum");
        create_graph_days(temp, "temp");
        create_graph_days(trips, "trips");
    }

    function create_graph_days(array, sort){
        console.log("creating averages chart");
        console.log(array);
        var data = {
            labels: ["different trips"],
            datasets: []
        };

        var trip_2 = {
            label: "first trip",
            title: "first trip",
            fillColor: "rgba(151,187,205,1)",
            strokeColor: "#47a3da",
            data: []
        }

        var trip_1 = {
            label: "second trip",
            title: "second trip",
            fillColor: "rgba(255,174,27,1)",
            strokeColor: "rgba(255,174,27,1)",
            data: []
        }

        var trip_3 = {
            label: "Third trip",
            title: "Third trip",
            fillColor: "rgba(126,116,133,0.8)",
            strokeColor: "rgba(126,116,133,1)",
            data: []
        }

        var trip_4 = {
            label: "Third trip",
            title: "Third trip",
            fillColor: "rgba(54,255,187,0.7)",
            strokeColor: "rgba(54,255,187,1)",
            data: []
        }

        $.each(array,function(index,value){
            var lengte = data.datasets.length;
            if (lengte == 0){
                var trip = trip_1;
            } else if (lengte == 1 ){
                var trip = trip_2;
            } else if(lengte == 2) {
                var trip = trip_3;
            } else {
                var trip = trip_4;
            }

            trip.label = "trip "+(parseInt(index)+1).toString();
            trip.title = "trip "+(parseInt(index)+1).toString();
            console.log(value);
            trip.data = [value];
            data.datasets.push(trip);


        });

        var options = {
            graphTitle: "Average Temperature",

            yAxisLabel: "Temperature"

        };
        if( sort == "temp"){
            var ctx = $("#average_temp").get(0).getContext("2d");
        } else if ( sort == "hum"){
            options.graphTitle = "Average Humidity"
            var ctx = $("#average_hum").get(0).getContext("2d");
        } else {
            options.graphTitle = "Number of trips "
            var ctx = $("#average_trips").get(0).getContext("2d");
        }


        ctx.canvas.width = 400;
        ctx.canvas.height = 400;
        var myNewChart = new Chart(ctx).Bar(data,options);



    }



    return {
        init: init,

        setTableToTrips: setTableToTrips,
        addTripToComparison: addTripToComparison,

        create_table: create_table,
        make_chart: make_chart,

        calculate_size_circle: calculate_size_circle,
        create_circles_distance : create_circles_distance,
        create_circles_time : create_circles_time,
        compare_items: compare_items,
        compare_days: compare_days,
        calculate_speed: calculate_speed,
        create_graph_days : create_graph_days,
        delete_current_data: delete_current_data
    }
})();

$(document).ready(compareController.init);


