<?php

/**
 * Retrieves a list of books from AustLit API and then gets
 * a rating for those books.
 */

require('class/AustlitAPI.php');
require('class/GoodreadsBooks.php');

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

$ratingsController = new GoodreadsBooks($books);
$books = $ratingsController->getRatings();

// Return array of books sorted by rating.
header('Content-Type: application/json');
echo json_encode($books);
