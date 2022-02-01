
<?php
// Check wether user exit or not
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/database.php';

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Get user email
  $email = $_GET['email'];
  $google_id= $_GET['google_id'];
  // Check if email id given
  if ($email) {
    // Connect to database & retrieve instance
    $db = Database::connect();
    //Check if user is already registered
    $check = mysqli_query($db, "SELECT * FROM `tbl_login` WHERE email ='$email'");
    if (mysqli_num_rows($check) > 0) {
      //fetch data
       if ($check->fetch_assoc()['google_id'] == $google_id) {
        //create session and save variable in the session
        session_start();
        $_SESSION['user_id'] = $check->fetch_assoc()['user_id'];
        http_response_code(200);
        echo json_encode(array('message' => "Login Successfull"));
      }
      else{
        http_response_code(400);
        echo json_encode(array('message' => "Invalid Username or Password"));
      }
    }
    else {
      http_response_code(404);
      // Convert to JSON & output error msg
      echo json_encode(array('message' => mysqli_error($db)));
    }
  } else {
    http_response_code(400);
    // Convert to JSON & output error msg
    echo json_encode(array('message' => 'Invalid arguments'));
  }
} else {
  http_response_code(400);
  // Convert to JSON & output error msg
  echo json_encode(array('message' => 'Only POST requests are accepted'));
}
