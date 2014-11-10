<?php

require('session.php');

$_SESSION = Array();
session_destroy();
unset($user);

$message = "You are successfully logged out.";

header("Location: loginForm.php?msg=$message");

?>