<?php

/**
 * Testing page for API calls.
 * Used for development purposes only.
 */

include_once("php/class/AustlitAPI.php");
//include_once("getAuthorPhoto.php");
//include_once("authorPhoto.php");

function isbnCutoff($isbn) {
    if (strpos($isbn, " ") !== false) {
        $isbn = explode(" ", $isbn)[0];
    }
    if (strpos($isbn, "(") !== false) {
        $isbn = explode("(", $isbn)[0];
    }
    return $isbn;
}

$params = array(
        'objectType' => 'agent',
        'authorIDs' => 'A5886'
    //'workTitle' => 'war',
    // 'workGenre' => 'adventure',
    // 'maxResults' => '8',
    // 'countFrom' => '0'
);

$apiAustlit = new AustlitAPI($params);


$data = $apiAustlit->queryAustlit($params);

//print_r($data);
foreach ($data as $item) {

    echo $item->name;
    echo "<br>";
    echo $item->birthPlace;
    echo "<br>";
    //echo $isbn;
    echo "<br>";
    //$authorImage = new authorPhoto($item->authors[0][1]);
    //$Image = $authorImage->Findauthor($item->authors[0][1]);
    //$authorPhoto = new getAuthorPhoto($isbn);
    //$newsult = $authorPhoto->Findauthor($isbn);

    echo "<br>";

}
?>

