<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  // Session start and Get user id
  session_start();
  $user_id = $_SESSION['user_id'];
  $post_id = $_POST['post_id'];
  $ontology = $_POST['ontology'];
  $reply_content = $_POST['content'];

  // Check if user id given
  if (!$user_id) user_id_error();

  // Check if request arguments given
  if (!$post_id || !$ontology || !$reply_content) invalid_argument_error();
  
  // Connect to database & retrieve instance
  $db = Database::connect();

  //fetch the expert data
  $time_stamp = date("Y-m-d H:i:s");

  // Insert the expert reply into database
  $results = mysqli_query($db, sprintf("INSERT INTO `tbl_post_reply` (user_id, post_id,ontology,reply_content,time_stamp) VALUES ('%s', '%s', '%s', '%s', '%s')", $user_id, $post_id, $ontology, $reply_content, $time_stamp));
  
  // Check if document created
  if ($results) success_message('success');
  else error_message(mysqli_error($db), 404);
