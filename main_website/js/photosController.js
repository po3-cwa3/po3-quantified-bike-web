
// A variable for all the loaded markers (red indicator on google maps)
var markers = [];

// A variable for all the info windows (picture with text and link)
var infoWindows = [];

// A variable to determine which markers are already on or off the map
var markersOnMap = {};

// A variable to remember for which months the data has already been queried
var completedMonths = [];

// A variable to remember which info window is open
var openedInfoWindow = 0;

mapController = ( function () {

    // variables with the current date
    var year = new Date().getFullYear();
    var month = new Date().getMonth()+1;
    var day = new Date().getDate();

    var month_data;
    var month_data_fetched = false;

    // Initialization
    function init() {

        // Query all trips with pictures in the current month
            dataController.queryPictureDataForMonth(month, function(data) {

            month_data = data;
            month_data_fetched = true;

            var myData = [];

            // If the day is not empty, add it to the array to add the pictures
            $.each(month_data, function(index, day_data){

                if (day_data.trips.length != 0){

                    myData = myData.concat(day_data.trips)
                }

            });

            // Convert the data into a usable array and filter out unusable data
            combinePicturesAndCo(myData);

            // Add the current month and year to the array so it does not have to be queried again (in the format of a 5 or 6 digit number)
            completedMonths.push(month*10000+year);

            console.log("Completed months:");
            console.log(completedMonths);

            // Remove the loading icon
            $("#spinnerContainer").css("display", "none");

            $("#calendar").datepicker("refresh");
        });

        // functions of the calendar
        $("#calendar").datepicker({

            // Select a date on the calendar
            onSelect: function (dateText, datepicker) {

                // retrieve the day month and year of selected date
                var elements = dateText.split("/");

                var day = elements[1];
                var month = elements[0];
                var year = elements[2];

                // add markers of the selected date if there are none and remove markers if they are already present
                addOrRemovePictures(day, month, year);
            },

            // Change the month of the calendar
            onChangeMonthYear: function (newYear, newMonth, datepicker) {

                console.log("Datepicker changed month to " + newMonth + " and year " + newYear);

                // Create a variable to check if the month has already been queried
                var monthYearCheck = newMonth*10000+year;

                if (completedMonths.indexOf(monthYearCheck) == -1) {

                    // Bring up the loading icon
                    $("#spinnerContainer").css("display", "inline");

                    month_data_fetched = false;

                    month = newMonth;

                    // Query the data for the new month. the following code is analogous to the first part of the initialization
                    dataController.queryPictureDataForMonth(month, function (data) {

                        month_data = data;
                        month_data_fetched = true;
                        var myData = [];
                        $.each(month_data, function (index, day_data) {

                            if (day_data.trips.length != 0) {

                                myData = myData.concat(day_data.trips);
                            }

                        });
                        combinePicturesAndCo(myData);

                        completedMonths.push(monthYearCheck);

                        console.log("Completed months:");
                        console.log(completedMonths);

                        // add a delay and then remove the loading icon.
                        setTimeout(function(){
                            $("#spinnerContainer").css("display", "none");
                        },50);
                        $("#calendar").datepicker("refresh");
                    });

                }

                // if the month has already been queried, then all needed data is stored in specific arrays. Nothing needs to be loaded or queried.
                else {

                    console.log("This month and year has already been queried.");

                    month = newMonth;
                    $("#calendar").datepicker("refresh");
                }
            },

            // Determine how a date should be displayed (colored if there are photos on that day, greyed out if not)
            beforeShowDay: function (day) {

                // Determine the month and year
                var day_month = day.getMonth() + 1;
                var day_year = day.getFullYear();

                if (month_data_fetched && day_month == month) {

                    var day_number = day.getDate();
                    var photos_present = false;

                    // iterate over all the markers to check if there are markers with the wanted date.
                    $.each(markers,function(index, marker) {

                        // if the dates match (this means there are pictures on the given day), set photos_present to true, which will color the day on the calendar
                        if (marker.date.getFullYear() == day_year && marker.date.getMonth() == day_month-1 && marker.date.getDate() == day_number) {

                            photos_present = true;
                            return false
                        }
                    });

                    return [photos_present, ""];
                }

                return [false, ""];
            }
        });

        // Click the clear all photos button
        $("#clearAll").click(function (){

            // iterate over each marker
            $.each(markers,function(index,marker){

                // remove the marker from the map
                marker.setMap(null);

                // check if the day of the marker is on markersOnMap. If so, set it to false (the markers of that day are not on the map anymore)
                var day = marker.date.getDate();
                var month = marker.date.getMonth()+1;
                var year = marker.date.getFullYear();
                var markerCheck;
                if (day.toString().length == 1) {
                    markerCheck = "0"+day.toString()+month.toString()+year.toString();
                }
                else {
                    markerCheck = day.toString()+month.toString()+year.toString();
                }
                if (markersOnMap.hasOwnProperty(markerCheck)) {

                    markersOnMap[markerCheck] = false
                }

            })
        });

        // initialize the map
        initMap();
    }

    function initMap() {

        // create start-up options for the map. The center is arbitrarily set to the coordinates of the computer sciences building of KULeuven, but this changes after markers (photos) are added to the map
        var MapOptions = {
            zoom: 16,
            center: {lat: 50.864, lng: 4.679},
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            maxZoom: 20,
            minZoom: 3
        };

        // create the map
        Map = new google.maps.Map(document.getElementById("MapCanvas"),
            MapOptions);
    }

    function combinePicturesAndCo(trips) {

        var pictureDataArray = [];

        // iterate over each trip in the array
        $.each(trips,function(index,trip){

            // check if the trip has sensor data
            if (trip.hasOwnProperty("sensorData")) {

                var tripPictureDataArray = [];
                var gpsDataArray = [];

                // iterate over each recorded sensor data of a trip
                $.each(trip.sensorData, function (index, sensorValue) {

                    // sensor value 8 corresponds with the camera
                    if (sensorValue.sensorID == 8) {

                        // create the link where the picture can be found
                        //var link = "http://dali.cs.kuleuven.be:8443/qbike/images/";
                        var link = dataController.getImagesURL();
                        link = link + "/" + sensorValue.data[0];

                        // retrieve the time the picture was taken
                        var time = sensorValue.timestamp;

                        // Create an array with in position 1 the link, position 2 gps coordinates (currently empty) and position 3 the timestamp
                        var pictureTimeArray = [link, [], time];

                        // Add the picture to the array of pictures from the current trip
                        tripPictureDataArray.push(pictureTimeArray);
                    }

                    // sensor value 1 corresponds with the gps
                    else if (sensorValue.sensorID == 1) {

                        // add the data to the array of gps data from the current trip
                        gpsDataArray.push(sensorValue)
                    }
                });

                // if the array of pictures from the current trip is not empty
                if (tripPictureDataArray != []) {

                    var gpsCo = [];

                    // if there is no gps data, the array of pictures is emptied (the pictures cannot be placed on the map without coordinates)
                    if (gpsDataArray.length == 0) {

                        tripPictureDataArray = [];

                    }

                    // if there is only one element of gps data, it is used to place the photo(s)
                    else if (gpsDataArray.length == 1) {

                        // a slightly different code must be used depending on the gps data tpe
                        if (gpsDataArray[0].data[0].type == "Multipoint") {

                            gpsCo = gpsDataArray[0].data[0].coordinates[0];
                        }

                        else {

                            gpsCo = gpsDataArray[0].data[0].coordinates;
                        }

                        $.each(tripPictureDataArray, function (index, pictureData) {

                            pictureData[1] = gpsCo;

                        })
                    }

                    // in this case there are multiple gps coordinates
                    else {

                        // the gps data is sorted by time
                        gpsDataArray.sort(dataController.compareTime);

                        // iterate over each picture in the array
                        $.each(tripPictureDataArray, function (index, pictureData) {

                            // the difference between the timestamp of the picture and the timestamp of each gps data is calculated.
                            var timeTaken = Date.parse(pictureData[2]);
                            var gpsIndex = 2;
                            var prevDif = Math.abs(Date.parse(gpsDataArray[0].timestamp) - timeTaken);
                            var currentDif = Math.abs(Date.parse(gpsDataArray[1].timestamp) - timeTaken);

                            // because the gps data is sorted, the iteration continues until the previous difference is smaller than the current difference
                            while (gpsIndex < gpsDataArray.length && currentDif < prevDif) {

                                prevDif = currentDif;
                                currentDif = Math.abs(Date.parse(gpsDataArray[gpsIndex].timestamp) - timeTaken);
                                gpsIndex = gpsIndex + 1;

                            }

                            // the previous difference is then the smallest difference in time between the gps data and the photo. the gps data is retrieved for the photo and put in the second position
                            if (gpsDataArray[gpsIndex - 1].data[0].type == "Multipoint") {

                                pictureData[1] = gpsDataArray[gpsIndex - 1].data[0].coordinates[0]
                            }

                            else {

                                pictureData[1] = gpsDataArray[gpsIndex - 1].data[0].coordinates
                            }

                        });
                    }

                    // the array of picture data from the trip is added to the overall picture data array
                    pictureDataArray = pictureDataArray.concat(tripPictureDataArray);

                }

            }


        });

        // this function moves pictures that possibly overlap each other (if they were taken at exactly the same gps coordinates)
        pictureDataArray = moveDuplicates(pictureDataArray);

        // this function creates the markers and info windows for the pictures
        initMarkers(pictureDataArray);

    }

    function moveDuplicates(pictureDataArray) {

        // iterate over each element in the array
        $.each(pictureDataArray, function (index, pictureData) {

            var pictureIndex = index+1;
            while (pictureIndex<pictureDataArray.length) {

                // check each element of the array with the remaining elements (that have not been compared yet) if they are within a certain distance of each other, move the second element
                if (Math.abs(pictureData[1][0]-pictureDataArray[pictureIndex][1][0])<0.00007 && Math.abs(pictureData[1][1]-pictureDataArray[pictureIndex][1][1])<0.00003) {
                    pictureDataArray[pictureIndex][1][1] = pictureDataArray[pictureIndex][1][1] + 0.00003
                }
                pictureIndex = pictureIndex + 1
            }
        });

        return pictureDataArray
    }

    function addOrRemovePictures(day, month, year) {

        // create a variable to check whether the selected day is already on the map
        var markerCheck = day.toString()+month.toString()+year.toString();
        if (markersOnMap.hasOwnProperty(markerCheck)) {

            // if it is on the map, the markers are removed
            if (markersOnMap[markerCheck]) {

                removeMarkers(day);
                markersOnMap[markerCheck] = false;
            }

            // otherwise, the markers are added
            else {

                addMarkers(day);
                markersOnMap[markerCheck] = true;
            }
        }

        // if the selected day is not registered, it is put on the map and registered
        else {

            addMarkers(day);
            markersOnMap[markerCheck] = true;
        }
    }

    function addMarkers(day) {

        var newCenter = {};
        // iterate over all the markers
        $.each(markers, function(index, marker){

            // if the current marker's timestamp corresponds with the selected day, it is added to the map
            if (day == marker.date.getDate()){

                markers[index].setMap(Map);
                newCenter = markers[index].position;
            }
        });

        // the position of the last marker set on the map is used as the new center for the map
        Map.panTo(newCenter);
    }

    function removeMarkers(day) {

        // iterate over all the markers
        $.each(markers, function(index, marker){

            // if the current marker's timestamp corresponds with the selected day, it is removed from the map
            if (day == marker.date.getDate()){
                markers[index].setMap(null);
            }
        })
    }

    function initMarkers(myData) {

        var markersLength = markers.length;

        // iterate over the length of the array myData
        for (i = 0; i < myData.length; i++) {
            (function () {

                // markersindex is created as an index after the last index in markers
                var markersindex = i+markersLength;

                // a variable of the time the picture is taken
                var dateTaken = new Date(myData[i][2]).toLocaleString();

                // a variable of the coordinates in the right form to be used by google maps
                var myLatLng = {lat: myData[i][1][0], lng: myData[i][1][1]};

                // the marker is created with certain properties
                markers[markersindex] = new google.maps.Marker({
                    position: myLatLng,
                    map: Map,
                    date: new Date(myData[i][2])
                });

                // the content of the info window is stored in a variable
                var contentString = '<div class="pictureContainer">'+
                    '<img class="picture" src='+myData[i][0]+'>'+
                    '<div class="takenOn">'+
                    'This photo was taken on '+
                    dateTaken +
                    '</div>'+
                    '<a class="photoLink" id="photo" target="_blank" href=' + myData[i][0] + '>'+
                    'view full size.'+
                    '</a>'+
                    '</div>';

                // the info window is created
                infoWindows[markersindex] = new google.maps.InfoWindow({
                    content: contentString,
                    position: myLatLng
                });

                // a function is made so that when you click on the marker, the corresponding info window pops up
                google.maps.event.addListener(markers[markersindex], "click", function () {

                    // if an info window is already open, it is closed
                    infoWindows[openedInfoWindow].close();
                    infoWindows[markersindex].open(Map, markers[markersindex]);
                    openedInfoWindow = markersindex;
                });

                // all markers are removed from the map (when a marker is created, it is automatically put on the map)
                markers[markersindex].setMap(null)

            }())


        }

        console.log("markers:");
        console.log(markers);

    }


    return {
        init:init,
        initMap: initMap,
        combinePicturesAndCo: combinePicturesAndCo,
        moveDuplicates: moveDuplicates,
        addOrRemovePictures: addOrRemovePictures,
        addMarkers: addMarkers,
        removeMarkers: removeMarkers,
        initMarkers: initMarkers
    };



})();

$(document).ready(mapController.init);
