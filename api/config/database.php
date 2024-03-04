<?php
  
  //require_once 'C:/xampp/htdocs/Semantically-master/api/vendor/autoload.php';
  
  //require_once 'C:/xampp/htdocs/Semantically-master/api/vendor/autoload.php';
  
  /*
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
  $dotenv->load();
  */
  require_once '../vendor/autoload.php';
  use Laudis\Neo4j\Authentication\Authenticate;
  use Laudis\Neo4j\ClientBuilder;


  class Database {
    // Database connect
    public static function connect() {
      // Declare and initialize connect string
      /*
      $host = $_ENV['HOST_NAME'];
      $database = $_ENV['DATABASE'];
      $username = $_ENV['USER'];
      $password = $_ENV['PASS'];
      
      $host = "localhost";
      $database = "asim_semantically_dev";
      $username = "root";
      $password = "";
      
      // Connect to database and store instance
      $conn = mysqli_connect($host, $username, $password, $database);
      */
      $client = ClientBuilder::create()
      
      ->withDriver('bolt', 'bolt://localhost:7687', Authenticate::basic('neo4j', 'root1234'))
      ->build();
      return $client;

    }
    
  }
Database::connect();
  