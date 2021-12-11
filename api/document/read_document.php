<?php
  // Headers
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Origin: http://localhost:3000');
  header('Access-Control-Allow-Methods: POST');
  header('Content-Type: application/json');

  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Start session and Get user id
      session_start();
      $user_id = $_SESSION['user_id'];
      // Check if project id given
      if ($user_id) {
        $document_id = $_POST['document_id'];
        if ($document_id) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          // Query for all projects
          $results = mysqli_query($db, sprintf("SELECT content FROM `tbl_documents` WHERE user_id = '%s' && doc_id = '%s'", $user_id, $document_id));
          // Check if document created
          if ($results) {
              // Turn to JSON & output
              http_response_code(200);
              echo json_encode(array('content' => $results->fetch_assoc()['content']));
          } else {
              http_response_code(404);
              // Convert to JSON & output error msg
              echo json_encode(array('message' => mysqli_error($db)));
          }
        } else {
            http_response_code(400);
            // Convert to JSON & output error msg
            echo json_encode(array('message' => 'Document id not given'));
        }
      } else {
        http_response_code(400);
        // Convert to JSON & output error msg
        echo json_encode(array('message' => 'User id not given'));
      }
  } else {
      http_response_code(400);
      // Convert to JSON & output error msg
      echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
