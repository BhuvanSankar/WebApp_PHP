/**
 * Query parameters
 */
var numResults = 200; // Number of AustLit search results to request
var maxResults = 12; // Max results to display on page.
var countFrom = 0; // Used to stagger the AustLit search results.
var numSimilar = 5; // Number of books to display on relationship map
var keyWord = ""; // Keyword used in the search.

/**
 * Storage for section results. Useful for re-renders.
 */
var bookData;
var authorData;
var treeMapData;
var lastClicked;
var wordCloudData;
var forceGraphBooks;
var forceGraphLinks;

/**
 * Add event listeners to accordion bars.
 *
 * If this page is a redirect from the home page then it will contain a
 * search string in the address. Take this search string and search using
 * the current page.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    var urlParams = getUrlVars();

    if (urlParams["search"] != null) {
        toggle_visibility(0, 0);
        initiateSearch(urlParams["search"], "no-bias");
        keyWord = urlParams["search"];
    }

    if (urlParams["topic"] != null) {
        toggle_visibility(0, 0);
        initiateSearch(urlParams["topic"], "topic");
        keyWord = urlParams["topic"];
    }

    if (urlParams["location"] != null) {
        toggle_visibility(0, 0);
        initiateSearch(urlParams["location"], "location");
        keyWord = urlParams["location"];
    }

    if (urlParams["search"] == null) {
        toggle_visibility(0, 0);
    }

    $("#sectionUpArrow").click(function () {
        toggle_visibility(-1, -1);
    });

    $("#sectionOneHeader").click(function () {
        toggle_visibility(0, 0);
    });

    $("#sectionTwoHeader").click(function () {
        toggle_visibility(1, 0);
    });

    $("#sectionThreeHeader").click(function () {
        toggle_visibility(2, 0);
    });

    $("#sectionFourHeader").click(function () {
        toggle_visibility(3, 0);
    });

    $("#sectionFiveHeader").click(function () {
        toggle_visibility(4, 0);
    });

    $("#sectionDownArrow").click(function () {
        toggle_visibility(-1, 1);
    });

});

/**
 * Multi use search function. Can be used standalone on the current page or
 * with a string argument for search.
 */
function initiateSearch(addressBarSearchString, searchBias) {
    var searchString = decodeURIComponent(addressBarSearchString);
    searchString = searchString.replace("#", "");

    if (searchString == "") {
        searchString = decodeURIComponent($('#searchTitle').val());
    }

    if (searchBias == undefined) {
        searchBias = "no-bias";
    }

    // Find out which section is currently active.
    var activeSectionId = get_index_open_section();

    var width = $(window).width();
    var height = $(window).height();

    // Wait icons and loading bars.
    $(".sectionBusy").each(function (index) {

        if (height <= 700) {

            $(this).find("img").css({
                width: "100px",
                height: "100px"
            });
            $(this).css({
                top: (height / 2 - 50) + "px",
                left: (width / 2 - 40) + "px"
            }).show();
        } else {
            $(this).css({
                top: (height / 2 - 200) + "px",
                left: (width / 2 - 90) + "px"
            }).show();
        }
    });

    if (width <= 767) {
        $(".loadbar-small").each(function (index) {
            $(this).show();
        });
    } else {
        $(".loadbar").each(function (index) {
            $(this).show();
        });
    }

    // Store keyword for later drill down searches.
    keyWord = searchString;

    // Get all page data
    uiLock(searchString);
    getAuthors(searchString, searchBias);
    showTopics(searchString, searchBias);
    getRelationships(searchString, searchBias);
    getLocations(searchString, searchBias);
    getPopularNovels(searchString, searchBias);
    toggle_visibility(activeSectionId, 0);
}

/**
 * Initiate a search off the home page.
 */
