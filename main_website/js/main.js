$(document).ready(function() {

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
        });

        $("#detailCloseButton2").click(function () {
            $('#about-device').slideUp("fast");
        });

        $("#settings").click(function () {
            console.log("settings have been clicked");
            $('#settings-list').slideToggle("fast");
        });

    });

    if (/firefox/.test(navigator.userAgent.toLowerCase())) {
        alert("Please don't use Firefox. This website won't work properly on Firefox.");
    }

});
