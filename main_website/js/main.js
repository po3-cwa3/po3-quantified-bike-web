$(document).ready(function() {

<<<<<<< HEAD
    $(function () {
        $("#header-loader").load("header.html", function() {

            $("#about").click(function () {
                $('#about-us').slideToggle("fast");
                $('#about-device').slideUp("fast");
            });

            $("#detailCloseButton").click(function () {
                $('#about-us').slideUp("fast");
            });


             $("#settings").click(function (){
        console.log("settings have been clicked")
        $('#settings-list').slideToggle("fast");



            $("#detailCloseButton2").click(function () {
                $('#about-device').slideUp("fast");
            });

            $("settings").click(function (){

            });
=======
    $("#header-loader").load("header.html", function() {

        $("#about").click(function () {
            $('#about-us').slideToggle("fast");
            $('#about-device').slideUp("fast");
        });

        $("#detailCloseButton").click(function () {
            $('#about-us').slideUp("fast");
        });

        $("#device").click(function () {
            $('#about-device').slideToggle("fast");
            $('#about-us').slideUp("fast");
>>>>>>> c5bcdb8c679a2b545911ccae90e084fb8f35f6e8
        });

        $("#detailCloseButton2").click(function () {
            $('#about-device').slideUp("fast");
        });

        $("#settings").click(function () {
            console.log("settings have been clicked");
            $('#settings-list').slideToggle("fast");
        });

    });

});
