

compareController = (function() {

    var items_to_compare = [];
    var month;

    function init() {

        $("#month").click(queryDataForMonth);

        $("#show_month").click(function () {

            month = $('.select_month option:selected').val();

            display_days(month);
        });

        $("#show_day").click(function () {
            var day = $('.select_day option:selected').val();
            console.log(day);
            console.log("day");
            queryDataForDay(day);
        });

        $("#show_trip").click(function () {
            var day = $('.select_trip option:selected').val();
            console.log(day);
            items_to_compare.push(day);
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
        });
    }

    function queryDataForMonth() {

        //$.ajax({
        //    //url: "http://dali.cs.kuleuven.be:8080/qbike/trips",
        //    url: "http://dali.cs.kuleuven.be:8080/qbike/trips?groupID=cwa3",
        //    jsonp: "callback",
        //    dataType: "jsonp",
        //
        //    success: function (json) {
        //
        //        console.log("We got " + json.length + " elements for cwa3.");
        //        data = display_months(json);
        //        //monthData = calendarController.filterDataForMonth(json, date);
        //        //calendarController.calculateMonthAverages();
        //        //data = calendarController.convertDataToCalendarCells(monthData, date);
        //    }
        //});

        dataController.queryTripsForGroupID("cwa3", function (trips) {

            console.log("We got " + trips.length + " elements for cwa3.");
            data = display_months(trips);
            //monthData = calendarController.filterDataForMonth(json, date);
            //calendarController.calculateMonthAverages();
            //data = calendarController.convertDataToCalendarCells(monthData, date);
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
                end_date = new Date(json[0].endTime)
                $("#table_day").append("<td> Date: "+date.getDate()+" : " + date.getMonth()+"</td>");
                $("#km").append("<td> end date:  "+end_date.getDate()+" : " + end_date.getMonth()+"</td>");
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
        create_table: create_table
    }
})();

$(document).ready(compareController.init);