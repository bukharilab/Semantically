<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/database.php';

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Start session and Get user id
    session_start();
    $doc_id = $_GET['doc_id'];
    $user_id = $_SESSION['user_id'];
    // Check if project id given
    if ($user_id) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        // Delete document
        $results = mysqli_query($db, sprintf("DELETE FROM `tbl_documents` WHERE doc_id = '%s'", $doc_id));
        // Check if document was deleted
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