function initiateSearchHome() {
    var searchString = $('#searchTitle').val();

    if (searchString == "") {
        document.getElementById("searchTitle").placeholder = "Please enter keyword";
    } else {
        searchString = searchString.replace("#", "");
        var docRefString = "accordion.php?s=1";
        docRefString += "&search=" + encodeURI(searchString);
        document.location.href = docRefString;
    }
}

/**
 * Get book data for page
 */
function getPopularNovels(searchString, searchBias) {
    clear_no_data_found("#book-warning");
    $('#bookSidebar').hide();
    $.ajax({
        method: 'POST',
        url: 'php/getPopNovels.php',
        data: {
            keyword: searchString,
            workForm: "novel",
            numResults: numResults,
            maxResults: maxResults,
            countFrom: countFrom,
            bias: searchBias
        },
        datatype: 'json',
        success: function (data) {

            if (!_.isEmpty(data)) {
                bookData = data;
                clearOldPrint("#books");
                printBooks(data, "#bookTemplate", "#books");
            } else {
                clearOldPrint("#books");
                show_no_data_found("#book-warning");
            }

            $('#s1busy').hide();
            $('#s1loadbar').hide();
            $('#s1loadbar-small').hide();
            //The page is the slowest, so put the unlock here after the page is loaded
            uiUnlock(searchString);

            console.log("Finished rendering novels page");
        },
        timeout: 25000,
        error: function (xhr, status, error) {

            clearOldPrint("#books");
            show_no_data_found("#book-warning");

            $('#s1busy').hide();
            $('#s1loadbar').hide();
            $('#s1loadbar-small').hide();

            //The page is the slowest, so put the unlock here after the page is loaded
            uiUnlock(searchString);
            //console.log(xhr.responseText);
        }
    });
}

/**
 * Clear the section named.
 */
function clear_no_data_found(sectionid) {
    $(sectionid).css('display', 'none');
}

/**
 * Show the section named.
 */
function show_no_data_found(sectionid) {
    $(sectionid).css('display', 'block');
}

/**
 * Convert rating value to pixel size, for use in "coloring in" the right
 * amount of stars in the rating.
 */
function give_rating(val) {
    val = parseFloat(val);

    // Make sure that the value is in 0 - 5 range, multiply to get width.
    var size = Math.max(0, (Math.min(5, val))) * 16;

    // Create stars holder.
    return $('<span />').width(size);
}

/**
 * Get authors data for page
 */
function getAuthors(searchString, searchBias) {
    clear_no_data_found("#author-warning");
    $('#authorSidebar').hide();
    $.ajax({
        method: 'POST',
        url: 'php/getAuthors.php',
        data: {
            keyword: searchString,
            workForm: "novel",
            numResults: numResults,
            maxResults: maxResults,
            countFrom: countFrom,
            bias: searchBias
        },
        datatype: 'json',
        success: function (data) {

            if (!_.isEmpty(data)) {
                authorData = data;
                clearOldPrint("#authors");
                printAuthors(data, "#authorTemplate", "#authors");

                $('#s2busy').hide();
                $('#s2loadbar').hide();
                $('#s2loadbar-small').hide();
                console.log("Finished rendering authors page");
            } else {
                clearOldPrint("#authors");
                show_no_data_found("#author-warning");
                $('#s2busy').hide();
                $('#s2loadbar').hide();
                $('#s2loadbar-small').hide();
            }
        },
        timeout: 25000,
        error: function (xhr, status, error) {
            clearOldPrint("#authors");
            show_no_data_found("#author-warning");
            $('#s2busy').hide();
            $('#s2loadbar').hide();
            $('#s2loadbar-small').hide();
            //console.log(xhr.responseText);
        }
    });
}

/**
 * Reorder the name of the author for display purposes.
 */
function author_name_reorder(authorName) {
    if (authorName.indexOf(",") > 1) {

        var firstName = authorName.split(",")[1];
        var surname = authorName.split(",")[0];

        if (firstName != "")
            return firstName + " " + surname;
        else
            return authorName;
    } else {
        return authorName;
    }
}

