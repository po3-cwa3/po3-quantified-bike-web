<?php

require('session.php');

$_SESSION = Array();
session_destroy();
unset($user);

$message = "You have successfully logged out.";

header("Location: loginForm.php?msg=$message");

?>