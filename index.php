<!doctype html>

<html lang="en" home-background>

<head>
    <title>AustLit Discovery</title>

    <!-- Common header insert across all pages -->
    <?php $content = file_get_contents('page_inserts/header_detail.html');
    echo($content); ?>

    <!-- Page specific styling or javascript -->
    <link rel="stylesheet" href="css/home.css">

</head>

<body class="container-fluid home vertical-center">
    <!-- Echo page name for search choice later -->
    <?php echo "<div id='pageId' style='display:none'>" . basename
            ($_SERVER['PHP_SELF'])
            . "</div>"; ?>

    <!-- Main Content Section -->
    <header>
        <div class="header-content">
            <div class="header-content-inner">
                <img src="images/discoverylogo.png" class="img-responsive"
                     alt="Responsive image">

                <p>Explore Australian Literature the visual way.</p>

                <div class="home-search-bar">
                    <form id="search" class=""
                          onsubmit="initiateSearchHome(); return false">
                        <div class="home-search-box">
                            <span class="fa fa-search"> </span>
                            <input class="form-control"
                                   placeholder="Search discovery..."
                                   type="text" id="searchTitle">
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </header>

</body>
<script>$('#searchTitle').focus();</script>
</html>
