<?php

    // check that the username and password match. If so, issue them a session token and return the info

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

    $data = json_decode($_POST["data"], false);
    // {"username":"admin","password":"admin"}

    // read the username and password from the json request
    $username = $data->username;
    $password = $data->password;

    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";

    // execute the query
    $result = $conn->query($sql);

    // if the query returns a row, then the username and password match
    // issue a session token and return the user info
    // otherwise, return an error
    $numRows = $result->num_rows;
    if ($numRows > 0) {

        if ($numRows > 1) {
            // too many rows returned
            // this should never happen
            // return an error
            // return json with error
            $response = array(
                "error" => "Too many rows returned",
                "dump" => $result->fetch_all()
            );
            echo json_encode($response);
            return;
        }

        // username found, password matches
        // issue a session token
        $token = uniqid();
        // store in session
        $_SESSION["token"] = $token;
        // store username
        $_SESSION["username"] = $username;

        // return the user info as JSON
        $row = $result->fetch_assoc();
        $response = array(
            "id" => $row["id"],
            "username" => $row["username"],
            "firstName" => $row["firstname"],
            "lastName" => $row["lastname"],
            "email" => $row["email"],
            "token" => $token
        );
        echo json_encode($response);
        return;
    } else {
        // username not found or password does not match
        // return an error
        $response = array(
            "error" => "Username or password incorrect"
        );
        echo json_encode($response);
        return;
    }

?>
