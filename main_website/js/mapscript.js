

//var myData = [["http://extranet.eco.ca/projects/crm/OccupationalProfiles/wopID208/Petroleum-Engineer.jpg",[50.864,4.679]],["http://rossengineers.com/wp-content/themes/rosseng/img/j0439299.jpg", [50.874,4.689]],["http://construction-engineers.regionaldirectory.us/construction-engineer-720.jpg", [50.874,4.679]]];
var markers = [];
var infoWindows = [];

mapController = ( function () {


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

    function combinePicturesToCo(trips) {

        var pictureDataArray = [];
        var gpsDataArray = [];

        $.each(trips,function(index,trip){

            var dayPictureDataArray = [];

            if (trip.hasOwnProperty("sensorData")){

                $.each(trip.sensorData,function(index,sensorValue){

                    if (sensorValue.sensorID == 8) {

                        var link = "http://dali.cs.kuleuven.be:8080/qbike/images/";
                        link = link + sensorValue.data[0];
                        console.log("picture link is" + link);
                        var time = sensorValue.timestamp;

                        var pictureTimeArray = [link, time];
                        dayPictureDataArray.push(pictureTimeArray)
                    }
                    else if (sensorValue.sensorID == 1) {

                        gpsDataArray.push(sensorValue)
                    }
                });

                if (gpsDataArray.length == 0) {

                    dayPictureDataArray = []
                }

                else if (gpsDataArray.length == 1) {

                    var gpsData = [];

                    if (gpsDataArray[0].data[0].type == "Multipoint") {

                        gpsData = gpsDataArray[0].data[0].coordinates[0]
                    }

                    else {

                        gpsData = gpsDataArray[0].data[0].coordinates
                    }

                    $.each(dayPictureDataArray, function(index, pictureData) {

                    })
                }

                else {


                    gpsDataArray.sort(dataController.compareTime);

                    $.each(dayPictureDataArray, function (index, pictureData) {

                        var timeTaken = Date.parse(pictureData[1]);


                    })
                }
            }
        })
    }

    function initMarkers() {

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


    }


    return {
        initMap: initMap,
        initMarkers: initMarkers
    };



})();

$(document).ready(mapController.initMap);
$(document).ready(mapController.initMarkers);
