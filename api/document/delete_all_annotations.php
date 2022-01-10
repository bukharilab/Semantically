<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

  $doc_id = $_POST['document_id'];
  if (!$doc_id) invalid_argument_error();

  // Connect to database & retrieve instance
  $db = Database::connect();

  // get all annotation
  $anno_results = mysqli_query($db, 
    sprintf("SELECT anno_id FROM tbl_primary_annotation WHERE doc_id = '%s'", $doc_id));

  while ($anno_id = mysqli_fetch_assoc($anno_results)['anno_id']) {
    // delete all ontologies
    $delete_onto_results = mysqli_query($db, 
    sprintf("DELETE FROM tbl_ontologies WHERE anno_id = '%s'", $anno_id));
    // delete annotation
    $delete_anno_results = mysqli_query($db, 
    sprintf("DELETE FROM tbl_primary_annotation WHERE anno_id = '%s'", $anno_id));
  }

  if ($delete_anno_results) success_message("all annotations deleted.");
  else system_error(mysqli_error($db)); 
  