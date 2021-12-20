<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get document id
    $document_id = $_POST['document_id'];
    session_start();
    $user_id = $_SESSION['user_id'];
    // Check if project id given
    if ($user_id) {
      // Connect to database & retrieve instance
      $db = Database::connect();

      // Delete document
      $results = mysqli_query($db, sprintf("DELETE FROM tbl_documents WHERE doc_id = '%s'", $document_id));

      // Check if document was deleted
      if ($results) {
        // Turn to JSON & output
        http_response_code(200);
        echo json_encode(array('message' => 'success'));

      } else {
        // Convert to JSON & output error msg
        http_response_code(500);
        echo json_encode(array('message' => mysqli_error($db)));
      }

    } else {
      // Convert to JSON & output error msg
      http_response_code(404);
      echo json_encode(array('message' => 'User id not given'));
    }

  } else {
    // Convert to JSON & output error msg
    http_response_code(400);
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
