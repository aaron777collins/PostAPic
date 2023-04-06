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
    if (!isset($_POST["page"]) || !isset($_POST["postsPerPage"]) || !isset($_POST["userid"]) || !isset($_POST["token"])) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // get from POST request
    $userid = $_POST["userid"];
    $token = $_POST["token"];
    $page = $_POST["page"];
    $postsPerPage = $_POST["postsPerPage"];

    // verify not empty
    if (empty($page) || empty($postsPerPage) || empty($userid) || empty($token)) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // search for the token
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


    $offset = ($page - 1) * $postsPerPage;

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

    // returns posts from users that the user follows

    $sql = "SELECT * FROM posts WHERE userid IN (SELECT otheruserid FROM follows WHERE userid = $userid) ORDER BY post_date DESC LIMIT $offset, $postsPerPage";

    // image is a longblob.

    $result = $conn->query($sql);
    $posts = array();
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;

        // find the username of the user who posted this post
        $userid = $row["userid"];
        $sql = "SELECT username FROM users WHERE id = $userid";
        $result2 = $conn->query($sql);
        $row2 = $result2->fetch_assoc();
        $posts[count($posts) - 1]["author"] = $row2["username"];
        if ($posts[count($posts) - 1]["author"] == null) {
            $posts[count($posts) - 1]["author"] = "Unknown";
        }
    }

    if (count($posts) == 0) {
        $response = array(
            "error" => "No posts found"
        );
        echo json_encode($response);
        return;
    } else {
        $response = array(
            "results" => $posts
        );
        echo json_encode($response);
        return;
    }


?>
