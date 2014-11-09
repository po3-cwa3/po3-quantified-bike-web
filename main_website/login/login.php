<?php

require('userClass.php');

// Set session name
session_name('qbLogin');

// Session lives for 1 minute
session_set_cookie_params(10);

// Start the session
session_start();

$allowedUsers = [
    "rugheid" => "boss",
    "lies" => "boss"
];

// redirect if username and/or password isn't set
if (!isset($_POST['username']) || !isset($_POST['password'])) {

    notAuthorised('You did not provide login credentials.');
}

// if login credentials are present, see whether they are registered.
$username = $_POST['username'];
$password = $_POST['password'];

// check whether the username is registered
if (!isset($allowedUsers[$username])) {

    notAuthorised('You are not registered yet, please register first.');
}

// check the password if the username is registered
if ($allowedUsers[$username] != $password) {

    notAuthorised('The password you entered was incorrect.');
}

// if the user is registered, make a User object containing the user info
$user = new User();
$user->username = $username;
$user->password = $password;

// set the session User object to the one we just created
$_SESSION['user'] = $user;

// redirect to index.php
header('Location: ../index.php');


// functino to redirect to the login page with a certain error message
function notAuthorised($message) {

    // the message is passed in the URL with a GET request, therefore the message must be urlencoded
    $message = urlencode($message);

    // redirect to loginForm.php with the message in a GET request
    header("Location: loginForm.php?msg=$message");
    exit();
}

?>