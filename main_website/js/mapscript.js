

//var myData = [["http://extranet.eco.ca/projects/crm/OccupationalProfiles/wopID208/Petroleum-Engineer.jpg",[50.864,4.679]],["http://rossengineers.com/wp-content/themes/rosseng/img/j0439299.jpg", [50.874,4.689]],["http://construction-engineers.regionaldirectory.us/construction-engineer-720.jpg", [50.874,4.679]]];
var markers = [];
var infoWindows = [];
var markersOnMap = {};

mapController = ( function () {

    var year = new Date().getFullYear();
    var month = new Date().getMonth()+1;
    var day = new Date().getDate();

    var month_data;
    var month_data_fetched = false;

    function init() {

        dataController.queryPictureDataForMonth(month, function(data) {

            month_data = data;
            month_data_fetched = true;

            var myData = [];
            $.each(month_data, function(index, day_data){

                if (day_data.trips.length != 0){

                    myData.concat(day_data.trips)
                }

            });
            combinePicturesAndCo(myData);

            console.log(month_data);


//            $("#loading_popover").css("display", "none");

            $("#calendar").datepicker("refresh");
        });

/*        $("#calendar").datepicker({
            onSelect: function (dateText, datepicker) {

                var elements = dateText.split("/");

                year = elements[2];
                month = elements[0];
                day = elements[1];

            }
        });*/

        $("#calendar").datepicker({

            onSelect: function (dateText, datepicker) {

                var elements = dateText.split("/");

                var day = elements[1];
                var month = elements[0];
                var year = elements[2];

//                setTableToTrips(month_data[day-1]);

//                $("#select_trip").empty();
//                queryDataForDay(day);
//                console.log(markersOnMap);
                addOrRemovePictures(day, month, year);
//                removeMarkers(day);
            },

            onChangeMonthYear: function (newYear, newMonth, datepicker) {

                console.log("Datepicker changed month to " + newMonth);

                month_data_fetched = false;

                month = newMonth;

//                markers = [];

                $("#loading_popover").css("display", "block");

                dataController.queryPictureDataForMonth(month, function(data) {

                    month_data = data;
                    month_data_fetched = true;
                    var myData = [];
                    $.each(month_data, function(index, day_data){

                        if (day_data.trips.length != 0){

                            myData = myData.concat(day_data.trips);
                        }

                    });
                    combinePicturesAndCo(myData);

                    console.log(month_data);

//                    $("#loading_popover").css("display", "none");
                    $("#calendar").datepicker("refresh");
                });
            },

            beforeShowDay: function (day) {

                var day_month = day.getMonth() + 1;

                if (month_data_fetched && day_month == month) {

                    var day_number = day.getDate();

                    var trips_present = month_data[day_number-1].average.nrOfTrips > 0;



                    if (trips_present) {

                        console.log("Trips present on " + day);
//                        console.log(month_data[day_number-1].trips);
                        var hasGPSData = false;
                        $.each(month_data[day_number-1].trips, function(index, trip){

                            $.each(trip.sensorData, function(index, sensor_data){

                                if (sensor_data.sensorID == 1){

                                    hasGPSData = true;
                                    return false
                                }

                            });
                            if (hasGPSData) {
                                return false
                            }
                        });
                        if (hasGPSData == false) {
                            trips_present = false;
                        }

                    }

                    return [trips_present, ""];
                }

                return [false, ""];
            }
        });

 /*       $("#addDay").click(function(){

            console.log("clicked");

            dataController.queryTripsForDay(new Date(year, month-1, day), function(trips){

                console.log(trips);
                combinePicturesAndCo(trips)

            })
        });
*/
        initMap();
    }

    function initMap() {

        var MapOptions = {
            zoom: 15,
            center: {lat: 50.864, lng: 4.679},
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            maxZoom: 20,
            minZoom: 3
        };

        Map = new google.maps.Map(document.getElementById("MapCanvas"),
            MapOptions);
    }

    function combinePicturesAndCo(trips) {

        var pictureDataArray = [];

        $.each(trips,function(index,trip){

            if (trip.hasOwnProperty("sensorData")) {

                var tripPictureDataArray = [];
                var gpsDataArray = [];


                $.each(trip.sensorData, function (index, sensorValue) {

                    if (sensorValue.sensorID == 8) {

                        var link = "http://dali.cs.kuleuven.be:8080/qbike/images/";
                        link = link + sensorValue.data[0];
//                        console.log("picture link is " + link);
                        var time = sensorValue.timestamp;

                        var pictureTimeArray = [link, [], time];
                        tripPictureDataArray.push(pictureTimeArray);
                    }
                    else if (sensorValue.sensorID == 1) {

                        gpsDataArray.push(sensorValue)
                    }
                });

                if (tripPictureDataArray != []) {

//                    console.log("there are " + tripPictureDataArray.length + " pictures on the day of " + tripPictureDataArray[0][2] + "(trip ID: " + trip._id + " )");
//                console.log(tripPictureDataArray);
                    var gpsCo = [];

                    if (gpsDataArray.length == 0) {

//                        console.log("there is no gps data, so pictures from the day of "+ tripPictureDataArray[0][2] +"are removed (tripID: " + trip._id +" )");
                        tripPictureDataArray = [];
/*                        $.each(tripPictureDataArray, function (index, pictureData) {

                            console.log("no GPS data found. Standard values are used (there may be more than one picture, but only one coordinate set is used)");
                            pictureData[1] = [50.864, 4.679];

                        })*/
                    }

                    else if (gpsDataArray.length == 1) {

//                        console.log("there is only one coordinate on trip of day " + tripPictureDataArray[0][2] + "(tripID: " + trip._id + " )");

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

                    else {


                        gpsDataArray.sort(dataController.compareTime);

                        $.each(tripPictureDataArray, function (index, pictureData) {

                            var timeTaken = Date.parse(pictureData[2]);
                            var gpsIndex = 2;
                            var prevDif = Math.abs(Date.parse(gpsDataArray[0].timestamp) - timeTaken);
                            var currentDif = Math.abs(Date.parse(gpsDataArray[1].timestamp) - timeTaken);
                            while (gpsIndex < gpsDataArray.length && currentDif < prevDif) {

                                prevDif = currentDif;
                                currentDif = Math.abs(Date.parse(gpsDataArray[gpsIndex].timestamp) - timeTaken);
                                gpsIndex = gpsIndex + 1;

                            }

                            if (gpsDataArray[gpsIndex - 1].data[0].type == "Multipoint") {

                                pictureData[1] = gpsDataArray[gpsIndex - 1].data[0].coordinates[0]
                            }

                            else {

                                pictureData[1] = gpsDataArray[gpsIndex - 1].data[0].coordinates
                            }

                        });
                    }

//                    console.log("tripPictureDataArray");
//                    console.log(tripPictureDataArray);
                    pictureDataArray = pictureDataArray.concat(tripPictureDataArray);

                }

            }


        });
//        console.log("pictureDataArray");
//        console.log(pictureDataArray);
        pictureDataArray = moveDuplicates(pictureDataArray);
        initMarkers(pictureDataArray);

    }

    function moveDuplicates(pictureDataArray) {

        $.each(pictureDataArray, function (index, pictureData) {

            var pictureIndex = index+1;
            while (pictureIndex<pictureDataArray.length) {

                if (Math.abs(pictureData[1][0]-pictureDataArray[pictureIndex][1][0])<0.00007 && Math.abs(pictureData[1][1]-pictureDataArray[pictureIndex][1][1])<0.00003) {
                    pictureDataArray[pictureIndex][1][1] = pictureDataArray[pictureIndex][1][1] + 0.00003
                }
                pictureIndex = pictureIndex + 1
            }
        });

        return pictureDataArray
    }

    function initPicturesAndCo () {

        var myData = [];

        dataController.queryPictureTrips(function(data){

            combinePicturesAndCo(data);
        });
    }


    function addOrRemovePictures(day, month, year) {

        console.log(markersOnMap);
        var markerCheck = day.toString()+month.toString()+year.toString();
        if (markersOnMap.hasOwnProperty(markerCheck)) {
            console.log("has own property");
            if (markersOnMap[markerCheck]) {
                console.log("markerCheck is true");
                removeMarkers(day);
                markersOnMap[markerCheck] = false;
            }
            else {
                console.log("markerCheck is false");
                addMarkers(day);
                markersOnMap[markerCheck] = true;
            }
        }
        else {
            console.log("does not have own property");
            addMarkers(day);
            markersOnMap[markerCheck] = true;
        }
    }

    function addMarkers(day) {

        $.each(markers, function(index, marker){

            if (day == marker.date.getDate()){
                markers[index].setMap(Map);
            }
        })
    }

    function removeMarkers(day) {

        $.each(markers, function(index, marker){

            if (day == marker.date.getDate()){
                markers[index].setMap(null);
            }
        })
    }

    function initMarkers(myData) {

        for (index in myData) {
            (function () {

                var i = index;
                var dateTaken = new Date(myData[i][2]).toLocaleString();
                var myLatLng = {lat: myData[i][1][0], lng: myData[i][1][1]};
                markers[i] = new google.maps.Marker({
                    position: myLatLng,
                    map: Map,
                    date: new Date(myData[i][2])
                });

                var contentString = '<div class="pictureContainer">'+
                    '<img class="picture" src='+myData[i][0]+'>'+
                    '<div class="takenOn">'+
                    'This photo was taken on '+
                    dateTaken +
                    '</div>'+
                    '<a class="photoLink" target="_blank" href=' + myData[i][0] + '>'+
                    'Click here to view full size.'+
                    '</a>'+
                    '</div>';

                infoWindows[i] = new google.maps.InfoWindow({
                    content: contentString,
                    position: myLatLng
                });


                google.maps.event.addListener(markers[i], "click", function () {
                    infoWindows[i].open(Map, markers[i]);
                });

                markers[i].setMap(null)

            }())


        }

        console.log(markers);

        setTimeout(function(){
            $("#spinnerContainer").css("display", "none");
        },2500)



    }


    return {
        init:init,
        initMap: initMap,
        combinePicturesAndCo: combinePicturesAndCo,
        moveDuplicates: moveDuplicates,
        initPicturesAndCo: initPicturesAndCo,
        addOrRemovePictures: addOrRemovePictures,
        addMarkers: addMarkers,
        removeMarkers: removeMarkers,
        initMarkers: initMarkers
    };



})();

$(document).ready(mapController.init);
