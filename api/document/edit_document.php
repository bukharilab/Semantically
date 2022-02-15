<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

  $document_id = $_POST['document_id'];
  $content = $_POST['content'];
  if (!$document_id && !$content) invalid_argument_error();

  // Connect to database & retrieve instance
  $db = Database::connect();

  // Edit the document's content
  $results = mysqli_query($db, sprintf("UPDATE tbl_documents SET content = '%s' WHERE doc_id = '%s'", addslashes($content), $document_id));

  if ($results) success_message("document edited.");
  else system_error(mysqli_error($db)); 
