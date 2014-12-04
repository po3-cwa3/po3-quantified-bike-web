<?php

require('login/session.php');

if (!isset($user)) {

    header('Location: login/loginForm.php?from=' . urlencode('../compare.php'));
    exit();

}

?>


<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="BOSS: Bike Of StatS" />
    <meta name="keywords" content="BOSS, bike, data, dashboard, home" />
    <meta name="author" content="BOSS" />

    <title>Bike of StatS</title>

    <link rel="shortcut icon" href="../favicon.ico">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" type="text/css" href="Bootstrap/css/bootstrap.css">

    <!-- Main Theme CSS -->
    <link rel="stylesheet" type="text/css" href="css/main.css" />

    <!-- specific CSS -->
    <link rel="stylesheet" type="text/css" href="css/compare.css" />

    <!-- jQuery -->
    <script type="text/javascript" charset="utf8" src="js/jQuery.js"></script>

    <!-- jQuery UI (for datepicker) -->
    <script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
<!--    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">-->

    <!-- Main Theme JS -->
    <script src="js/main.js"></script>

    <!-- chart JS -->
    <script src="js/ChartNew.js"></script>

    <!-- Bootstrap JS -->
    <script type="text/javascript" charset="utf8" src="Bootstrap/js/bootstrap.js"></script>

    <!-- Google Maps API -->
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>

    <!-- Data Controller JS -->
    <script src="js/dataController.js"></script>

    <!-- Compare Controller JS -->
    <script src="js/compare.js"></script>



</head>
<body>
<div class="container">
    <div id="header-loader"></div>
    <div class="content">
        <nav id ="choose-compare-sort">
            <a id="trips" class="bp-icon bp-icon-trip " data-info="compare trips"><span>compare trips</span></a>
            <a id="days"  class="bp-icon bp-icon-day " data-info="compare days"><span>compare days</span></a>
        </nav>

        <button id="compare-other-trips">choose other trips</button>
        <div id="compare-trips">

            <h1 id="enough-entries">You have selected the maximum number of entries, please click on the compare button now</h1>

            <div id ="calendar-1">


                <h2>Choose the trips you want to compare, then press 'Compare'.</h2><br>

                <div id="trip_selector">

                    <div id="calendar"></div>

                    <img id="calendar_arrow" src="Images/arrow-alt-right.png"></img>

                    <div id="trip_lister">

                        <ul></ul>

                    </div>

                    <div id="loading_popover">

                        <p class="loading_message">Loading, please wait...</p>

                        <div class="loadingSpinner"></div>

                    </div>

                </div>

            </div>

            <button id="start_comparing">compare</button>


        </div>

        <div id="compare-days">
            <h2>Choose the trips you want to compare, then press 'Compare'.</h2><br>
            <div id="calendar-2"></div>
            <div id="loading_popover-2">

                <p class="loading_message">Loading, please wait...</p>

                <div class="loadingSpinner"></div>

            </div>

            <button id="start_comparing_days">compare</button>

        </div>


        <table id="table_compare" class="table_compare">
            <tr id="elements_to_compare"></tr>

            <tr id="table_day"></tr>

            <tr id="km"></tr>

            <tr id="duration"></tr>


        </table>

        <canvas id="first_chart" ></canvas>
        <canvas id="second_chart" ></canvas>
        <canvas id="speed_chart" ></canvas>
        <canvas id="heartbeat_chart" ></canvas>

        <canvas id="average_temp" ></canvas>
        <canvas id="average_hum" ></canvas>
        <canvas id="average_trips" ></canvas>





    </div>

</div>
</body>
</html>
