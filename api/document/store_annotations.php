<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
sleep(5);
  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user id and content
    $document_id = $_POST['document_id'];
    $annotations = $_POST['annotations'];

    // Check if document id and annotations are given
    if ($document_id && $annotations) {
      // Connect to database & retrieve instance
      $db = Database::connect();

      $results = mysqli_query($db, sprintf("SELECT anno_id FROM `tbl_primary_annotation` WHERE doc_id = '%s'", $document_id));

      if (mysqli_num_rows($results) == 1) {
        $results = mysqli_query($db, sprintf("UPDATE `tbl_primary_annotation` SET annotations = '%s' WHERE doc_id = '%s'", $annotations, $document_id));
      } else {
        session_start();
        $user_id = $_SESSION['user_id'];
        $results = mysqli_query($db, sprintf("INSERT INTO `tbl_primary_annotation` (user_id, doc_id, annotations) VALUES ('%s', '%s', '%s')", $user_id, $document_id, $annotations));
      }

      // Check if annotations saved
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
      echo json_encode(array('message' => 'Invalid arguments'));
    }

  } else {
    // Convert to JSON & output error msg
    http_response_code(400);
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
