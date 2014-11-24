

compareController = (function() {

    var items_to_compare = [];
    var month;
    var data_for_circle = [];
    var km_for_circle = [];
    var data;
    var returnData;
    var temperature = [];

    function init() {

        $("#calendar").datepicker({
            onSelect: function (dateText, datepicker) {

                var elements = dateText.split("/");

                month = elements[0];
                var day = elements[1];

                $("#select_trip").empty();
                queryDataForDay(day);
            }
        });

        $("#trips").click(function(){
            $("#choose-compare-sort").slideUp("fast");
            $("#compare-trips").slideDown("fast");
        });

        $("#days").click(function(){
            $("#choose-compare-sort").slideUp("fast");
            $("#compare-days").slideDown("fast");
        });

        $("#month").click(queryDataForMonth);

        $("#show_month").click(function () {

            month = $('.select_month option:selected').val();
            $("#select_day").empty();
            $("#select_trip").empty();
            display_days(month);
        });

        $("#show_day").click(function () {
            var day = $('.select_day option:selected').val();
            console.log(day);
            console.log("day");
            $("#select_trip").empty();
            queryDataForDay(day);
        });

        $("#show_trip").click(function () {
            var day = $('.select_trip option:selected').val();
            /*$("#title_1").css("display","inline");*/
            console.log(day);
            items_to_compare.push(day);
            if ( document.getElementById("table_compare").rows[0].cells.length == 0){
                $("#elements_to_compare").append("<td width='140px' id='title_1'>id:</td>");
            }
            $("#elements_to_compare").append("<td id='" + day + "'> trip: " +  document.getElementById("table_compare").rows[0].cells.length+ " </td>");
        });

        $("#start_comparing").click(function () {
            console.log(items_to_compare);
            compare_items();

            console.log(items_to_compare);
            $("#select_day").empty();
            $("#select_trip").empty();



        });
    }

    function make_chart(data_trip){
        var fill_choiche = data_trip.length;
        if (fill_choiche < 4){
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
            fillColor: "rgba(220,220,220,"+fill+")",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
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
            console.log(trip);
            data.datasets.push(trip);
            if (value.length > data.labels.length){
                data.labels = [];
                var i ;
                for (i=0; i < value.length; i++ ){
                    data.labels.push(i.toString());
                }
            }
        });


        var options = {
            graphTitle: "Temperature during the trip",
            showTooltips: true,
            annotateDisplay: true,
            legend: true,
            yAxisMinimumInterval : 1,
            /*scaleOverride: true,
            scaleStepWidth : 1,
            scaleStartValue: 10,
            scaleSteps: 20,*/
            yAxisUnit : "°C",
            yAxisUnitFontSize: 16,
            yAxisLabel: "Temperature"

        };

        console.log(data.datasets);
        var ctx = $("#first_chart").get(0).getContext("2d");
        ctx.canvas.width = 1000;
        ctx.canvas.height = 500;
        var myNewChart = new Chart(ctx).Line(data,options);


    }


    function calculate_size_circle(procent,sort,index,value){
        procent = Math.round(procent);
        var radius = 75;
        var angle = procent* 2*Math.PI/100;
        var svg = "<svg id='circle_"+index+sort+"' class='pie'><circle cx='75' cy='75' r='74'></circle><circle class='inner' cx='75' cy='75' r='40'></circle></svg>"
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
            svg.appendChild(newElement_1);
            var x = radius + radius*Math.cos(angle);
            var y = radius + radius*Math.sin(angle);
            var path = "M75,75 L75,150 A75,75 1 0,1 "+Math.round(x)+","+Math.round(y)+" z";
            console.log(path);
            newElement.setAttribute("d",path);
            svg.appendChild(newElement);
        }

        else {
            var x = radius + radius * Math.cos(angle);
            var y = radius + radius * Math.sin(angle);
            var path = "M75,75 L75,0 A75,75 1 0,1 " + Math.round(x) + "," + Math.round(y) + " z";
            console.log(path);
            newElement.setAttribute("d", path);
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
        text2.setAttributeNS(null,"fill","#47a3da");
        text2.setAttributeNS(null,"font-family","'Lato', Calibri, Arial, sans-serif");
        text2.setAttributeNS(null,"text-anchor","middle");
        var textNode = document.createTextNode(procent+"%");
        if (sort == "time"){
            var display_text = ~~(value/3600)+"h"+ Math.round((value%3600)/60)+"m";
        } else {
            var display_text = value + "km";
        }
        var textNode2 = document.createTextNode(display_text);
        console.log(textNode);
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
        console.log("this is total ");
        console.log(total);
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
        console.log("this is total ");
        console.log(total);
        $.each(km_for_circle,function(index,value){
            procent = value/total;
            calculate_size_circle(procent*100,"distance",index,value);
        });
    }


    function queryDataForMonth() {

        dataController.queryTripsForGroupID("cwa3", function (trips) {

            console.log("We got " + trips.length + " elements for cwa3.");
            data = display_months(trips);
        });
    }

    function display_months(data){
        var dates = find_date(data);
        var month = [];
        $.each(dates, function(index, value){
            if ( $.inArray(value[0], month)==-1) {
                month.push(value[0]);
            };

        });
        $.each(month, function(index,value){
            $("#select_month").append("<option id='"+ value +"'>"+ value +"</option>");
        });
    }

    function find_date(data) {

        returnData = [];

        $.each(data, function(index, value) {
            var date = new Date(value.startTime);
            returnData.push([date.getMonth()+1,date.getDate()]);


        });

        return returnData;
    }

    function display_days(month){
        var days = [];
        $.each(returnData, function(index, value){
            if (value[0] == month){
                if ($.inArray(value[1], days)==-1) {
                    console.log("is not in days yet");
                    days.push(value[1]);
                };
           };
        });
        $.each(days, function(index, value){
            $("#select_day").append("<option id='"+value +"'>"+ value +"</option>");
        });
    }

    function queryDataForDay(day){
        //$.ajax({
        //    //url: "http://dali.cs.kuleuven.be:8080/qbike/trips",
        //    url: "http://dali.cs.kuleuven.be:8080/qbike/trips?toDate=2014-"+month+"-"+day+"&groupID=cwa3",
        //    jsonp: "callback",
        //    dataType: "jsonp",
        //
        //    success: function (json) {
        //
        //        console.log("We got " + json.length + " elements for this day ");
        //        $.each(json, function(index, value){
        //            var _id = value._id;
        //            $("#select_trip").append("<option value='"+_id +"'>"+index +"</option>");
        //        });
        //
        //    }
        //});

        dataController.queryTripsForDay(new Date(2014, month-1, day), function (trips) {
            console.log(trips);
            console.log("We got " + trips.length + " elements for this day.");
            $.each(trips, function(index, value){
                var _id = value._id;
                $("#select_trip").append("<option value='"+_id +"'>"+index +"</option>");
            });
        });
    }

    function compare_items(){
        setTimeout(create_circles_time,500);
        setTimeout(create_circles_distance,500);
        $.each(items_to_compare, function (index, value) {
            create_table(value);

        });

        setTimeout(function(){
            make_chart(temperature);
        },500);

    }

    function get_data_for_table(){

    }
    function create_table(id){
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
                $("#table_day").append("<td> "+date.getDate() +" "+ monthNames[date.getMonth()] +"</td>");
                if (json[0].hasOwnProperty("meta.distance")) {
                    var distance = json[0].meta.distance/1000;
                    $("#km").append("<td>" + distance + " km "  + "</td>");
                    km_for_circle.push(distance);
                } else {
                    $("#km").append("<td> not recorded  </td>");
                }

                temperature.push(dataController.getAveragesFromTrips(json).temparature);
                console.log(temperature);

            }
        });


    }
    return {
        init: init,
        queryDataForMonth: queryDataForMonth,
        find_months: find_date,
        display_months: display_months,
        display_days : display_days,
        queryDataForDay : queryDataForDay,
        create_table: create_table,
        make_chart: make_chart,
        calculate_size_circle: calculate_size_circle,
        create_circles_time : create_circles_time,
        compare_items: compare_items,
        create_circles_distance : create_circles_distance,
        get_data_for_table: get_data_for_table

    }
})();

$(document).ready(compareController.init);


