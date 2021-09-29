<?php
  class Database {
    // Database connect
    public static function connect() {
      // Declare and initialize connect string
      $conn_str = sprintf('host=%s dbname=%s user=%s password=%s',
        'semantically.risonstudio.com', 'semantically', 'postgres', '');

      // Connect to database and store instance
      $conn = pg_connect($conn_str);

      return $conn;
    }
  }
