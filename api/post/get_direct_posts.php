<?php
include_once '../config/headers.php';
include_once '../config/database.php';
//include_once './get_responses_func.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(array('message' => 'Only POST requests are accepted'));
    die();
}
session_start();
$user_id = $_SESSION['user_id'];
// Connect to database & retrieve instance
$db = Database::connect();

// Query for all posts
//$results = mysqli_query($db, sprintf("SELECT * FROM `tbl_create_post` where expert_id = '%d'",$user_id));
// Grab all the direct posts made to the user. 
$results = $db->run(<<<'CYPHER'
         MATCH (all_posts:TblCreatePost {expertId: $exID})
         RETURN all_posts; 
         CYPHER, ['exID' => $user_id]);
if (!$results) {
    http_response_code(404);
    echo json_encode(array('message' => mysqli_error($db)));
}

// Turn to JSON & output
$res = array();
foreach ($results as $result) {
    $node = $result->get('all_posts');
    $post_id = $node->getProperty('postId');

    $responses = $db->run(<<<'CYPHER'
        MATCH (post:TblCreatePost {postId: $id}) OPTIONAL MATCH (post)-[:reply_to]-(reply:TblPostReply) RETURN post, COUNT(reply) as responses;
        CYPHER, ['id' => $post_id]);

    foreach ($responses as $record) {
        $post_id = $record->get('post');
        $responses = $record->get('responses');
        $postArray = $post_id->toArray();
        $postArray['properties'] = $postArray['properties']->toArray();
        $postArray['properties']['responses'] = $responses;
        $res[] = $postArray['properties'];
    }
}
http_response_code(200);
echo json_encode(array('direct_posts' => $res));
