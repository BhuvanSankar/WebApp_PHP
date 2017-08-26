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
                <h3>AustLit Discovery Contributors</h3>

                <p>AustLit Discovery was made possible through a
                    collaboration between AustLit and students in their
                    penultimate year of their programs in Interaction Design
                    and Information Technology, at the University of
                    Queensland.</p>

                <p>The build team included the following team members:</p>

                <h4>Andre de San Miguel</h4>
                <h5>Developer</h5>
                <p>Andre worked on both the front and back-ends of the site
                    and played a key part in building and designing the
                    site's visualisation features.</p>

                <h4>Lisha Wang</h4>
                <h5>UX/UI Designer</h5>
                <p>Lisha Wang was responsible for the user interface design
                    and user experience design of AustLit Discovery.</p>

                <h4>Xiao Wang</h4>
                <h5>Backend Programmer</h5>
                <p>Xiao focused on fetching and processing data from
                    AustLit, Amazon, GoodReads and Google.</p>

                <h4>Bhuvaneswari Thirugnanasambandham</h4>
                <h5>Backend Programmer</h5>

                <h4>Alex Cazanas</h4>
                <h5>Frontend Developer</h5>

                <h4>Chris Lee</h4>
                <h5>Backend Programmer</h5>


            </div>
            <div class="col-xs-1 col-sm-1 col-md-1"></div>
        </div>
    </div>

    <!-- Footer -->
    <?php $content = file_get_contents('page_inserts/bottom_footer.html');
    echo($content); ?>

</body>
</html>