<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once 'config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    session_start();

    // Get user id
    $user_id = $_SESSION['user_id'];
    $document_name = $_POST['document_name'];
    $document_content = $_POST['document_content'];

    // Check if project id given
    if ($user_id) {
      
      if ($document_name && $document_content) {
         
        // Connect to database & retrieve instance
        $db = Database::connect();

        // Create document
        $results = mysqli_query($db, sprintf("INSERT INTO tbl_document (user_id, document_name, document_content) VALUES ('%s', '%s', '%s')", $user_id, $document_name, $document_content));

        // Check if document created
        if ($results) {
          // Turn to JSON & output
          echo json_encode(array('document_id' => mysqli_insert_id($db)));

        } else {
          // Convert to JSON & output error msg
          echo json_encode(array('message' => mysqli_error($db)));
        }
        
      } else {
        echo json_encode(
          array('message' => 'Document name and content are required')
        );
      }
      

    } else {
      // Convert to JSON & output error msg
      echo json_encode(array('message' => 'User id not given'));
    }

  } else {
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
