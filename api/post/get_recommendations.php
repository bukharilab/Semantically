<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get project id
    $terminology = $_POST['terminology'];

    // Check if project id given
    if ($terminology) {
      // Connect to database & retrieve instance
      $db = Database::connect();

      // Query for all projects
      $results = mysqli_query($db, sprintf("SELECT ontology, reason FROM OntologyRecommendation WHERE terminology = '%s'", $terminology));

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
