<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Get user id and content
      $first_name = $_POST['first_name'];
      $last_name = $_POST['last_name'];
      $email = $_POST['email'];
      $google_id = $_POST['google_id'];
      $img_url=$_POST['img_url'];
      // Check if document id given
      if ($first_name && $last_name && $email && $google_id) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          // Creatte new user
          $results = mysqli_query($db, sprintf("INSERT INTO tbl_login (first_name, last_name, email, google_id,img_url) VALUES ('%s', '%s', '%s', '%s','%s')", $first_name, $last_name, $email, $google_id,$img_url));
          // User was created
          if ($results) {
              // Turn to JSON & output
              http_response_code(200);
              echo json_encode(array('message' => 'success'));
          } else {
              // Convert to JSON & output error msg
              http_response_code(400);
              echo json_encode(array('message' => mysqli_error($db)));
          }
      } else {
          // Convert to JSON & output error msg
          http_response_code(400);
          echo json_encode(array('message' => 'Invalid arguments'));
      }
  } else {
      // Convert to JSON & output error msg
      http_response_code(400);
      echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
