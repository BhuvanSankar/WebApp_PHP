<?php

// Provides a wrapper class for getting locations from AustLit book arrays.
class Locations
{
    private $books = [];

    public function __construct($books)
    {
        $this->books = $books;
    }

    // Get list of locations from Austlit book array
    public function getLocations()
    {
        $locations = [];
        $locationList = [];

        for ($i = 0; $i < sizeof($this->books); $i++) {
            $book = $this->books[$i];
            if (isset($book->settingPlace)) {
                foreach ($book->settingPlace as $location) {

                    $location = $location[1];
                    if (!isset($locations[$location])) {
                        $locations[$location] = [];
                        //$locationList[] = $location;
                    }
                    $locations[$location] = $i;
                }
            }
        }

        // Add locations to locationList in sorted order
        $locationCounter = 0;
        foreach ($locations as $key => $value) {
            $locationRank = array('text' => $key, 'size' => $value);
            $locationList[] = $locationRank;
        }

        return array($locationList);
    }
}
