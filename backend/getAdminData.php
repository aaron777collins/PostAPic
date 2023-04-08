<?php


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

    // users schema:
    // CREATE TABLE IF NOT EXISTS users (
    //     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    //     username VARCHAR(50) NOT NULL,
    //     firstname VARCHAR(50) NOT NULL,
    //     lastname VARCHAR(50) NOT NULL,
    //     password VARCHAR(256) NOT NULL,
    //     email VARCHAR(50),
    //     reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    // )

    // posts schema:
    // CREATE TABLE IF NOT EXISTS posts (
    //     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    //     userid INT(6) UNSIGNED NOT NULL,
    //     title VARCHAR(50) NOT NULL,
    //     description VARCHAR(500) NOT NULL,
    //     image LONGBLOB NOT NULL,
    //     imagetype VARCHAR(50) NOT NULL,
    //     post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //     FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
    //     )

    // returning the number of posts and the number of accounts

    $sql = "SELECT COUNT(*) FROM users";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $numUsers = $row["COUNT(*)"];

    $sql = "SELECT COUNT(*) FROM posts";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $numPosts = $row["COUNT(*)"];

    $response = array(
        "numUsers" => $numUsers,
        "numPosts" => $numPosts
    );

    echo json_encode($response);
    return;


?>
