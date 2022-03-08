<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

  $document_id = $_POST['document_id'];
  if (!$document_id) invalid_argument_error();

  // Connect to database & retrieve instance
  $db = Database::connect();
  // Query for all projects
  $results = mysqli_query($db, sprintf("SELECT content FROM `tbl_documents` WHERE user_id = '%s' && doc_id = '%s'", $user_id, $document_id));
  // Check if document created
  if ($results) success_response(array('content' => $results->fetch_assoc()['content']));
  else system_error(mysqli_error($db));
