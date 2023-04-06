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
    if (!isset($_POST["userid"]) || !isset($_POST["page"]) || !isset($_POST["postsPerPage"])) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }

    // read post request
    $userid = $_POST["userid"];
    $page = $_POST["page"];
    $postsPerPage = $_POST["postsPerPage"];

    // check if userid is empty
    if (empty($userid) || empty($page) || empty($postsPerPage)) {
        $response = array(
            "error" => "Please fill in all required fields."
        );
        echo json_encode($response);
        return;
    }


    $offset = ($page - 1) * $postsPerPage;

    // reading from schema like
    //     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // userid INT(6) UNSIGNED NOT NULL,
    // title VARCHAR(50) NOT NULL,
    // description VARCHAR(500) NOT NULL,
    // image LONGBLOB NOT NULL,
    // imagetype VARCHAR(50) NOT NULL,
    // post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    // FOREIGN KEY (userid) REFERENCES users(id) (with ON DELETE CASCADE)

    $sql = "SELECT * FROM posts WHERE userid = $userid ORDER BY post_date DESC LIMIT $offset, $postsPerPage";

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
