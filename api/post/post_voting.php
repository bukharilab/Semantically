<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

    $post_reply_id = $_POST['post_reply_id'];
    $vote_up = $_POST['vote_up'];
    $vote_down = $_POST['vote_down'];
  if (!$post_reply_id && !$vote) invalid_argument_error();
  // Connect to database & retrieve instance
  $db = Database::connect();
  $time_stamp=date("Y-m-d H:i:s");
  // Create document
  $results = mysqli_query($db, sprintf("INSERT INTO `tbl_vote` (post_reply_id,user_id,vote_up,vote_down,time_stamp) 
  VALUES ('%s', '%s', '%s','%s', '%s')", $post_reply_id,$user_id, $vote_up,$vote_down, $time_stamp));
  if (mysqli_num_rows($results) > 0) die();

  if ($results) success_message("data insert");
  else system_error(mysqli_error($db));

