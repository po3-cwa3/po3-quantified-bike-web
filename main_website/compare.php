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

    <!-- Main Theme JS -->
    <script src="js/main.js"></script>

    <!-- chart JS -->
    <script src="js/ChartNew.js"></script>

    <!-- Bootstrap JS -->
    <script type="text/javascript" charset="utf8" src="Bootstrap/js/bootstrap.js"></script>

    <!-- Data Controller JS -->
    <script src="js/dataController.js"></script>

    <!-- Compare Controller JS -->
    <script src="js/compare.js"></script>

</head>
<body>
<div class="container">
    <div id="header-loader"></div>
    <div class="content">
        <div>
            <h2>choose trips to compare</h2><br>

            <a id="month">month:</a><br>
            <select id="select_month" class="select_month"></select>
            <button id="show_month">select month</button>
            <br>
            <p id="day">day:</p>
            <select id="select_day" class="select_day"></select>
            <button id="show_day">select day</button>
            <br>
            <p id="trip">trip:</p>
            <select id="select_trip" class="select_trip"></select>
            <button id="show_trip">select trip</button>

        </div><br><br>

        <button id="start_comparing">compare</button><br>
        <button id="example">example graph</button>
        <table id="table_compare" class="table_compare">
            <tr id="elements_to_compare"></tr>

            <tr id="table_day"></tr>

            <tr id="km"></tr>

            <tr id="duration"></tr>

        </table>

        <canvas id="first_chart" width="400" height="400"></canvas>

        <div id="outer" class="circle"><div id="inner" class="circle"><div><h3>hello!</h3></div></div></div>

    </div>

</div>
</body>
</html>
