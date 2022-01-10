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

  $anno_results = mysqli_query($db, sprintf("SELECT * FROM `tbl_primary_annotation` WHERE doc_id = '%s'", $doc_id));
  
  $res = array();
  $res_selection = array();
  $res_anno_deletion = array();
  while ($anno_row = mysqli_fetch_assoc($anno_results)) {
    $key = sprintf("%s-%s", intval($anno_row['from_loc'])+1, $anno_row['to_loc']);
    $res[$key] = array();
    $res_selection[$key] = $anno_row['ontology_id'];
    $res_anno_deletion[$key] = $anno_row['removed'];

    $onto_results = mysqli_query($db, sprintf("SELECT * FROM `tbl_ontologies` WHERE anno_id = '%s'", $anno_row['anno_id']));
    while ($onto_row = mysqli_fetch_assoc($onto_results)) {
      $ann = array();
      $ann['annotation_id'] = $anno_row['anno_id'];
      $ann['from'] = intval($anno_row['from_loc'])+1;
      $ann['to'] = $anno_row['to_loc'];
      $ann['text'] = $anno_row['text_str'];
      $ann['ontologyId'] = $onto_row['ontology_id'];
      $ann['matchType'] = $onto_row['match_type'];
      $ann['acronym'] = $onto_row['acronym'];
      $ann['link'] = $onto_row['link'];
      $ann['id'] = $onto_row['onto_id'];

      $res[$key][] = $ann;
    }
  }

  if ($onto_results) success_response(array('annotations' => $res, 'ontology_selection' => $res_selection, 'anno_deletion' => $res_anno_deletion));
  else system_error(mysqli_error($db));
