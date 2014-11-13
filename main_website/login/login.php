<?php

error_reporting(E_ALL);
ini_set( 'display_errors','1');

require('session.php');

$allowedUsers = [
    "rugheid" => "boss",
    "lies" => "boss",
    "guest" => "boss"
];

if (isset($user)) {

    session_destroy();
    unset($user);

    notAuthorised('There was an error, we are very sorry for the inconvenience. Please log in again.');
}

// redirect if username and/or password isn't set
if (!isset($_POST['username']) || !isset($_POST['password'])) {

    notAuthorised('You did not provide login credentials.');
}

// if login credentials are present, see whether they are registered.
$username = $_POST['username'];
$password = $_POST['password'];

$sql = <<<EOF
SELECT username, password FROM accounts WHERE username = "$username";
EOF;

$ret = $db->query($sql);

$databaseUser = $ret->fetchArray(SQLITE3_ASSOC);

if (!$databaseUser) {

    notAuthorised("There is no account with the given username.");

} else if ($databaseUser['password'] != $password) {

    notAuthorised("The given password was incorrect.");
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
    header("Location: loginForm.php?msg=$message");
    exit();
}

?>