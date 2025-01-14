<?php


include_once '../config/headers.php';
include_once '../config/database.php';
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();

$doc_id = (int) $_POST['document_id'];
if (!$doc_id) invalid_argument_error();

// Get the Neo4j client instance
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