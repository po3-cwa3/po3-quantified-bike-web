var bol = bol || {};

var month = new Date();
var monthData = new Array();

var detailsMap;

var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var propertiesInDetailsView = [
    {prop: "averageTemperature", title: "Average Temperature", postfix: " °C"},
    {prop: "averageHumidity", title: "Average Humidity", postfix: " %"}
];

/**
 * This file serves as the controller and depends on everything in the js folder
 */

bol.controller = (function() {

    var assets; //all our ajax-loaded assets (templates and json data)

    function init() {

        bol.controller.changeMonth(month);

        $("#detailCloseButton").click(function() {

            $('#detailSection').css("display","none");
        });

        $("#prev_month").click(function() {

            bol.controller.changeMonth(-1);

            $("#calendarTable").DataTable().ajax.reload(bol.controller.tableHasBeenRedrawn);
        });

        $("#next_month").click(function () {

            bol.controller.changeMonth(1);

            $("#calendarTable").DataTable().ajax.reload(bol.controller.tableHasBeenRedrawn);
        });


        /* Initialise the calendar using the external dataTable library.
         We use ajax initialisation to load the calendar data asynchronously. */
        $("#calendarTable").dataTable( {

            "ajax": function(data, callback, settings) {

                /* We add a loadingSpinner div to the only cell the table currently holds.
                 This content will be overwritten once the data is loaded. */
                $("#calendarTable tbody").html('<td colspan="7"><div class="loadingSpinner"></div></td>');

                bol.controller.queryDataForMonth(month, function (data) {

                    callback({data: data});
                });
            },

            /* Some other settings for the table. */
            "paging": false,
            "ordering": false,
            "searching": false,
            "info": false,

            /* This function gets called when the initialisation is complete. */
            "initComplete": bol.controller.tableHasBeenRedrawn
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

                monthData = bol.controller.filterDataForMonth(json, date);

                data = bol.controller.convertDataToCalendarCells(monthData, date);

                callback(data);
            }
        });
    }


//    Helper Functions

    function filterDataForMonth(data, date) {

        var month = date.getMonth()+1;
        var year = date.getFullYear();
        var nrOfDays = new Date(year, month, 0).getDate();

        var returnData = new Array();

        for (i = 0; i<nrOfDays; i++) {
            returnData.push(new Array());
        }

        $.each(data, function(index, value) {
            var date = new Date(value.startTime);

            if (date.getMonth()+1 == month) {

                var day = date.getDate()-1;

                returnData[day].push(value);
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

        var averages = bol.controller.getAveragesFromData(data);

        var calendar = new Array();

        for (row = 0; row < nrOfRows; row++) {

            var rowData = new Array();

            for (col = 0; col < 7; col++) {

                var cellData = "";

                var day = row*7 + col - beginDay + 1;

                if (day > 0 && day <= nrOfDays) {

                    var average = averages[day-1];

                    var dayNumberHTML = '<h1 class="dayNumber">' + day + '</h1>';
                    cellData += dayNumberHTML;

                    var avTempHTML = '<div class="avSpeed" style="top:' + (110 - average.averageTemperature) + '"></div>';
                    cellData += avTempHTML;
                }

                rowData.push(cellData);
            }

            calendar.push(rowData);
        }

        return calendar;
    }


    function getAveragesFromData(data) {

        var averages = new Array();

        $.each(data, function (day, trips) {

            var average = bol.controller.getAveragesFromDay(trips);

            averages.push(average);
        });

        return averages;
    }


    function getAveragesFromDay(trips) {

        var avTemp = 0;
        var avTempCount = 0;

        var avHum = 0;
        var avHumCount = 0;

        $.each(trips, function(index, trip) {

            if (trip.hasOwnProperty("sensorData")) {

                $.each(trip.sensorData, function(index, sensorValue) {

                    switch(sensorValue.sensorID) {

                        // Temperature
                        case 3:

                            var temp = parseInt(sensorValue.data[0].value);

                            if (!isNaN(temp)) {

                                avTemp += temp;
                                avTempCount += 1;
                            }

                            break;


                        // Humidity
                        case 4:

                            var hum = parseInt(sensorValue.data[0].value);

                            if (!isNaN(hum)) {

                                avHum += hum;
                                avHumCount += 1;
                            }

                            break;

                        default:
                    }
                });
            }
        });

        if (avTempCount > 0) {
            avTemp /= avTempCount;
            avTemp = Math.round(avTemp *100)/100;
        } else {
            avTemp = "No Readings";
        }

        if (avHumCount > 0) {
            avHum /= avHumCount;
            avHum = Math.round(avHum *100)/100;
        } else {
            avHum = "No Readings";
        }

        var average = new Object();
        average.averageTemperature = avTemp;
        average.averageHumidity = avHum;

        return average;
    }


    function changeMonth(diff) {

        var calendarMonthTitle = "";

        console.log(typeof new Date());

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

            calendarMonthTitle = monthArray[current_month] + ", " + current_year;

        } else if (typeof diff == "object") {

            month = diff;

            calendarMonthTitle = monthArray[month.getMonth()] + ", " + month.getFullYear();
        }

        $("#monthTitleSpan").text(calendarMonthTitle);

        console.log("changed month to: " + month);
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

                    bol.controller.tableCellHasBeenClicked($(this));
                });
            }
        });
    }


    function tableCellHasBeenClicked(cell) {

        var dayIndex = parseInt($(cell).find(".dayNumber").text()) - 1;

        console.log("Loading details for day with index: " + dayIndex);

        $('#detailSection').css("display","block").ScrollTo();

        $("#detailSection .loadingSpinner").css("display", "block");

        bol.controller.queryDetailsForDay(dayIndex);
    }


    function queryDetailsForDay(dayIndex) {

        var trips = monthData[dayIndex];

        console.log("Day " + dayIndex + " contains " + trips.length + " entries.");

        var average = bol.controller.getAveragesFromDay(trips);

        var averagesHTML = "";

        $.each(propertiesInDetailsView, function(index, property) {

            var divHTML = '<div class="averageDiv">';

            divHTML += '<span class="averageDivTitle">' + property.title + '</span>';
            divHTML += '<span class="averageDivValue">' + average[property.prop] + property.postfix + '</span>';

            divHTML += '</div>';

            averagesHTML += divHTML;
        });

        $("#detailsAveragesViewContainer").html(averagesHTML);

        bol.controller.initDetailsMap();

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


    return {
        init: init,
        queryDataForMonth: queryDataForMonth,
        filterDataForMonth: filterDataForMonth,
        convertDataToCalendarCells: convertDataToCalendarCells,
        getAveragesFromData: getAveragesFromData,
        getAveragesFromDay: getAveragesFromDay,
        changeMonth: changeMonth,
        tableHasBeenRedrawn: tableHasBeenRedrawn,
        tableCellHasBeenClicked: tableCellHasBeenClicked,
        queryDetailsForDay: queryDetailsForDay,
        initDetailsMap: initDetailsMap
    };

})();

$(document).ready(bol.controller.init);
