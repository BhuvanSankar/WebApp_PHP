<?php

/**
 * Retrieves a list of books from AustLit API based on a keyword search
 */

include_once("class/AustlitAPI.php");
include_once("class/AmazonCovers.php");
include_once("class/GoodreadsBooks.php");
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

// If no book results, then don't need to run anything further.
if (count($books) > 1) {

    $bookRanking = new Ranking($books);
    $books = $bookRanking->getRanking($_POST['keyword'], $_POST['bias'], $_POST['maxResults']);

    // Return covers and links.
    $apiCovers = new AmazonCovers($books);
    $apiCovers->getCovers();

    $apiRatings = new GoodreadsBooks($books);
    $ratings = $apiRatings->getRatings();

}

// Return array of books sorted by rating.
header('Content-Type: application/json');
echo json_encode($books);