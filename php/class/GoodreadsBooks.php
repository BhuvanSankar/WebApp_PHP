<?php

include_once("MultiRequest.php");

// Provides a wrapper class for querying the Goodreads API for book information.
class GoodreadsBooks
{
    public $books = [];

    public function __construct($books)
    {
        $this->books = $books;
    }

    public function getRatings()
    {
        $this->queryGoodreads();
        return $this->books;
    }

    // Query GoodReads for ratings and review stats
    private function queryGoodreads()
    {

        $key = array('qRfujVUrT8eO1onERaGg','ozdkV8g2OeUiIPeb51SkTg','qcTBYRpsVfQsSCSRNC1e9g','iuAb2vanCV3g0pPlAXzew');
        $bookCount = 0;
        $multiple = 4;
        $queryArray = [];

        // Build query array.
        foreach ($this->books as $book) {
            $keyToUse = $key[$bookCount % $multiple];
            $queryArray[] = $url1 = 'http://www.goodreads.com/book/isbn?&isbn=' .
                $book->isbn . '&key=' . $keyToUse;
            $bookCount++;
        }

        // Get back results array.
        $bookResults = multiRequest($queryArray);

        // Process results array into useable information.
        foreach ($bookResults as $bookResult) {

            $Object = simplexml_load_string($bookResult);

            if (property_exists($Object, 'book')) {
                $id = (string)$Object->book->id;
                $rating = (float)(string)$Object->book->average_rating;
                $image = (string)$Object->book->image_url;
                $isbn = (string)$Object->book->isbn;
                $isbn13 = (string)$Object->book->isbn13;
                $grlink = (string)$Object->book->link;

                $this->updateBook($isbn, $isbn13, $rating, $image, $grlink);
            }
        }

        // Sort by rating.
        usort($this->books, function ($a, $b) {
            if (!isset($a->rating)) return 1;
            if (!isset($b->rating)) return -1;
            if ($a->rating < $b->rating) return 1;
            if ($a->rating > $b->rating) return -1;
            return 0;
        });
    }

    // Insert ratings fields into original book object in books array.
    public function updateBook($isbn, $isbn13, $rating, $image, $grlink) {
        foreach ($this->books as $book) {
            if ($book->isbn == $isbn||$book->isbn == $isbn13) {
                $book->rating = $rating;
                $book->grlink = $grlink;

                if (strpos($image,'nophoto') == false) {
                    if (isset($book->cover)) {
                        if ($book->cover == null || $book->cover ="http://www
                    //.austlit.edu.au/austlit/static/new/images/newsiteimages/") {
                            $book->cover = $image;
                        }
                    }
                }
            }
        }
    }
}