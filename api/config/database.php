<?php
  require_once __DIR__ . '/../vendor/autoload.php';
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
  $dotenv->load();

  class Database {
    // Database connect
    public static function connect() {
      // Declare and initialize connect string
      $host = $_ENV['HOST_NAME'];
      $database = $_ENV['DATABASE'];
      $username = $_ENV['USER'];
      $password = $_ENV['PASS'];


      // Connect to database and store instance
      $conn = mysqli_connect($host, $username, $password, $database);

      return $conn;
    }
  }
