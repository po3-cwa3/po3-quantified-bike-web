<?php

// Create a subclass of SQLite3 for the accounts database
class AccountsDB extends SQLite3 {

    // Change the constructor to open the accounts database
    function __construct() {

        $this->open("accounts.db");
    }
}

// Set the db variable to an accounts database instance
$db = new AccountsDB();

// If the database could not be made, echo the last error message
if (!$db) {
    echo $db->lastErrorMsg();
}

?>