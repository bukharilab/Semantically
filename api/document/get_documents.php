<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once 'config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get project id
    $user_id = $_POST['user_id'];

    // Check if project id given
    if ($user_id) {
      // Connect to database & retrieve instance
      $db = Database::connect();

      // Query for all projects
      $results = mysqli_query($db, sprintf("SELECT document_id, title FROM Document WHERE user_id = '%s'", $user_id));

      // Check if document created
      if ($results) {
        // Get project data

        // Turn to JSON & output
        $res = array();
        while ($row = mysqli_fetch_assoc($results)) $res[] = $row;

        echo json_encode(array('data' => $res));
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
