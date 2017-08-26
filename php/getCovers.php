<?php

/**
 * Retrieves a list of book covers from AustLit API
 */

include_once("class/AustlitAPI.php");
include_once("class/AmazonCovers.php");
include_once("class/Ranking.php");

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

$apiAustlit = new AustlitAPI($params);
$books = $apiAustlit->getBooks();

$bookRanking = new Ranking($books);
$books = $bookRanking->getRanking($_POST['keyword'], "cover", $_POST['maxResults']);

$apiCovers = new AmazonCovers($books);
$apiCovers->getCovers();

header('Content-Type: application/json');
echo json_encode($books);