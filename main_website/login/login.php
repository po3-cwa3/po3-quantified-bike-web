<?php

// Setup the session
require('session.php');

// If the user is still set, destroy the session and unset the user
// Then go back to the login page with a given error
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

// Prepare the SQL query
$sql = <<<EOF
SELECT id, username, password, user_id FROM accounts WHERE username = "$username";
EOF;

// Execute the query
$ret = $db->query($sql);

// Get the database user
$databaseUser = $ret->fetchArray(SQLITE3_ASSOC);

// If there is no database user, there is no account with the given username
if (!$databaseUser) {

    notAuthorised("There is no account with the given username.");

    // If there is a user with the given username, check whether the password is correct
} else if ($databaseUser['password'] != $password) {

    notAuthorised("The given password was incorrect.");
}


// if the user is registered, make a User object containing the user info
$user = new User();
$user->username = $username;
$user->password = $password;
$user->id = $databaseUser['id'];
$user->user_id = $databaseUser['user_id'];

// set the session User object to the one we just created
$_SESSION['user'] = $user;

// See whether there is a specific page set to redirect to
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
    header("Location: loginForm.php?msg=$message");
    exit();
}

?>