<?php

// See whether ther is a message set to display
$message = "";

if (isset($_GET['msg'])) {
    $message = $_GET['msg'];
}

// See whether there is a specific page set to which the register should redirect
$from = "";

if (isset($_GET['from'])) {
    $from = '?to=' . urlencode($_GET['from']);
}

?>

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

    <p id="errorMessage"><?php echo $message ?></p>

    <h1>Please choose a username and password.</h1>

    <form id="registerForm" action="register.php<?php echo $from ?>" method="post">

        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <input type="submit" value="Register">

    </form>

    <a href="loginForm.php">Already have an account?</a>

</div>

</body>
</html>
