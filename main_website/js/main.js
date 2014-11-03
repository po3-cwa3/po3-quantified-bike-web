<<<<<<< HEAD
$(document).ready(function() {

    var counterus = 0;
    var counterdevice = 0;

    $("#about").click(function () {
        //if (counterus){
        //    $('#about-us').slideUp("fast");
        //    counterus = 0;
        //}
        //else {
        //    $('#about-device').slideUp("fast");
        //    $('#about-us').slideDown("fast");
        //    counterus = 1;
        //}
        $('#about-us').slideToggle("fast");
        $('#about-device').slideUp("fast");
    });

    $("#detailCloseButton").click(function () {
        $('#about-us').slideUp("fast");
    });

    $("#device").click(function () {
        //if (counterdevice){
        //    $('#about-device').slideUp("fast");
        //    counterdevice = 0;
        //}
        //else {
        //    $('#about-us').slideUp("fast");
        //    $('#about-device').slideDown("fast");
        //    counterdevice = 1;
        //}
        $('#about-device').slideToggle("fast");
        $('#about-us').slideUp("fast");
    });

    $("#detailCloseButton2").click(function () {
        $('#about-device').slideUp("fast");
    });

    $("settings").click(function (){

    });

});
=======


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


    }

    return {
        init: init
     };


})();

$(document).ready(dataController.init);

>>>>>>> a1dc873dffb1b38748f904f2c11b71e193abd33d
