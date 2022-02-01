<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/database.php';

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Session start and Get user id
    session_start();
    $user_id = $_SESSION['user_id'];
    $post_id = $_GET['post_id'];
    $ontology = $_GET['ontology'];
    $reply_conent = $_GET['content'];

    // Check if project id given
    if ($user_id) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        //fetch the expert data
        $time_stamp = date("Y-m-d H:i:s");
        // Insert the expert reply into databasr
        $results = mysqli_query($db, sprintf("INSERT INTO `tbl_post_reply` (user_id, post_id,ontology,reply_content,time_stamp) VALUES ('%s', %s,'%s', '%s','%s')", $user_id, $post_id, $ontology, $reply_conent, $time_stamp));
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
