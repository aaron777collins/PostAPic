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

if (empty($postid) || empty($userid) || empty($token)) {
    $response = array(
        "error" => "Please fill in all fields"
    );
    echo json_encode($response);
    return;
}

// Validate token and userid by checking if the token and userid is in the database
$sql = "SELECT userid FROM tokens WHERE token='$token' AND userid='$userid'";
$result = $conn->query($sql);
if ($result->num_rows == 0) {
    $response = array(
        "error" => "Invalid token. Please log in again."
    );
    echo json_encode($response);
    return;
}


// searching table with schema:
// CREATE TABLE IF NOT EXISTS likedby (
//     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     postid INT(6) UNSIGNED NOT NULL,
//     userid INT(6) UNSIGNED NOT NULL,
//     FOREIGN KEY (postid) REFERENCES posts(id), (with ON DELETE CASCADE)
//     FOREIGN KEY (userid) REFERENCES users(id) (with ON DELETE CASCADE)
//     )

// seeing if the user has already liked the post
$sql = "SELECT * FROM likedby WHERE postid = $postid AND userid = $userid";

// if the user has already liked the post, ignore the request

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $response = array(
        "error" => "You have already liked this post"
    );
    echo json_encode($response);
    return;
}

// if the user has not liked the post, add a new row to the table

$sql = "INSERT INTO likedby (postid, userid) VALUES ($postid, $userid)";

$result = $conn->query($sql);

if ($result) {
    $response = array(
        "success" => "You have liked this post"
    );
    echo json_encode($response);
    return;
} else {
    $response = array(
        "error" => "Something went wrong"
    );
    echo json_encode($response);
    return;
}
