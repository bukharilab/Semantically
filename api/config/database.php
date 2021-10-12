<?php
  class Database {
    // Database connect
    public static function connect() {
      // Declare and initialize connect string
      $host = '127.0.0.1';
      $database = 'semantically';
      $username = 'root';
      $password = '5@w4W@HGZtPXn97';

      // Connect to database and store instance
      $conn = mysqli_connect($servername, $username, $password, $database);

      return $conn;
    }
  }
