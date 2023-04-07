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

    // verify it is set
    if (!isset($_POST["useridToCheck"]) || !isset($_POST["userid"]) || !isset($_POST["token"])) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // get from POST request
    $useridToCheck = $_POST["useridToCheck"];
    $userid = $_POST["userid"];
    $token = $_POST["token"];

    // verify not empty
    if (empty($useridToCheck) || empty($userid) || empty($token)) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }


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

    // follows table schema:
    // CREATE TABLE IF NOT EXISTS follows (
    //     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    //     userid INT(6) UNSIGNED NOT NULL,
    //     otheruserid INT(6) UNSIGNED NOT NULL,
    //     FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    //     FOREIGN KEY (otheruserid) REFERENCES users(id) ON DELETE CASCADE
    //     )

    // check if already following
    $sql = "SELECT * FROM follows WHERE userid='$userid' AND otheruserid='$useridToCheck'";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $response = array(
            "isFollowing" => true
        );
        echo json_encode($response);
        return;
    } else {
        $response = array(
            "isFollowing" => false
        );
        echo json_encode($response);
        return;
    }

?>
