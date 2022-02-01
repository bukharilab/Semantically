<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/database.php';
// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get user id and content
    $first_name = $_GET['first_name'];
    $last_name = $_GET['last_name'];
    $email = $_GET['email'];
    $google_id = $_GET['google_id'];
    $img_url = $_GET['img_url'];
    // Check if document id given
    if ($first_name && $last_name && $email && $google_id) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        //Check if user is already registered
        $check = mysqli_query($db, "SELECT google_id FROM tbl_login WHERE email ='$email'");
        if (mysqli_num_rows($check) > 0) {
            http_response_code(200);
            echo json_encode(array('message' => 'User Already Exist'));
        } else {
            // Creatte new user
            $results = mysqli_query($db, sprintf("INSERT INTO tbl_login (first_name, last_name, email, google_id,img_url) VALUES ('%s', '%s', '%s', '%s','%s')", $first_name, $last_name, $email, $google_id, $img_url));
            // User was created
            if ($results) {
                http_response_code(200);
                // Turn to JSON & output
                echo json_encode(array('message' => 'success'));
            } else {
                http_response_code(404);
                // Convert to JSON & output error msg
                echo json_encode(array('message' => mysqli_error($db)));
            }
        }
    } else {
        http_response_code(400);
        // Convert to JSON & output error msg
        echo json_encode(array('message' => 'Invalid arguments'));
    }
} else {
    http_response_code(400);
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Only POST requests are accepted'));
}
