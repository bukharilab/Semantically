<?php
include_once '../config/headers.php';
include_once '../config/database.php'; // This should now use the Laudis Neo4j client
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();

$document_id = (int) $_POST['document_id'];
$content = $_POST['content'];
if (!$document_id || !$content) invalid_argument_error();

// Get the Neo4j client instance
/** @var \Laudis\Neo4j\Contracts\ClientInterface $neo4jClient */
$neo4jClient = Database::connect();

// Prepare the Cypher query for updating the document's content
$query = 'MATCH (doc:TblDocument {docId: $document_id}) SET doc.content = $content RETURN doc';

// Execute the query
try {
    $result = $neo4jClient->run($query, ['document_id' => $document_id, 'content' => $content]);
    
    // If the result is not empty, it means the update was successful
    if ($result->count() > 0) {
        success_message("Document edited.");
    } else {
        // No document was updated, which means the document wasn't found
        not_found_error(); // Define this function to handle not found errors
    }
} catch (\Throwable $e) {
    // Handle any errors during the execution of the query
    system_error($e->getMessage());
}
?>