/**
 * Cap the length of titles so that they fit into the page ok.
 */
function cap_title_length(title) {
    var MAX_TITLE_LENGTH = 59;

    if (title.length > MAX_TITLE_LENGTH) {
        return title.substring(0, MAX_TITLE_LENGTH) + "...";
    }
    return title;
}

/**
 * Converts JSON search results in a html element that can be inserted into
 * the page. Requires a template already included on the target page.
 */
function printBooks(data, templateId, parent) {
    $.each(data, function () {

        // Copy template
        var template = $(templateId).clone();

        // Populate template
        $.each(this, function (k, v) {
            switch (k) {
                case "cover":

                    if (typeof (v) == "object") {
                        template.find(".iconContainer").html('<img src="' +
                            v["0"] + '" alt="Icon"/>');
                    }
                    if (typeof (v) == "string" && v != "") {
                        var newV = checkResource(v);
                        template.find(".iconContainer").html('<img src="' +
                            newV + '" alt="Icon" ' + 'onerror="imgError(this);"/>');
                    }
                    if (v == "") {
                        template.find(".iconContainer").html('<img src="images/no-img.png" alt="Icon"/>');
                    }
                    break;
                case "title":
                    v = cap_title_length(v);
                    template.find(".title").html(v);
                    break;
                case "author":
                    v = author_name_reorder(v);
                    template.find(".author").html("by " + v);
                    break;
                case "rating":
                    if (v != null) {
                        var newHtml = give_rating(v);
                        template.find(".stars").html(newHtml);
                    }
                    break;
                case "link":
                    break;
                case "isbn":
                    template.attr('id', v);
                    break;
                default:
                //do nothing;
            }

        });

        // Set template to visible
        template.css("display", "");

        // Append copy to parent
        $(parent).append(template);

    });

    // Call to function that adds listeners to the printed book items
    setBookListeners();
}

/**
 * Converts JSON search results in a html element that can be inserted into
 * the page. Requires a template already included on the target page.
 */
function printAuthors(data, templateId, parent) {
    var authorid = $(this).attr("id");
    changeBackground($(this), ".innerauthor");
    $("#author-help").css('display', 'none');

    $('#sideBar').show();
    if ($("#sectionOneDetail").scrollTop() == 0) {
        $('#sideBar').css('margin-top', "10px");
    }

    $.each(data, function () {

        // Copy template
        var template = $(templateId).clone();

        // Populate template
        $.each(this, function (k, v) {

            switch (k) {
                case "image":
                    if (v != null) {
                        template.find(".iconContainer").html('<img src="' +
                            v["0"] + '" alt="Icon"/>');
                    }
                    if (typeof (v) == "string") {
                        var newV = checkResource(v);
                        template.find(".iconContainer").html('<img src="' +
                            newV + '" alt="Icon" ' + 'onerror="imgError(this);"/>');
                    }
                    break;
                case "name":
                    v = author_name_reorder(v);
                    template.find(".title").html(v);
                    break;
                case "birthPlace":
                    template.find(".author").html(v[1]);
                    break;
                case "rating":
                    if (v != null) {
                        var newHtml = give_rating(v);
                        template.find(".stars").html(newHtml);
                    } else {
                        template.find(".stars").remove();
                    }
                    break;
                case "austlitId":
                    template.attr('id', v);
                    break;
                default:
                // Do nothing
            }
        });

        // Set template to visible
        template.css("display", "");

        // Append copy to parent
        $(parent).append(template);

    });

    // Call to function that adds listeners to the printed author items
    setAuthorListeners()
}

/**
 * Clears the books div of content from previous searches.
 */
function clearOldPrint(parentId) {
    $(parentId).html("");
}

/**
 * Check a resource for an image link.
 */
function checkResource(url) {
    if (url.substr(url.length - 1, 1) == '/') {
        return "images/no-img.png";
    }
    return url;
}

