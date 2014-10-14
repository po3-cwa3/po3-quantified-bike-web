var bol = bol || {};

/**
 * This file serves as the controller and depends on everything in the js folder
 */

bol.controller = (function() {

    var assets; //all our ajax-loaded assets (templates and json data)

    function init() {


        /* Initialise the calendar using the external dataTable library.
         We use ajax initialisation to load the calendar data asynchronously. */
        $("#calendarTable").dataTable( {
            "ajax": function(data, callback, settings) {

                var today = new Date();

                bol.controller.queryDataForMonth(today, function (data) {

                    callback({data: data});
                });
            },

            /* Some other settings for the table. */
            "paging": false,
            "ordering": false,
            "searching": false,
            "info": false,

            /* This function gets called when the initialisation is complete. */
            "initComplete": function(settings, json) {

                /* We remove the style attribute to make sure the table adjusts itself when the window resizes.
                 The style attribute is added by the dataTables library and contains a width attribute. */
                $('#calendarTable').removeAttr('style');

                /* We loop over all cells to determine which cells hold content. */
                $('#calendarTable td').each(function(index, value) {

                    if ($(this).html() != "") {

                        /* We assign the containsContent class to manage hover effects and stuff like that. */
                        $(this).addClass("containsContent");

                        $(this).click(function() {

                            $('#detailSection').css("display","block").ScrollTo();


                        });
                    }
                });
            }
        });

        /* We add a loadingSpinner div to the only cell the table currently holds.
         This content will be overwritten once the data is loaded. */
        $("#calendarTable td").html('<div class="loadingSpinner"></div>');

    }


//    Query Functions

    function queryDataForMonth(date, callback) {

        $.ajax({
            url: "http://dali.cs.kuleuven.be:8080/qbike/trips?groupID=cwa3",
            jsonp: "callback",
            dataType: "jsonp",

            success: function (json) {

                console.log("We got " + json.length + " elements for cwa3.");

                var data = bol.controller.filterDataForMonth(json, date);

                data = bol.controller.convertDataToCalendarCells(data, date);

                callback(data);
            }
        });
    }


//    Helper Functions

    function filterDataForMonth(data, date) {

        var month = date.getMonth()+1;
        var year = date.getFullYear();
        var nrOfDays = new Date(year, month, 0).getDate();

        console.log(year + " " + month + " " + nrOfDays);

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

        console.log("first day: " + firstDayDate);
        console.log("last day: " + lastDayDate);
        console.log("begin day: " + beginDay);
        console.log("nr of days: " + nrOfDays);
        console.log("end day: " + endDay);
        console.log("nr of rows: " + nrOfRows);

        var averages = bol.controller.getAveragesFromData(data);

        var calendar = new Array();

        for (row = 0; row < nrOfRows; row++) {

            var rowData = new Array();

            for (col = 0; col < 7; col++) {

                var cellData = "";

                var day = row*7 + col - beginDay + 1;

                if (day > 0 && day <= nrOfDays) {

                    var average = averages[day-1];
                    console.log(average);

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

            var avTemp = 0;
            var avTempCount = 0;

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

                            default:
                        }
                    });
                }
            });

            if (avTempCount > 0) {
                avTemp /= avTempCount;
            }

            var average = new Object();
            average.averageTemperature = avTemp;

            averages.push(average);
        });

        return averages;
    }


    return {
        init: init,
        queryDataForMonth: queryDataForMonth,
        filterDataForMonth: filterDataForMonth,
        convertDataToCalendarCells: convertDataToCalendarCells,
        getAveragesFromData: getAveragesFromData
    };

})();

$(document).ready(bol.controller.init);
