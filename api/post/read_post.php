<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  // start session and Get user id
  session_start();
  $user_id = $_SESSION['user_id'];
  $post_id = $_POST['post_id'];

  // Check if user id given
  if (!$user_id) user_id_error();

  // Check if post id given
  if (!$post_id) invalid_argument_error();
  
  // Connect to database & retrieve instance
  $db = Database::connect();

  // Query for all projects
  $results = mysqli_query($db, sprintf("SELECT * FROM `tbl_create_post` WHERE post_id = '%s'", $post_id));
  
  // Check if document created
  if (!$results) error_message(mysqli_error($db), 404);

  $post_res = $results->fetch_assoc();
  $results = mysqli_query($db, sprintf("SELECT first_name, last_name FROM `tbl_login` WHERE user_id = '%s'", $post_res['user_id']));
  $user_res = $results->fetch_assoc();
  $results = mysqli_query($db, sprintf("SELECT * FROM `tbl_post_reply` WHERE post_id = '%s'", $post_res['post_id']));
  $replies_res = array();
  while ($row = mysqli_fetch_assoc($results)) {
    $res = mysqli_query($db, sprintf("SELECT first_name, last_name FROM `tbl_login` WHERE user_id = '%s'", $row['user_id']));
    $replies_res[] = array_merge($row, $res->fetch_assoc());
  }
  
  success_response(array(
    'post' => array_merge($post_res, $user_res),
    'replies' => $replies_res));