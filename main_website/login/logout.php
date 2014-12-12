<?php

// Setup the session
require('session.php');

// Reset the session, destroy it and unset the user variable
$_SESSION = Array();
session_destroy();
unset($user);

// Set the message for the login form
$message = "You have successfully logged out.";

// Redirect to the login form with the message in a GET request
header("Location: loginForm.php?msg=$message");

?>