
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

    $("#settings").click(function (){
        console.log("settings have been clicked")
        $('#settings-list').slideToggle("fast");

    });

});


