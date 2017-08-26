<?php

/**
 * Retrieves a list of books from AustLit API then returns the ranked
 * location from the books.
 */

require('class/AustlitAPI.php');
require('class/Locations.php');

$maxNumSimilar = $_POST['numResults'];

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

$locationsController = new Locations($books);
$locations = $locationsController->getLocations();

header('Content-Type: application/json');
echo json_encode($locations);