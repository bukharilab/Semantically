<?php

// Headers
include_once '../config/headers.php';
include_once '../config/database.php';

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Start session and get user ID
    session_start();

    $user_id = $_SESSION['user_id'];
    $doc_id = (int) $_POST['doc_id'];
    $post_reply_id = (int) $_POST['post_reply_id'];
    $from_loc = (int) $_POST['from_loc'];
    $to_loc = (int) $_POST['to_loc'];
    $acronym = $_POST['acronym'];
    $onto_link = $_POST['onto_link'];
    $flag = (int) $_POST['flag'];   
    $rating = (int) $_POST['rating'];

     // Check if post reply ID is given
    if ($post_reply_id) {
        // Connect to Neo4j database & retrieve client instance
        $neo4jClient = Database::connect();
        $time_stamp = date("Y-m-d H:i:s");

        // Update post reply flag
        $queryUpdateReply = 'MATCH (reply:TblPostReply {postReplyId: $post_reply_id})
                             SET reply.flag = $flag';
        $results = $neo4jClient->run($queryUpdateReply, ['post_reply_id' => $post_reply_id, 'flag' => $flag]);
        
        // If flag is set to '1', update related ontologies
        if ($flag === 1) {
            $changeCurrOntologiesQuery = 'MATCH (log:TblLogin {userId: $user_id})-[:created]-(post:TblCreatePost)-[:reply_to]-(reply:TblPostReply {postReplyId: $post_reply_id}) SET post.currOntology = $acronym RETURN log, post, reply';
            $ontChangeQuery = $neo4jClient->run($changeCurrOntologiesQuery, ['user_id' => $user_id, 'post_reply_id' => $post_reply_id, 'acronym' => $acronym]);
            
            $addRecommendationRatingQuery = 'MATCH (reply:TblPostReply {postReplyId: $post_reply_id}) SET reply.rating = $rating';

            $queryUpdateOntologies = 'MATCH (doc:TblDocument {docId: $doc_id})<-[:annotated_to]-(anno:TblPrimaryAnnotation {fromLoc: $from_loc, toLoc: $to_loc})<-[:annotated_from]-(onto:TblOntology {ontologyId: anno.ontologyId})
                                      SET onto.acronym = $acronym, onto.link = $onto_link';
            $ratingQuery = $neo4jClient->run($addRecommendationRatingQuery, ['post_reply_id' => $post_reply_id, 'rating' => $rating]);
            $query = $neo4jClient->run($queryUpdateOntologies, ['doc_id' => $doc_id, 'from_loc' => $from_loc, 'to_loc' => $to_loc, 'acronym' => $acronym, 'onto_link' => $onto_link]);
            
            
            
            http_response_code(200);
            echo json_encode(['message' => 'Updated successfully']);
            echo json_encode(['Result' => $query]);
        } else {
            http_response_code(200);
            echo json_encode(['message' => 'Success']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Post reply ID not provided']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Only POST requests are accepted']);
}
?>