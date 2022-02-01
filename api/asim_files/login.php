<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $email = $_GET['email'];
    $google_id = $_GET['google_id']; // google id

    if ($email && $google_id) {
      // Connect to database & retrieve instance
      $db = Database::connect();

      //Check if user is already registered
      $results = mysqli_query($db, "SELECT google_id FROM tbl_login WHERE email ='$email'");

      if (mysqli_num_rows($results)) {
        //Check if google ids match
        if ($results->fetch_assoc()['google_id'] == $google_id) {
          echo json_encode(array('message' => 'Login Sucessful'));

        } else echo json_encode(array('message' => 'Login Unsucessful'));

      } else echo json_encode(array('message' => 'Not Registered'));

    } else echo json_encode(array('message' => 'Invalid arguments'));

  } else echo json_encode(array('message' => 'Only POST requests are accepted'));
