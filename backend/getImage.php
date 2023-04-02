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

if (isset($_GET['post_id'])) {
    $sql = "SELECT imageType,image FROM posts WHERE id=?";
    $statement = $conn->prepare($sql);
    $statement->bind_param("i", $_GET['post_id']);
    $statement->execute() or die("<b>Error:</b> Problem on Retrieving Image BLOB<br/>");
    $result = $statement->get_result();

    $row = $result->fetch_assoc();
    header("Content-type: " . $row["imageType"]);
    echo $row["imageData"];
} else {
    echo "Post: " . $_GET['post_id'] . "Not found";
}
?>
