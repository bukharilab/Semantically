<?php
session_start();
echo "Hello this is the index.php file";
echo "\n";
echo "session id is";
echo "\n";
$user_id=$_SESSION['user_id'];
echo $user_id;

?>