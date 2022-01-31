<?php
// Headers
  include_once '../config/headers.php';
  include_once '../config/database.php';

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Start session and Get user id
    session_start();
    $user_id = $_SESSION['user_id'];
    
    $post_reply_id = $_POST['post_reply_id'];
    $flag = $_POST['flag'];
    // Check if project id given
    if ($post_reply_id) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        $time_stamp=date("Y-m-d H:i:s");
        // Create document
        $results = mysqli_query($db, sprintf("UPDATE tbl_post_reply SET flag= $flag WHERE post_reply_id=$post_reply_id"));
        // Check if document createdc
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
        echo json_encode(array('message' => 'Post id not given'));
    }

} else {
    http_response_code(400);
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Only POST requests are accepted'));
}
?>