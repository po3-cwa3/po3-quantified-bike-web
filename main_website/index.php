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
        <link rel="stylesheet" type="text/css" href="Bootstrap/css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="css/main.css" />
		<link rel="stylesheet" type="text/css" href="css/component.css" />
        <script type="text/javascript" charset="utf8" src="js/jQuery.js"></script>
        <script type="text/javascript" charset="utf8" src="Bootstrap/js/bootstrap.js"></script>
        <script src="js/main.js"></script>
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
						<a href="maps.php">
							<span class="cbp-ig-icon cbp-ig-icon-maps"></span>
							<h3 class="cbp-ig-title">maps</h3>
							<span class="cbp-ig-category">all your trips together</span>
						</a>
					</li>

				</ul>
			</div>

		</div>
	</body>
</html>