/**
 * Get url variables off a GET browser call
 */
function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/**
 * Get a list of topics for the treemap page
 */
function showTopics(searchString, searchBias) {
    clear_no_data_found("#topic-warning");
    $(".treemap").css("display", "block");
    if (searchString != "") {
        $('#s3busy').show();

        $.ajax({
            method: 'POST',
            url: 'php/getTopics.php',
            datatype: 'json',
            data: {
                keyword: searchString,
                workForm: "novel",
                numResults: numResults,
                maxResults: maxResults,
                countFrom: countFrom,
                bias: searchBias
            },
            success: function (data) {

                // data[0] is array of books
                // data[1] is array of topics and indexes of books associated with the topic
                // data[2] is a list of topics in order of prevalence
                // console.log(data[0]);
                // console.log(data[1]);

                //data[2].forEach(function( obj ) {
                //    console.log(obj.name + ": '../images/treemap/',");
                //});
                if (!_.isEmpty(data[2])) {
                    treeMapData = data[2];
                    generateTreemap(treeMapData);
                    console.log("Finished rendering treemap.");
                } else {
                    show_no_data_found("#topic-warning");
                    $(".treemap").css("display", "none");
                }

                $('#s3loadbar').hide();
                $('#s3loadbar-small').hide();
                $('#s3busy').hide();
            },
            timeout: 25000,
            error: function (a, b, c) {

                // Replace section info text with no result warning text.
                show_no_data_found("#topic-warning");
                $('#s3loadbar').hide();
                $('#s3loadbar-small').hide();
                $('#s3busy').hide();
                //console.log(a);
                //console.log(b);
                //console.log(c);
            }
        });
    }
}

/**
 * Get book relationships for the forcegraph page
 */
function getRelationships(searchString, searchBias) {
    clear_no_data_found("#graph-warning");
    $.ajax({
        method: 'POST',
        url: 'php/getRelationships.php',
        data: {
            keyword: searchString,
            workForm: "novel",
            numResults: numResults,
            maxResults: numSimilar,
            countFrom: countFrom,
            bias: searchBias
        },
        success: function (data) {
            //console.log(data);
            // data[0] is an array of books
            // data[1] is an array of links

            if (!_.isEmpty(data[0])) {
                forceGraphBooks = data[0];
                forceGraphLinks = data[1];
                doGraph(forceGraphBooks, forceGraphLinks);
                console.log("Finished rendering relationships.");
            } else {
                show_no_data_found("#graph-warning");
            }
            $('#s4busy').hide();
            $('#s4loadbar').hide();
            $('#s4loadbar-small').hide();
        },
        timeout: 25000,
        error: function (a, b, c) {

            // Replace section info text with no result warning text.
            show_no_data_found("#graph-warning");
            $('#s4busy').hide();
            $('#s4loadbar').hide();
            $('#s4loadbar-small').hide();
            //console.log(a);
            //console.log(b);
            //console.log(c);
        }
    });
}

/**
 * Get book locations for the location wordcloud page
 */
function getLocations(searchString, searchBias) {
    clear_no_data_found("#location-warning");
    $.ajax({
        method: 'POST',
        url: 'php/getLocations.php',
        data: {
            keyword: searchString,
            workForm: "novel",
            numResults: numResults,
            maxResults: numSimilar,
            countFrom: countFrom,
            bias: searchBias
        },
        success: function (data) {
            // data[0] is an array of locations and occurrence

            if (!_.isEmpty(data[0])) {
                wordCloudData = data[0];
                createWordCloud(wordCloudData);
            } else {
                show_no_data_found("#location-warning");
            }
            $('#s5busy').hide();
            $('#s5loadbar').hide();
            $('#s5loadbar-small').hide();
        },
        timeout: 25000,
        error: function (a, b, c) {

            // Replace section info text with no result warning text.
            show_no_data_found("#location-warning");
            $('#s5busy').hide();
            $('#s5loadbar').hide();
            $('#s5loadbar-small').hide();
            //console.log(a);
            //console.log(b);
            //console.log(c);
        }
    });
}

