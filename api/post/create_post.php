<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  // Start session and Get user id
  session_start();
  $user_id = $_SESSION['user_id'];
  $post_title = $_POST['question'];
  $terminology = $_POST['terminology'];
  $curr_ontology = $_POST['ontology'];
  $post_content = $_POST['context'];

  // Check if user id given
  if (!$user_id) user_id_error();

  if (!$post_title || !$terminology || !$post_content) invalid_argument_error();

  // Connect to database & retrieve instance
  $db = Database::connect();
  $time_stamp=date("Y-m-d H:i:s");

  // Create document
  $results = mysqli_query($db, sprintf("INSERT INTO `tbl_create_post` (user_id, post_title, terminology, curr_ontology, post_content,time_stamp) VALUES ('%s', '%s', '%s','%s', '%s', '%s')", $user_id, $post_title, $terminology, $curr_ontology, $post_content, $time_stamp));
  
  // Check if document created
  if ($results) success_response(array('post_id' => mysqli_insert_id($db)));
  else error_message(mysqli_error($db), 404);
