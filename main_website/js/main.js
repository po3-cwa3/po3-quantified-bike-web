

dataController = ( function () {


    function init() {
        var counterus = 0;
        var counterdevice = 0;

        $("#about").click(function () {
            if (counterus){
                $('#about-us').css("display", "none");
                counterus = 0;
            }
            else {
                $('#about-device').css("display", "none");
                $('#about-us').css("display", "block");
                counterus = 1;
            }
        });

        $("#detailCloseButton").click(function () {
            $('#about-us').css("display", "none");
        });

        $("#device").click(function () {
            if (counterdevice){
                $('#about-device').css("display", "none");
                counterdevice = 0;
            }
            else {
                $('#about-us').css("display", "none");
                $('#about-device').css("display", "block");
                counterdevice = 1;
            }
        });

        $("#detailCloseButton2").click(function () {
            $('#about-device').css("display", "none");
        });

        $("settings").click(function (){

        });
    }

    return {
        init: init
     };


})();

$(document).ready(dataController.init);

