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
      $query = pg_prepare($db, 'create_document_query', 'INSERT INTO document(user_id) VALUES ($1)');
      $result = pg_execute($db, 'create_document_query', array($user_id));

      // Check if document created
      if ($result) {
        // Get project data


        // Turn to JSON & output
        echo json_encode(array('message' => 'success'));

      } else {
        // Convert to JSON & output error msg
        echo json_encode(array('message' => 'error'));
      }

    } else {
      // Convert to JSON & output error msg
      echo json_encode(array('message' => 'User id not given'));
    }

  } else {
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
