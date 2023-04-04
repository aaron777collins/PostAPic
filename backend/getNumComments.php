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

if (isset($_POST["postid"])) {
    // echo "All fields are set";
} else {
    $response = array(
        "error" => "Please fill in all fields"
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


// counts the number of comments for a post
$sql = "SELECT COUNT(*) FROM comments WHERE postid = $postid";

$result = $conn->query($sql);

// return the count
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $response = array(
        "count" => $row["COUNT(*)"]
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
