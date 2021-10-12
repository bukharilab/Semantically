<?php
  class Database {
    // Database connect
    public static function connect() {
      // Declare and initialize connect string
      $host = 'host.docker.internal';
      $database = 'semantically';
      $username = 'root';
      $password = '5@w4W@HGZtPXn97';

      // Connect to database and store instance
      $conn = mysqli_connect($host, $username, $password);

      return $conn;
    }
  }

  $db_conn = new Database();
  $db_conn = $db_conn->connect();

  // Check connection
  if ($db_conn->connect_error) {
    die("Connection failed: " . $db_conn->connect_error);
  }

  if ($db_conn) echo "Connected successfully";

  die("done.");
