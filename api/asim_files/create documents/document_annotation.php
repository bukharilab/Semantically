<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/database.php';

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Start session and Get user id
  session_start();
  $user_id = $_SESSION['user_id'];
  $doc_id = $_GET['doc_id'];
  //data should be in this format
  $marks = array(
    array("term" => "cancel", "ontology" => 'snomed-ct', "defination" => "its a vital disease"),
    array("term" => 'disease', "ontology" => "CPT", "defination" => "its a medical term"),
    array("term" => "Covid", "ontology" => "NCBO", "defination" => "its a fatal disease recently emerge all over the world that engulfed many preciouse life")
  );
  // Check if project id given
  if ($user_id) {
    // Connect to database & retrieve instance
    $db = Database::connect();
    foreach ($marks as $key => $value) {
      $term = $value["term"];
      $ontology = $value["ontology"];
      $defination = $value["defination"];
      // Query for all projects
      $results = mysqli_query($db, sprintf("INSERT INTO `tbl_primary_annotation` (user_id, doc_id,annotated_term,annotated_def,annotated_onto) VALUES ('%s', '%s', '%s','%s','%s')", $user_id, $doc_id, $term, $defination, $ontology));
    }
    // Check if document created
    if ($results) {
      http_response_code(200);
      echo json_encode(array('data' => 'insert successfully'));
    } else {
      http_response_code(404);
      // Convert to JSON & output error msg
      echo json_encode(array('message' => mysqli_error($db)));
    }
  } else {
    http_response_code(400);
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'User id not given'));
  }
} else {
  http_response_code(400);
  // Convert to JSON & output error msg
  echo json_encode(array('message' => 'Only POST requests are accepted'));
}
?>