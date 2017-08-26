<?php

include_once("MultiRequest.php");

// Provides a wrapper class for Goodreads author photos and ratings.
// Goodreads.
class GoodreadsAuthors
{
    public $books = [];

    public function __construct($authors)
    {
        $this->authors = $authors;
    }

    public function getAuthorPhotos()
    {
        $key = array('qRfujVUrT8eO1onERaGg','ozdkV8g2OeUiIPeb51SkTg','qcTBYRpsVfQsSCSRNC1e9g','iuAb2vanCV3g0pPlAXzew');
        $authorCount = 0;
        $multiple = 4;
        $queryArray = [];

        // Build query array.
        foreach($this->authors as $author){
            $keyToUse = $key[$authorCount % $multiple];

            $queryArray[] = $this->goodreadsQuery($author, $keyToUse);
            $authorCount++;
        }

        // Get back results array.
        $bookResults = multiRequest($queryArray);
        $returnArray = [];

        // Process results array into useable information.
        foreach ($bookResults as $bookResult) {

            $Object = simplexml_load_string($bookResult);

            if (property_exists($Object, 'book')) {
                $returnArray[] = array(
                    'link' => (string)$Object->book->authors->author->link,
                    'id' => (string)$Object->book->authors->author->id,
                    'rating' => (float)(string)$Object->book->authors->author->average_rating,
                    'image' => (string)$Object->book->authors->author->image_url,
                    'isbn' => (string)$Object->book->isbn,
                    'isbn13' => (string)$Object->book->isbn13);
            }
        }

        // Match up xml results to original array.
        $arrayCount = 0;
        foreach($this->authors as $author) {

            $isImageSet = isset($author->image);
            $alreadyHaveImage = false;
            if ($isImageSet) {
                $alreadyHaveImage = $author->image != "" ? true : false;
            }

            foreach ($returnArray as $bookInfo) {

                if (property_exists($author, 'isbn')) {

                    if ($bookInfo['isbn'] == $author->isbn ||
                        $bookInfo['isbn13'] == $author->isbn) {

                        if (isset($bookInfo['link'])) {
                            $this->authors[$arrayCount]->grlink = $bookInfo['link'];
                        }


                        if (isset($bookInfo['rating'])) {
                            $this->authors[$arrayCount]->rating = $bookInfo['rating'];
                        }

                        if ((!$isImageSet || !$alreadyHaveImage) && isset
                            ($bookInfo['image'])) {
                            $this->authors[$arrayCount]->image = $bookInfo['image'];
                        }
                    }
                }
            }
            $arrayCount++;
        }
        return $this->authors;
    }

    // Get goodreads query string.
    function goodreadsQuery($author, $key)
    {
        // Get info about an author using book isbn
        if (property_exists($author, 'isbn')) {
            $isbn = $author->isbn;
            $url1 = 'http://www.goodreads.com/book/isbn?&isbn=' .
                $isbn . '&key=' . $key;

            return $url1;
        }
        return $url1 = 'http://www.goodreads.com/book/isbn?&isbn=' .
            'no-isbn' . '&key=' . $key;
    }
}
