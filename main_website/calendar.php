<?php

// Setup the session
require('login/session.php');

// If there is no user logged in, redirect to the login page
if (!isset($user)) {

    header('Location: login/loginForm.php?from=' . urlencode('../calendar.php'));
    exit();

}

?>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
		<meta name="author" content="BOSS" >
		<meta name="description" content="BOSS Website" >
		<meta name="keywords" content="BOSS, Bike, Stats" >

		<title>Bike of StatS - Calendar</title>

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" type="text/css" href="Bootstrap/css/bootstrap.css">

        <!-- Main Theme CSS -->
        <link rel="stylesheet" media="screen" type="text/css" href="css/main.css">

        <!-- Calendar CSS -->
        <link rel="stylesheet" media="screen" type="text/css" href="css/calendar.css">

		<!-- DataTables CSS -->
		<link rel="stylesheet" type="text/css" href="http://cdn.datatables.net/1.10.2/css/jquery.dataTables.css">

		<!-- jQuery -->
		<script type="text/javascript" charset="utf8" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>

        <!-- Main Theme JS -->
		<script src="js/main.js"></script>
  
		<!-- DataTables JS -->
		<script type="text/javascript" charset="utf8" src="http://cdn.datatables.net/1.10.2/js/jquery.dataTables.js"></script>
		
		<!-- jQuery ScrollTo JS -->
		<script src="ScrollTo plugin/jquery-scrollto.js"></script>

        <!-- Google Maps API -->
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>

        

        <!-- Bootstrap JS -->
        <!-- <script type="text/javascript" charset="utf8" src="Bootstrap/js/bootstrap.js"></script> -->

        <!-- Data Controller JS -->
        <script src="js/dataController.js"></script>

        <!-- JS for setting user variables -->
        <script>
            var global_user = {};
            global_user.user_id = "<?php echo $user->user_id ?>";
            global_user.username = "<?php echo $user->username ?>";
            global_user.id = "<?php echo $user->id ?>";
        </script>

        <!-- Calendar Controller JS -->
        <script src="js/calendarController.js"></script>



	</head>
	<body>

	<div class="container">
		<div id="header-loader"></div>
	</div>

    <div id="content">

        <div id="contentWrapper">

            <div id="calendarWrapper">

                <div class="containerHeader">

                    <h1>Calendar</h1>

                    <div  id="calendarBarSelectContainer">

                        <div>

                            <img src="Images/arrow.svg">

                            <select id="calendarBarSelect"></select>

                            <img src="Images/arrow.svg">

                        </div>

                    </div>

                    <h1 class="month"><img id="prev_month" src="Images/arrow.svg" height="20px"><span id="monthTitleSpan">October, 2014</span><img id="next_month" src="Images/arrow.svg" height="20px"></h1>

                </div>

                <table id="calendarTable">

                    <thead>

                    <tr>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                        <th>Sun</th>
                    </tr>

                    </thead>

                    <tbody></tbody>

                </table>

            </div>

            <div id="detailSection" style="display: none;">

                <div class="containerHeader">

                    <h1>Details</h1>

                    <h1 id="detailsDayH1" class="mid">Day</h1>

                    <div id="detailCloseButton">×</div>

                </div>

                <div id="detailsContainer">

                    <table id="detailsContainerTable">

                        <thead>

                        <tr>

                            <th>Averages</th>
                            <th>Map</th>

                        </tr>

                        </thead>

                        <tbody>

                        <tr>

                            <td id="detailsAveragesViewContainer"></td>

                            <td id="detailsMapViewContainer">

                                <div id="detailsMapCanvas"></div>

                            </td>

                        </tr>

                        </tbody>

                    </table>

                </div>

                <div class="loadingSpinner" style="display: none"></div>

            </div>

        </div>

    </div>
		
	</body>
</html>
