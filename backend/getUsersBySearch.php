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
    if (!isset($_POST["username"]) || !isset($_POST["page"]) || !isset($_POST["usersPerPage"])) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // get from POST request
    $username = $_POST["username"];
    $page = $_POST["page"];
    $usersPerPage = $_POST["usersPerPage"];

    // verify not empty
    if (empty($username) || empty($page) || empty($usersPerPage)) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }


    $offset = ($page - 1) * $usersPerPage;

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

    // get users by username search with pagination
    $sql = "SELECT * FROM users WHERE username LIKE '$username_search' LIMIT $offset, $usersPerPage";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $users = array();
        while ($row = $result->fetch_assoc()) {
            $user = array(
                "id" => $row["id"],
                "username" => $row["username"],
                "firstname" => $row["firstname"],
                "lastname" => $row["lastname"],
                "email" => $row["email"],
                "reg_date" => $row["reg_date"]
            );
            array_push($users, $user);
        }
        $response = array(
            "users" => $users
        );
        echo json_encode($response);
        return;
    } else {
        $response = array(
            "error" => "No users found."
        );
        echo json_encode($response);
        return;
    }

?>
