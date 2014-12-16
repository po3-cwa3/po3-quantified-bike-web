<?php

require('login/session.php');

if (!isset($user)) {

    header('Location: login/loginForm.php?from=' . urlencode('../photos.php'));
    exit();

}

?>


<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bike of StatS</title>
    <meta name="description" content="BOSS: Bike Of StatS" />
    <meta name="keywords" content="BOSS, bike, data, dashboard, home" />
    <meta name="author" content="BOSS" />
    <link rel="shortcut icon" href="../favicon.ico">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" type="text/css" href="Bootstrap/css/bootstrap.css">

    <!-- Main CSS -->
    <link rel="stylesheet" type="text/css" href="css/main.css" />
    <link rel="stylesheet" type="text/css" href="css/component.css" />

    <!-- Map CSS -->
    <link rel="stylesheet" type="text/xss" href="css/mapstyle.css" />

    <!-- jQuery -->
    <script type="text/javascript" charset="utf8" src="js/jQuery.js"></script>

    <!-- Main JS -->
    <script src="js/main.js"></script>

    <!-- PhotosController JS -->
    <script src="js/photosController.js"></script>

    <!-- jQuery UI (for datepicker) -->
    <script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>

    <!-- Google Maps API -->
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>

    <!-- DataController JS -->
    <script src="js/dataController.js"></script>

    <!-- JS for setting user variables -->
    <script>
        var global_user = {};
        global_user.user_id = "<?php echo $user->user_id ?>";
        global_user.username = "<?php echo $user->username ?>";
        global_user.id = "<?php echo $user->id ?>";
    </script>

</head>
<body>
<div class="container">
    <div id="header-loader"></div>
    <div id="mapContainer">
        <div id="calendar"></div>
        <button id="clearAll">Clear all pictures</button>
        <div id="MapCanvas">
        </div>
        <div id="spinnerContainer" >
            <br>
            <p id="loadingText">Loading data...</p>
            <div class="loadingSpinner" style="display: block"></div>
            <p id="pleaseWait" class="loadingText">Please wait</p>
        </div>
    </div>




</div>
</body>
</html>
