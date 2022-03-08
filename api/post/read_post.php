<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // start session and Get user id
      session_start();
      $user_id = $_SESSION['user_id'];
      $post_id = $_POST['post_id'];
      // Check if project id given
      // echo json_encode(array('message' => $post_id));
      // die();
      if ($user_id) {
        if ($post_id) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          // Query for all projects
          $results = mysqli_query($db, sprintf("SELECT * FROM `tbl_create_post` WHERE post_id = '%s'", $post_id));
          // Check if document created
          if ($results) {
              $post_res = $results->fetch_assoc();
              $results = mysqli_query($db, sprintf("SELECT first_name, last_name FROM `tbl_login` WHERE user_id = '%s'", $post_res['user_id']));
              $user_res = $results->fetch_assoc();
             
              $results = mysqli_query($db, sprintf("SELECT * FROM `tbl_post_reply` WHERE post_id = '%s'", $post_res['post_id']));
              //by asim
              $vote_res=array();
              $replies_res = array();
              while ($row = mysqli_fetch_assoc($results)) {
                  $res = mysqli_query($db, sprintf("SELECT first_name, last_name FROM `tbl_login` WHERE user_id = '%s'", $row['user_id']));
                  //by asim
                  $results_vote = mysqli_query($db, sprintf("SELECT SUM(vote_up) AS upvote,SUM(vote_down) AS downvote FROM `tbl_vote` WHERE post_reply_id = '%s'", $row['post_reply_id']));
                  $replies_res[] = array_merge($row, $res->fetch_assoc(),$results_vote->fetch_assoc());
                  
              }
              // Turn to JSON & output
              http_response_code(200);
              //show the result
              echo json_encode(array(
                'post' => array_merge($post_res, $user_res),
                'replies' => $replies_res));
          } else {
              http_response_code(404);
              // Convert to JSON & output error msg
              echo json_encode(array('message' => mysqli_error($db)));
          }
        } else {
          http_response_code(400);
          // Convert to JSON & output error msg
          echo json_encode(array('message' => 'post id not given'));
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
