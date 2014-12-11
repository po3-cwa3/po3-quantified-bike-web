<?php

require('login/session.php');

if (!isset($user)) {

    header('Location: login/loginForm.php?from=' . urlencode('../index.php'));
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

        <!-- Block Components CSS -->
		<link rel="stylesheet" type="text/css" href="css/component.css" />

        <!-- jQuery -->
        <script type="text/javascript" charset="utf8" src="js/jQuery.js"></script>

        <!-- Bootstrap JS -->
        <script type="text/javascript" charset="utf8" src="Bootstrap/js/bootstrap.js"></script>

        <!-- Main JS -->
        <script src="js/main.js"></script>

        <!-- Index JS -->
        <script src="js/indexController.js"></script>

	</head>
	<body>
		<div class="container">
			<div id="header-loader"></div>

			<div class="main">
				<ul class="cbp-ig-grid">
					<li>
						<a href="calendar.php">
							<span class="cbp-ig-icon cbp-ig-icon-calendar"></span>
							<h3 class="cbp-ig-title">Calendar view</h3>
							<span class="cbp-ig-category">easy detail viewer</span>
						</a>
					</li>
					<li>
						<a href="compare.php">
							<span class="cbp-ig-icon cbp-ig-icon-compare"></span>
							<h3 class="cbp-ig-title">compare view</h3>
							<span class="cbp-ig-category">multiple trips </span>
						</a>
					</li>
					<li>
						<a href="photos.php">
							<span class="cbp-ig-icon cbp-ig-icon-maps"></span>
							<h3 class="cbp-ig-title">photo viewer</h3>
							<span class="cbp-ig-category">view your photos on a map</span>
						</a>
					</li>

				</ul>
			</div>

		</div>

        <div id="welcome-message">
            <div id="welcome-container">
                <div id="welcomeCloseButton">×</div>
                <div id="welcome-header">
                    <h1>Welcome!</h1>
                </div>
                <p>
                    Welcome at the BOSS website, the Bike Of StatS! The website is divided into
                    three big parts. If you want to take a look at your biking experiences over time,
                    you can visit the Calendar. If you want to compare trips or days, you can visit the
                    Compare page. If you want to see the collection of photos you've taken, you
                    can visit the Photos page.
                </p>
            </div>
        </div>
	</body>
</html>
