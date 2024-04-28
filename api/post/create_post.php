<?php
include_once '../config/headers.php';
include_once '../config/database.php';

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Start session and get user ID and other POST data
    session_start();
    $user_id = $_SESSION['user_id'];
    $post_title = $_POST['question'];
    $terminology = $_POST['terminology'];
    $curr_ontology = $_POST['ontology'];
    $post_content = $_POST['context'];

    // Check if necessary data is provided
    if ($user_id && $post_title && $terminology && $post_content) {
        $neo4jClient = Database::connect();
        $time_stamp = date("Y-m-d H:i:s");
        $post_id = rand();
        // Prepare the Cypher query to create a new post.
        $query = '
        MATCH (log:TblLogin {userId: $user_id})
        CREATE (p:TblCreatePost {postId: $post_id, expertId: 0, postTitle: $post_title, terminology: $terminology, currOntology: $curr_ontology, postContent: $post_content, timeStamp: $time_stamp})
        CREATE (p)-[:created]->(log) 
        RETURN p.postId AS postId';

        // Execute the query
        try {
            $result = $neo4jClient->run($query, [
                'user_id' => $user_id,
                'post_id' => $post_id,
                'post_title' => $post_title,
                'terminology' => $terminology,
                'curr_ontology' => $curr_ontology,
                'post_content' => $post_content,
                'time_stamp' => $time_stamp
            ]);

            $postId = $result->first()->get('postId');

            http_response_code(200);
            echo json_encode(['post_id' => $postId]);
        } catch (\Throwable $e) {
            http_response_code(404);
            echo json_encode(['message' => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Only POST requests are accepted']);
}
?>
