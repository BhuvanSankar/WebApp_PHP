/**
 * Adds the visibility functions to any pages resize events. This enforces a
 * redraw of most elements to provide page fluidity.
 */
document.addEventListener("DOMContentLoaded", function (event)
{
    $(window).resize(function() {
        toggle_visibility(get_index_open_section(), 0);
    });

});

/**
 * Displays the contents of a particular section if its header bar is
 * clicked in the accordion.
 */
function toggle_visibility(chosenSectionId, upOrDown)
{
    var width = $(window).width();
    if(width <= 767){
        $("#footer").css('display', "None");
        $("#footer-mobile").css('display', "Block");
        toggle_visibility_mobile(chosenSectionId, upOrDown);
    } else {
        $("#footer").css('display', "Block");
        $("#footer-mobile").css('display', "None");
        toggle_visibility_web(chosenSectionId, upOrDown);
    }
}

/**
 * Global variables for use on section highlighting and resizing.
 */
var maxVertical;
var highlightColor = 'rgb(225, 118, 36)';

/**
 * Toggle the visibility of a chosen section on pc browsers.
 */
function toggle_visibility_web(chosenSectionId, upOrDown)
{
    // Setup the accordion id's.
    var sectionHeaderIds = ["#sectionOneHeader", "#sectionTwoHeader", "#sectionThreeHeader",
        "#sectionFourHeader", "#sectionFiveHeader"];
    var sectionDetails = ["#sectionOneDetail", "#sectionTwoDetail", "#sectionThreeDetail",
        "#sectionFourDetail", "#sectionFiveDetail"];
    var rowHeight = 38;
    var numSections = sectionHeaderIds.length;
    maxVertical = 0;
    var maxVerticalModifier = 32;
    var topDistance = 119;
    var bottomDistance = 130;
    var topPadding = 153;

    // Loop through the id's.
    for (var i = 0; i < numSections; i++) {

        var sectionHeader = $(sectionHeaderIds[i]);
        var sectionDetail = $(sectionDetails[i]);

        // Display all accordion bars.
        sectionHeader.css('position','fixed');
        sectionHeader.css('top',(i <= chosenSectionId) ? i * rowHeight + topDistance: '');
        sectionHeader.css('bottom',(i > chosenSectionId) ? (numSections - i - 1) * rowHeight + bottomDistance : '');
        sectionHeader.css('display', 'block');

        // Hide the arrow bars.
        $("#sectionUpArrow").css('display', 'none');
        $("#sectionDownArrow").css('display', 'none');

        // Display the selected section, hide the rest.
        if (i == chosenSectionId) {
            sectionDetail.css('display', 'block');
            $(sectionHeaderIds[i]).children('i').attr('class','fa fa-minus');
            $(sectionHeaderIds[i]).css('background-color',highlightColor);

        } else {
            sectionDetail.css('display', 'none');
            $(sectionHeaderIds[i]).children('i').attr('class','fa fa-plus');
            $(sectionHeaderIds[i]).css('background-color','#494949');
        }
    }

    // Adjust vertical heights of divs.. really more for resize events, buts
    // sits ok here.
    for (var i = 0; i < numSections; i++) {
        if (i == chosenSectionId) {

            if (chosenSectionId == 4) {
                maxVertical = $("#footer").offset().top - $(sectionHeaderIds[i]).offset().top - maxVerticalModifier;

            } else {
                maxVertical = $(sectionHeaderIds[i + 1]).offset().top - $(sectionHeaderIds[i]).offset().top;
            }
            $("#content").css("padding-top", topPadding + i * 38 + "px" );
        }
    }

    // Update the height of the now opened section to be the max space
    // available to it.
    var selectedSection = $(sectionDetails[chosenSectionId]);
    selectedSection.height(maxVertical);

    // Update the heights of the treemap divs
    $(".treemap-container").width(selectedSection.width() - 20);
    $(".treemap-container").height(selectedSection.height() - 95);
    generateTreemap(treeMapData);
}

/**
 * Toggle the visibility of a chosen section on mobile devices.
 */