/**
 * Add listeners to book items on the results grid
 */
function setBookListeners() {
    var classname = document.getElementsByClassName("book");
    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', printBookDetails, false);
    }
    $('#bookSidebar div').empty();
    $('#bookSidebar').hide();

    $(".innerbook").click(function () {
        $(".innerbook").removeClass('active');
        $(this).toggleClass('active');
    });
}

/**
 * Add listeners to book items on the results grid
 */
function setAuthorListeners() {
    var classname = document.getElementsByClassName("author");
    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', printAuthorDetails, false);
    }
    $('#authorSidebar div').empty();
    $('#authorSidebar').hide();

    $(".innerauthor").click(function () {
        $(".innerauthor").removeClass('active');
        $(this).toggleClass('active');
    });
}

/**
 * Print book details on the side bar
 */
function printBookDetails() {
    var isbnBook = $(this).attr("id");
    changeBackground($(this), ".innerbook");

    $('#bookSidebar').show();
    if ($("#sectionOneDetail").scrollTop() == 0) {
        $('#bookSidebar').css('margin-top', "10px");
    }

    var title = "";
    var AustLitLink = 'http://www.austlit.edu.au/austlit/page/';
    var AustLitIcon = 'images/discoverylogoicon_darkgrey.png';
    var GoogleLink = 'https://books.google.com.au/books?isbn=';
    var GoogleIcon = 'images/google.png';
    /*retrieved from http://www.yootheme.com/icons/freebies/12*/
    var AmazonIcon = 'images/amazon.png';
    /*retrieved from http://findicons.com/icon/267455/amazon?id=267520*/
    var Booktopia = 'http://www.booktopia.com.au/search.ep?productType=917504&keywords=';
    var BooktopiaIcon = 'images/Booktopia.gif';
    /*retrieved from http://koombanadays.com/img*/
    var GoodReadsLink = "<p>No reviews available for this book.</p>";
    var GoodreadsIcon = 'images/goodreads.png';
    /*retrieved from https://www.iconfinder.com/icons/43148/goodreads_icon*/
    var abstractText = "<p>Abstract not available.</p>";
    var cover = "images/no-img.jpg";

    $.each(bookData, function () {
        var isbnMatch = false;

        if (this['isbn'] == isbnBook) {
            isbnMatch = true;
        }
        if (isbnMatch) {

            // Amazon Link.
            if (this['link'] != null) {
                var link = '<a href="' + this['link'] + '" target="_blank"><img src="' + AmazonIcon + '"/>Amazon</a>';
            }

            // Google Link.
            else {
                var googleLink = "https://books.google.com.au/books?isbn=" + this['isbn'];
                link = '<a href="' + googleLink + '" target="_blank"><img src="' + GoogleIcon + '"/>Google</a>';
            }

            // Goodreads reviews link.
            if (this['rating'] != null) {
                GoodReadsLink = '<a href="' + this['grlink'] + '#other_reviews' +
                    '" target="_blank"><img src="' + GoodreadsIcon + '"/>Goodreads </a>';
            }
            if ('abstract' in this) {
                // Process abstract to open in-built links in a new tab.
                abstractText = this['abstract'].replace('href=', 'target="_blank" href=');
                abstractText = '<p>' + abstractText + '</p>';
            }
            if (this['cover'] != "") {
                cover = this['cover'][0];
            }

            var author = author_name_reorder(this['author']);

            // Decide the length for abstract based on the size of the window.
            var abstractLength = getTextLength();

            // Truncate the text based on the changeable length.
            if (abstractText != "<p>Abstract not available</p>") {
                abstractText = truncate(abstractText, abstractLength);
            }

            document.getElementById("detailsBookTitle").innerHTML = '<h3>' + this['title'] + '</h3>';
            document.getElementById("detailsBookAuthorYear").innerHTML = '<p>by ' + author + ' (' + this['date'] + ')' + '</p>';
            document.getElementById("abstractBook").innerHTML = abstractText;
            document.getElementById("detailsBookInfo").innerHTML = '<p>Publisher: ' + this['publisher'] +
                ' (' + this['placePublished'] + ')' + '</p>' +
                '<p>ISBN: ' + this['isbn'] + '</p>' +
                '<p>Extent: ' + this['pages'] + '</p>';
            document.getElementById("externalBookLinks").innerHTML = link;
            document.getElementById("AustlitBookPage").innerHTML = '<a href="' + AustLitLink + this['austlitId'] +
                '" target="_blank"><img src="' + AustLitIcon + '"/>AustLit</a>';
            document.getElementById("BooktopiaBookPage").innerHTML = '<a href="' + Booktopia + this['isbn'] +
                '" target="_blank"><img src="' + BooktopiaIcon + '"/>Booktopia</a>';
            document.getElementById("GoodReadsReviews").innerHTML = GoodReadsLink;

            isbnMatch = false;
        }
    });
}

