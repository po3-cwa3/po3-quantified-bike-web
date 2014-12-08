

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



        $("#start_comparing").click(function () {

            compare_items();
        });

        $("#start_comparing_days").click(function () {

            console.log(days);
            compare_days();
        });

        // button is clicked when the user wants to choose other trips.
        $("#compare-other-trips").click(function(){
            // the calendar to pick trips has to be visible again for the user.
            $("#compare-trips").slideDown("fast");
            $("#start_comparing").slideDown("fast");
            $("#calendar-1").slideDown("fast");

            // the message that enough entries have been chosen has to dissapear. the buttons to view graphs don't have to be visible anymore
            $("#enough-entries").slideUp("fast");
            $("#buttons").slideUp("fast");

            // all the current comparisons are deleted.
            delete_current_data();

        });

        // when the user clicks on one of the following buttons, the corresponding graphs have to be displayed.
        $("#view_temperature").click(function(){
            $("#first_chart").slideDown("fast");
            $("#second_chart").slideUp("fast");
            $("#speed_chart").slideUp("fast");
            $("#heartbeat_chart").slideUp("fast");

            // after the graph has been drawn, the page scrolls to the bottom of the page, so that the user can easily see the graph.
            setTimeout(function(){
                window.scrollTo(0,document.body.scrollHeight);
            },200)

        });

        $("#view_humidity").click(function(){
            $("#first_chart").slideUp("fast");
            $("#second_chart").slideDown("fast");
            $("#speed_chart").slideUp("fast");
            $("#heartbeat_chart").slideUp("fast");
            setTimeout(function(){
                window.scrollTo(0,document.body.scrollHeight);
            },200)
        });

        $("#view_speed").click(function(){
            $("#first_chart").slideUp("fast");
            $("#second_chart").slideUp("fast");
            $("#speed_chart").slideDown("fast");
            $("#heartbeat_chart").slideUp("fast");
            setTimeout(function(){
                window.scrollTo(0,document.body.scrollHeight);
            },200)
        });

        $("#view_heartbeat").click(function(){
            $("#first_chart").slideUp("fast");
            $("#second_chart").slideUp("fast");
            $("#speed_chart").slideUp("fast");
            $("#heartbeat_chart").slideDown("fast");
            setTimeout(function(){
                window.scrollTo(0,document.body.scrollHeight);
            },200)
        });

    }

    function delete_current_data(){

        // the list of trips on a certain day is emptied
        var tripLister = $("#trip_lister ul");
        tripLister.empty();

        // all the array containing data for comparisons are emptied
        var arrays = [items_to_compare,data_for_circle, km_for_circle, temperature, humidity, heartbeat, coordinates, speed_for_graph];
        $.each(arrays, function(){
            while ( this.length > 0){
                this.pop();
            };
        });


        // all the info in the table is deleted.

        // all the rows in the compare table
        var element = document.getElementById("table_compare").rows;
        console.log(element);
        $.each(element, function(){
            // every row is deleted cell by cell
            while (this.cells.length > 0){
                console.log(this + " row");
                this.deleteCell(0);
            };
        });


        // the charts are temporarily made invisible again. once the user chooses new trips,
        // the canvases containing these graps will be overwritten
        $("#first_chart").slideUp("fast");
        $("#second_chart").slideUp("fast");
        $("#speed_chart").slideUp("fast");
        $("#heartbeat_chart").slideUp("fast");

    }

    function make_chart(data_trip,sort){
        console.log(data_trip + sort);
        var fill_choiche = data_trip.length;

        // the humidity graph looks better if there is no filling under the lines.
        if (sort == "hum"){
            var fill = 0;
        } else if (fill_choiche < 4){
            var fill = 0.2;
        // if there are 4 trips to be compared, we make the fill more transparent so that
        // the graphs are still visible
        } else {
            var fill =  0.1;
        }
        console.log("making chart");

        // the different trips get different colours in the graph
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
            // the datapoints will be added later
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

        // data contains the labels that will be placed on the x-axis and the data of the different trips
        var data = {
            labels: [],
            datasets: []
        };


        // a dataset is made for each trip
        $.each(data_trip,function(index,value){
            var lengte = data.datasets.length;
            // the first trip gets trip_1 as starting dataset and the colour defined in trip_1
            if (lengte == 0){
                var trip = trip_1;
            // the second trip gets trip_2 as starting dataset and the colour defined in trip_2
            } else if (lengte == 1 ){
                var trip = trip_2;
             // the third trip gets trip_3 as starting dataset and the colour defined in trip_3
            } else if(lengte == 2) {
                var trip = trip_3;
            // the fourth trip gets trip_4 as starting dataset and the colour defined in trip_4
            // the user can't select more than 4 trips to compare
            } else {
                var trip = trip_4;
            }
            // the trip gets a title
            trip.label = "trip "+(parseInt(index)+1).toString();
            trip.title = "trip "+(parseInt(index)+1).toString();
            // the data corresponding to this trip is added to the dataset
            trip.data = value;

            // the dataset is added to the variable 'data'
            data.datasets.push(trip);

            // assuming that during all trips the sensors have gathered data at the same frequency,
            // the trip with the most readings has the longest duration
            if (value.length > data.labels.length){

                // the trip with the longest duration provides the labels on the x-axis
                data.labels = [];

                // the length of the trip with this data is stored in data_for_circle
                var duration_trip = data_for_circle[index];
                console.log(duration_trip);

                // we want to display a label every thirty seconds.
                // we add one because the first label is displayed at 0 seconds.
                var number_of_labels = Math.round(duration_trip/30)+1;
                console.log(number_of_labels);
                var i ;

                // labels is an array containing all the labels that have to be displayed.
                var labels = [];
                for (i=0; i < number_of_labels; i++){
                    labels.push(30*i);
                }
                console.log(labels + "these are the labels");

                // the interval of readings at which a label has to be displayed.
                var labels_interval = Math.round(value.length/number_of_labels);
                var j ;
                var number = 0;
                for (j=0; j < value.length; j++ ){
                    // if the j-th reading is a multiple of the interval, a label is added
                    if ( j % labels_interval ==0 ){
                        if (number > number_of_labels -1){
                            // if all the labels have already been added, no label can be added anymore so nothing is displayed instead
                            var label = "";
                        } else {
                            var label = labels[number];
                            number += 1;
                        }
                    // if this is not the case, nothing is displayed on the x-axis
                    } else {
                        var label = "";
                    }
                    data.labels.push(label.toString());
                }
            }
        });


        var options = {
            // the title of the graph
            graphTitle: "Temperature during the trip",

            // if you go over the line, you will see each point with its corresponding value in a box
            showTooltips: true,
            annotateDisplay: true,

            // a legend is displayed
            legend: true,

            // the minimum interval of the y-axis
            yAxisMinimumInterval : 1,

            // the label on the x-axis
            xAxisLabel: "Seconds",

            // the x-axis at the bottom is displayed
            xAxisBottom: true,

            // every 15 readings, a vertical grid line is displayed.
            scaleXGridLinesStep: 15,

            // there are no dots on the lines to indicate a reading
            pointDot: false,

            // the y-axis is automatically computed
            scaleOverride: false,

            // the width of the steps on the y-axis. This value is only effective when scaleOverride is set to 'true'
            scaleStepWidth : 1,

            // the start value of the y-axis. This value is only effective when scaleOverride is set to 'true'
            scaleStartValue: 10,

            // The number of steps on the y-axis. This value is only effective when scaleOverride is set to 'true'
            scaleSteps: 20,

            // the unit of the values on the y-axis
            yAxisUnit : "°C",

            // the size of the above unit
            yAxisUnitFontSize: 16,

            // the label displayed on the y-axis
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

        }
        console.log(data.datasets);

        //depending on the sort of graph, the graph gets added to a certain canvas
        if (sort == "temp"){
            var ctx = $("#first_chart").get(0).getContext("2d");

        } else if (sort == "hum") {
            var ctx = $("#second_chart").get(0).getContext("2d");

        } else if (sort == "heart") {
            var ctx = $("#heartbeat_chart").get(0).getContext("2d");

        } else {
            var ctx = $("#speed_chart").get(0).getContext("2d");

        }

        // the height and width of the canvas
        ctx.canvas.width = 1100;
        ctx.canvas.height = 500;

        // the graph is made and added to the canvas 'ctx'
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
            var display_text = Math.round(value/10)/100 + "km";
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
            $("#buttons").slideDown("fast");


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


