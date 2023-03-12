<?php

    // connect to the mysql database and create the users table
    // if it doesn't already exist

    $servername = "appdb:3306";

    // REPLACE with your Database name
    $dbname = "pap";

    $dbuser = "pap";
    $dbpass = "secret";

    // Create connection
    $conn = new mysqli($servername, $dbuser, $dbpass, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // sql to create table
    $sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(50),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";

    // executing sql query
    $result = mysqli_query($conn, $sql);

    // sends result back in JSON format
    echo json_encode(array("result" => $result));
?>