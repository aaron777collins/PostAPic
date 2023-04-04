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

    // $data = json_decode($_POST["data"], false);


    // $title = $data->title;
    // $description = $data->description;
    // $image = $data->image;
    // $imagetype = $data->imagetype;
    // $token = $data->token;

    if (isset($_POST["title"]) && isset($_POST["description"]) && isset($_FILES["image"]) && isset($_POST["imagetype"]) && isset($_POST["token"]) && $_FILES['image']['error'] == 0) {
        // echo "All fields are set";
    } else {
        $response = array(
            "error" => "Please fill in all fields"
        );
        echo json_encode($response);
        return;
    }

    $title = $_POST["title"];
    $description = $_POST["description"];
    // $image = $_FILES["image"];
    $imagetype = $_POST["imagetype"];
    $token = $_POST["token"];

    // ensure type matches and is jpeg, jpg, png or gif
    if ($imagetype != "image/jpeg" && $imagetype != "image/jpg" && $imagetype != "image/png" && $imagetype != "image/gif") {
        $response = array(
            "error" => "Please upload a JPEG, PNG or GIF image"
        );
        echo json_encode($response);
        return;
    }

    if ($_FILES['image']['type'] != $imagetype) {
        $response = array(
            "error" => "Image type does not match"
        );
        echo json_encode($response);
        return;
    }


    // Remove the data:image/jpeg;base64, part from the base64 string
    // $base64Image = substr($image, strpos($image, ",") + 1);

    $image = file_get_contents($_FILES['image']['tmp_name']);
    $base64Image = base64_encode($image);

    // $base64Image = $image;

    // check that all the fields are filled in
    if ($title == "" || $description == "" || $base64Image == "" || $imagetype == "") {
        $response = array(
            "error" => "Please fill in all fields"
        );
        echo json_encode($response);
        return;
    }

    if ($imagetype != "image/jpeg" && $imagetype != "image/jpg" && $imagetype != "image/png" && $imagetype != "image/gif") {
        $response = array(
            "error" => "Please upload a JPEG or PNG image"
        );
        echo json_encode($response);
        return;
    }


    // CREATE TABLE IF NOT EXISTS posts (
    // id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // userid INT(6) UNSIGNED NOT NULL,
    // title VARCHAR(50) NOT NULL,
    // description VARCHAR(500) NOT NULL,
    // image LONGBLOB NOT NULL,
    // imagetype VARCHAR(50) NOT NULL,
    // post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    // FOREIGN KEY (userid) REFERENCES users(id)
    // )

    // get username from token tables
    // tokens table schema:
    // CREATE TABLE IF NOT EXISTS tokens (
    // id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    // userid INT(6) UNSIGNED NOT NULL,
    // token VARCHAR(256) NOT NULL,
    // created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    // FOREIGN KEY (userid) REFERENCES users(id)
    // )
    $sql_token = "SELECT userid FROM tokens WHERE token='$token'";
    $result_token = $conn->query($sql_token);
    $row_token = $result_token->fetch_assoc();
    $userid = $row_token["userid"];

    if ($userid == "") {
        $response = array(
            "error" => "Invalid token"
        );
        echo json_encode($response);
        return;
    }

    // store in db
    $sql = "INSERT INTO posts (userid, title, description, image, imagetype) VALUES ($userid, '$title', '$description', '$base64Image', '$imagetype')";

    // execute
    $result2 = $conn->query($sql);
    // check results
    if ($result2) {
        // return all data from the post that was just created
        $response = array(
            "success" => array(
                "id" => $conn->insert_id,
                "userid" => $userid,
                "title" => $title,
                "description" => $description,
                "image" => $base64Image, // Use imageData here to return the base64 encoded image
                "imagetype" => $imagetype,
                "post_date" => date("Y-m-d H:i:s"))
        );
        echo json_encode($response);
        return;
    } else {
        $response = array(
            "error" => "Error creating post"
        );
        echo json_encode($response);
        return;
    }
?>
