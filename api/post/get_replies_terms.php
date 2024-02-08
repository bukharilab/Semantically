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
         // $results = 
                   // Check if document created
          if ($results) {
              $res = array();
              while ($row = mysqli_fetch_assoc($results)) $res[] = $row;
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