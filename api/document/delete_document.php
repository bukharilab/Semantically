<?php
include_once '../config/headers.php';
include_once '../config/database.php'; 
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();

$document_id = (int) $_POST['document_id'];
if (!$document_id) invalid_argument_error();

// Get the Neo4j client instance
$neo4jClient = Database::connect();

// Prepare the Cypher query to delete the document, annotations, and ontologies
$query = '
MATCH (doc:TblDocument {docId: $document_id})
OPTIONAL MATCH (doc)-[:annotated_to]-(anno:TblPrimaryAnnotation)
OPTIONAL MATCH (anno)-[:annotated_from]-(onto:TblOntology)
DETACH DELETE doc, anno, onto';

// Execute the query
try {
    $neo4jClient->run($query, ['document_id' => $document_id]);
    success_message("Document deleted.");
} catch (\Throwable $e) {
    // Handle any errors during the execution of the query
    system_error($e->getMessage());
}
?>
