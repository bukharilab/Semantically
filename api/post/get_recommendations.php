<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  // start session and Get user id
  session_start();
  $user_id = $_SESSION['user_id'];
  
  // Check if user id given
  if (!$user_id) user_id_error();

  $terminology = $_POST['terminology'];
  if (!$terminology) invalid_argument_error();

  // Connect to database & retrieve instance
  $db = Database::connect();

  // Query for all projects
  $results = mysqli_query($db, sprintf("SELECT ontology, reason FROM OntologyRecommendation WHERE terminology = '%s'", $terminology));

  // Check if document created
  if (!$results) error_message(mysqli_error($db), 404);
  
  // Turn to JSON & output
  $res = array();
  while ($row = mysqli_fetch_assoc($results)) $res[] = $row;

  success_response(array('data' => $res));
