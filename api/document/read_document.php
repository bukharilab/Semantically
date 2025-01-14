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

if (empty($document_id)) {
    invalid_argument_error();
    exit; // Ensure the script stops if the document ID is not provided
}
// Get the Neo4j client instance
$neo4jClient = Database::connect();

try {
    // Cypher query to retrieve the document content
    $query = 'MATCH (doc:TblDocument)-[:created]->(log:TblLogin) WHERE log.userId = $user_id AND doc.docId = $doc_id RETURN doc.content AS content';
    
    $result = $neo4jClient->run($query, ['user_id' => $user_id, 'doc_id' => $document_id]);
    //Checking to see if there are any results at all.
    if ($result->count() > 0) {     
        $content = $result->first()->get('content');
        success_response(['content' => $content]);
    } else {
        //If not, throw an error.
        system_error('No document found.');
    }
} catch (\Throwable $e) {
    // Handle any errors during the execution of the query
    system_error($e->getMessage());
}
?>