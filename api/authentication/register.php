<?php
  include_once '../config/headers.php';
  include_once '../config/database.php';
  require_once '../vendor/autoload.php';
  use Laudis\Neo4j\Authentication\Authenticate;
  use Laudis\Neo4j\ClientBuilder;
  // Check if POST request
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Get user id and content
      $first_name = $_POST['first_name'];
      $last_name = $_POST['last_name'];
      $email = $_POST['email'];
      $google_id = $_POST['google_id'];
      $img_url=$_POST['img_url'];
      // Check if document id given
      if ($first_name && $last_name && $email && $google_id) {
          // Connect to database & retrieve instance
          $db = Database::connect();
          $result = $db->run(<<<'CYPHER'
          MATCH (log:TblLogin {email: $emailVal})
          RETURN log;
          CYPHER, ['emailVal' => $email])->first();
          $node = $result->get('log');
          
          $fname = $node->getProperty('firstName');
          $lname = $node->getProperty('lastName');
          //$check = mysqli_query($db, "SELECT * FROM tbl_login WHERE email ='$email'");

          if (is_null($google_id_result)) {
            // Creatte new user
            //$results = mysqli_query($db, sprintf("INSERT INTO tbl_login (first_name, last_name, email, google_id,img_url) VALUES ('%s', '%s', '%s', '%s','%s')", $first_name, $last_name, $email, $google_id,$img_url));
            $results = $db->run(<<<'CYPHER'
            CREATE (register:TblLogin {email: $emailVal, firstName: $firstN, lastName: $lastN, google_id: $google_id, img_url: $img)})
            RETURN register;
            CYPHER, ['emailVal' => $email,'firstN' => $first_name,'lastN' => $last_name,'google_id' => $googleID,'img' => $img_url])->first();
            // User was created
            if ($results) {
                // Turn to JSON & output
                http_response_code(200);
                echo json_encode(array('message' => 'success'));
            } else {
                // Convert to JSON & output error msg
                http_response_code(400);
                echo json_encode(array('message' => mysqli_error($db)));
            }
          } else {
            // Convert to JSON & output error msg
            http_response_code(400);
            echo json_encode(array('error_key' => 'alreadyRegistered'));
          }
      } else {
          // Convert to JSON & output error msg
          http_response_code(400);
          echo json_encode(array('message' => 'Invalid arguments'));
      }
  } else {
      // Convert to JSON & output error msg
      http_response_code(400);
      echo json_encode(array('message' => 'Only POST requests are accepted'));
  }
