<?php
include_once '../config/headers.php';
include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $user_id = $_SESSION['user_id'];
   // $post_id = $_POST['post_id'];
    $post_id = (int) $_POST['post_id'];
    if ($user_id && $post_id) {
        /** @var \Laudis\Neo4j\Contracts\ClientInterface $neo4jClient */
        $neo4jClient = Database::connect();
        
         
        // Fetch post and post creator's details
        $postQuery = 'MATCH (p:TblCreatePost {postId: $post_id})-[:created]-(u:TblLogin) WHERE u.userId = $user_id OR p.expertId IS NOT NULL
                      RETURN p AS post, u.firstName AS first_name, COALESCE(p.expertId, "No Expert") AS expert_id, u.lastName AS last_name';
        $postResult = $neo4jClient->run($postQuery, ['post_id' => $post_id, 'user_id' => $user_id])->first();

        if ($postResult) {
            $postDetails = $postResult->get('post')->toArray();
            $postDetails['properties'] = $postDetails['properties']->toArray();
            $postDetails['properties']['first_name'] = $postResult->get('first_name');
            $postDetails['properties']['last_name'] = $postResult->get('last_name');
            
            // Fetch replies, authors, and votes
            $repliesQuery = 'MATCH (u:TblLogin)-[:created]-(p:TblCreatePost {postId: $post_id})-[:reply_to]-(r:TblPostReply) OPTIONAL MATCH (r)-[:voted]-(v:TblVote)      
            RETURN r.timeStamp AS timestamp, r.confidenceScore AS confidence_score, r.flag AS flag, r.postReplyId AS post_reply_id, r.ontologyLink AS ontology_link, r.replyContent AS reply_content, r.ontology AS ontology, sum(v.voteUp) AS upvote, sum(v.voteDown) AS downvote ,r AS reply, u.firstName AS first_name, u.lastName AS last_name
         ';
            $repliesResults = $neo4jClient->run($repliesQuery, ['post_id' => $post_id]);

            $replies = [];
            foreach ($repliesResults as $record) {
                
                $replyArray = array();
                $replyArray['timestamp'] = $record->get('timestamp');
                $replyArray['confidence_score'] = $record->get('confidence_score');
                $replyArray['flag'] = $record->get('flag');
                $replyArray['post_reply_id'] = $record->get('post_reply_id');
                $replyArray['ontologyLink'] = $record->get('ontology_link');
                $replyArray['replyContent'] = $record->get('reply_content');
                $replyArray['ontology'] = $record->get('ontology');
                $replyArray['first_name'] = $record->get('first_name');
                $replyArray['last_name'] = $record->get('last_name');
                $replyArray['upvote'] = $record->get('upvote');
                $replyArray['downvote'] = $record->get('downvote');
                $replies[] = $replyArray;
            }

            http_response_code(200);
            echo json_encode(['post' => $postDetails['properties'], 'replies' => $replies]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Post not found']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Post id or user id not provided']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Only POST requests are accepted']);
}
?>