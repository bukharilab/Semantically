<?php 
// Headers
include_once '../config/headers.php';
include_once '../config/database.php';

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Start session and get user ID and term
    session_start();
    $user_id = $_SESSION['user_id'];
    $term = $_POST['term'];
   
    // Check if user ID and term are given
    if ($user_id && $term) {
        // Connect to Neo4j database & retrieve client instance
        $neo4jClient = Database::connect();

        // Prepare the Cypher query
        $query = 'MATCH (u:TblLogin {userId: $user_id})-[:created]-(p:TblCreatePost)-[:reply_to]-(r:TblPostReply) WHERE p.terminology = $term AND r.flag = $flag
        RETURN collect({postId: p.postId, terminology: p.terminology, post_reply_id: r.postReplyId, reply_content: r.replyContent, ontology: r.ontology, onto_link: r.ontologyLink, confidence_score: r.confidenceScore, flag: r.flag}) AS Recommendation';
        // Execute the query
        try {
            $results = $neo4jClient->run($query, ['user_id' => $user_id, 'term' => $term, 'flag' => 0]);

            $res = [];
            foreach ($results as $record) {
                // Convert each record to an associative array
                $res = $record->get('Recommendation')->toArray();
            }

            http_response_code(200);
            echo json_encode(['message' => $res]);
        } catch (\Throwable $e) {
            http_response_code(404);
            echo json_encode(['message' => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'User ID or term not provided']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Only POST requests are accepted']);
}
?>