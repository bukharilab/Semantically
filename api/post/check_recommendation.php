<?php 
// Headers
include_once '../config/headers.php';
include_once '../config/database.php';

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Start session and Get project id
    session_start();
    $user_id = $_SESSION['user_id'];
    $term=$_POST['term'];
   // $flag = $_POST['flag'];
    // Check if project id given
    if ($user_id) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        // Query for all projects
        //$results = mysqli_query($db, sprintf("SELECT * FROM `post_reply` WHERE term = '%s'", $term));
        $results = mysqli_query($db, sprintf("SELECT tbl_create_post.post_id,tbl_create_post.terminology,tbl_post_reply.post_reply_id,tbl_post_reply.reply_content,tbl_post_reply.ontology_link,tbl_post_reply.flag FROM `tbl_create_post` INNER JOIN tbl_post_reply ON tbl_create_post.post_id = tbl_post_reply.post_id WHERE tbl_create_post.user_id='%s' AND tbl_create_post.terminology = '%s' AND tbl_post_reply.flag='%s'", $user_id,$term,'0'));
        //$results = mysqli_query($db, sprintf("SELECT tbl_create_post.post_id,tbl_create_post.terminology,tbl_post_reply.post_reply_id,tbl_post_reply.reply_content,tbl_post_reply.ontology,tbl_post_reply.ontology_link,tbl_post_reply.flag,tbl_post_reply.confidence_score FROM `tbl_create_post` INNER JOIN tbl_post_reply ON tbl_create_post.post_id = tbl_post_reply.post_id WHERE tbl_create_post.user_id='%s' AND tbl_post_reply.flag='%s'", $user_id,$flag));
        // Check if document created
        if ($results) {
            // Turn to JSON & output
            $res = array();
            while ($row =mysqli_fetch_assoc($results)) {
                $res[] = $row;
            }
            http_response_code(200);
            //show the result
            echo json_encode(array('message' => $res));
            
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