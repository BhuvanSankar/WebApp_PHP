<?php

// Provides a wrapper class for querying the AustLit API.
class AustlitAPI
{
    private $books = [];
    private $authors = [];

    public function __construct($params)
    {
        // Query Austlit straight away.
        $this->processAustlitData($this->queryAustlit($params));
    }

    public function getBooks()
    {
        return $this->books;
    }

    public function getAuthors()
    {
        return $this->authors;
    }

    // User can requery the object.
    public function queryAustlit($params)
    {
        if (!isset($params['authorIDs'])) {

            $url = $this->buildUrl($params);

            // Create a stream to set HTTP request headers.
            $opts = array('http' => array(
                    'method' => "GET",
                    'header' => "Accept: text/html"
            ));
            $context = stream_context_create($opts);

            // Open file using HTTP headers set above.
            $response = file_get_contents($url, false, $context);

            // Remove the first div at the start.
            $fdiv = strpos($response, "<div id='results'>", 20);
            $response = substr($response, $fdiv);

            // Parse austlit IDs from the HTML returned.
            $ids = [];
            $dom = new DOMDocument;
            $dom->loadXML($response);
            foreach ($dom->getElementsByTagName('span') as $node) {
                if ($node->hasAttribute('austlitId')) {
                    $ids[] = $node->getAttribute('austlitId');
                }
            }
        } else {
            $ids = $params['authorIDs'];
        }

        // POST request.
        $url = "http://www.austlit.edu.au/austlit/export";

        // Serialise ids array.
        $nodestr = "";
        foreach ($ids as $id) {
            $nodestr = $nodestr . "&nodes=" . $id;
        }

        // Prepare data to post.
        $post = array(
                'exportTemplate' => "JSON",
                'disposition' => "file",
                'downloadFileName' => "export",
                'downloadFileExtension' => "json"
        );

        // Build content string (data to post).
        $content = http_build_query($post) . $nodestr;

        // Set request headers.
        $opts = array('http' => array(
                'method' => "POST",
                'header' => "Content-type: application/x-www-form-urlencoded; charset=UTF-8\r\n" .
                        "Accept: application/json, text/javascript, */*; q=0.01",
                'content' => $content
        ));
        $context = stream_context_create($opts);

        // Open file using HTTP headers set above.
        $response = file_get_contents($url, false, $context);
        return json_decode($response);
    }

    // Build the AustLit API query string.
    function buildUrl($params)
    {
        if (isset($params['numResults'])) {
            $numResults = $params['numResults'];
        } else {
            $numResults = 60;
        }
        if (isset($params['countFrom'])) {
            $countFrom = $params['countFrom'];
        } else {
            $countFrom = 0;
        }

        // Change url for the optional agent parameter.
        $objectType = "work";
        if (isset($params['objectType'])) {
            if ($params['objectType'] == "agent") {
                $objectType = "agent";
            }
        }

        // Build the query url based on user parameters
        $url = "http://www.austlit.edu.au/austlit/search?format=IdsOnly&facetValuesSize=0&facetSampleSize=0&passThru=y" .
                "&count=" . $numResults .
                "&from=" . $countFrom .
                "&scope=" . $objectType .
                "&agentQuery=" .
                "&workQuery=" .
                "(wworkType:%22" . urlencode("single work") . "%22)%20AND%20";

        if (isset($params['keyword'])) {
            $url = $url . "(%22" . urlencode($params['keyword']) . "%22)%20AND%20";
        }

        // Currently workform querying has been turned off to increase the
        // variety of results.

        //if (isset($params['workForm'])) {
        //    $url = $url . "(wform:%22" . urlencode($params['workForm']) . "%22)%20AND%20";
        //}

        if (isset($params['workGenre'])) {
            $url = $url . "(wgenre:%22" . urlencode($params['workGenre']) . "%22)%20AND%20";
        }

        if (isset($params['workTitle'])) {
            $url = $url . "((ftwtitle:%22" . urlencode($params['workTitle']) . "%22)%20OR%20(ftwotherTitle:%22" . urlencode($params['workTitle']) . "%22))%20AND%20";
        }

        // Remove final AND.
        $url = substr($url, 0, -9);
        return $url;
    }

