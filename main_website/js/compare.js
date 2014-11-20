

compareController = (function() {

    var items_to_compare = [];
    var month;
    var data_for_circle = [];
    var data;

    function init() {

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
            $("#elements_to_compare").append("<td id='" + day + "'>" + day + " </td>");
        });

        $("#start_comparing").click(function () {
            console.log(items_to_compare);
            $.each(items_to_compare, function (index, value) {
                create_table(value);
            });
            items_to_compare = [];
            $("#select_day").empty();
            $("#select_trip").empty();
            create_circles();
        });

        $("#example").click(function(){
            make_chart();
        });

        calculate_size_circle(59,75);




    }

    function make_chart(){
        console.log("making chart");
        var data = {
            labels: ["0km", "5km", "10km", "15km", "20km", "25km", "30km"],
            datasets: [
                {
                    label: "first trip",
                    title: "first trip",
                    fillColor: "rgba(220,220,220,0.2)",
                    lineColor: "#fff",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [15, 17, 21, 19, 20, 23, 27]
                },
                {
                    label: "second trip ",
                    title: "second trip ",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "#47a3da",
                    lineColor: "#47a3da",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 28, 24, 30, 15, 16, 19]
                }
            ]
        };

        var options = {
            graphTitle: "average speed in km/h",
            showTooltips: true,
            annotateDisplay: true,
            legend: true

        };

        var ctx = $("#first_chart").get(0).getContext("2d");
        var myNewChart = new Chart(ctx).Line(data,options);
    }

    function calculate_size_circle(procent, radius){
        var angle = procent* 2*Math.PI/100;
        var svg = document.getElementById("first_pie");
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
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
            var svg = document.getElementById("first_pie");
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            newElement.setAttribute("d", path);
            svg.appendChild(newElement);

        }
        text.setAttributeNS(null,"x",75);
        text.setAttributeNS(null,"y",90);
        text.setAttributeNS(null,"font-size","40");
        text.setAttributeNS(null,"font-family","Arial");
        text.setAttributeNS(null,"text-anchor","middle");
        var textNode = document.createTextNode(procent);
        text.appendChild(textNode);
        svg.appendChild(text);
    }

    function create_circles(){
        var total = 0;
        $.each(data_for_circle, function(index, value){
            console.log(value);
            total += value;
        });
        console.log("this is total ");
        console.log(total);
        console.log("ok");
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

            console.log("We got " + trips.length + " elements for this day.");
            $.each(trips, function(index, value){
                var _id = value._id;
                $("#select_trip").append("<option value='"+_id +"'>"+index +"</option>");
            });
        });
    }

    function create_table(id){
        $.ajax({
            url: "http://dali.cs.kuleuven.be:8080/qbike/trips/"+id,
            jsonp: "callback",
            dataType: "jsonp",

            success: function (json) {
                date = new Date(json[0].startTime);
                end_date = new Date(json[0].endTime);
                var duration = (end_date.getTime() - date.getTime())/1000;
                console.log(duration);
                if (document.getElementById("table_compare").rows[1].cells.length == 0){
                    $("#table_day").append("<td id='title_2' >start day:  </td>");
                    $("#km").append("<td id='title_3' > total distance:   </td>");
                    $("#duration").append("<td id='title_4' > duration:   </td>");
                }
                $("#table_day").append("<td> "+date.getDate()+" : " + (date.getMonth()+1).toString() +"</td>");
                if (json[0].hasOwnProperty("meta.distance")) {
                    $("#km").append("<td>" + json[0].meta.distance/1000 + " km "  + "</td>");
                } else {
                    $("#km").append("<td> not recorded  </td>");
                }
                $("#duration").append("<td> hours: " + ~~(duration/3600)+ "minutes: "+ duration%3600+ "</td>" );
                data_for_circle.push(duration);
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
        create_circles : create_circles

    }
})();

$(document).ready(compareController.init);