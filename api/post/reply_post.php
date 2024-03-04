<?php
include_once '../config/headers.php';
include_once '../config/database.php'; // Assuming this returns a Neo4j client

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    
    $user_id = $_SESSION['user_id'];
    $post_id = (int) $_POST['post_id'];
    $ontology = $_POST['ontology'];
    $ontology_link = $_POST['ontology_link'];
    $reply_content = $_POST['content'];
    $confidence_score = $_POST['confidence_score'];
    $flag = 0;
    
    if ($user_id && $post_id && $ontology && $reply_content) {
        /** @var \Laudis\Neo4j\Contracts\ClientInterface $neo4jClient */
        $neo4jClient = Database::connect();
        $time_stamp = date("Y-m-d H:i:s");
        $post_reply_id = rand();
        // Prepare the Cypher query to insert the expert reply into the database
        $query = 'MATCH (p:TblCreatePost {postId: $post_id})
        CREATE (reply:TblPostReply {postReplyId: $post_reply_id, ontology: $ontology, ontologyLink: $ontology_link, replyContent: $reply_content, confidenceScore: $confidence_score, flag: $flag, timeStamp: $time_stamp})       
        CREATE (reply)<-[:reply_to]-(p)
        RETURN id(reply) AS replyId';
        
        try {
            $result = $neo4jClient->run($query, [
                'user_id' => $user_id,
                'post_reply_id' => $post_reply_id,
                'post_id' => $post_id,
                'ontology' => $ontology,
                'ontology_link' => $ontology_link,
                'reply_content' => $reply_content,
                'confidence_score' => $confidence_score,
                'time_stamp' => $time_stamp,
                'flag' => $flag,
            ]);
            
            if ($result->count() > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Success']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Failed to create reply']);
            }
        } catch (\Throwable $e) {
            http_response_code(404);
            echo json_encode(['message' => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Missing arguments']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Only POST requests are accepted']);
}
?>