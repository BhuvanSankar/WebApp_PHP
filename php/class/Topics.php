<?php

// Provides a wrapper class for extracting the topics from a set of AustLit
// books.
class Topics
{
    private $books = [];

    public function __construct($books) {
        $this->books = $books;
    }

    // Get a list of topics from an AustLit book array
    public function getTopics()
    {
        $topics = [];
        $topicList = [];

        for ($i = 0; $i < sizeof($this->books); $i++) {
            $book = $this->books[$i];
            if (isset($book->topics)) {
                foreach ($book->topics as $topic) {
                    $topic = $topic[1];
                    if (!isset($topics[$topic])) {
                        $topics[$topic] = [];
                        // $topicList[] = $topic;
                    }
                    $topics[$topic][] = $i;
                }
            }
        }

        // Sort array of topics in order of prevalence
        uasort($topics, function ($a, $b) {
            if (sizeof($a) < sizeof($b)) return 1;
            if (sizeof($a) > sizeof($b)) return -1;
            return 0;
        });

        // Add topics to topicList in sorted order
        $topicCounter = 0;
        foreach ($topics as $key => $value) {

            $bg = $this->get_relevant_image($key);
            $topicRank = array("name" => $key, "mcap" => sizeof($value),
                "bg" => $bg);
            $topicList[] = $topicRank;
            if ($topicCounter++ > 7)
                break;
        }

        // Add background image information
        return array($topics, $topicList);
    }

    // Get an image for the slected topic.
    public function get_relevant_image($topic)
    {
        $topic = strtolower($topic);

        $pics = [
            'aboriginal', 'academic', 'activist',
            'adolescent', 'adoption', 'ageing', 'alcohol',
            'ancestors', 'animal', 'art', 'australia',
            'boy', 'british', 'building',
            'bush', 'business', 'cat', 'child',
            'communism', 'cook', 'country', 'courtship', 'crim',
            'desert', 'detective', 'diar',
            'dragon', 'environment', 'eucalypt',
            'europe', 'exploration', 'families', 'family',
            'farm', 'father', 'fear', 'food',
            'forest', 'france', 'freedom', 'game',
            'girl', 'gold', 'graffiti', 'grandmother',
            'home', 'homosexuality', 'island', 'isolation',
            'landscape', 'librar', 'love', 'marriage',
            'military', 'monarchy', 'mother', 'murder',
            'nuclear', 'computer', 'orphanages', 'peace',
            'people', 'pets', 'disabilities', 'journeys',
            'poison', 'post', 'power', 'precious',
            'psychics', 'school', 'science', 'sea',
            'sheep', 'shipwreck', 'sister', 'soldier',
            'solitude', 'spirituality', 'stew', 'storm',
            'story', 'survival', 'sydney', 'teacher',
            'time', 'tourist', 'travel', 'tree',
            'universit', 'urban', 'war', 'wealth',
            'wedding', 'women', 'work', 'zoo'
        ];

        $path = '../images/treemap/';

        foreach ($pics as $pic) {

            if (strpos($topic, $pic) !== false) {

                // Test for jpg .. if yes, return with it.
                if (file_exists($path.$pic.".jpg")) {
                    return $path.$pic.".jpg";
                }

                // Test for png .. if yes, return with it.
                if (file_exists($path.$pic.".png")) {
                    return $path.$pic.".png";
                }
            }
        }

        return "";
    }
}
