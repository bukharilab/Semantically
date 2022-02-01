<?php
<<<<<<< HEAD
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
=======
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../config/database.php';
  session_start();

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get user id and content
    $email = $_GET['email'];
    $password = $_GET['password']; // google id
    //$token = $_GET['token'];

    // Connect to database & retrieve instance
    $db = Database::connect();

    // Check if user registered
   // if ($email && $password) {
    $sql = "SELECT * FROM Users WHERE email='$email' && password='$password'";
    $result = mysqli_query($db,$sql);
    echo $result;
    $_SESSION['myid'] = $value;


        //$result = mysqli_query($db, sprintf("SELECT user_id FROM User WHERE email='%s' && password='%s'", $email, $password));
        // echo implode(" ", mysqli_fetch_row($result));

        // if ($result) {
        //     // user registered
        //     if ($token) {
        //         // // Create new session
        //         $user_id = mysqli_fetch_row($result);
        //         // $user_id = '2';
        //         $result = mysqli_query($db, sprintf("INSERT INTO LoginSession (user_id, token) VALUES ('%s', '%s')", $user_id, $token));

        //         if ($result) {
        //             // Login successful
        //             echo json_encode(array('message' => 'success', 'session_id' => mysqli_insert_id($db)));
        //         } else {
        //             // Login unsuccessful
        //             echo json_encode(array('message' => mysqli_error($db)));
        //         }
        //     } else {
        //         // create token for manual login
        //     }
        // } else {
        //     echo json_encode(array('message' => 'User is not registered'));
        // }
    }
  } else {
    // Convert to JSON & output error msg
>>>>>>> f2d3a9592247871bc431ce55190befeafc0cd8d5
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
