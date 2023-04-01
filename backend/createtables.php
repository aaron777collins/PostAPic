<?php

// connect to the mysql database and create the users table
// if it doesn't already exist

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
    die("Connection failed: " . $conn->connect_error);
}

// sql to create tables (users, posts, comments, likedby, follows) with relationships
$sql1 = "CREATE TABLE IF NOT EXISTS users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(50),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
$sql2 = "CREATE TABLE IF NOT EXISTS posts (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userid INT(6) UNSIGNED NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    image LONGBLOB NOT NULL,
    imagetype VARCHAR(50) NOT NULL,
    post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id)
    )";
$sql3 = "CREATE TABLE IF NOT EXISTS comments (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userid INT(6) UNSIGNED NOT NULL,
    postid INT(6) UNSIGNED NOT NULL,
    comment VARCHAR(500) NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
    )";
$sql4 = "CREATE TABLE IF NOT EXISTS likedby (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    postid INT(6) UNSIGNED NOT NULL,
    userid INT(6) UNSIGNED NOT NULL,
    FOREIGN KEY (postid) REFERENCES posts(id),
    FOREIGN KEY (userid) REFERENCES users(id)
    )";
$sql5 = "CREATE TABLE IF NOT EXISTS follows (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userid INT(6) UNSIGNED NOT NULL,
    otheruserid INT(6) UNSIGNED NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (otheruserid) REFERENCES users(id)
    )";

$sql6 = "CREATE TABLE IF NOT EXISTS tokens (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userid INT(6) UNSIGNED NOT NULL,
    token VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id)
    )";

$sql7 = "SELECT * FROM users WHERE username = 'admin' AND password = 'admin'";



// executing sql query
$result1 = mysqli_query($conn, $sql1);
$result2 = mysqli_query($conn, $sql2);
$result3 = mysqli_query($conn, $sql3);
$result4 = mysqli_query($conn, $sql4);
$result5 = mysqli_query($conn, $sql5);
$result6 = mysqli_query($conn, $sql6);
$result7 = mysqli_query($conn, $sql7);

// check if $result7 is empty
if ($result7->num_rows == 0) {
    // add admin account with username: admin, password: admin
    // only if admin doesn't exist
    $addAdmin = "INSERT INTO users (username, firstname, lastname, password, email) VALUES ('admin', 'admin', 'admin', 'admin', 'admin@example.com')";
    $result7 = mysqli_query($conn, $addAdmin);
    // sends result back in JSON format
    echo json_encode(array("results" => array($result1, $result2, $result3, $result4, $result5, $result6, $result7)));
    return;
}


// sends result back in JSON format
echo json_encode(array("results" => array($result1, $result2, $result3, $result4, $result5, $result6, $result7)));
