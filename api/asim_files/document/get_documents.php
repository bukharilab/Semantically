<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

	// Connect to database & retrieve instance
	$db = Database::connect();
	// Query for all projects
	$results = mysqli_query($db, sprintf("SELECT * FROM `tbl_documents` WHERE user_id = '%s'", $user_id));
	// Check if document created
	if ($results) {
			// Turn to JSON & output
			$res = array();
			while ($row = mysqli_fetch_assoc($results)) {
					$res[] = $row;
			}
			success_response(array('documents' => $res));
	} else system_error(mysqli_error($db));
