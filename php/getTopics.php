<?php

/**
 * Retrieves a list of book topics from AustLit API
 */

include_once('class/AustlitAPI.php');
include_once('class/Topics.php');
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
$books = $bookRanking->getRanking($_POST['keyword'], $_POST['bias'], $_POST['maxResults']);

$topicsController = new Topics($books);
$topicResults = $topicsController->getTopics();

header('Content-Type: application/json');
echo json_encode(array($books, $topicResults[0], $topicResults[1]));