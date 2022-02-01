<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/database.php';

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Start session and Get user id
    session_start();
    $user_id = $_SESSION['user_id'];
    $post_title = $_GET['post_title'];
    $post_content = $_GET['post_content'];
    // Check if project id given
    if ($user_id) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        $time_stamp=date("Y-m-d H:i:s");
        // Create document
        $results = mysqli_query($db, sprintf("INSERT INTO `tbl_create_post` (user_id, post_title,post_content,time_stamp) VALUES ('%s', '%s', '%s','%s')", $user_id, $post_title, $post_content,$time_stamp));
        // Check if document created
        if ($results) {
            http_response_code(200);
            // Turn to JSON & output
            echo json_encode(array('message' => 'success'));

        } else {
            http_response_code(404);
            // Convert to JSON & output error msg
            echo json_encode(array('message' => mysqli_error($db)));
        }

    } else {
        http_response_code(400);
        // Convert to JSON & output error msg
        echo json_encode(array('message' => 'User id not given'));
    }

} else {
    http_response_code(400);
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Only POST requests are accepted'));
}
?>