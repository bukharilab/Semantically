<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once 'config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user id
    $user_id = $_POST['user_id'];

    // Check if project id given
    if ($user_id) {
      $terminology = $_POST['terminology'];
      $question = $_POST['question'];
      $context = $_POST['context'];

      if ($terminology && $question && $context) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        $selected_ontology = $_POST['selected_ontology'];

        // Create document
        if ($selected_ontology) {
          $results = mysqli_query($db,
            sprintf("INSERT INTO OntologySuggestionPost
            (author_id, terminology, question, context, selected_ontology)
            VALUES ('%s', '%s', '%s', '%s', '%s')",
            $user_id, $terminology, $question, $context, $selected_ontology));
        } else {
          $results = mysqli_query($db,
            sprintf("INSERT INTO OntologySuggestionPost
            (author_id, terminology, question, context)
            VALUES ('%s', '%s', '%s', '%s')",
            $user_id, $terminology, $question, $context));
        }

        // Check if post created
        if ($results) {
          // Turn to JSON & output
          echo json_encode(array('post_id' => mysqli_insert_id($db)));

        } else {
          // Convert to JSON & output error msg
          echo json_encode(array('message' => mysqli_error($db)));
        }
      } else {
        // Convert to JSON & output error msg
        echo json_encode(array('message' => 'Required post field(s) missing.'));
      }
    } else {
      // Convert to JSON & output error msg
      echo json_encode(array('message' => 'User id not given'));
    }
  } else {
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
