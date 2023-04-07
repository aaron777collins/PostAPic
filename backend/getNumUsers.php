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
    if (!isset($_POST["username"])) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // get from POST request
    $username = $_POST["username"];

    // verify not empty
    if (empty($username)) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // users table schema:
    // CREATE TABLE IF NOT EXISTS users (
    // id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // username VARCHAR(50) NOT NULL,
    // firstname VARCHAR(50) NOT NULL,
    // lastname VARCHAR(50) NOT NULL,
    // password VARCHAR(256) NOT NULL,
    // email VARCHAR(50),
    // reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    // )

    $username_search = "%". implode("%", str_split($username)) . "%";

    // get number of usernames matching the search
    $sql = "SELECT COUNT(*) FROM users WHERE username LIKE '$username_search'";

    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response = array(
            "numUsers" => $row["COUNT(*)"]
        );
        echo json_encode($response);
    } else {
        $response = array(
            "error" => "No users found."
        );
        echo json_encode($response);
    }

?>
