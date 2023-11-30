<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

    $doc_name = $_POST['doc_name'];
	$desc = $_POST['description'];
	$content = $_POST['content'];

	if (!$doc_name && !$desc) invalid_argument_error();

	// Connect to database & retrieve instance
	$db = Database::connect();
	// Create document
	$results = mysqli_query($db, sprintf("INSERT INTO tbl_documents (user_id, doc_name, description, content) VALUES ('%s', '%s', '%s', '%s')", $user_id, $doc_name, $desc, $content));

	if ($results) success_response(array('document_id' => mysqli_insert_id($db)));
	else system_error(mysqli_error($db));
