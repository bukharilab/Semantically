<?php
include_once '../config/headers.php';
include_once '../config/database.php'; // Assuming this returns a Neo4j client
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();

$post_reply_id = (int) $_POST['post_reply_id'];
$vote_up = (int) $_POST['vote_up'];
$vote_down = (int) $_POST['vote_down'];

if (!$post_reply_id) invalid_argument_error(); // Note: Adjusted the condition to check for $post_reply_id specifically

/** @var \Laudis\Neo4j\Contracts\ClientInterface $neo4jClient */
$neo4jClient = Database::connect();
$time_stamp = date("Y-m-d H:i:s");
$vote_id = rand();
// Prepare the Cypher query to create a new Vote node and relate it to the PostReply node
$query = 
'MATCH (pr:TblPostReply {postReplyId: $post_reply_id})
CREATE (pr)<-[:voted]-(v:TblVote {userId: $user_id, postReplyId: $post_reply_id, vote_id: $vote_id, voteUp: $vote_up, voteDown: $vote_down, timeStamp: $time_stamp})
RETURN v';

// Execute the query
try {
    $results = $neo4jClient->run($query, [
        'post_reply_id' => $post_reply_id,
        'vote_id' => $vote_id,
        'user_id' => $user_id,
        'vote_up' => $vote_up,
        'vote_down' => $vote_down,
        'time_stamp' => $time_stamp,
    ]);

    if ($results->count() > 0) {
        success_message("Data inserted");
    } else {
        system_error("Failed to insert data");
    }
} catch (\Throwable $e) {
    system_error($e->getMessage());
}
?>

