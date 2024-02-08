<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Start session and Get user id
      session_start();
      $user_id = $_SESSION['user_id'];
      // Check if project id given
      if ($user_id) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          // Query for all projects
          $results = $db->run('MATCH (log:TblLogin {userId: $u_id})-[:created]-(post:TblCreatePost)-[:reply_to]-(reply:TblPostReply) 
          RETURN log,post,COUNT(reply) AS responses;', ['u_id' => $user_id]);
          // Check if document created
          if ($results) {
              // Turn to JSON & output
              $res = array();
            foreach ($results as $record) {
        $post_id = $record->get('post'); 
        $responses = $record->get('responses');
        $postArray = $post_id->toArray();
        $postArray['properties'] = $postArray['properties']->toArray();
        $postArray['properties']['responses'] = $responses; 
        $res[] = $postArray['properties'];
    }
              http_response_code(200);
              echo json_encode(array('posts' => $res));
              
          } else {
              http_response_code(404);
              // Convert to JSON & output error msg
              echo json_encode(array('message' => mysqli_error($db)));
          }

      } else {
          http_response_code(400);
          // Convert to JSON & output error msg
          echo json_encode(array('message' => 'User id not given'));
      }

  } else {
      http_response_code(400);
      // Convert to JSON & output error msg
      echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
