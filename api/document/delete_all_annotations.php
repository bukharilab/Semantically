<?php
include_once '../config/headers.php';
include_once '../config/database.php'; // Assuming this returns a Neo4j client
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();

$doc_id = (int) $_POST['document_id'];
if (!$doc_id) invalid_argument_error();

/** @var \Laudis\Neo4j\Contracts\ClientInterface $neo4jClient */
$neo4jClient = Database::connect();

// Prepare the Cypher query to delete all annotations and related ontologies for a given document
$query = 'MATCH (doc:TblDocument {docId: $doc_id})<-[:annotated_to]-(anno:TblPrimaryAnnotation)
OPTIONAL MATCH (anno)<-[:annotated_from]-(onto:TblOntology)
DETACH DELETE anno, onto;';

// Execute the query
try {
   // $neo4jClient->run($query, ['doc_id' => $doc_id]);
   $neo4jClient->run($query, ['doc_id' => $doc_id]);
    success_message("All annotations deleted.");
} catch (\Throwable $e) {
    // Handle any errors during the execution of the query
    system_error($e->getMessage());
}
?>