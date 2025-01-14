<?php
include_once '../config/headers.php';
include_once '../config/database.php';
include_once '../config/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') post_request_error();

session_start();
$user_id = $_SESSION['user_id'];
if (!$user_id) user_id_error();
//Making sure that the document id is an int to avoid type mismatches.
$doc_id = (int) $_POST['document_id'];
$annotations = $_POST['annotations'];
if (!$doc_id || !$annotations) invalid_argument_error();

$annotations = json_decode($annotations, true);


$neo4jClient = Database::connect();

// Check if document annotations already exist
$query = 'MATCH (d:TblDocument {docId: $docId})<-[:annotated_to]-(a:TblPrimaryAnnotation) RETURN a LIMIT 1';
$result = $neo4jClient->run($query, ['docId' => $doc_id]);

if (count($result) > 0) die('Annotations already exist for this document.');
try {
//For each annotation, store them in the database and link them to the document the user made changes to. Annotations of key words in the document will persist. 
foreach ($annotations as $annotation) {
    $anno_id = rand();
    $anno_onto_id = rand();
    $query = 'MATCH (d:TblDocument {docId: $docId}) 
              CREATE (d)<-[:annotated_to]-(a:TblPrimaryAnnotation {annoId: $anno_id, ontologyId: $anno_onto_id, fromLoc: $from, toLoc: $to, textStr: $text, removed: -1}) 
              RETURN a.annoId AS annoId';
    if($query){
        success_message('The annotation has been recorded: ');
        echo "Annotation text: " . $annotation['text'];
    }
    else{
        print('There is no annotation');
    }
    $parameters = [
        'anno_id' => $anno_id,
        'anno_onto_id' => $anno_onto_id,
        'docId' => $doc_id,
        'from' => $annotation['from'],
        'to' => $annotation['to'],
        'text' => $annotation['text'],
    ];
    $annoResult = $neo4jClient->run($query, $parameters);
    $annoId = $annoResult->first()->get('annoId');

    // Each annotation will have a set of ontologies retrieved from online ontology databases. Store each ontology as a node and link it to the annotation.
    $first_ontology_id = null;
    foreach ($annotation['ontologies'] as $ontology) {
        //If the annotation is 
        if(!$first_ontology_id){
            $first_ontology_id = $anno_onto_id;
            $onto_id = $first_ontology_id;
        }
        else{
            $onto_id = rand();
        }
        
        $query = 'MATCH (a:TblPrimaryAnnotation) 
                  WHERE a.annoId = $annoId 
                  CREATE (a)<-[:annotated_from]-(:TblOntology {ontologyId: $onto_id, acronym: $acronym, matchType: $matchType, link: $link, ontoId: $id})';
        $parameters = [
            'annoId' => $annoId,
            'onto_id' => $onto_id,
            'acronym' => $ontology['acronym'],
            'matchType' => $ontology['matchType'],
            'link' => $ontology['link'],
            'id' => $ontology['id'],
        ];
        $neo4jClient->run($query, $parameters);
        

    }
    success_message("Annotations saved.");
}
}
catch (\Throwable $e) {
    // Handle any errors during the execution of the query
    system_error($e->getMessage());
}
?>
