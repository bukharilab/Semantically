<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  

  // // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Session start and Get user id
      session_start();
      
      $user_id = $_SESSION['user_id'];
      $first_name = $_POST['first_name'];
      $last_name = $_POST['last_name'];
      /*
      $post_id = $_POST['post_id'];
      $ontology = $_POST['ontology'];
      $ontology_link = $_POST['ontology_link'];
      $reply_content = $_POST['content'];
      $confidence_score=$_POST['confidence_score'];
      */
      

  //     // Check if project id given
       if ($user_id ) {
        
         if ($first_name) {
          
  //         // Connect to database & retrieve instance
           $db = Database::connect();
  //         //fetch the expert data
           $time_stamp = date("Y-m-d H:i:s");
          
  //         // Insert the expert reply into databasr
           $results = mysqli_query($db, sprintf("SELECT tbl_post_reply.post_reply_id, tbl_create_post.post_id,ontology, first_name, last_name, reply_content, profile_rank, vote_up, vote_down FROM tbl_post_reply INNER JOIN tbl_login on tbl_login.user_id = tbl_post_reply.user_id LEFT JOIN tbl_vote on tbl_vote.post_reply_id = tbl_post_reply.post_reply_id LEFT JOIN tbl_create_post on tbl_create_post.post_id = tbl_post_reply.post_id WHERE first_name = '%s' and last_name = '%s'",$first_name, $last_name));
                   // Check if document created
          if ($results) {
              $res = array();
              while ($row = mysqli_fetch_assoc($results)) $res[] = $row;
              http_response_code(200);
              echo json_encode(array('replies' => $res));
          

          } else {
              http_response_code(404);
              // Convert to JSON & output error msg
              echo json_encode(array('message' => mysqli_error($db)));
          }
        } else {
          http_response_code(400);
          // Convert to JSON & output error msg
          echo json_encode(array('message' => 'Missing arguments'));
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