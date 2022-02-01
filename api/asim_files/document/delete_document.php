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

  // delete ontologies
  $results = mysqli_query($db, sprintf("SELECT anno_id FROM tbl_primary_annotation WHERE doc_id = '%s'", $document_id));
  while ($anno_id = mysqli_fetch_assoc($results)['anno_id']) {
    // delete ontologies
    mysqli_query($db, sprintf("DELETE FROM tbl_ontologies WHERE anno_id = '%s'", $anno_id));
  }
  // delete annotations
  $results = mysqli_query($db, sprintf("DELETE FROM tbl_primary_annotation WHERE doc_id = '%s'", $document_id));
  // Delete document
  $results = mysqli_query($db, sprintf("DELETE FROM tbl_documents WHERE doc_id = '%s'", $document_id));

  if ($results) success_message("document deleted.");
  else system_error(mysqli_error($db)); 
