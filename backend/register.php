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

    $data = json_decode($_POST["data"], false);
    // {"username":"admin","password":"admin"}

    // read the firstName, lastName, email, username, and password from the json request
    $firstName = $data->firstName;
    $lastName = $data->lastName;
    $email = $data->email;
    $username = $data->username;
    $password = $data->password;

    // check that all the fields are filled in
    if ($firstName == "" || $lastName == "" || $email == "" || $username == "" || $password == "") {
        $response = array(
            "error" => "Please fill in all fields"
        );
        echo json_encode($response);
        return;
    }

    // check if the username or email already exists
    $sql = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";

    // execute the query
    $result = $conn->query($sql);

    // if the query returns a row, then the username or email is already in use
    // return an error as a json object
    $numRows = $result->num_rows;
    if ($numRows > 0) {

        // error
        $response = array(
            "error" => "Username or email already exists"
        );
        echo json_encode($response);

    }

    // now we can create a user with these details
    $sql2 = "INSERT INTO users (firstname, lastname, email, username, password) VALUES ('$firstName', '$lastName', '$email', '$username', '$password')";

    // execute the query
    $result2 = $conn->query($sql2);

    // check for errors
    if ($result2 === TRUE) {

        // success
        $response = array(
            "success" => "User created"
        );
        echo json_encode($response);

    } else {

        // error
        $response = array(
            "error" => "Error creating user"
        );
        echo json_encode($response);

    }

?>
