

dataController = ( function () {


    function initMap() {

        var MapOptions = {
            zoom: 20,
            center: {lat: 50.864, lng: 4.679},
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        Map = new google.maps.Map(document.getElementById("MapCanvas"),
            MapOptions);
    }

    return {
        initMap: initMap
    };


})();

$(document).ready(dataController.initMap);