/**
 * Print book details on the side bar
 */
function printAuthorDetails() {
    var authorId = $(this).attr("id");
    changeBackground($(this), ".innerauthor");

    $('#authorSidebar').show();
    if ($("#sectionTwoDetail").scrollTop() == 0) {
        $('#authorSidebar').css('margin-top', "10px");
    }

    var amazonLink = "";
    var grlink = "";
    var bioText = "<p>No biography available</p>";
    var birthPlace = "Unknown";
    var author = "<h3>Author Name Not Found</h3>";
    var AustLitLink = 'http://www.austlit.edu.au/austlit/page/';
    var AustLitIcon = 'images/discoverylogoicon_darkgrey.png';
    var GoogleIcon = 'images/google.png';
    /*retrieved from http://www.yootheme.com/icons/freebies/12*/
    var GoodReadsLink = "<p>No reviews available for this book.</p>";
    var GoodreadsIcon = 'images/goodreads.png';
    /*retrieved from https://www.iconfinder.com/icons/43148/goodreads_icon*/

    $.each(authorData, function () {

        if (this['austlitId'] == authorId) {

            if ('name' in this) {
                author = author_name_reorder(this['name']).trim();
                author = '<h3>' + author + '</h3>';
            }

            // Amazon Link.
            if (this['link'] != null) {
                var link = '<p><strong>External links</strong></p><a href="' +
                    this['link'] + '" target="_blank">Amazon</a>';
            }

            // Google Link.
            if(true) {
                var googleLink = generateLink(this['name']);
                link = '<a href="' + googleLink + '" target="_blank"><img src="' + GoogleIcon + '"/>Google Books</a>';
            }
            // Goodreads Link.
            if (this['grlink']) {
                grlink = '<a href="' + this['grlink'] + '" target="_blank"><img src="' + GoodreadsIcon + '"/>Goodreads</a>';
            }
            if ('bio' in this) {
                bioText = '<p>' + this['bio'] + '</p>';
            }
            if ('birthPlace' in this) {
                birthPlace = this['birthPlace'][1];
            }

            // Decide the length for abstract based on the size of the window.
            var abstractLength = getTextLength();

            // Truncate the text based on the changeable length.
            if (bioText != "<p>No biography available</p>") {
                bioText = truncate(bioText, abstractLength);
            }

            $("#detailsAuthor").html(author);
            $("#detailsAuthorLocation").html('<p>Birthplace: ' + birthPlace + '</p>');
            $("#biographyAuthor").html(bioText);
            document.getElementById("externalAuthorLinks").innerHTML = link;
            document.getElementById("AustlitAuthorPage").innerHTML = '<a href="' + AustLitLink + this['austlitId'] +
                '" target="_blank"><img src="' + AustLitIcon + '"/>AustLit</a>';
            document.getElementById("goodreadsAuthorPage").innerHTML = grlink;
        }
    });
}

