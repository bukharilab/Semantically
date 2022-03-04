<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  // Start session and Get user id
  session_start();
  $user_id = $_SESSION['user_id'];

  // Check if user id given
  if (!$user_id) user_id_error();
  
  // Connect to database & retrieve instance
  $db = Database::connect();

  // Query for all projects
  $results = mysqli_query($db, sprintf("SELECT * FROM `tbl_create_post` WHERE user_id = '%s'", $user_id));
  
  // Check if document created
  if (!$results) error_message(mysqli_error($db), 404);
  
  // Turn to JSON & output
  $res = array();
  while ($row = mysqli_fetch_assoc($results)) {
    // get post responses
    $reponses = mysqli_query($db, sprintf("SELECT post_reply_id FROM `tbl_post_reply` WHERE post_id = '%s'", $row['post_id']));
    $row['responses'] = mysqli_num_rows($reponses);
    $res[] = $row;
  }
  sucess_response(array('posts' => $res));
