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

if (isset($_POST["postid"]) && isset($_POST["userid"])) {
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

if (empty($postid) || empty($userid)) {
    $response = array(
        "error" => "Please fill in all fields"
    );
    echo json_encode($response);
    return;
}

// searching table with schema:
// CREATE TABLE IF NOT EXISTS likedby (
//     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     postid INT(6) UNSIGNED NOT NULL,
//     userid INT(6) UNSIGNED NOT NULL,
//     FOREIGN KEY (postid) REFERENCES posts(id),
//     FOREIGN KEY (userid) REFERENCES users(id)
//     )

$sql = "SELECT * FROM likedby WHERE postid = $postid AND userid = $userid";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $response = array(
        "liked" => true
    );
    echo json_encode($response);
    return;
} else {
    $response = array(
        "liked" => false
    );
    echo json_encode($response);
    return;
}

?>
