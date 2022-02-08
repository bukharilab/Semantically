<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Session start and Get user id
      session_start();
      $user_id = $_SESSION['user_id'];
      $post_id = $_POST['post_id'];
      $ontology = $_POST['ontology'];
      $ontology_link = $_POST['ontology_link'];
      $reply_content = $_POST['content'];
      $confidence_score=$_POST['confidence_score'];

      

      // Check if project id given
      if ($user_id) {
        if ($post_id && $ontology && $reply_content) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          //fetch the expert data
          $time_stamp = date("Y-m-d H:i:s");
          // Insert the expert reply into databasr
          $results = mysqli_query($db, sprintf("INSERT INTO `tbl_post_reply` (user_id, post_id,ontology,ontology_link,reply_content,confidence_score,flag,time_stamp) VALUES ('%s', '%s', '%s', '%s','%s', '%s', '%s','%s')", $user_id, $post_id, $ontology, ,$ontology_link,$reply_content,$confidence_score,'0',$time_stamp));
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