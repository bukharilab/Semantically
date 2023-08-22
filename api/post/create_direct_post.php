<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Start session and Get user id
      session_start();
      $user_id = $_SESSION['user_id'];
      $post_title = $_POST['question'];
      $terminology = $_POST['terminology'];
      $curr_ontology = $_POST['ontology'];
      $post_content = $_POST['context'];
      $expert_id = $_POST['expertID'];
      //echo $expert_id;
      //isset($POST['expertID']);
      // Check if project id given
      if ($user_id) {
        if ($post_title && $terminology && $post_content) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          $time_stamp=date("Y-m-d H:i:s");
          // Create document
          
          
            
          $results = mysqli_query($db, sprintf("INSERT INTO `tbl_create_post` (user_id, post_title, terminology, curr_ontology, post_content,time_stamp, expert_id) VALUES ('%s', '%s', '%s','%s', '%s', '%s', '%d')", $user_id, $post_title, $terminology, $curr_ontology, $post_content,$time_stamp,$expert_id));
          
          

          
          // Check if document created
          if ($results) {
            http_response_code(200);
            // Turn to JSON & output
            echo json_encode(array('post_id' => mysqli_insert_id($db)));
          } else {
              http_response_code(404);
              // Convert to JSON & output error msg
              echo json_encode(array('message' => mysqli_error($db)));
          }
        } else {
          http_response_code(400);
          // Convert to JSON & output error msg
          echo json_encode(array('message' => array('ont'=> $post_title, 'term'=> $terminology, 'cont'=> $post_content)));
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
