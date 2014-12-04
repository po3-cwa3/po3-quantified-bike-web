

calendarController = (function() {

    // Class Variables
    var selectedCell;

    var month = new Date();
    var monthData = [];
    var maxAverage = {};

    var barOption;

    var detailsMap;

    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var propertiesInDetailsView = [
        {prop: "nrOfTrips", title: "Nr. of trips", postfix: " trip(s)", accuracy: 0},
        {prop: "averageSpeed", title: "Average Speed", postfix: " km/h", accuracy: 2},
        {prop: "totalDistance", title: "Total Distance", postfix: " m", accuracy: 2},
        {prop: "totalTime", title: "Total Biking Time", postfix: ""},
        {prop: "averageTemperature", title: "Average Temperature", postfix: " °C", accuracy: 0},
        {prop: "averageHumidity", title: "Average Humidity", postfix: " %", accuracy: 0}
    ];

    var noReadingsMessage = "No Readings";


    // Initialisation

    function init() {

        // Change the month to the current month
        changeMonth(month);


        // Loop through the properties and add them to the selection popup
        $.each(propertiesInDetailsView, function(index, object) {

            $("#calendarBarSelect").append('<option prop="' + object.prop + '">' + object.title + '</option>');
        });

        // Begin with the first option
        var beginOption = propertiesInDetailsView[0];
        changeSelectedBarOption(beginOption.title, beginOption.prop);

        // Adjust the option when the calendar option selection changed
        $("#calendarBarSelect").change(function() {

            var selectedOption = $('#calendarBarSelect').find(":selected");

            console.log("Changed selected calendar bar option to " + selectedOption.text());

            changeSelectedBarOption(selectedOption.text(), selectedOption.attr("prop"));
        });


        // Add the click function for the detail view close button
        $("#detailCloseButton").click(function() {

            // Deselect the currently selected cell
            selectedCell.removeClass("activeCell");
            selectedCell = null;

            // Slide up the detail section
            $('#detailSection').slideUp("fast");
        });

        // Add the click function for the previous month button
        $("#prev_month").click(function() {

            // Change the month using a difference instead of a date
            changeMonth(-1);

            // Reload the calendar table
            reloadTable();
        });

        // Add the click function for the next month button
        $("#next_month").click(function () {

            // Change the month using a difference instead of a date
            changeMonth(1);

            // Reload the calendar table
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

                    // The returned object must have its data in the data key
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

    // This method is used to fetch the data, formatted as HTML cells for the table
    function queryDataForMonth(date, callback) {

        // We reset the maximum average
        maxAverage = 0;

        // We query the data for the given month using the dataController
        dataController.queryDataForMonth(date, function (data) {

            // We log the data for debugging
            console.log("Month data: ");
            console.log(data);

            // We set the new data as the current monthData
            monthData = data;

            // We loop through the data to set the maxAverage for this month
            $.each(monthData, function(index, dayData) {

                if (maxAverage == 0) {

                    // If the maxAverage is not set yet, it's the first loop iteration and we
                    // can just set the maxAverage using the current average
                    // We do have to take a copy of the dayData average, otherwise the changes to
                    // maxAverage will result in changes to the dayData average and the first day
                    // will have the maxAverage values
                    console.log("maxData is still empty, assigning first average");
                    maxAverage = Object.create(dayData.average);

                } else {

                    // Otherwise we loop through the properties to see whether they exceed the current maximum
                    $.each(propertiesInDetailsView, function(index, property) {

                        if (dayData.average[property.prop] > maxAverage[property.prop] || maxAverage[property.prop] == noReadingsMessage) {

                            maxAverage[property.prop] = dayData.average[property.prop];
                        }
                    });
                }
            });

            // Log the calculated maxAverage for debugging
            console.log("maxAverage:");
            console.log(maxAverage);

            // Then we convert the monthData to HTML data for the table
            var tableData = convertDataToCalendarCells(monthData, date);

            callback(tableData);
        });
    }


//    Helper Functions


    // This method is used to convert a table of day data objects to a table of HTML cells
    function convertDataToCalendarCells(data, date) {

        // We get this months first and last date
        var firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDayDate = new Date(date.getFullYear(), date.getMonth()+1, 0);

        // We calculate some values from these dates
        var beginDay = firstDayDate.getDay()-1;
        var nrOfDays = lastDayDate.getDate();
        var endDay = beginDay + nrOfDays - 1;
        var nrOfRows = Math.ceil(endDay/7.0);

        // We create an empty array in which to put the table data
        var calendar = [];

        // For everery row ...
        for (row = 0; row < nrOfRows; row++) {

            // ... we create a row array
            var rowData = [];

            // For every column in this row ...
            for (col = 0; col < 7; col++) {

                // ... we create the cells HTML
                var cellData = "";

                // We calculate the day to display in the cell
                var day = row*7 + col - beginDay + 1;

                // If the day is a day of the month, we can add HTML
                if (day > 0 && day <= nrOfDays) {

                    // We set the average object for this day
                    var average = data[day-1].average;

                    // We see whether there are trips present on this day
                    var tripsPresent = average.nrOfTrips > 0;

                    // We add the dayNumber HTML, if no trips are present we also add the noTripsPresent class
                    var dayNumberHTML = '<h1 class="dayNumber ' + (tripsPresent ? '' : 'noTripsPresent' ) + '">' + day + '</h1>';
                    cellData += dayNumberHTML;

                    // We add the average value HTML and set the distance from the top of the cell
                    var topDistance = 110 - 70 * (average[barOption] / maxAverage[barOption]);
                    var avTempHTML = '<div class="avSpeed" style="top:' + topDistance + '"></div>';
                    cellData += avTempHTML;
                }

                // We add the cell HTML to the current row
                rowData.push(cellData);
            }

            // We add the current row to the table
            calendar.push(rowData);
        }

        return calendar;
    }


    // This method is used to change the month and adjust the calendars header
    // diff can be either an int, representing a difference
    //      ex: -1 -> previous month, +1 -> next month
    // or it can be a date, from which the month is used
    function changeMonth(diff) {

        // Close the detail pane
        $('#detailSection').slideUp("fast");

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

        // if this is the current month, disable the next month button (otherwise you could look into the future)
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
        var calendarMonthTitle = monthArray[month.getMonth()] + ", " + month.getFullYear();

        $("#monthTitleSpan").text(calendarMonthTitle);

        // Log the change for debugging
        console.log("changed month to: " + month);
    }


    function changeSelectedBarOption(option, key) {

        // Change the selection of the calendar option selector to the given property
        $('#calendarBarSelect').val(option);

        // Adjust the current barOption variable
        barOption = key;

        // For every cell in the table ...
        $('#calendarTable td').each(function() {

            // ... get the dayNumber and calculate the dayIndex as dayNumber - 1
            var dayIndex = parseInt($(this).find(".dayNumber").text()) - 1;

            // If the dayIndex exists
            if (!isNaN(dayIndex)) {

                // Get the required value from the day average
                var avValue = monthData[dayIndex].average[barOption];

                // If the value does not exist, or it's not a number, set the value to 0
                if (isNaN(avValue) || typeof avValue != "number") {

                    avValue = 0;
                }

                // Calculate the top distance using the maxAverage
                var topDistance = 110 - 70 * (avValue / maxAverage[barOption]);

                // Adjust the bar in the cell
                $(this).find(".avSpeed").css("top", topDistance);

            }
        });
    }


    // This method is called after the table has been redrawn
    function tableHasBeenRedrawn() {

        /* We remove the style attribute to make sure the table adjusts itself when the window resizes.
         The style attribute is added by the dataTables library and contains a width attribute. */
        $('#calendarTable').removeAttr('style');

        /* We loop over all cells to determine which cells hold content. */
        $('#calendarTable td').each(function(index, value) {

            // If the cell is not empty
            if ($(this).html() != "") {

                /* We assign the containsContent class to manage hover effects and stuff like that. */
                $(this).addClass("containsContent");

                /* We add a click funtion to the table cell. */
                $(this).click(function() {

                    tableCellHasBeenClicked($(this));
                });
            }
        });
    }


    // This method is called when a table cell has been clicked
    function tableCellHasBeenClicked(cell) {

        // If there already was a selected cell, deselect it
        if (selectedCell != null) {
            selectedCell.removeClass("activeCell");
        }

        // Change the selected cell to the clicked cell
        selectedCell = cell;

        // Change the cell to selected state
        $(selectedCell).addClass("activeCell");

        // Find the dayNumber and calculate the dayIndex as dayNumber - 1
        var dayIndex = parseInt($(selectedCell).find(".dayNumber").text()) - 1;

        // Log the dayIndex for debugging
        console.log("Loading details for day with index: " + dayIndex);

        // Get the detail section
        var detailSection = $('#detailSection');

        // Slide it down and scroll to it when the animation is done
        detailSection.slideDown("fast", function() {
            detailSection.ScrollTo();
        });

        // Show the loadingSpinner in the detail section,
        // it will be removed once the data has been loaded
        $("#detailSection .loadingSpinner").css("display", "block");

        // Query the details for this day,
        // the required data is already in memory and does not need to be fetched from the server
        queryDetailsForDay(dayIndex);
    }


    // This method is called when the detail section needs to be adjusted to the selected cell
    function queryDetailsForDay(dayIndex) {

        // Set the title of the detail section to the the selected day
        var dayH1 = monthArray[month.getMonth()] + " " + (dayIndex + 1);
        $("#detailsDayH1").text(dayH1);

        // Get the average from the monthData array
        var average = monthData[dayIndex].average;

        // Create the HTML for in the detail sections left part,
        // this is the part that shows the statistics
        var averagesHTML = "";

        // For every property ...
        $.each(propertiesInDetailsView, function(index, property) {

            // ... Create a div that holds the properties title and value
            var divHTML = '<div class="averageDiv">';

            // Add the title
            divHTML += '<span class="averageDivTitle">' + property.title + '</span>';

            // Add the div that holds the value
            divHTML += '<span class="averageDivValue">';

            var roundedValue;

            // If the property is numeric, round it using the accuracy from the properties array
            // If the property is a string, just use the string
            if (property.prop != "totalTime") {

                roundedValue = round(average[property.prop], property.accuracy);

            } else {

                roundedValue = average[property.prop] / 1000.0;
            }

            // Add the value
            divHTML += roundedValue;

            // If there is a reading present, add the postfix from the properties array
            if (roundedValue != noReadingsMessage) {
                divHTML += property.postfix;
            }

            // Close the value span
            divHTML += '</span>';

            // Close the container div
            divHTML += '</div>';

            // Add the properties HTML to the averages HTML
            averagesHTML += divHTML;
        });

        // Set the HTML
        $("#detailsAveragesViewContainer").html(averagesHTML);



        // Initialise the map: default center are the coordinates of the computer sciences building.
        var startCo = {lat: 50.864, lng: 4.679};

        // Iterate over all routes.
        $.each(average.routes,function(index,route){

            // If a route is not empty (it could be empty by a bug or the GPS not working), take the first coordinate and use that as the center of the map
            if(route.length != 0){

                startCo = route[0];

                // A new Center for the map has been found, so the loop can be exited.
                return false;
            }
        });

        initDetailsMap(startCo);

        // Loop through the routes and draw them on the map
        $.each(average.routes, function(index, route) {
            drawTrip(route,index).setMap(detailsMap);

        });

        // Everything is loaded, so remove the loading spinner
        $("#detailSection .loadingSpinner").css("display", "none");
    }


    // This method is used to initialise the details map
    function initDetailsMap(startCo) {

        // Some options for the map
        var detailsMapOptions = {
            zoom: 17,
            center: startCo,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Initialise the map on the detailsMapCanvas and assign it to the detailsMap variable
        detailsMap = new google.maps.Map(document.getElementById("detailsMapCanvas"),
            detailsMapOptions);
    }


    // This method is used to calculate the average value from an array of values
    // When there are no values present null is returned
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


    // This method is used to round a number to a given accuracy
    // If the given number is not a number, the noReadingsMessage is returned
    function round(number, accuracy) {

        if (typeof number == "number") {

            var rounder = Math.pow(10, accuracy);

            return Math.round(number * rounder) / rounder;
        }

        return noReadingsMessage;
    }


    // This method is called to reload the table
    function reloadTable() {

        $("#calendarTable").DataTable().ajax.reload(tableHasBeenRedrawn);
    }


    // This method is used to make a Google line object to be used as the trip,
    // it needs to be followed by .setMap(detailsMap) to actually draw it on the map
    function drawTrip(tripCoordinates,color) {

        // Get the last digit to determine the color of the line
        var digit = color - Math.floor(color/10)*10

        // Create a Google Maps line
        var tripPath = new google.maps.Polyline({
            path: tripCoordinates,
            geodesic: false,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 5
        });

        // Set the calculated color
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