<?php
include_once '../config/headers.php';
include_once '../config/database.php'; // This should now use the Laudis Neo4j client
include_once '../config/response.php';

session_start();
$user_id = $_SESSION['user_id'];

// Get the Neo4j client instance
/** @var \Laudis\Neo4j\Contracts\ClientInterface $neo4jClient */
$neo4jClient = Database::connect();

// Prepare the Cypher query
$query = 'MATCH (l:TblLogin {userId: $user_id}) RETURN l.userId AS user_id';

// Execute the query and retrieve the results
try {
    $results = $neo4jClient->run($query, ['user_id' => $user_id]);
    
    $res = [];
    foreach ($results as $record) {
        $res[] = ['user_id' => $record->get('user_id')];
    }

    echo json_encode(['data' => $res]);
    http_response_code(200);
} catch (\Throwable $e) {
    // If there is any error, respond with 404 and the error message
    http_response_code(404);
    echo json_encode(['message' => $e->getMessage()]);
}
?>

