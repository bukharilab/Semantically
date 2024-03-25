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
      $neo4jUrl = 'neo4j+s://9b2ba3a3.databases.neo4j.io';
$username = 'neo4j';
$password = '';

// Initialize the Neo4j client
$client = ClientBuilder::create()
    ->withDriver('default', $neo4jUrl, Authenticate::basic($username, $password)) // This is the correct approach
    ->build();
    /*
      $client = ClientBuilder::create()
      
      ->withDriver('neo4j+s', '9b2ba3a3.databases.neo4j.io:7687', Authenticate::basic('neo4j', 'Rs6ohkABtkf3O-l4w73N5n_DRpwRqVosjSyQxT6sABE'))
      ->build();
      */
      return $client;

    }
    
  }
Database::connect();
  