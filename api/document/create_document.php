<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  include_once '../config/response.php';
  require_once '../vendor/autoload.php';
  use Laudis\Neo4j\Contracts\TransactionInterface;
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

  session_start();
	$user_id = $_SESSION['user_id'];
	if (!$user_id) user_id_error();
    $docId = rand();
  
    $doc_name = $_POST['doc_name'];
	$desc = $_POST['description'];
	$content = $_POST['content'];

	if (!$doc_name && !$desc) invalid_argument_error();

	// Connect to database & retrieve instance
	$db = Database::connect();
	// Create document
	$query = ' MATCH (log:TblLogin {userId: $user_id})
    CREATE (doc:TblDocument {docId: $docId, docName: $doc_name, description: $description, content: $content})-[:created]->(log) RETURN doc.docId AS docId';

// Parameters to be passed to the query
$params = [
    'user_id' => $user_id,
    'docId' => $docId,
    'doc_name' => $doc_name,
    'description' => $desc,
    'content' => $content,
];

// Execute the query

$result = $db->run($query, $params);

// Fetch the newly created Document node ID
$documentId = $result->first()->get('docId');

// Assuming success_response is a function that returns a successful response
if ($documentId !== null) {
    success_response(['document_id' => $documentId]);
} else {
    // Handle error or no result case
}