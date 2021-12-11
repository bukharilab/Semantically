<?php
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
  // destroy the session and user will be logout
  session_start();
  echo json_encode(array('message' => $_SESSION['user_id']));
  session_destroy($_SESSION['user_id']);
  unset($_SESSION['user_id']);
?>
