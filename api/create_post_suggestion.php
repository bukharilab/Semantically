// create new post suggestion

// fields: post_id, ontology, terminology, reason

// return 'success' if row added, error otherwise

// reference: create_post.php

<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once 'config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user id
    $user_id = $_POST['user_id'];

    // Check if user id is given
    if ($user_id) {

      $post_id = $_POST['post_id'];
      $ontology = $_POST['ontology'];
      $terminology = $_POST['terminology'];
      $reason = $_POST['reason'];

      if ($post_id && $ontology && $terminology && $reason) {
        // Connect to database & retrieve instance
        $db = Database::connect();
        $selected_ontology = $_POST['selected_ontology'];

        // Create document
        if ($selected_ontology) {
          $results = mysqli_query($db,
            sprintf("INSERT INTO OntologySuggestionPost
            (author_id, ontology, terminology, reason, selected_ontology)
            VALUES ('%s', '%s', '%s', '%s', '%s')",
            $user_id, $ontology, $terminology, $reason, $selected_ontology));
        } else {
          $results = mysqli_query($db,
            sprintf("INSERT INTO OntologySuggestionPost
            (author_id, ontology, terminology, reason)
            VALUES ('%s', '%s', '%s', '%s')",
            $user_id, $ontology, $terminology, $reason));
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
