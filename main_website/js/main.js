$(document).ready(function() {

    $("#header-loader").load("header.php", function() {

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

        $("#CloseAboutUs").click(function(){
            $("#about-us").slideUp("fast");
        });

        $("#CloseAboutDevice").click(function(){
            $("#about-device").slideUp("fast");
        });





        $("#settings").click(function () {


            window.location.href = "login/logout.php";

        });

    });

    if (/firefox/.test(navigator.userAgent.toLowerCase())) {
        alert("Please don't use Firefox. This website won't work properly on Firefox.");
    }

});
