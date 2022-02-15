<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

  $post_id = $_POST['post_id'];
  if (!$post_id) invalid_argument_error();

  // Connect to database & retrieve instance
  $db = Database::connect();

  // delete ontologies
  $results = mysqli_query($db, sprintf("SELECT post_reply_id FROM `tbl_post_reply` WHERE post_id = '%s'", $post_id));
  while ($post_reply_id = mysqli_fetch_assoc($results)['post_reply_id']) {
    // delete ontologies
    mysqli_query($db, sprintf("DELETE FROM `tbl_Vote` WHERE post_reply_id = '%s'", $post_reply_id));
  }
  // delete annotations
  $results = mysqli_query($db, sprintf("DELETE FROM `tbl_post_reply` WHERE post_id = '%s'", $post_id));
  // Delete document
  $results = mysqli_query($db, sprintf("DELETE FROM `tbl_create_post` WHERE post_id = '%s'", $post_id));

  if ($results) success_message("post deleted.");
  else system_error(mysqli_error($db));