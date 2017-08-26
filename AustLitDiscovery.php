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
    <div class="navbar navbar-inverse navbar-fixed-top navbar-fixed-width" role="navigation">

    <div class="titlebar container max-width variable-padding variable-padding-right">
        <div class="header">
            <div class="brand-logo">
                <a href="index.php">
                    <img src="images/discoverylogo_grey_cropped.png" alt="IconHeader">
                </a>
                <div class="header-quote">
                    <i class="fa fa-quote-left quote-mark"></i>
                    It's like taking a walk through a virtual library.
                    <i class="fa fa-quote-right quote-mark"></i>
                </div>
            </div>

        </div>
    </div>

    <div class="container search-bar max-width" id="top-search-bar">
        <form id="SearchBox" role="search" onsubmit="initiateSearchHome(); return false">
            <div class="search-box">
                <span class="fa fa-search"></span>
                <input class="form-control" placeholder="Search" type="text" id="searchTitle">
            </div>
        </form>
    </div>

</div>

    <!-- Main Content Section -->
    <div class="container-fluid max-width">
        <div class="row info-page">
            <div class="col-xs-1 col-sm-1 col-md-1"></div>
            <div class="col-xs-10 col-sm-10 col-md-10">
                <h3>About AustLit Discovery</h3>

                <p>AustLit Discovery is a visual search interface that allows you to look for Australian
                literature as if you were browsing through a library or bookstore. You can explore for books based on title,
                author, keyword, location, topic or relationship.</p>

                <p>Discovery links to over 800,000 records of Australian literature sourced from
                AustLit’s book database, supplemented with information from Goodreads and Amazon.
                If you like reading books and hadn’t really heard much about Australian literature or even if
                you’re a big fan, Discovery is a great place to start your journey.</p>
            </div>
            <div class="col-xs-1 col-sm-1 col-md-1"></div>
        </div>
    </div>

    <!-- Footer -->
    <?php $content = file_get_contents('page_inserts/bottom_footer.html');
    echo($content); ?>

</body>
</html>