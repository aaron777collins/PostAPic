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

// comment table schema:
// CREATE TABLE IF NOT EXISTS comments (
//     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     userid INT(6) UNSIGNED NOT NULL,
//     postid INT(6) UNSIGNED NOT NULL,
//     comment VARCHAR(500) NOT NULL,
//     comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (userid) REFERENCES users(id), (with ON DELETE CASCADE)
//     FOREIGN KEY (postid) REFERENCES posts(id) (with ON DELETE CASCADE)
//     )

// token table schema:
// CREATE TABLE IF NOT EXISTS tokens (
    // id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // userid INT(6) UNSIGNED NOT NULL,
    // token VARCHAR(256) NOT NULL,
    // created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    // FOREIGN KEY (userid) REFERENCES users(id) (with ON DELETE CASCADE)
    // )

if (isset($_POST["postid"]) && isset($_POST["userid"]) && isset($_POST["token"])) {
    // echo "All fields are set";
} else {
    $response = array(
        "error" => "Please fill in all fields"
    );
    echo json_encode($response);
    return;
}

$postid = $_POST["postid"];
$userid = $_POST["userid"];
$token = $_POST["token"];

// check if token is valid
$sql = "SELECT * FROM tokens WHERE token='$token' AND userid='$userid'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // echo "Token is valid";
} else {
    $response = array(
        "error" => "Invalid token. Please log in again."
    );
    echo json_encode($response);
    return;
}

// User table schema:
// CREATE TABLE IF NOT EXISTS users (
    // id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // username VARCHAR(50) NOT NULL,
    // firstname VARCHAR(50) NOT NULL,
    // lastname VARCHAR(50) NOT NULL,
    // password VARCHAR(256) NOT NULL,
    // email VARCHAR(50),
    // reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    // )

// check if the userid is the admin user
$sql = "SELECT * FROM users WHERE id='$userid' AND username='admin'";
$result = $conn->query($sql);

// if the user is the admin user, delete the comment regardless of the userid
// else, delete the comments where the userid matches the userid of the comment

// posts schema
// CREATE TABLE IF NOT EXISTS posts (
    // id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // userid INT(6) UNSIGNED NOT NULL,
    // title VARCHAR(50) NOT NULL,
    // description VARCHAR(500) NOT NULL,
    // image LONGBLOB NOT NULL,
    // imagetype VARCHAR(50) NOT NULL,
    // post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    // FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
    // )

if ($result->num_rows > 0) {
    // admin
    // delete post
    $sql = "DELETE FROM posts WHERE id='$postid'";

    $result2 = $conn->query($sql);

    if ($result2) {
        $response = array(
            "success" => "Post deleted successfully"
        );
        echo json_encode($response);
        return;
    } else {
        $response = array(
            "error" => "Error deleting post"
        );
        echo json_encode($response);
        return;
    }

} else {

    // delete post using the userid
    $sql = "DELETE FROM posts WHERE id='$postid' AND userid='$userid'";

    $result2 = $conn->query($sql);

    if ($result2) {
        $response = array(
            "success" => "Post deleted successfully"
        );
        echo json_encode($response);
        return;
    } else {
        $response = array(
            "error" => "Error deleting post"
        );
        echo json_encode($response);
        return;
    }

}
