<?php

// Provides a wrapper class for determining the relationships between the
// books returned from the AustLit search.
class Relationships
{
    private $books = [];

    public function __construct($books)
    {
        $this->books = $books;
    }

    public function getRelationships($maxNumSimilar)
    {
        $relatedBooks = $this->findSimilarBooks($maxNumSimilar);
        $links = $this->calculateLinks($relatedBooks);

        return array($relatedBooks, $links);
    }

    // Create an array of objects showing similarity, with this format:
    // { source: (element of books), target: (element of books), similarity: (value between 0 and 1)}
    private function findSimilarBooks($maxNumSimilar)
    {
        $similarBookGrid = array(array());

        // Check the similiarity of every book with every other book.
        for ($i = 0; $i < sizeof($this->books); $i++) {
            for ($j = 0; $j < sizeof($this->books); $j++) {

                $similarBookGrid[$i][$j] = $this->calcSimularity
                ($this->books[$j], $this->books[$i]);

            }
        }

        // Determine which book is the most linked.
        $maxSimularityCount = 0;
        $rootBook = 0;

        for ($i = 0; $i < sizeof($this->books); $i++) {

            $simularityCount = 0;

            for ($j = 0; $j < sizeof($this->books); $j++) {
                $simularityCount += $similarBookGrid[$i][$j];
            }

            if ($simularityCount > $maxSimularityCount) {
                $maxSimularityCount = $simularityCount;
                $rootBook = $i;
            }
        }

        $graphBooks = [];
        $graphBooks[] = $this->books[$rootBook];

        // Populate the array of simular books by check each book's
        // similarity with the root book
        $similarBooks = $this->maxN($similarBookGrid[$rootBook],
            $maxNumSimilar);

        foreach ($similarBooks as $similarity) {
            for ($j = 0; $j < sizeof($this->books); $j++) {

                if ($similarBookGrid[$rootBook][$j] == $similarity &&
                    $j != $rootBook) {
                    $graphBooks[] = $this->books[$j];
                    break;
                }
            }
        }

        return $graphBooks;
    }

    // Calculate the links between books which can then be used by D3 to
    // render a forcegraph.
    private function calculateLinks($graphBooks)
    {
        // Now calculate each book's similarity to every other book
        $cutOff = 7; // decrease this for more (weak) links
        $links = [];

        for ($i = 0; $i < sizeof($graphBooks); $i++) {
            for ($j = $i + 1; $j < sizeof($graphBooks); $j++) {
                $sim = $this->calcSimularity($graphBooks[$i], $graphBooks[$j]);
                if ($sim > $cutOff || $i == 0 || $j == 0) {
                    $links[] = array(
                            'source' => $i,
                            'target' => $j,
                            'similarity' => $sim
                    );
                }
            }
        }

        // Change similarities to a 0-1 for between the lowest and highest
        $highestSimilarity = $this->getHighestSimilarity($links);
        $lowestSimilarity = $this->getLowestSimilarity($links);

        for ($i = 0; $i < sizeof($links); $i++) {
            $sim = $links[$i]['similarity'];
            $sim = 1 - ($sim - $lowestSimilarity) / ($highestSimilarity -
                $lowestSimilarity);
            $links[$i]['similarity'] = $sim;
        }

        // Sort by similarity
        usort($links, function ($a, $b) {
            if ($a['similarity'] < $b['similarity']) return 1;
            if ($a['similarity'] > $b['similarity']) return -1;
            return 0;
        });

        return $links;
    }

    // Calculate the simularity between books.
    function calcSimularity($a, $b) {

        $score = 0;

        // Series (20 pts)
        if (isset($a->series) && isset($b->series)) {
            if ($a->series === $b->series) {
                $score += 20;
            }
        }

        // Author (10 points)
        if (isset($a->author) && isset($b->author)) {
            if ($a->author === $b->author) {
                $score += 10;
            }
        }

        // Genre (5 points per genre)
        if (isset($a->genres) && isset($b->genres)) {
            foreach ($a->genres as $aG) {
                foreach ($b->genres as $bG) {
                    if ($aG === $bG) {
                        $score += 5;
                    }
                }
            }
        }

        // Topics (1 point per topic)
        if (isset($a->topics) && isset($b->topics)) {
            foreach ($a->topics as $aG) {
                foreach ($b->topics as $bG) {
                    if ($aG === $bG) {
                        $score += 1;
                    }
                }
            }
        }

        // Place setting (1 point)
        if (isset($a->settingPlace) && isset($b->settingPlace)) {
            if ($a->settingPlace === $b->settingPlace) {
                $score += 1;
            }
        }

        // Time setting (1 point)
        if (isset($a->settingTime) && isset($b->settingTime)) {
            if ($a->settingTime === $b->settingTime) {
                $score += 1;
            }
        }
        return $score + rand(0, 100000) / 100000;
    }

    // Calculate the highest simulairty score between books in a set.
    function getHighestSimilarity($links) {
        $highest = 0;
        foreach ($links as $link) {
            if ($link['similarity'] > $highest) {
                $highest = $link['similarity'];
            }
        }
        return $highest;
    }

    // Calculate the lowest simulairty score between books in a set.
    function getLowestSimilarity($links) {
        $lowest = 1000;
        foreach ($links as $link) {
            if ($link['similarity'] < $lowest) {
                $lowest = $link['similarity'];
            }
        }
        return $lowest;
    }

    # Get the top N values from an array.
    function maxN(array $numbers, $n) {
        $maxHeap = new SplMaxHeap;
        foreach($numbers as $number) {
            $maxHeap->insert($number);
        }
        return iterator_to_array(
            new LimitIterator($maxHeap, 0, $n)
        );
    }
}