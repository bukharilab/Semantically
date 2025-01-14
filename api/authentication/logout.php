<?php
  include_once '../config/headers.php';

  // destroy the session and user will be logout
  session_start();
  echo json_encode(array('message' => $_SESSION['user_id']));
  session_destroy();
  unset($_SESSION['user_id']);
?>
