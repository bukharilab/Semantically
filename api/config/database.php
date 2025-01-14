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
      $neo4j_connection_type = $_ENV['NEO4J_CONNECTION_TYPE'];
      $neo4j_connection_url = $_ENV['NEO4J_CONNECTION_URL'];
      $neo4j_username = $_ENV['NEO4J_USERNAME'];
      $neo4j_password = $_ENV['NEO4J_PASSWORD'];
    
    $client = ClientBuilder::create()

      ->withDriver($neo4j_connection_type, $neo4j_connection_url, Authenticate::basic($neo4j_username, $neo4j_password))
      ->build();
      return $client;

    }
    
  }
Database::connect();
  