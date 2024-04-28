<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';

  

  // // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Session start and Get user id
      session_start();
      
      $user_id = $_SESSION['user_id'];
      $terminology = $_POST['terminology'];
      

  //     // Check if project id given
       if ($user_id ) {
        
         if ($terminology) {
          
  //         // Connect to database & retrieve instance
           $db = Database::connect();
  //         //fetch the expert data
           $time_stamp = date("Y-m-d H:i:s");
          
  //         // Insert the expert reply into databasr
         //$results = mysqli_query($db, sprintf("SELECT post_id, terminology, curr_ontology, post_content FROM tbl_create_post WHERE terminology = '%s'",$terminology));
         //$results = $db->run('MATCH (log:TblLogin)-[:created]-(doc:TblDocument )-[:annotated_to]-(anno:TblPrimaryAnnotation {textStr: $terminology})-[:annotated_from]-(onto:TblOntology) OPTIONAL MATCH (post:TblCreatePost {terminology: $terminology}) OPTIONAL MATCH (post)-[:reply_to]-(reply:TblPostReply) OPTIONAL MATCH (reply)-[:voted]-(vote:TblVote)
         //RETURN post.postId AS post_id, anno.textStr AS terminology, post.currOntology AS curr_ontology, post.postContent AS post_content, reply.replyContent AS reply_content, vote.voteUp AS voteup, vote.voteDown AS votedown, id(vote) AS vote_id;',['terminology' => $terminology]);
         $results = $db->run('MATCH (log:TblLogin)-[:created]-(post:TblCreatePost {terminology: $terminology})
         OPTIONAL MATCH (post)-[:reply_to]-(reply:TblPostReply)
         OPTIONAL MATCH (reply)-[:voted]-(vote:TblVote)
         
         RETURN post.postId AS post_id, post.postContent AS post_content, post.terminology AS terminology, reply.replyContent AS reply_content,reply.ontology AS curr_ontology, 
                sum(vote.voteUp) AS upvote, sum(vote.voteDown) AS downvote, reply.postReplyId AS reply_id, reply.confidenceScore AS confidence_score, reply.rating AS rating, log.profileRank AS rank, reply.ontologyLink AS ontology_link;',['terminology' => $terminology]);
                   // Check if document created
          if ($results) {
            $res = array();
            foreach ($results as $record) {
              $res[] = [
                'post_id' => $record->get('post_id'), 
                'terminology' => $record->get('terminology'), 
                'curr_ontology' => $record->get('curr_ontology'), 
                'post_content' => $record->get('post_content'),
                'reply_content' => $record->get('reply_content'),
                'confidence_score' => $record->get('confidence_score'),
                'ontology_link' => $record->get('ontology_link'),
                'reply_id' => $record->get('reply_id'),
                'voteup' => $record->get('upvote'),
                'votedown' => $record->get('downvote'),
                'rating' => $record->get('rating'),
                'rank' => $record->get('rank'),
            ];
            }
              http_response_code(200);
              echo json_encode(array('terminology' => $res));
          

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