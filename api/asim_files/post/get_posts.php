<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Start session and Get user id
      session_start();
      $user_id = $_SESSION['user_id'];
      // Check if project id given
      if ($user_id) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          // Query for all projects
          $results = mysqli_query($db, sprintf("SELECT * FROM `tbl_create_post` WHERE user_id = '%s'", $user_id));
          // Check if document created
          if ($results) {
              // Turn to JSON & output
              $res = array();
              while ($row = mysqli_fetch_assoc($results)) {
                // get post responses
                $reponses = mysqli_query($db, sprintf("SELECT post_reply_id FROM `tbl_post_reply` WHERE post_id = '%s'", $row['post_id']));
                $row['responses'] = mysqli_num_rows($reponses);
                $res[] = $row;
              }
              http_response_code(200);
              echo json_encode(array('posts' => $res));
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
