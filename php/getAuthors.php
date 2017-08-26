<?php

/**
 * Retrieves a list of authors from AustLit API
 */

include_once("class/AustlitAPI.php");
include_once("class/GoodreadsAuthors.php");
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

$authorIDs = [];

foreach ($books as $book) {

    if(isset($book->authorID)){
        $newAuthorId = $book->authorID;

        $authorAlreadyListed = false;

        foreach ($authorIDs as $authorID) {
            if($authorID == $newAuthorId){
                $authorAlreadyListed = true;
            }
        }

        if (!$authorAlreadyListed) {
            $authorIDs[] = $book->authorID;
        }
    }
}

$params2 = array(
    'objectType' => 'agent',
    'authorIDs' => $authorIDs
);

$apiAustlit = new AustlitAPI($params2);
$authors = $apiAustlit->getAuthors();

// Need to loop through author array to get id to lookup book isbn
$authorCount = 0;
foreach ($authors as $author) {

    foreach ($books as $book) {
        if (!isset($book->authorID)) {
            break;
        }
        if(!isset($book->isbn)){
            break;
        }
        if ($book->authorID == $author->austlitId) {
            $authors[$authorCount]->isbn = $book->isbn;
            break;
        }
    }
    $authorCount++;
}

$apiAuthorPhotos = new GoodreadsAuthors($authors);
$apiAuthorPhotos->getAuthorPhotos();

header('Content-Type: application/json');
echo json_encode($authors);