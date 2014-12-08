<?php

error_reporting(E_ALL);
ini_set( 'display_errors','1');

require('session.php');

if (isset($user)) {

    session_destroy();
    unset($user);

    notAuthorised('There was an error, we are very sorry for the inconvenience. Please try again.');
}

// redirect if username and/or password isn't set
if (!isset($_POST['username']) || !isset($_POST['password'])) {

    notAuthorised('You did not provide login credentials.');
}

// if login credentials are present, see whether the username is available.
$username = $_POST['username'];
$password = $_POST['password'];

$sql = <<<EOF
SELECT username FROM accounts WHERE username = "$username";
EOF;

$ret = $db->query($sql);

$databaseUser = $ret->fetchArray(SQLITE3_ASSOC);

$free = false;

if (!$databaseUser) {
    $free = true;
}

// if the username is not free, redirect
if (!$free) {

    notAuthorised("The given username is no longer available.");
}

$sql = <<<EOF
INSERT INTO accounts (username, password) VALUES ("$username", "$password");
EOF;

$ret = $db->exec($sql);

if (!$ret) {

    notAuthorised('We are very sorry. An error occurred during data entry. Please try again.');
}



// if the user is registered, make a User object containing the user info
$user = new User();
$user->username = $username;
$user->password = $password;

// set the session User object to the one we just created
$_SESSION['user'] = $user;

$to = "../index.php";
if (isset($_GET['to'])) {
    $to = $_GET['to'];
}

// redirect to index.php
header('Location: ' . $to);


// function to redirect to the login page with a certain error message
function notAuthorised($message) {

    // the message is passed in the URL with a GET request, therefore the message must be urlencoded
    $message = urlencode($message);

    // redirect to loginForm.php with the message in a GET request
    header("Location: registerForm.php?msg=$message");
    exit();
}

?>