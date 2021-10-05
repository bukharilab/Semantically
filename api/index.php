<?php
  include_once 'config/database.php';

  $db_conn = new Database();
  $db_conn = $db_conn->connect();

  // Check connection
  if ($db_conn->connect_error) {
    die("Connection failed: " . $db_conn->connect_error);
  }
  echo "Connected successfully";
