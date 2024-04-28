<?php
include_once '../config/headers.php';
include_once '../config/database.php';
include_once '../config/response.php';
require_once '../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    post_request_error();
}

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) {
    user_id_error();
}

// Connect to database & retrieve instance
$db = Database::connect();

try {
    // Start a transaction
    $transaction = $db->beginTransaction();

    $query = 'MATCH (doc:TblDocument)-[:created]->(log:TblLogin {userId: $userId})
              RETURN doc.docId as docid, doc.docName as docname, doc.description as description, doc.content as content';
    
    // Execute query within a transaction
    $results = $transaction->run($query, ['userId' => $user_id]);
    
    // Commit the transaction
    $transaction->commit();

    // Prepare and send response
    $res = [];
    foreach ($results as $record) {
        $res[] = [
            'doc_id' => $record->get('docid'),
            'doc_name' => $record->get('docname'),
            'description' => $record->get('description'),
            'content' => $record->get('content'),
        ];
    }
    success_response(['documents' => $res]);
} catch (\Exception $e) {
    // Rollback the transaction in case of an error
    if (isset($transaction)) {
        $transaction->rollback();
    }
    system_error('Cannot retrieve documents. Error: ' . $e->getMessage());
}
