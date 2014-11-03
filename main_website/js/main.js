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


             $("#settings").click(function (){
        console.log("settings have been clicked")
        $('#settings-list').slideToggle("fast");



            $("#detailCloseButton2").click(function () {
                $('#about-device').slideUp("fast");
            });

            $("settings").click(function (){

            });
        });
    });

});
