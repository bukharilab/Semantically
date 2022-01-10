<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

  $doc_id = $_POST['document_id'];
  $anno_id = $_POST['anno_id'];
  $ontology_id = $_POST['ontology_id'];

  if (!$doc_id && !$anno_id && !$ontology_id) invalid_argument_error();

  // Connect to database & retrieve instance
  $db = Database::connect();

  $onto_change_results = mysqli_query($db, 
  sprintf("UPDATE tbl_primary_annotation SET ontology_id = '%s' WHERE anno_id = '%s'", $ontology_id, $anno_id));

  if ($onto_change_results) success_message("ontology selection changed.");
  else system_error(mysqli_error($db));
