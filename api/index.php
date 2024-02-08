<?php
require_once 'vendor/autoload.php';
use Laudis\Neo4j\Authentication\Authenticate;
use Laudis\Neo4j\ClientBuilder;

$client = Laudis\Neo4j\ClientBuilder::create()->withDriver('http', 'http://localhost:8081', Authenticate::basic('neo4j','root1234'))->build();

$result = $client->run(<<<'CYPHER'
MERGE (neo4j:Database {name: $dbName}) - [:HasRating] - (rating:Rating {value: 10})
RETURN neo4j, rating
CYPHER, ['dbName' => 'neo4j'])->first();

$neo4j = $result->get('neo4j');
$rating = $result->get('rating');

// Outputs "neo4j is 10 out of 10"
echo $neo4j->getProperty('name').' is '.$rating->getProperty('value') . ' out of 10!';
