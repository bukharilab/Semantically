<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once 'config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user id and content
    $post_id = $_POST['post_id'];

    // Check if project id given
    if ($post_id) {
      // Connect to database & retrieve instance
      $db = Database::connect();

      // Edit the document's content
      $results = mysqli_query($db, sprintf("SELECT author_id, terminology, question, context, selected_ontology FROM OntologySuggestionPost WHERE post_id = '%s'", $post_id));

      // Check if document was edited
      if ($results) {
        // Turn to JSON & output
        echo json_encode(array('post_data' => $results->fetch_assoc()));

      } else {
        // Convert to JSON & output error msg
        echo json_encode(array('message' => mysqli_error($db)));
      }

    } else {
      // Convert to JSON & output error msg
      echo json_encode(array('message' => 'Post id not given'));
    }

  } else {
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
