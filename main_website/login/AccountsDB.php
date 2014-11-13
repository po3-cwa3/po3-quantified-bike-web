<?php

class AccountsDB extends SQLite3 {

    function __construct() {

        $this->open("accounts.db");
    }
}

$db = new AccountsDB();

if (!$db) {
    echo $db->lastErrorMsg();
}

?>