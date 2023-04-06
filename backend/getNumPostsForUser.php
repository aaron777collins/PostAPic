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

    // verify that the userid is in the request
    if (!isset($_POST["userid"])) {
        $response = array(
            "error" => "Please fill in all required fields. userid is required."
        );
        echo json_encode($response);
        return;
    }

    // read the user id from the POST request
    $userId = $_POST["userid"];

    // check if userid is empty
    if (empty($userId)) {
        $response = array(
            "error" => "Please fill in all required fields. userid is required."
        );
        echo json_encode($response);
        return;
    }


    // returns the number of posts in the database for the user
    $sql = "SELECT COUNT(*) FROM posts WHERE userid = $userId";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response = array(
            "numPosts" => $row["COUNT(*)"]
        );
        echo json_encode($response);
    } else {
        $response = array(
            "error" => "No posts found"
        );
        echo json_encode($response);
    }

?>
