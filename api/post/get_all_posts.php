<?php
    include_once '../config/headers.php';
    include_once '../config/database.php';
    
   
    //include_once './get_responses_func.php';

    // if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    //     http_response_code(400);
    //     echo json_encode(array('message' => 'Only POST requests are accepted'));
    //     die();
    // }
$query = 'MATCH (post:TblCreatePost)
OPTIONAL MATCH (post)-[:reply_to]-(reply:TblPostReply)
WITH post, COUNT(reply) AS responses
RETURN post, responses';
// Check if the result is in cache

    // Connect to database & retrieve instance
    $db = Database::connect();

    // Query for all posts
    //$results = mysqli_query($db, sprintf("SELECT * FROM tbl_create_post"));
    $results = $db->run($query);   
    
    if (!$results) {
        http_response_code(404);
        echo json_encode(array('message' => mysqli_error($db)));
    }
    
    // Turn to JSON & output
    $res = array();
    foreach ($results as $record) {
        $post_id = $record->get('post'); 
        $responses = $record->get('responses');
        $postArray = $post_id->toArray();
        $postArray['properties'] = $postArray['properties']->toArray();
        $postArray['properties']['responses'] = $responses; 
        $res[] = $postArray['properties'];
    }
    /*
    while ($row = mysqli_fetch_assoc($results)) {
        // get post responses
        $reponses = mysqli_query($db, sprintf("SELECT post_reply_id FROM `tbl_post_reply` WHERE post_id = '%s'", $row['post_id']));
        $row['responses'] = mysqli_num_rows($reponses);
        $res[] = $row;

    }
    */
    http_response_code(200);
    echo json_encode(array('all_posts' => $res));
