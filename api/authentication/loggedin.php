<?php
  include_once '../config/headers.php';

  // destroy the session and user will be logout
  session_start();
  if ($_SESSION['user_id']) {
    http_response_code(200);
    echo json_encode(array('message' => 'You are logged in'));
  } else {
    http_response_code(400);
    echo json_encode(array('message' => 'You are not logged in'));
  }
?>
