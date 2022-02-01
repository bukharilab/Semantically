<?php
    include_once '../config/headers.php';
    include_once '../config/database.php';
    include_once './get_responses_func.php';

    // if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    //     http_response_code(400);
    //     echo json_encode(array('message' => 'Only POST requests are accepted'));
    //     die();
    // }

    // Connect to database & retrieve instance
    $db = Database::connect();

    // Query for all posts
    $results = mysqli_query($db, sprintf("SELECT * FROM tbl_create_post"));

    if (!$results) {
        http_response_code(404);
        echo json_encode(array('message' => mysqli_error($db)));
    }

    // Turn to JSON & output
    $res = array();
    while ($row = mysqli_fetch_assoc($results)) {
        // get post responses
        $reponses = mysqli_query($db, sprintf("SELECT post_reply_id FROM `tbl_post_reply` WHERE post_id = '%s'", $row['post_id']));
        $row['responses'] = mysqli_num_rows($reponses);
        $res[] = $row;

    }

    http_response_code(200);
    echo json_encode(array('all_posts' => $res));
