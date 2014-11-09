

var myData = [["http://extranet.eco.ca/projects/crm/OccupationalProfiles/wopID208/Petroleum-Engineer.jpg",[50.864,4.679]],["http://rossengineers.com/wp-content/themes/rosseng/img/j0439299.jpg", [50.874,4.689]],["http://construction-engineers.regionaldirectory.us/construction-engineer-720.jpg", [50.874,4.679]]];
var markers = [];
var infoWindows = [];

calendarController = ( function () {


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

    function initMarkers() {

        for (index in myData) {
            (function () {

                var i = index;
                var myLatLng = {lat: myData[i][1][0], lng: myData[i][1][1]};
                markers[i] = new google.maps.Marker({
                    position: myLatLng,
                    map: Map
                });
//            var contentString = '<img src=myData[index][0] alt="Smiley face" height="100" width="100">'
                infoWindows[i] = new google.maps.InfoWindow({
                    content: '<img src='+myData[i][0]+' height="200" width="200">',
                    position: myLatLng,
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

$(document).ready(calendarController.initMap);
$(document).ready(calendarController.initMarkers);
