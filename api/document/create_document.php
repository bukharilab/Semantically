<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // start session and Get user id
      session_start();
      $user_id = $_SESSION['user_id'];
      $doc_name = $_POST['doc_name'];
      $desc = $_POST['description'];
      $content = $_POST['content'];
      // Check if project id given
      if ($user_id) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          // Create document
          $results = mysqli_query($db, sprintf("INSERT INTO tbl_documents (user_id, doc_name, description, content) VALUES ('%s', '%s', '%s', '%s')", $user_id, $doc_name, $desc, $content));
          // Check if document created
          if ($results) {
              //return last generated id
              http_response_code(200);
              // Turn to JSON & output
              echo json_encode(array('document_id' => mysqli_insert_id($db)));
          } else {
              http_response_code(404);
              // Convert to JSON & output error msg
              echo json_encode(array('message' => mysqli_error($db)));
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
