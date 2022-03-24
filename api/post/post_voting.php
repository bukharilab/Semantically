<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
  console.log("userid",$user_id);
	if (!$user_id) user_id_error();

  $post_reply_id = $_POST['post_reply_id'];
    $vote_up = $_POST['vote_up'];
    $vote_down = $_POST['vote_down'];
  if (!$post_reply_id && !$vote) invalid_argument_error();
  // Connect to database & retrieve instance
  $db = Database::connect();
  $time_stamp=date("Y-m-d H:i:s");
  // Create document

   $results =  $results = mysqli_query($db, sprintf("SELECT * FROM `tbl_vote` WHERE user_id = '%s' AND post_reply_id='%s'", $user_id,$post_reply_id));
   if (mysqli_num_rows($results) > 0) {
    $update_results = mysqli_query($db, sprintf("UPDATE `tbl_vote` SET `vote_up` = '%s',`vote_down`='%s', `time_stamp`='%s'
     WHERE user_id = '%s' AND post_reply_id='%s'", $vote_up,$vote_down, $time_stamp, $user_id,$post_reply_id));
    if (mysqli_num_rows($update_results) > 0) die();
    if($update_results)success_message("update record");
    else system_error(mysqli_error($db));
    
   }
   else{
    $insert_results = mysqli_query($db, sprintf("INSERT INTO `tbl_vote` (post_reply_id,user_id,vote_up,vote_down,time_stamp) 
    VALUES ('%s', '%s', '%s','%s', '%s')", $post_reply_id,$user_id, $vote_up,$vote_down, $time_stamp));
    if (mysqli_num_rows($insert_results) > 0);
    if ($insert_results) success_message("data insert");
    else system_error(mysqli_error($db));
   }


   
  // $results = mysqli_query($db, "INSERT INTO `tbl_vote` (post_reply_id,user_id,vote_up,vote_down,time_stamp) VALUES ($post_reply_id, $user_id, $vote_up,$vote_down, $time_stamp) 
  // ON DUPLICATE KEY UPDATE `vote_up` = VALUES($vote_up),`vote_down`= VALUES($vote_down), `time_stamp`= VALUES($time_stamp)");
  // // $results = mysqli_query($db, sprintf("INSERT INTO 'tbl_vote' SET `post_reply_id` = '1', `user_id` = 'A', `vote_up` = 19,`vote_down`='%s', `time_stamp`='%s'
  // // ON DUPLICATE KEY UPDATE `post_reply_id` = '1', `user_id` = 'A', `vote_up` = 19,`vote_down`='%s', `time_stamp`='%s'));
  // if (mysqli_num_rows($results) > 0) die();

  // if ($results) success_message("data insert");
  // else system_error(mysqli_error($db));

