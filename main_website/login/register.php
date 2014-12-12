<?php

// Setup the session
require('session.php');

// If the user object is still set, destroy the session and unset the user
// Then redirect to the register form with an appropriate error
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

// Prepare the SQL query
$sql = <<<EOF
SELECT username FROM accounts WHERE username = "$username";
EOF;

// Execute the query
$ret = $db->query($sql);

// Fetch the database user if there is one
$databaseUser = $ret->fetchArray(SQLITE3_ASSOC);

// Initialise a variable that says whether the username is still free
$free = false;

// If there is no database user, the username is still free
if (!$databaseUser) {
    $free = true;
}

// if the username is not free, redirect
if (!$free) {

    notAuthorised("The given username is no longer available.");
}

// Perpare the register SQL query
$sql = <<<EOF
INSERT INTO accounts (username, password) VALUES ("$username", "$password");
EOF;

// Execute the query
$ret = $db->exec($sql);

// If the the query failed, redirect to the register form with an appropriate error
if (!$ret) {

    notAuthorised('We are very sorry. An error occurred during data entry. Please try again.');
}



// if the user is registered, make a User object containing the user info
$user = new User();
$user->username = $username;
$user->password = $password;

// set the session User object to the one we just created
$_SESSION['user'] = $user;

// Check whether there is a specific page given to redirect to
$to = "../index.php";
if (isset($_GET['to'])) {
    $to = $_GET['to'];
}

// redirect
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