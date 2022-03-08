<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();

  $doc_id = $_POST['document_id'];
  $annotations = $_POST['annotations'];
  if (!$doc_id && !$annotations) invalid_argument_error();

  $annotations = json_decode($annotations, true);

  // Connect to database & retrieve instance
  $db = Database::connect();

  $results = mysqli_query($db, sprintf("SELECT * FROM `tbl_primary_annotation` WHERE doc_id = '%s'", $_POST['document_id']));
  if (mysqli_num_rows($results) > 0) die();

  foreach ($annotations as $annotation) {
    $results = mysqli_query($db, sprintf("INSERT INTO `tbl_primary_annotation` (doc_id, from_loc, to_loc, text_str, removed) 
      VALUES ('%s', '%s', '%s', '%s', '%s')", $_POST['document_id'], $annotation['from'], $annotation['to'], $annotation['text'], -1));

    $anno_id = mysqli_insert_id($db);
    $first_ontology_id = NULL;
    foreach ($annotation['ontologies'] as $ontology) {
      $results = mysqli_query($db, sprintf("INSERT INTO `tbl_ontologies` (anno_id, acronym, match_type, link, onto_id) 
      VALUES ('%s', '%s', '%s', '%s', '%s')", $anno_id, $ontology['acronym'], $ontology['matchType'], $ontology['link'], $ontology['id']));
      if (!$first_ontology_id) $first_ontology_id = mysqli_insert_id($db);
    }
    $results = mysqli_query($db, sprintf("UPDATE `tbl_primary_annotation` SET ontology_id = '%s' WHERE anno_id = '%s'", $first_ontology_id, $anno_id));
  }

  if ($results) success_message("annotations saved.");
  else system_error(mysqli_error($db));
