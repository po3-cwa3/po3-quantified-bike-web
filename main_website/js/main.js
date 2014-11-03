$(document).ready(function() {

    $(function () {
        $("#header-loader").load("header.html", function() {

            $("#about").click(function () {
                $('#about-us').slideToggle("fast");
                $('#about-device').slideUp("fast");
            });

            $("#detailCloseButton").click(function () {
                $('#about-us').slideUp("fast");
            });

<<<<<<< HEAD
    $("#settings").click(function (){
        console.log("settings have been clicked")
        $('#settings-list').slideToggle("fast");
=======
            $("#device").click(function () {
                $('#about-device').slideToggle("fast");
                $('#about-us').slideUp("fast");
            });
>>>>>>> ef674b04e35b4919f8709e273e6b2693c625d2ed

            $("#detailCloseButton2").click(function () {
                $('#about-device').slideUp("fast");
            });

            $("settings").click(function (){

            });
        });
    });

});
