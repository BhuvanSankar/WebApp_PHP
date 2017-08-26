<?php

require('AmazonAPI.php');

// Provides a wrapper class to extract Amazon book cover information.
class AmazonCovers {

    private $books = [];

    public function __construct($books) {
        $this->books = $books;
    }

    public function getCovers() {
        $numOfBooks = count($this->books);
        $start = 0;
        $end = 10;

        // Split the search - 10 books one time for the Amazon restriction

        while ($start < $numOfBooks) {
            if ($end > $numOfBooks) {
                $end = $numOfBooks;
            }
            $this->queryCovers($start, $end);
            $start += 10;
            $end += 10;
        }
        return $this->books;
    }

    // Query amazon for book covers

    private function queryCovers($start, $end)
    {
        // Build string of isbns.
        $isbnStr = "";

        for ($i = $start; $i < $end; $i++) {
            $isbnStr = $isbnStr . $this->books[$i]->isbn . ",";
        }
        $isbnStr = substr($isbnStr, 0, -1);

        $url = "http://webservices.amazon.com/onca/xml?Service=AWSECommerceService&Operation=ItemLookup&Version=2011-08-01&ItemId=" .
               $isbnStr . "&IdType=ISBN&ResponseGroup=Images,ItemAttributes&SearchIndex=Books";

        $amazonAPI = new AmazonAPI();
        $response = $amazonAPI->queryAmazon($url);
        $parsed_xml = simplexml_load_string($response);

        for ($i = 0; $i < 10; $i++) {
            if ($parsed_xml->Items == null) continue;
            if ($parsed_xml->Items->Item[$i] == null) continue;
            if ($parsed_xml->Items->Item[$i]->LargeImage == null) continue;
            if ($parsed_xml->Items->Item[$i]->LargeImage->URL == null) continue;

            $cover_url = $parsed_xml->Items->Item[$i]->LargeImage->URL;
            $link = split("%", $parsed_xml->Items->Item[$i]->DetailPageURL)[0];
            $ean = $parsed_xml->Items->Item[$i]->ItemAttributes->EAN;
            $isbn = $parsed_xml->Items->Item[$i]->ItemAttributes->ISBN;

            // Reassociate covers with books
            foreach ($this->books as $key => $value) {
                if ($value->isbn == $ean || $value->isbn == $isbn) {
                    $this->books[$key]->cover = $cover_url;
                }
            }

            // Reassociate links with books
            foreach ($this->books as $key => $value) {
                if ($value->isbn == $ean || $value->isbn == $isbn) {
                    $this->books[$key]->link = $link;
                }
            }
        }
    }
}