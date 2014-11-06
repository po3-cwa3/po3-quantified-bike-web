<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bike of StatS</title>
    <meta name="description" content="BOSS Login" />
    <meta name="keywords" content="BOSS, Login" />
    <meta name="author" content="BOSS" />
    <link rel="shortcut icon" href="../favicon.ico">
    <link rel="stylesheet" type="text/css" href="../css/main.css" />
    <link rel="stylesheet" type="text/css" href="login.css" />
    <script type="text/javascript" charset="utf8" src="../js/jQuery.js"></script>
    <script type="text/javascript" charset="utf8" src="loginController.js"></script>
</head>
<body>

    <div id="login">

        <p id="errorMessage"><?php

            if (isset($_GET['msg'])) {
                echo $_GET['msg'];
            }

            ?></p>

        <h1>Login</h1>

        <form id="loginForm" action="login.php" method="post">

            <input type="text" name="username" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <input type="submit">

        </form>

    </div>

</body>
</html>
