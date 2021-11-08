<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once 'config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user id
    $user_id = $_POST['user_id'];

    // Check if project id given
    if ($user_id) {
      // Connect to database & retrieve instance
      $db = Database::connect();

      // Create document
      $results = mysqli_query($db, "INSERT INTO Document (user_id, content) VALUES ('1', '')");

      // Check if document created
      if ($results) {
        // Turn to JSON & output
        echo json_encode(array('message' => 'success'));

      } else {
        // Convert to JSON & output error msg
        echo json_encode(array('message' => mysqli_error($db)));
      }

    } else {
      // Convert to JSON & output error msg
      echo json_encode(array('message' => 'User id not given'));
    }

  } else {
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
