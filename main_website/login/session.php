<?php

require('userClass.php');

// This is how long the session will live
$sessionTime = 100; // seconds

// Set the session name
session_name('qbLogin');

// Set the session lifetime
session_set_cookie_params($sessionTime);

// Start the session
session_start();

// If there is a user loged in, set the $user variable
if (isset($_SESSION['user'])) {
    $user = $_SESSION['user'];
}

?>