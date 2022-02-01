<?php 

// destroy the session and user will be logout
session_start();
session_destroy($_SESSION['user_id']);
unset($_SESSION['user_id']);
?>