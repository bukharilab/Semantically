<?php
  require_once __DIR__ . '/../vendor/autoload.php';
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
  $dotenv->load();

  class Database {
    // Database connect
    public static function connect() {
      // Declare and initialize connect string
<<<<<<< HEAD
      $host = $_ENV['HOST_NAME'];
      $database = $_ENV['DATABASE'];
      $username = $_ENV['USER'];
      $password = $_ENV['PASS'];
=======
      $host = 'localhost';
      $database = 'Semantically';
      $username = 'root';
      $password = '';
>>>>>>> f2d3a9592247871bc431ce55190befeafc0cd8d5

      // Connect to database and store instance
      $conn = mysqli_connect($host, $username, $password, $database);

      return $conn;
    }
  }