    // Return an array of book objects.
    private function processAustlitData($data)
    {
        $books = [];
        $authors = [];

        if (is_array($data) || is_object($data)){

            foreach ($data as $item) {

                // All items must have an object type.
                if (isset($item->objectType)) {

                    // Build an authors object.
                    if ($item->objectType == "agent") {
                        $author = new stdClass();
                        if (isset($item->austlitId)) {
                            $author->austlitId = $item->austlitId;
                        }
                        if (isset($item->name)) {
                            $author->name = $item->name;
                        }
                        if (isset($item->bio)) {
                            $author->bio = $item->bio;
                        }
                        if (isset($item->birthPlace)) {
                            $author->birthPlace = $item->birthPlace;
                        }

                        $austLitPic = $this->getAustlitPic($item);
                        if ($austLitPic != "") {
                            $author->image = $austLitPic;
                        }

                        $authors[] = $author;

                    // Build a book object.
                    } else {
                        if (isset($item->ISBNs)) {
                            if (sizeof($item->ISBNs) > 0) {
                                $duplicateFlag = false;
                                foreach($books as $oneBook){
                                    if($oneBook->isbn == $this->isbnCutoff($item->ISBNs[0])){
                                        $duplicateFlag = true;
                                        break;
                                    }
                                }
                                if($duplicateFlag == false){
                                    $book = new stdClass();
                                    $book->isbn = $this->isbnCutoff($item->ISBNs[0]);
                                    if (isset($item->authors[0])) {
                                        $book->author = $item->authors[0][1];
                                        $book->authorID = $item->authors[0][0];
                                    }
                                    if (isset($item->abstract)) {
                                        $book->abstract = $item->abstract;
                                    }
                                    if (isset($item->concepts)) {
                                        $book->topics = $item->concepts;
                                    }
                                    if (isset($item->firstKnownDate)) {
                                        $book->date = $item->firstKnownDate;
                                    }
                                    if (isset($item->forms[0])) {
                                        $book->form = $item->forms[0];
                                    }
                                    if (isset($item->genres)) {
                                        $book->genres = $item->genres;
                                    }
                                    if (isset($item->pagination)) {
                                        $book->pages = $item->pagination;
                                    }
                                    if (isset($item->partOfSeries[0])) {
                                        $book->series = $item->partOfSeries[0][1];
                                    }
                                    if (isset($item->publishers[0])) {
                                        $book->publisher = $item->publishers[0][1];
                                    }
                                    if (isset($item->settingsPlaces)) {
                                        $book->settingPlace = $item->settingsPlaces;
                                    }
                                    if (isset($item->settingsTimes)) {
                                        $book->settingTime = $item->settingsTimes;
                                    }
                                    if (isset($item->subjectWorks)) {
                                        $book->subjects = $item->subjectWorks;
                                    }
                                    if (isset($item->title)) {
                                        $book->title = $item->title;
                                    }
                                    if (isset($item->austlitId)) {
                                        $book->austlitId = $item->austlitId;
                                    }
                                    if (isset($item->placesPublished[0])) {
                                        $book->placePublished = $item->placesPublished[0][1];
                                    }

                                    $book->rating = null;
                                    $austLitPic = $this->getAustlitPic($item);
                                    $book->cover = $austLitPic;
                                    $books[] = $book;
                                }
                            }
                        }
                    }
                }
            }
        }
        $this->books = $books;
        $this->authors = $authors;
    }

    // Process Austlit object for author pictures or covers
    private function getAustlitPic($item)
    {
        $imageSources = [];
        if (isset($item->newImages[0]) && !empty($item->newImages[0])) {
            $imageSources[] = $item->newImages[0];
        }
        if (isset($item->newImages2[0]) && !empty($item->newImages2[0])) {
            $imageSources[] = $item->newImages2[0];
        }
        if (isset($item->oldImages[0]) && !empty($item->oldImages[0])) {
            $imageSources[] = $item->oldImages[0];
        }
        if (isset($item->oldImages2[0]) && !empty($item->oldImages2[0])) {
            $imageSources[] = $item->oldImages2[0];
        }

        foreach ($imageSources as $imageSource) {

            $url = $this->imageUrl($imageSource);
            if ($url != null && $url != "") {
                return $url;
                break;
            }
        }
        return "";
    }

    // Process AustLit image source using a preferential cascade.
    private function imageUrl($item)
    {
        if (isset($item->smaller) && !empty($item->smaller)) {
            return $item->smaller;
        } elseif (isset($item->NLAImage) && !empty($item->NLAImage)) {
            return $item->NLAImage;
        } elseif (isset($item->fileName) && !empty($item->fileName)) {
            return $item->fileName;
        } elseif (isset($item->thumbnail) && !empty($item->thumbnail)) {
            return $item->thumbnail;
        }
        return null;
    }

    // Cut end characters off ISBNs
    private function isbnCutoff($isbn)
    {
        if (strpos($isbn, " ") !== false) {
            $isbn = explode(" ", $isbn)[0];
        }
        if (strpos($isbn, "(") !== false) {
            $isbn = explode("(", $isbn)[0];
        }
        return $isbn;
    }
}