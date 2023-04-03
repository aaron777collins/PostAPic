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

$postid = $_POST["postid"];

if (empty($postid)) {
    $response = array(
        "error" => "Please fill in all fields"
    );
    echo json_encode($response);
    return;
}

$sql = "SELECT * FROM comments WHERE postid = $postid ORDER BY comment_date";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $comments = array();
    while ($row = $result->fetch_assoc()) {

        // search users table for the username of the user
        $userid = $row["userid"];
        $sql = "SELECT username FROM users WHERE id = $userid";

        $conn->query($sql);
        $username = $conn->query($sql)->fetch_assoc()["username"];

        if (empty($username)) {
            $username = "Unknown";
        }


        $comment = array(
            "id" => $row["id"],
            "userid" => $row["userid"],
            "username" => $username,
            "postid" => $row["postid"],
            "comment" => $row["comment"],
            "comment_date" => $row["comment_date"]
        );
        array_push($comments, $comment);
    }
    $response = array(
        "comments" => $comments
    );
    echo json_encode($response);
    return;
} else {
    $response = array(
        "error" => "No comments found"
    );
    echo json_encode($response);
    return;
}


?>
