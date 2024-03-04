<?php
include_once '../config/headers.php';
include_once '../config/database.php'; // Assuming this returns a Neo4j client
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();

$post_id = (int) $_POST['post_id'];
if (!$post_id) invalid_argument_error();

/** @var \Laudis\Neo4j\Contracts\ClientInterface $neo4jClient */
$neo4jClient = Database::connect();

// Start a transaction


try {
    // Delete related Votes
    $queryDeleteVotes = 'MATCH (p:TblCreatePost {postId: $post_id})-[:reply_to]-(r:TblPostReply)-[:voted]-(v:TblVote) DETACH DELETE v';
    $neo4jClient->run($queryDeleteVotes, ['post_id' => $post_id]);

    // Delete PostReplies
    $queryDeleteReplies = 'MATCH (p:TblCreatePost {postId: $post_id})-[:reply_to]-(r:TblPostReply) DETACH DELETE r';
    $neo4jClient->run($queryDeleteReplies, ['post_id' => $post_id]);

    // Finally, delete the Post itself
    $queryDeletePost = 'MATCH (p:TblCreatePost {postId: $post_id}) DETACH DELETE p';
    $neo4jClient->run($queryDeletePost, ['post_id' => $post_id]);

    // Commit the transaction
    

    success_message("Post deleted.");
} catch (\Throwable $e) {
    // In case of any error, rollback the transaction
   
    
    system_error($e->getMessage());
}
?>
