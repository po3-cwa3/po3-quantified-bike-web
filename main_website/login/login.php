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

$user = new User();
$user->username = $username;
$user->password = $password;

$_SESSION['user'] = $user;

// redirect to index.php
header('Location: ../index.php');



function notAuthorised($message) {

    $message = urlencode($message);

    header("Location: loginForm.php?msg=$message");
    exit();
}

?>