function toggle_visibility_mobile(chosenSectionId, upOrDown)
{
    // Setup the accordion id's.
    var sectionHeaderIds = ["#sectionOneHeader", "#sectionTwoHeader", "#sectionThreeHeader",
        "#sectionFourHeader", "#sectionFiveHeader"];
    var sectionDetails = ["#sectionOneDetail", "#sectionTwoDetail", "#sectionThreeDetail",
        "#sectionFourDetail", "#sectionFiveDetail"];
    var rowHeight = 38;
    var numSections = sectionHeaderIds.length;
    maxVertical = 0;
    var topDistance = 97;
    var bottomDistance = 1;
    var topPadding = 131;
    var maxVerticalModifier = 32;

    // Modify chosen section based on up / down button clicks.
    if (upOrDown != 0) {
        var alreadySelected = get_index_open_section();
        chosenSectionId = alreadySelected + upOrDown;
    }

    $("#sectionUpArrow").css('position','fixed');
    $("#sectionDownArrow").css('position','fixed');

    // Loop through the id's.
    for (var i = 0; i < numSections; i++) {

        $(sectionHeaderIds[i]).css('position','fixed');

        if (i == chosenSectionId) {

            $(sectionHeaderIds[i]).children('i').attr('class', 'fa fa-minus');
            $(sectionHeaderIds[i]).css('background-color', highlightColor);
            $(sectionDetails[i]).css('display', 'block');

            if (chosenSectionId == 0) {

                // Hide top arrow.
                $("#sectionUpArrow").css('display', 'none');
                $("#sectionUpArrow").css('top', rowHeight * 2 + bottomDistance);

                // Enable i as top header.
                $(sectionHeaderIds[i]).css('top', topDistance);
                $(sectionHeaderIds[i]).css('bottom', '');
                $(sectionHeaderIds[i]).css('display', 'block');

                // Enable i + 1 as bottom header.
                $(sectionHeaderIds[i + 1]).css('display', 'block');
                $(sectionHeaderIds[i + 1]).css('bottom', rowHeight + bottomDistance);
                $(sectionHeaderIds[i + 1]).css('top', '');

                // Show bottom arrow.
                $("#sectionDownArrow").css('display', 'block');
                $("#sectionDownArrow").css('bottom', bottomDistance);

            } else if (chosenSectionId == 4) {

                // Show top arrow.
                $("#sectionUpArrow").css('display', 'block');
                $("#sectionUpArrow").css('top', topDistance);

                // Enable i as top header.
                $(sectionHeaderIds[i]).css('top', rowHeight + topDistance);
                $(sectionHeaderIds[i]).css('bottom', '');
                $(sectionHeaderIds[i]).css('display', 'block');

                // Hide bottom arrow.
                $("#sectionDownArrow").css('display', 'none');
                $("#sectionDownArrow").css('bottom', rowHeight + bottomDistance);

            } else { // In between section.

                // Show top arrow.
                $("#sectionUpArrow").css('display', 'block');
                $("#sectionUpArrow").css('top', topDistance);

                // Enable i as top header.
                $(sectionHeaderIds[i]).css('top', rowHeight + topDistance);
                $(sectionHeaderIds[i]).css('bottom', '');
                $(sectionHeaderIds[i]).css('display', 'block');

                // Enable i + 1 as bottom header.
                $(sectionHeaderIds[i + 1]).css('display', 'block');
                $(sectionHeaderIds[i + 1]).css('bottom', rowHeight + bottomDistance);
                $(sectionHeaderIds[i + 1]).css('top', '');

                // Show bottom arrow.
                $("#sectionDownArrow").css('display', 'block');
                $("#sectionDownArrow").css('bottom', bottomDistance);
            }

        } else {

            // Hide relevant sections.
            if (chosenSectionId == 0) {
                if(i > 1) {
                    $(sectionHeaderIds[i]).css('display', 'none');
                }
            } else if (chosenSectionId == 4) {
                if(i < chosenSectionId) {
                    $(sectionHeaderIds[i]).css('display', 'none');
                }
            } else {
                if (i < chosenSectionId || i > chosenSectionId + 1) {
                    $(sectionHeaderIds[i]).css('display', 'none');
                }
            }
            $(sectionDetails[i]).css('display', 'none');

            // Reformat non-selected section.
            $(sectionHeaderIds[i]).children('i').attr('class','fa fa-plus');
            $(sectionHeaderIds[i]).css('background-color','#494949');
        }
    }

    // Adjust vertical heights of divs.. really more for resize events, buts
    // sits ok here.
    for (var i = 0; i < numSections; i++) {
        if (i == chosenSectionId) {

            if (chosenSectionId == 4) {
                maxVertical = $("#footer-mobile").offset().top - $(sectionHeaderIds[i]).offset().top - maxVerticalModifier;
            } else {
                maxVertical = $(sectionHeaderIds[i + 1]).offset().top - $(sectionHeaderIds[i]).offset().top - maxVerticalModifier;
            }

            if (chosenSectionId == 0) {
                $("#content").css("padding-top", topDistance + rowHeight + "px");
            } else {
                $("#content").css("padding-top", topDistance + 2 * rowHeight + "px");
            }
        }
    }
    var selectedSection = $(sectionDetails[chosenSectionId]);
    selectedSection.height(maxVertical);

    // Update the heights of the D3 divs
    if (chosenSectionId == 2) {
        $(".treemap-container").width(selectedSection.width() - 20);
        $(".treemap-container").height(selectedSection.height() - 80);
        generateTreemap(treeMapData);
    }
}

/**
 * Get the index of the currently opened section.
 */
function get_index_open_section()
{
    // Setup the accordion id's.
    var sectionHeaderIds = ["#sectionOneHeader", "#sectionTwoHeader", "#sectionThreeHeader",
        "#sectionFourHeader", "#sectionFiveHeader"];
    var numSections = sectionHeaderIds.length;

    // Find open section
    for (var i = 0; i < numSections; i++) {
        if ($(sectionHeaderIds[i]).css("background-color") == highlightColor) {
            return i;
        }
    }
    return 0;
}