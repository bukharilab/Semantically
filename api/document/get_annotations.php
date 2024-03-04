<?php
 /*
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
*/

include_once '../config/headers.php';
include_once '../config/database.php'; // This should now return a Neo4j client
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();

$doc_id = (int) $_POST['document_id'];
if (!$doc_id) invalid_argument_error();

// Get the Neo4j client instance
/** @var \Laudis\Neo4j\Contracts\ClientInterface $neo4jClient */
$neo4jClient = Database::connect();


// Prepare the Cypher query for retrieving primary annotations and their related ontologies
$query = '
MATCH (doc:TblDocument {docId: $doc_id})-[:annotated_to]-(anno:TblPrimaryAnnotation)
OPTIONAL MATCH (anno)-[:annotated_from]-(onto:TblOntology)
RETURN anno.annoId AS anno_id, anno.fromLoc AS from_loc, anno.toLoc AS to_loc, anno.textStr AS text_str, anno.removed AS removed, onto.ontologyId AS ontology_id,
       collect({annotation_id: anno.annoId, from: anno.fromLoc, to: anno.toLoc, text: anno.textStr,
                ontologyId: onto.ontologyId, matchType: onto.matchType, acronym: onto.acronym, link: onto.link,
                id: onto.ontoId}) AS annotations';

// Execute the query
try {
    $annotationsResult = $neo4jClient->run($query, ['doc_id' => $doc_id]);
    
    $res = [];
    $res_selection = [];
    $res_anno_deletion = [];

    foreach ($annotationsResult as $record) {
        $key = sprintf("%s-%s", $record->get('from_loc') + 1, $record->get('to_loc'));
        $annotationsArray = $record->get('annotations')->toArray();
        if (isset($res[$key])) {
          // Ensure that $res[$key] is also an array.
          $res[$key] = array_merge((array) $res[$key], $annotationsArray);
      } else {
          $res[$key] = $annotationsArray;
      }
        $res_selection[$key] = $record->get('ontology_id');
        $res_anno_deletion[$key] = $record->get('removed');
       

    }

    success_response(['annotations' => $res, 'ontology_selection' => $res_selection, 'anno_deletion' => $res_anno_deletion]);
} catch (\Throwable $e) {
    // Handle exceptions
    system_error($e->getMessage());
}
?>