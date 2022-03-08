<?php

// Headers
  include_once '../config/headers.php';
  include_once '../config/database.php';
 
// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Start session and Get user id
    session_start();
    
    $user_id = $_SESSION['user_id'];
    $doc_id = $_POST['doc_id'];
    $post_reply_id = $_POST['post_reply_id'];
    $from_loc = $_POST['from_loc'];
    $to_loc = $_POST['to_loc'];
    $acronym = $_POST['acronym'];
    $onto_link = $_POST['onto_link'];
    $flag = $_POST['flag'];
    
   
    // Check if project id given
    if ($post_reply_id) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        $time_stamp=date("Y-m-d H:i:s");
        // Create document
        $results = mysqli_query($db, sprintf("UPDATE `tbl_post_reply` SET flag= '%s' WHERE post_reply_id='%s'", $flag,$post_reply_id));
        
        // Check if document createdc
        if ($results) {
          if($flag === '1'){
             // Select ontology Id
       $anno_results = mysqli_query($db, sprintf("SELECT ontology_id FROM `tbl_primary_annotation` WHERE doc_id = '%s' AND from_loc='%s' AND to_loc ='%s'", $doc_id,$from_loc,$to_loc));  
        
        while ($anno_row = mysqli_fetch_assoc($anno_results)) {
            
            //update ontologies table
            $onto_update = mysqli_query($db, sprintf("UPDATE `tbl_ontologies` SET acronym= '%s', link='%s' WHERE ontology_id='%s'",$acronym,$onto_link,$anno_row['ontology_id']));
            
        }
            http_response_code(200);
            // Turn to JSON & output
            echo json_encode(array('message' => 'updated success'));
          }
          else{
            http_response_code(200);
            // Turn to JSON & output
            echo json_encode(array('message' => 'success'));
        }

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