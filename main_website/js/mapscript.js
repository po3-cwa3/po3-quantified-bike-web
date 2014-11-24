

//var myData = [["http://extranet.eco.ca/projects/crm/OccupationalProfiles/wopID208/Petroleum-Engineer.jpg",[50.864,4.679]],["http://rossengineers.com/wp-content/themes/rosseng/img/j0439299.jpg", [50.874,4.689]],["http://construction-engineers.regionaldirectory.us/construction-engineer-720.jpg", [50.874,4.679]]];
var markers = [];
var infoWindows = [];

mapController = ( function () {


    function init() {

        initMap();
        initPicturesAndCo();
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

            var tripPictureDataArray = [];
            var gpsDataArray = [];


            $.each(trip.sensorData,function(index,sensorValue){

                if (sensorValue.sensorID == 8) {

                    var link = "http://dali.cs.kuleuven.be:8080/qbike/images/";
                    link = link + sensorValue.data[0];
                    console.log("picture link is " + link);
                    var time = sensorValue.timestamp;

                    var pictureTimeArray = [link, time];
                    tripPictureDataArray.push(pictureTimeArray);
                }
                else if (sensorValue.sensorID == 1) {

                    gpsDataArray.push(sensorValue)
                }
            });

            if (tripPictureDataArray != []) {

                console.log("there are "+ tripPictureDataArray.length +" pictures on the day of " + tripPictureDataArray[0][1] + "(trip ID: " +  trip._id +" )");
//                console.log(tripPictureDataArray);
                var gpsCo = [];

                if (gpsDataArray.length == 0) {

//                        console.log("there is no gps data, so pictures from the day of "+ tripPictureDataArray[0][1] +"are removed (tripID: " + trip._id +" )");
//                        tripPictureDataArray = [];
                    $.each(tripPictureDataArray, function (index, pictureData) {

                        console.log("no GPS data found. Standard values are used (there may be more than one picture, but only one coordinate set is used)");
                        pictureData[1] = [50.864,4.679];

                    })
                }

                else if (gpsDataArray.length == 1) {

                    console.log("there is only one coordinate on trip of day " + tripPictureDataArray[0][1] + "(tripID: "+ trip._id +" )");

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

                        var timeTaken = Date.parse(pictureData[1]);
                        var gpsIndex = 2;
                        var prevDif = Math.abs(Date.parse(gpsDataArray[0].timestamp)-timeTaken);
                        var currentDif = Math.abs(Date.parse(gpsDataArray[1].timestamp)-timeTaken);
                        while (gpsIndex < gpsDataArray.length && currentDif < prevDif){

                            prevDif = currentDif;
                            currentDif = Math.abs(Date.parse(gpsDataArray[gpsIndex].timestamp)-timeTaken);
                            gpsIndex = gpsIndex+1;

                        }

                        if (gpsDataArray[gpsIndex-1].data[0].type == "Multipoint") {

                            pictureData[1] = gpsDataArray[gpsIndex-1].data[0].coordinates[0]
                        }

                        else {

                            pictureData[1] = gpsDataArray[gpsIndex-1].data[0].coordinates
                        }

                    });
                }

                console.log("tripPictureDataArray");
                console.log(tripPictureDataArray);
                pictureDataArray = pictureDataArray.concat(tripPictureDataArray);

            }


        });
        console.log("pictureDataArray");
        console.log(pictureDataArray);
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

    function initMarkers(myData) {

        for (index in myData) {
            (function () {

                var i = index;
                var myLatLng = {lat: myData[i][1][0], lng: myData[i][1][1]};
                markers[i] = new google.maps.Marker({
                    position: myLatLng,
                    map: Map
                });

                var contentString = '<div class="pictureContainer">'+
                    '<img class="picture" src='+myData[i][0]+'>'+
                    '</div>';

                infoWindows[i] = new google.maps.InfoWindow({
                    content: contentString,
                    position: myLatLng
                });


                google.maps.event.addListener(markers[i], "click", function () {
                    infoWindows[i].open(Map, markers[i]);
                });

            }())


        }

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
        initMarkers: initMarkers
    };



})();

$(document).ready(mapController.init);
