<?php

/**
 * Retrieves a list of book from AustLit API then calculates the
 * relationship between each book.
 */
include_once("class/AustlitAPI.php");
include_once("class/AmazonCovers.php");
include_once("class/Ranking.php");
include_once('class/Relationships.php');

$maxNumSimilar = $_POST['maxResults'];

$params = [];

if (isset($_POST['keyword'])) {
    $params = array(
        'keyword' => $_POST['keyword'],
        'workForm' => $_POST['workForm'],
        'numResults' => $_POST['numResults'],
        'maxResults' => $_POST['maxResults'],
        'countFrom' => $_POST['countFrom'],
        'bias' => $_POST['bias']
    );
}

$austlitAPI = new AustlitAPI($params);
$books = $austlitAPI->getBooks();

$relationshipsController = new Relationships($books);
$relationships = $relationshipsController->getRelationships($maxNumSimilar);

$apiCovers = new AmazonCovers($relationships[0]);
$apiCovers->getCovers();

header('Content-Type: application/json');
echo json_encode($relationships);