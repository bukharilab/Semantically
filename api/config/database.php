<?php
  class Database {
    // Database connect
    public static function connect() {
      // Declare and initialize connect string
      $host = 'localhost';
      $database = 'Semantically';
      $username = 'root';
      $password = '5@w4W@HGZtPXn97';

      // Connect to database and store instance
      $conn = mysqli_connect($servername, $username, $password, $database);

      return $conn;
    }
  }
