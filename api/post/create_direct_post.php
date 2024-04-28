<?php
require_once '../vendor/autoload.php'; // Make sure to include the autoload.php from Composer
include_once '../config/headers.php';
include_once '../config/database.php'; // Assuming this returns a Neo4j client
include_once '../config/response.php';
use Laudis\Neo4j\ClientBuilder;

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Start session and Get user id
    session_start();
    $user_id = $_SESSION['user_id'];
    $post_title = $_POST['question'];
    $terminology = $_POST['terminology'];
    $curr_ontology = $_POST['ontology'];
    $post_content = $_POST['context'];
    $expert_id = (int)$_POST['expertID'];

    // Check if user id is given
    if ($user_id) {
        if ($post_title && $terminology && $post_content) {
            // Connect to Neo4j
            $client = Database::connect();

            $time_stamp = date("Y-m-d H:i:s");
           
            // Create document in Neo4j
            $query = "
            MATCH (log:TblLogin {userId: $user_id})
            CREATE (p:TblCreatePost {
              postId: \$post_id, 
              postTitle: \$post_title, 
              terminology: \$terminology, 
              currOntology: \$curr_ontology, 
              postContent: \$post_content, 
              timeStamp: \$time_stamp, 
              expertId: \$expert_id
          }) 
          CREATE (log)<-[:created]-(p)
          RETURN id(p) AS post_id";
            $parameters = [
                'post_id' => rand(),
                'user_id' => $user_id,
                'post_title' => $post_title,
                'terminology' => $terminology,
                'curr_ontology' => $curr_ontology,
                'post_content' => $post_content,
                'time_stamp' => $time_stamp,
                'expert_id' => $expert_id,
            ];

            try {
                $result = $client->run($query, $parameters);
                $post_id = $parameters['post_id'];

                http_response_code(200);
                echo json_encode(array('post_id' => $post_id));
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(array('message' => $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array('message' => 'Required fields are missing'));
        }
    } else {
        http_response_code(400);
        echo json_encode(array('message' => 'User id not given'));
    }
} else {
    http_response_code(400);
    echo json_encode(array('message' => 'Only POST requests are accepted'));
}
