<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user id and content
    $document_id = $_POST['document_id'];
    $content = $_POST['content'];

    // Check if document id given
    if ($document_id) {
      // Connect to database & retrieve instance
      $db = Database::connect();

      // Edit the document's content
      $results = mysqli_query($db, sprintf("UPDATE tbl_documents SET content = '%s' WHERE doc_id = '%s'", $content, $document_id));

      // Check if document was edited
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
      http_response_code(400);
      echo json_encode(array('message' => 'User id not given'));
    }

  } else {
    // Convert to JSON & output error msg
    http_response_code(400);
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
