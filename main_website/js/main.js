$(document).ready(function() {

    $("#header-loader").load("header.html", function() {

        $("#about").click(function () {
            $('#about-us').slideToggle("fast");
            $('#about-device').slideUp("fast");
            $('#settings-user').slideUp("fast")
        });

        $("#detailCloseButton").click(function () {
            $('#about-us').slideUp("fast");
        });

        $("#device").click(function () {
            $('#about-device').slideToggle("fast");
            $('#about-us').slideUp("fast");
            $('#settings-user').slideUp("fast")
        });

        $("#detailCloseButton2").click(function () {
            $('#about-device').slideUp("fast");
        });

        $("#detailCloseButton3").click(function () {
            $('#settings-user').slideUp("fast");
        });

        $("#settings").click(function () {
            console.log("settings have been clicked");
            $('#settings-user').slideToggle("fast");
            $('#about-device').slideUp("fast");
            $('#about-us').slideUp("fast");
        });

    });

});
