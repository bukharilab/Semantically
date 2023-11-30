<?php
       
       
       include_once '../config/headers.php';
       include_once '../config/database.php';
       include_once '../config/response.php';

       session_start();
       $user_id = $_SESSION['user_id'];
       $db = Database::connect();

    // Query for the given ID
    $results = mysqli_query($db, sprintf("SELECT user_id FROM `tbl_login` WHERE user_id = '%s'",$user_id));
    
        $res = array();
        while ($row = mysqli_fetch_assoc($results)) $res[] = $row;

        echo json_encode(array('data' => $res));
        http_response_code(200);
    
    if (!$results) {
        http_response_code(404);
        echo json_encode(array('message' => mysqli_error($db)));
    }
    

