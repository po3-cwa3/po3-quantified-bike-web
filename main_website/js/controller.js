var month = new Date();
var monthData = new Array();

var barOption;

var detailsMap;

var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var propertiesInDetailsView = [
    {prop: "averageSpeed", title: "Average Speed", postfix: " km/h", accuracy: 2},
    {prop: "totalDistance", title: "Total Distance", postfix: " km", accuracy: 2},
    {prop: "averageTemperature", title: "Average Temperature", postfix: " °C", accuracy: 0},
    {prop: "averageHumidity", title: "Average Humidity", postfix: " %", accuracy: 0}
];

var noReadingsMessage = "No Readings";



dataController = (function() {

    
    function init() {

        dataController.changeMonth(month);


        $.each(propertiesInDetailsView, function(index, object) {

            $("#calendarBarSelect").append('<option prop="' + object.prop + '">' + object.title + '</option>');
        });

        var beginOption = propertiesInDetailsView[2];
        dataController.changeSelectedBarOption(beginOption.title, beginOption.prop);

        $("#calendarBarSelect").change(function() {

            var selectedOption = $('#calendarBarSelect').find(":selected");

            console.log("Changed selected calendar bar option to " + selectedOption.text());

            dataController.changeSelectedBarOption(selectedOption.text(), selectedOption.attr("prop"));

            //dataController.reloadTable();
        });


        $("#detailCloseButton").click(function() {

            $('#detailSection').css("display","none");
        });

        $("#prev_month").click(function() {

            dataController.changeMonth(-1);

            dataController.reloadTable();
        });

        $("#next_month").click(function () {

            dataController.changeMonth(1);

            dataController.reloadTable();
        });


        /* Initialise the calendar using the external dataTable library.
         We use ajax initialisation to load the calendar data asynchronously. */
        $("#calendarTable").dataTable( {

            "ajax": function(data, callback, settings) {

                /* We add a loadingSpinner div to the only cell the table currently holds.
                 This content will be overwritten once the data is loaded. */
                $("#calendarTable tbody").html('<td colspan="7"><div class="loadingSpinner"></div></td>');

                dataController.queryDataForMonth(month, function (data) {

                    callback({data: data});
                });
            },

            /* Some other settings for the table. */
            "paging": false,
            "ordering": false,
            "searching": false,
            "info": false,

            /* This function gets called when the initialisation is complete. */
            "initComplete": dataController.tableHasBeenRedrawn
        });

    }


//    Query Functions

    function queryDataForMonth(date, callback) {

        $.ajax({
            url: "http://dali.cs.kuleuven.be:8080/qbike/trips?groupID=cwa3",
            jsonp: "callback",
            dataType: "jsonp",

            success: function (json) {

                console.log("We got " + json.length + " elements for cwa3.");

                monthData = dataController.filterDataForMonth(json, date);
                dataController.calculateMonthAverages();

                data = dataController.convertDataToCalendarCells(monthData, date);

                callback(data);
            }
        });
    }


//    Helper Functions

    function filterDataForMonth(data, date) {

        var month = date.getMonth()+1;
        var year = date.getFullYear();
        var nrOfDays = new Date(year, month, 0).getDate();

        var returnData = [];

        for (i = 0; i<nrOfDays; i++) {
            returnData.push({trips: []});
        }

        $.each(data, function(index, value) {
            var date = new Date(value.startTime);

            if (date.getMonth()+1 == month) {

                var day = date.getDate()-1;

                returnData[day].trips.push(value);
            }

        });

        return returnData;
    }


    function convertDataToCalendarCells(data, date) {

        var firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDayDate = new Date(date.getFullYear(), date.getMonth()+1, 0);

        var beginDay = firstDayDate.getDay()-1;
        var nrOfDays = lastDayDate.getDate();
        var endDay = beginDay + nrOfDays - 1;
        var nrOfRows = Math.ceil(endDay/7.0);

//        console.log("first day: " + firstDayDate);
//        console.log("last day: " + lastDayDate);
//        console.log("begin day: " + beginDay);
//        console.log("nr of days: " + nrOfDays);
//        console.log("end day: " + endDay);
//        console.log("nr of rows: " + nrOfRows);


        var calendar = new Array();

        for (row = 0; row < nrOfRows; row++) {

            var rowData = new Array();

            for (col = 0; col < 7; col++) {

                var cellData = "";

                var day = row*7 + col - beginDay + 1;

                if (day > 0 && day <= nrOfDays) {

                    var average = monthData[day-1].average;

                    var dayNumberHTML = '<h1 class="dayNumber">' + day + '</h1>';
                    cellData += dayNumberHTML;

                    var avTempHTML = '<div class="avSpeed" style="top:' + (110 - average[barOption]) + '"></div>';
                    cellData += avTempHTML;
                }

                rowData.push(cellData);
            }

            calendar.push(rowData);
        }

        return calendar;
    }


    function calculateMonthAverages() {

        $.each(monthData, function(day, dayData) {

            dayData.average = dataController.getAveragesFromDay(dayData.trips);
        });
    }


    function getAveragesFromDay(trips) {

        //var totalDist = 0;

        var tempReadings = [];

        var humReadings = [];

        $.each(trips, function(index, trip) {

            if (trip.hasOwnProperty("sensorData")) {

                $.each(trip.sensorData, function(index, sensorValue) {

                    switch(sensorValue.sensorID) {

                        // Temperature
                        case 3:

                            var temp = parseInt(sensorValue.data[0].value);

                            if (!isNaN(temp)) {

                                tempReadings.push(temp);
                            }

                            break;


                        // Humidity
                        case 4:

                            var hum = parseInt(sensorValue.data[0].value);

                            if (!isNaN(hum)) {

                                humReadings.push(hum);
                            }

                            break;

                        default:
                    }
                });
            }

//            if (trip.hasOwnProperty("meta")) {
//
//                $.each(trip.meta, function(key, metaValue) {
//
//                    switch(key) {
//
//                        case "distance":
//
//                                totalDist += parseInt(metaValue);
//
//                            break;
//
//                        case "averageSpeed":
//
//
//
//                            break;
//                    }
//                });
//            }
        });

        var avTemp = arrayAverage(tempReadings);

        var avHum = arrayAverage(humReadings)

        var average = new Object();
        average.averageTemperature = avTemp;
        average.averageHumidity = avHum;

        return average;
    }


    function changeMonth(diff) {

        var calendarMonthTitle = "";

        if (typeof diff == "number") {

            var current_year = month.getFullYear();
            var current_month = month.getMonth();

            current_month += diff;

            if (current_month < 0) {
                current_month = 11;
                current_year -= 1;
            } else if (current_month > 11) {
                current_month = 0;
                current_year += 1;
            }

            month = new Date(current_year, current_month, 1);

        } else if (typeof diff == "object") {

            month = diff;
        }

        if (month.getMonth() == new Date().getMonth()) {

            $('#next_month').css({
                opacity: 0.7,
                "pointer-events": "none"
            });

        } else {

            $('#next_month').css({
                opacity: 1,
                "pointer-events": "auto"
            });
        }

        calendarMonthTitle = monthArray[month.getMonth()] + ", " + month.getFullYear();

        $("#monthTitleSpan").text(calendarMonthTitle);

        console.log("changed month to: " + month);
    }


    function changeSelectedBarOption(option, key) {

        $('#calendarBarSelect').val(option);

        barOption = key;

        $('#calendarTable td').each(function() {

            var dayIndex = parseInt($(this).find(".dayNumber").text()) - 1;

            if (!isNaN(dayIndex)) {

                var avValue = monthData[dayIndex].average[barOption];

                if (isNaN(avValue) || typeof avValue != "number") {

                    avValue = 0;
                }

                $(this).find(".avSpeed").css("top", 110 - avValue);

            }
        });
    }


    function tableHasBeenRedrawn() {

        /* We remove the style attribute to make sure the table adjusts itself when the window resizes.
         The style attribute is added by the dataTables library and contains a width attribute. */
        $('#calendarTable').removeAttr('style');

        /* We loop over all cells to determine which cells hold content. */
        $('#calendarTable td').each(function(index, value) {

            if ($(this).html() != "") {

                /* We assign the containsContent class to manage hover effects and stuff like that. */
                $(this).addClass("containsContent");

                /* We add a click funtion to every table cell. */
                $(this).click(function() {

                    dataController.tableCellHasBeenClicked($(this));
                });
            }
        });
    }


    function tableCellHasBeenClicked(cell) {

        var dayIndex = parseInt($(cell).find(".dayNumber").text()) - 1;

        console.log("Loading details for day with index: " + dayIndex);

        $('#detailSection').css("display","block").ScrollTo();

        $("#detailSection .loadingSpinner").css("display", "block");

        dataController.queryDetailsForDay(dayIndex);
    }


    function queryDetailsForDay(dayIndex) {

        var dayH1 = monthArray[month.getMonth()] + " " + (dayIndex + 1);
        $("#detailsDayH1").text(dayH1);

        var average = monthData[dayIndex].average;

        var averagesHTML = "";

        $.each(propertiesInDetailsView, function(index, property) {

            var divHTML = '<div class="averageDiv">';

            divHTML += '<span class="averageDivTitle">' + property.title + '</span>';

            divHTML += '<span class="averageDivValue">';

            var roundedValue = round(average[property.prop], property.accuracy);
            divHTML += roundedValue;

            if (roundedValue != noReadingsMessage) {
                divHTML += property.postfix
            }

            divHTML += '</span>'

            divHTML += '</div>';

            averagesHTML += divHTML;
        });

        $("#detailsAveragesViewContainer").html(averagesHTML);

        dataController.initDetailsMap();

        $("#detailSection .loadingSpinner").css("display", "none");
    }


    function initDetailsMap() {

        var detailsMapOptions = {
            zoom: 18,
            center: {lat: 50.864, lng: 4.679},
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        detailsMap = new google.maps.Map(document.getElementById("detailsMapCanvas"),
            detailsMapOptions);
    }


    function arrayAverage(array) {

        if (array.length == 0) {
            return null;
        }

        var total = 0.0;

        $.each(array, function(index, element) {

            total += element;
        });

        return total/array.length;
    }


    function round(number, accuracy) {

        if (typeof number == "number") {

            var rounder = Math.pow(10, accuracy);

            return Math.round(number * rounder) / rounder;
        }

        return noReadingsMessage;
    }


    function reloadTable() {

        $("#calendarTable").DataTable().ajax.reload(dataController.tableHasBeenRedrawn);
    }


    return {
        init: init,

        queryDataForMonth: queryDataForMonth,
        filterDataForMonth: filterDataForMonth,

        calculateMonthAverages: calculateMonthAverages,
        getAveragesFromDay: getAveragesFromDay,

        convertDataToCalendarCells: convertDataToCalendarCells,

        changeMonth: changeMonth,
        changeSelectedBarOption: changeSelectedBarOption,

        reloadTable: reloadTable,
        tableHasBeenRedrawn: tableHasBeenRedrawn,
        tableCellHasBeenClicked: tableCellHasBeenClicked,

        queryDetailsForDay: queryDetailsForDay,
        initDetailsMap: initDetailsMap,

        arrayAverage: arrayAverage,
        round: round
    };

})();

$(document).ready(dataController.init);
