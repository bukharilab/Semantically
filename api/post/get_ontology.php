<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  

  // // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Session start and Get user id
      session_start();
      
      $user_id = $_SESSION['user_id'];
      $ontology = $_POST['ontology'];
      

  //     // Check if project id given
       if ($user_id ) {
        
         if ($ontology) {
          
  //         // Connect to database & retrieve instance
           $db = Database::connect();
  //         //fetch the expert data
           $time_stamp = date("Y-m-d H:i:s");
          
  //         // Insert the expert reply into databasr
          $results = $db->run('MATCH (log:TblLogin)-[:created]-(p:TblCreatePost {currOntology: $ont}) OPTIONAL MATCH (p)-[r:reply_to]-(reply:TblPostReply) OPTIONAL MATCH (reply)-[v:voted]-(vote:TblVote) RETURN p.postId AS postId, p.terminology AS terminology, reply.ontology AS currOntology, p.postContent AS postContent, reply.replyContent AS reply_content, SUM(vote.voteUp) AS voteup, SUM(vote.voteDown) AS votedown, reply.postReplyId AS reply_id, reply.confidenceScore AS confidence_score, reply.rating AS rating, reply.ontologyLink AS ontology_link, log.profileRank AS rank', ['ont' => $ontology]);
                   // Check if document created
          
          if ($results) {
            $res = array();
            foreach ($results as $record) {
              $res[] = [
                'post_id' => $record->get('postId'),
                'terminology' => $record->get('terminology'),
                'curr_ontology' => $record->get('currOntology'),
                'post_content' => $record->get('postContent'),
                'reply_content' => $record->get('reply_content'),
                'reply_id' => $record->get('reply_id'),
                'confidence_score' => $record->get('confidence_score'),
                'voteup' => $record->get('voteup'),
                'votedown' => $record->get('votedown'),
                'rating' => $record->get('rating'),
                'ontology_link' => $record->get('ontology_link'),
                'rank' => $record->get('rank'),
            ];
                    
            }
            http_response_code(200);
            echo json_encode(array('ontology' => $res));

          } else {
              http_response_code(404);
              // Convert to JSON & output error msg
              echo json_encode(array('message' => mysqli_error($db)));
          }
        } else {
          http_response_code(400);
          // Convert to JSON & output error msg
          echo json_encode(array('message' => 'Missing arguments'));
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
?>