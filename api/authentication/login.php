<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user email
    $email = $_POST['email'];
    $google_id= $_POST['google_id'];

    // Check if email id given
    if ($email && $google_id) {
      // Connect to database & retrieve instance
      $db = Database::connect();
      //Check if user is already registered
      $check = mysqli_query($db, "SELECT * FROM tbl_login WHERE email ='$email'");

      if (mysqli_num_rows($check) > 0) {
        //fetch data
        $row = $check->fetch_assoc();
         if ($row['google_id'] == $google_id) {
          //create session and save variable in the session
          // create session
          session_start();
          $_SESSION['user_id'] = $row['user_id'];
          http_response_code(200);
          echo json_encode(array('message' => 'Login Sucessfully'));
        } else {
          // Convert to JSON & output error msg
          http_response_code(404);
          echo json_encode(array('message' => 'Invalid credentials'));
        }
      }
      else {
        // Convert to JSON & output error msg
        http_response_code(404);
        echo json_encode(array('message' => 'User not registered'));
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
