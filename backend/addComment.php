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

// getting the data from the $_POST array
// Note that the comment schema is:
// id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
// userid INT(6) UNSIGNED NOT NULL,
// postid INT(6) UNSIGNED NOT NULL,
// comment VARCHAR(500) NOT NULL,
// comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
// FOREIGN KEY (userid) REFERENCES users(id), (with ON DELETE CASCADE)
// FOREIGN KEY (postid) REFERENCES posts(id) (with ON DELETE CASCADE)

$userid = $_POST["userid"];
$postid = $_POST["postid"];
$comment = $_POST["comment"];
$token = $_POST["token"];

if (empty($userid) || empty($token)) {
    $response = array(
        "error" => "Please log in again"
    );
    echo json_encode($response);
    return;
}

if (empty($userid) || empty($postid) || empty($comment) || empty($token)) {
    $response = array(
        "error" => "Please fill in all fields",
        "userid" => $userid,
        "postid" => $postid,
        "comment" => $comment,
        "token" => $token
    );
    echo json_encode($response);
    return;
}

// verify the token and userid
$sql = "SELECT * FROM tokens WHERE userid='$userid' AND token='$token'";
$result = $conn->query($sql);
if ($result->num_rows == 0) {
    $response = array(
        "error" => "Invalid token. Please log in again."
    );
    echo json_encode($response);
    return;
}

// add the comment to the database
$sql = "INSERT INTO comments (`userid`, `postid`, `comment`) VALUES ('$userid', '$postid', '$comment')";
$result = $conn->query($sql);
if ($result === TRUE) {
    $response = array(
        "success" => array(
            "userid" => $userid,
            "postid" => $postid,
            "comment" => $comment)
    );
    echo json_encode($response);
    return;
} else {
    $response = array(
        "error" => "Error adding comment"
    );
    echo json_encode($response);
    return;
}

?>