/**
 * If 404 error for image, return the no cover image.
 */
function imgError(image) {
    // Parent of parent of image, which should be the innerbook div or
    // innerauthor div.
    var innerClass = image.parentNode.parentNode.getAttribute('class');

    if (innerClass == "innerbook") {
        image.onerror = "";
        image.src = "images/no-img.png";
    } else {
        image.onerror = "";
        image.src = "images/author_photo_missing.png";
    }

    return true;
}

/**
 * Prime the sidebar scrolling divs.
 */
$().ready(function () {
    var $scrollingDiv1 = $("#bookSidebar");
    var $accSection1 = $("#sectionOneDetail");
    var $scrollingDiv2 = $("#authorSidebar");
    var $accSection2 = $("#sectionTwoDetail");

    sideBarScroll($scrollingDiv1, $accSection1);
    sideBarScroll($scrollingDiv2, $accSection2);
});

/**
 * Generate the link to google, currently only for author page
 */
function generateLink(name) {
    var authorName = name.split(',');
    var authorString = "";
    for (var i = 0; i < authorName.length; i++) {
        authorString += "inauthor:" + authorName[i].trim() + "+";
    }
    var googleLink = "https://www.google.com.au/search?tbo=p&tbm=bks&q=" +
        authorString.slice(0, -1) + "&num=10";
    return googleLink;
}

/**
 * Move sidebar according to the window scrolling
 */
function sideBarScroll(scrollingDiv, accSection) {
    accSection.scroll(function () {
        scrollingDiv
            .stop()
            .animate({
                "marginTop": (accSection.scrollTop()) + 10
            }, "slow");
    });
}

/**
 * Change clicked book-item background color
 */
function changeBackground(itemForHighlight, innerItem) {
    if (lastClicked) {
        lastClicked.css("border-left", "0px");
        lastClicked.css("padding-left", "10px");
    }
    lastClicked = $(itemForHighlight.find(innerItem));
    lastClicked.css("padding-left", "0px");
    lastClicked.css("border-left", "solid 10px #40bbbf");
}

/**
 * Locks the user interface. Useful for when a search is currently in progress.
 */
function uiLock(searchString) {
    var searchDiv = $('#searchTitle');
    searchDiv.prop('disabled', true);
    searchDiv.css('background-color', '#6C6C6C');
    searchDiv.css('color', '#A5A5A5');
    searchDiv.val("Searching for: " + decodeURIComponent(searchString) + " ...");
}

/**
 * Unlocks the user interface.
 */
function uiUnlock(keyWord) {
    var searchDiv = $('#searchTitle');
    searchDiv.prop('disabled', false);
    searchDiv.css('background-color', '#ffffff');
    searchDiv.css('color', '#494949');
    searchDiv.val(decodeURIComponent(keyWord));
}

/**
 * Get the active accordion height and estimate the text length.
 */
function getTextLength() {
    var height;

    // Find out which section is currently active and get the height
    $('#accordion').children('div').each(function () {
        if (this.className.indexOf("search-results-light") > -1 && this.style.display == "block") {
            height = parseInt(this.style.height.slice(0, -2));
        }
    });

    // The px number minus for the height, could add other parameters to
    // adjust the calculation later.
    var minusMarginPX = 250;
    var abstractLength = height;
    if (minusMarginPX < height) {
        abstractLength = Math.round((height - minusMarginPX));
    }
    return abstractLength;
}
/**
 * Truncate the text by given length
 */
function truncate(abstractText, abstractLength) {
    if (abstractLength >= abstractText.length) {
        return abstractText
    } else {
        return abstractText.substring(0, abstractText.indexOf(" ", abstractLength)) + " ...";
    }
}