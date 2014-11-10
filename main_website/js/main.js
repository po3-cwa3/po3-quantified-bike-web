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

        $("#settings").popover({
            title: "Settings",
            content: "<p id='settings-logout'>Log out</p>" +
                        "<p id='settings-preferences'>Preferences</p>",
            placement: "bottom",
            html: true
        });



        $("#settings").click(function () {
            //console.log("settings have been clicked");
            //$('#settings-user').slideToggle("fast");
            //$('#about-device').slideUp("fast");
            //$('#about-us').slideUp("fast");

            if ($(this).attr("popover-visible") == "true") {

                $(this).popover('hide');
                $(this).attr("popover-visible", "false");

            } else {

                $(this).popover('show');
                $(this).attr("popover-visible", "true");

                $("#settings-logout").click(function() {

                    window.location.href = "login/logout.php";
                });

                $("#settings-preferences").click(function() {

                    alert("Preferences are in development");
                });
            }
        });

    });

    if (/firefox/.test(navigator.userAgent.toLowerCase())) {
        alert("Please don't use Firefox. This website won't work properly on Firefox.");
    }

});
