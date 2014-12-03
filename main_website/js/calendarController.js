

calendarController = (function() {

    // Class Variables
    var selectedCell;

    var month = new Date();
    var monthData = new Array();

    var barOption;

    var detailsMap;

    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var propertiesInDetailsView = [
        {prop: "nrOfTrips", title: "Nr. of trips", postfix: " trip(s)", accuracy: 0},
        {prop: "averageSpeed", title: "Average Speed", postfix: " km/h", accuracy: 2},
        {prop: "totalDistance", title: "Total Distance", postfix: " m", accuracy: 2},
        {prop: "totalTime", title: "Total Biking Time", postfix: "", type: "string"},
        {prop: "averageTemperature", title: "Average Temperature", postfix: " °C", accuracy: 0},
        {prop: "averageHumidity", title: "Average Humidity", postfix: " %", accuracy: 0}
    ];

    var noReadingsMessage = "No Readings";


    // Initialisation

    function init() {

        changeMonth(month);


        $.each(propertiesInDetailsView, function(index, object) {

            $("#calendarBarSelect").append('<option prop="' + object.prop + '">' + object.title + '</option>');
        });

        var beginOption = propertiesInDetailsView[0];
        changeSelectedBarOption(beginOption.title, beginOption.prop);

        $("#calendarBarSelect").change(function() {

            var selectedOption = $('#calendarBarSelect').find(":selected");

            console.log("Changed selected calendar bar option to " + selectedOption.text());

            changeSelectedBarOption(selectedOption.text(), selectedOption.attr("prop"));
        });


        $("#detailCloseButton").click(function() {

            selectedCell.removeClass("activeCell");
            selectedCell = null;

            $('#detailSection').slideUp("fast");
        });

        $("#prev_month").click(function() {

            changeMonth(-1);

            reloadTable();
        });

        $("#next_month").click(function () {

            changeMonth(1);

            reloadTable();
        });


        /* Initialise the calendar using the external dataTable library.
         We use ajax initialisation to load the calendar data asynchronously. */
        $("#calendarTable").dataTable( {

            "ajax": function(data, callback, settings) {

                /* We add a loadingSpinner div to the only cell the table currently holds.
                 This content will be overwritten once the data is loaded. */
                $("#calendarTable tbody").html('<td colspan="7"><div class="loadingSpinner"></div></td>');

                queryDataForMonth(month, function (data) {

                    callback({data: data});
                });
            },

            /* Some other settings for the table. */
            "paging": false,
            "ordering": false,
            "searching": false,
            "info": false,

            /* This function gets called when the initialisation is complete. */
            "initComplete": tableHasBeenRedrawn
        });

    }


//    Query Functions

    function queryDataForMonth(date, callback) {

        dataController.queryDataForMonth(date, function (data) {

            console.log("Month data: ");
            console.log(data);

            monthData = data;

            var tableData = convertDataToCalendarCells(monthData, date);

            callback(tableData);
        });
    }


//    Helper Functions


    function convertDataToCalendarCells(data, date) {

        var firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDayDate = new Date(date.getFullYear(), date.getMonth()+1, 0);

        var beginDay = firstDayDate.getDay()-1;
        var nrOfDays = lastDayDate.getDate();
        var endDay = beginDay + nrOfDays - 1;
        var nrOfRows = Math.ceil(endDay/7.0);

        var calendar = new Array();

        for (row = 0; row < nrOfRows; row++) {

            var rowData = new Array();

            for (col = 0; col < 7; col++) {

                var cellData = "";

                var day = row*7 + col - beginDay + 1;

                if (day > 0 && day <= nrOfDays) {

                    var average = data[day-1].average;

                    var tripsPresent = average.nrOfTrips > 0;

                    var dayNumberHTML = '<h1 class="dayNumber ' + (tripsPresent ? '' : 'noTripsPresent' ) + '">' + day + '</h1>';
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

            dayData.average = dataController.getAveragesFromTrips(dayData.trips);
        });
    }


    function changeMonth(diff) {

        // Slide the detail pane up
        $('#detailSection').slideUp("fast");

        var calendarMonthTitle = "";

        // if diff is a number, it represents a difference (-1 or +1).
        // meaning previous month or next month
        if (typeof diff == "number") {

            // get the current year and month
            var current_year = month.getFullYear();
            var current_month = month.getMonth();

            // we add up the difference
            current_month += diff;

            // if the current month is beyond 0..11 bounds, adjust the year accordingly
            if (current_month < 0) {
                current_month = 11;
                current_year -= 1;
            } else if (current_month > 11) {
                current_month = 0;
                current_year += 1;
            }

            // make a date object from the calculated properties and set the class variable
            month = new Date(current_year, current_month, 1);

        } else if (typeof diff == "object") {

            month = diff;
        }

        // if this is the current month, disable the next month button
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

        // change the calendar month title
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

                    tableCellHasBeenClicked($(this));
                });
            }
        });
    }


    function tableCellHasBeenClicked(cell) {

        if (selectedCell != null) {
            selectedCell.removeClass("activeCell");
        }

        selectedCell = cell;

        $(selectedCell).addClass("activeCell");

        var dayIndex = parseInt($(selectedCell).find(".dayNumber").text()) - 1;

        console.log("Loading details for day with index: " + dayIndex);

        var detailSection = $('#detailSection')

        detailSection.slideDown("fast", function() {
            detailSection.ScrollTo();
        });

        $("#detailSection .loadingSpinner").css("display", "block");

        queryDetailsForDay(dayIndex);
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

            var roundedValue;

            if (property.type != "string") {

                roundedValue = round(average[property.prop], property.accuracy);

            } else {

                roundedValue = average[property.prop];
            }

            divHTML += roundedValue;

            if (roundedValue != noReadingsMessage) {
                divHTML += property.postfix;
            }

            divHTML += '</span>';

            divHTML += '</div>';

            averagesHTML += divHTML;
        });

        $("#detailsAveragesViewContainer").html(averagesHTML);

        initDetailsMap();


        $.each(average.routes, function(index, route) {
            drawTrip(route,index).setMap(detailsMap);

        });

        $("#detailSection .loadingSpinner").css("display", "none");
    }


    function initDetailsMap() {

        var detailsMapOptions = {
            zoom: 18,
            center: {lat: 50.864, lng: 4.679},
            mapTypeId: google.maps.MapTypeId.ROADMAP
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

        $("#calendarTable").DataTable().ajax.reload(tableHasBeenRedrawn);
    }

    function drawTrip(tripCoordinates,color) {

        var digit = color - Math.floor(color/10)*10

        tripPath = new google.maps.Polyline({
            path: tripCoordinates,
            geodesic: false,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 5
        });

        if (digit == 0||digit == 5) {
            tripPath.strokeColor = '#FF0000'
        } else if (digit == 1||digit == 6) {
            tripPath.strokeColor = '#00FF00'
        } else if (digit == 2||digit == 7) {
            tripPath.strokeColor = '#FFFF00'
        } else if (digit == 3||digit == 8) {
            tripPath.strokeColor = '#00EFFF'
        } else{
            tripPath.strokeColor = '#0000FF'
        }


        return tripPath;
    }


    return {
        init: init,

        queryDataForMonth: queryDataForMonth,

        calculateMonthAverages: calculateMonthAverages,

        convertDataToCalendarCells: convertDataToCalendarCells,

        changeMonth: changeMonth,
        changeSelectedBarOption: changeSelectedBarOption,

        reloadTable: reloadTable,
        tableHasBeenRedrawn: tableHasBeenRedrawn,
        tableCellHasBeenClicked: tableCellHasBeenClicked,

        queryDetailsForDay: queryDetailsForDay,
        initDetailsMap: initDetailsMap,

        arrayAverage: arrayAverage,
        round: round,

        drawTrip: drawTrip
    };

})();

$(document).ready(calendarController.init);