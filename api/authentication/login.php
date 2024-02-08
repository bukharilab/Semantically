<?php
  
  include_once '../config/headers.php';
  require_once '../vendor/autoload.php';
  include_once '../config/database.php';
  use Laudis\Neo4j\Authentication\Authenticate;
  use Laudis\Neo4j\ClientBuilder;

  // Check if POST request
  
    // Get user email
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      $email = $_POST['email'];
      $google_id= $_POST['google_id'];
    // Check if email id given
    if ($email && $google_id) {
      // Connect to database & retrieve instance
      $db = Database::connect();
      //Check if user is already registered
      
      $result = $db->run(<<<'CYPHER'
      MATCH (log:TblLogin {email: $emailVal})
      RETURN log;
      CYPHER, ['emailVal' => $email])->first();

      $node = $result->get('log');
      $google_id_result = $node->getProperty('googleId');
      $userID = $node->getProperty('userId');
      
      if (!is_null($google_id_result)) {
        //fetch data
        
         if ($google_id_result == $google_id) {
          //create session and save variable in the session
          // create session
          session_start();
          $_SESSION['user_id'] = $userID;
          http_response_code(200);
          echo json_encode(array('message' => 'Login Sucessfully'));
        } else {
          // Convert to JSON & output error msg
          http_response_code(404);
          echo json_encode(array('message' => 'Invalid credentials'));
        }
      }
    
      else {
        // Convert to JSON & output error msg
        http_response_code(404);
        echo json_encode(array('message' => 'User not registered'));
      }
    }
     else {
      // Convert to JSON & output error msg
      http_response_code(400);
      echo json_encode(array('message' => 'Invalid arguments'));
    }
    }
   else {
    // Convert to JSON & output error msg
    
    http_response_code(400);
    echo json_encode(array('message' => 'Only POST requests are accepted'));
    
  }
