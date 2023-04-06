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
    if (!isset($_POST["userid"]) || !isset($_POST["token"])) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // read the user id from the POST request
    $userId = $_POST["userid"];
    $token = $_POST["token"];

    // check if userid is empty
    if (empty($userId) || empty($token)) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // check if the token is valid by searching tokens for the token and userid
    // tokens schema:
    // CREATE TABLE IF NOT EXISTS tokens (
    // id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // userid INT(6) UNSIGNED NOT NULL,
    // token VARCHAR(256) NOT NULL,
    // created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    // FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
    // )

    // search for the token
    $sql = "SELECT * FROM tokens WHERE token='$token' AND userid='$userId'";
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

    // returns the number of posts in the database that the user follows
    // posts schema:
    // CREATE TABLE IF NOT EXISTS posts (
    // id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // userid INT(6) UNSIGNED NOT NULL,
    // title VARCHAR(50) NOT NULL,
    // description VARCHAR(500) NOT NULL,
    // image LONGBLOB NOT NULL,
    // imagetype VARCHAR(50) NOT NULL,
    // post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    // FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
    // )

    // follows schema
    // CREATE TABLE IF NOT EXISTS follows (
    //     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    //     userid INT(6) UNSIGNED NOT NULL,
    //     otheruserid INT(6) UNSIGNED NOT NULL,
    //     FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    //     FOREIGN KEY (otheruserid) REFERENCES users(id) ON DELETE CASCADE
    //     )

    $sql = "SELECT COUNT(*) FROM posts WHERE userid IN (SELECT otheruserid FROM follows WHERE userid='$userId')";

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
