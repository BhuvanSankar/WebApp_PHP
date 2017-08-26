<!doctype html>
<html lang="en">

<head>
    <title>AustLit Discovery</title>

    <!-- App header -->
    <?php $content = file_get_contents('page_inserts/header_detail.html');
    echo($content); ?>

</head>

<body id="content" class="container-fluid sub">

    <!-- Top menu bar / navigation -->
    <?php $content = file_get_contents('page_inserts/accordion_top_menu.html');
    echo($content); ?>


    <!-- Main Content Section -->
    <div id="accordion" class="container accordion-container max-width">

        <div id="sectionUpArrow" class="container arrow-bar max-width"
             style = "display: none;">
            <img id="mobile-nav-arrow-up" class="mobile-nav-arrow"
                 src="images/mobile-up.png">
        </div>

        <div id="sectionOneHeader" class="container accordion-bar max-width">
            <i class="fa fa-plus"></i> Popular Books
            <img id="s1loadbar" class="loadbar" src="images/294.png">
            <img id="s1loadbar-small" class="loadbar-small"
                 src="images/294_small.png">
        </div>

        <div id="sectionOneDetail" class="container search-results-light
        max-width variable-padding" style =
        "display: none;">
            <?php $content = file_get_contents('page_inserts/popular_novels.html');
            echo($content); ?>
        </div>

        <div id="sectionTwoHeader" class="container accordion-bar max-width">
            <i class="fa fa-minus"></i> Popular Authors
            <img id="s2loadbar" class="loadbar" src="images/294.png">
            <img id="s2loadbar-small" class="loadbar-small" src="images/294_small.png">
        </div>

        <div id="sectionTwoDetail" class="container search-results-light max-width variable-padding" style = "display: none;">
            <?php $content = file_get_contents('page_inserts/popular_authors.html');
            echo($content); ?>
        </div>

        <div id="sectionThreeHeader" class="container accordion-bar max-width">
            <i class="fa fa-plus"></i> Hot Topics
            <img id="s3loadbar" class="loadbar" src="images/294.png">
            <img id="s3loadbar-small" class="loadbar-small"
                 src="images/294_small.png">
        </div>

        <div id="sectionThreeDetail" class="container search-results-light
        max-width variable-padding variable-padding-right" style = "display: none;">
            <?php $content = file_get_contents('page_inserts/popular_topics.html');
            echo($content); ?>
        </div>

        <div id="sectionFourHeader" class="container accordion-bar max-width">
            <i class="fa fa-plus"></i> Book Relationship Graph
            <img id="s4loadbar" class="loadbar" src="images/294.png">
            <img id="s4loadbar-small" class="loadbar-small"
                 src="images/294_small.png">
        </div>

        <div id="sectionFourDetail" class="container search-results-light max-width variable-padding" style = "display: none;">
            <?php $content = file_get_contents('page_inserts/relationship_graph.html');
            echo($content); ?>
        </div>

        <div id="sectionFiveHeader" class="container accordion-bar max-width">
            <i class="fa fa-plus"></i> Book Locations & Settings
            <img id="s5loadbar" class="loadbar" src="images/294.png">
            <img id="s5loadbar-small" class="loadbar-small"
                 src="images/294_small.png">
        </div>

        <div id="sectionFiveDetail" class="container search-results-light
        max-width variable-padding" style = "display: none;">
            <?php $content = file_get_contents('page_inserts/book_locations.html');
            echo($content); ?>
        </div>

        <div id="sectionDownArrow" class="container arrow-bar
        max-width" style = "display: none;">
            <img id="mobile-nav-arrow-down" class="mobile-nav-arrow"
                 src="images/mobile-down.png">
        </div>

    </div>

    <!-- Footer -->
    <?php $content = file_get_contents('page_inserts/bottom_footer.html');
    echo($content); ?>

</body>

</html>