<?php
include_once '../config/headers.php';
include_once '../config/database.php';
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();

$doc_id = (int) $_POST['document_id'];
$anno_id = (int) $_POST['anno_id'];
$ontology_id = (int) $_POST['ontology_id'];

if (!$doc_id || !$anno_id || !$ontology_id) invalid_argument_error();

$neo4jClient = Database::connect();

// Prepare the Cypher query to update the ontology_id of a specific annotation
$query = '
MATCH (anno:TblPrimaryAnnotation {annoId: $anno_id})
SET anno.ontologyId = $ontology_id
RETURN anno';

// Execute the query
try {
    $result = $neo4jClient->run($query, ['anno_id' => $anno_id, 'ontology_id' => $ontology_id]);

    if ($result->count() > 0) {
        success_message("Ontology selection changed.");
    } else {
        // No annotation was updated, which means the annotation wasn't found or no change was needed
        http_response_code(404);
    }
} catch (\Throwable $e) {
    // Handle any errors during the execution of the query
    system_error($e->getMessage());
}
?>
