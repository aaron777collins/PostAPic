<?php

// this file is for testing purposes only and should not be used in production

// deletes all accounts except for the admin account

$servername = getenv("DB_HOST") ? getenv("DB_HOST") : "localhost"; // REPLACE with Database host, usually localhost

    if (getenv("DB_HOST")) {
        $servername = getenv("DB_HOST");
        $dbname = "pap";
        $dbuser = "pap";
    } else {
        $servername = "localhost";
        $dbname = "colli11s_pap";
        $dbuser = "colli11s_pap";
    }

    $dbpass = "secret";

    // Create connection
    $conn = new mysqli($servername, $dbuser, $dbpass, $dbname);

    // Check connection
    if ($conn->connect_error) {
        $response = array(
            "error" => "Connection refused"
        );
        echo json_encode($response);
        return;
    }

    $sql = "DELETE FROM users WHERE username != 'admin'";
    $result = $conn->query($sql);
    if ($result) {
        echo "Accounts deleted<br>";
    } else {
        echo "Error deleting accounts<br>";
    }

    $sql = "DELETE FROM posts";
    $result = $conn->query($sql);
    if ($result) {
        echo "Posts deleted";
    } else {
        echo "Error deleting posts";
    }


?>
