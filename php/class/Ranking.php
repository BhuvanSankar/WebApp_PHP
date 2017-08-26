<?php

// Provides a wrapper to calculate book rankings from returned AustLit books.
class Ranking {

    private $books = [];
    private $bias;

    public function __construct($books)
    {
        $this->books = $books;
    }

    // Rank each book in the book array, then cull the list.
    function getRanking($searchString, $searchBias, $maxBooks)
    {
        $this->calculateRanking($searchString);
        $this->books = array_slice($this->books, 0, $maxBooks, true);
        $this->bias = $searchBias;
        return $this->books;
    }

    private function calculateRanking($searchString)
    {
        for ($i = 0; $i < sizeof($this->books); $i++) {
            $this->books[$i]->scoring = $this->calculateScore($this->books[$i], $searchString);
        }

        // Books sorted in descending score order.
        usort($this->books, function ($a, $b) {
            if ($a->scoring < $b->scoring) return 1;
            if ($a->scoring > $b->scoring) return -1;
            return 0;
        });

        for ($j = 0; $j < sizeof($this->books); $j++) {
            $this->books[$j]->rank = $j + 1;
        }
    }

    /*
     * Returns score of each book w.r.t the given keyword (searchstring).
     */
    private function calculateScore($book, $searchString)
    {
        $score = 0;
        $searchBias = $this->bias;
        $searchBiasModifier = 100000;

        // Max 10^5 pts for exact matching otherwise 9X10^4 points
        if (isset($book->title)) {
            if (preg_match("/\b$searchString\b/i", $book->title)) {
                $score += 100000;
            } elseif (preg_match("/$searchString/i", $book->title)) {
                $score += 90000;
            }
            if ($searchBias == "title") {
                $score += $searchBiasModifier;
            }
        }

        // Max 10^4 pts for exact matching otherwise 9X10^3 points
        if (isset($book->author)) {
            if (preg_match("/\b$searchString\b/i", $book->author)) {
                $score += 10000;
            } elseif (preg_match("/$searchString/i", $book->author)) {
                $score += 9000;
            }
            if ($searchBias == "author") {
                $score += $searchBiasModifier;
            }
        }

        // Max 10^3 pts for exact matching otherwise 9X10^2 points
        if (isset($book->topics)) {
            foreach ($book->topics as $topic) {
                if (preg_match("/\b$searchString\b/i", $topic[1])) {
                    $score += 1000;
                } elseif (preg_match("/$searchString/i", $topic[1])) {
                    $score += 900;
                }
            }
            if ($searchBias == "topic") {
                $score += $searchBiasModifier;
            }
        }

        // Max 100 pts for exact matching otherwise 90 points
        if (isset($book->genres)) {
            foreach ($book->genres as $genre) {
                if (preg_match("/\b$searchString\b/i", $genre)) {
                    $score += 100;
                } elseif (preg_match("/$searchString/i", $genre)) {
                    $score += 90;
                }
            }
            if ($searchBias == "genre") {
                $score += $searchBiasModifier;
            }
        }

        // Max 50 pts for exact matching otherwise 30 points
        if (isset($book->settingsPlaces)) {
            if (preg_match("/\b$searchString\b/i", $book->settingsPlaces)) {
                $score += 50;
            } elseif (preg_match("/$searchString/i", $book->settingsPlaces)) {
                $score += 30;
            }
            if ($searchBias == "location") {
                $score += $searchBiasModifier;
            }
        }

        // Max 10 pts for exact matching otherwise 8 points
        if (isset($book->abstract)) {
            if (preg_match("/\b$searchString\b/i", $book->abstract)) {
                $score += 10;
            } elseif (preg_match("/$searchString/i", $book->abstract)) {
                $score += 8;
            }
        }

        if (isset($book->cover) && $searchBias = "cover") {
            $score = ($score > 0) ? $score *= 20 : $score = 10;
        }
        
        return $score;
    }
}