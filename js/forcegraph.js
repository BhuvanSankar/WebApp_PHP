/**
 * Creates a force graph from book relationship data
 */
function doGraph(graph_nodes, graph_links)
{
    // Get details of containing div.
    var forceGraphContainer = $(".forcegraph-container");
    forceGraphContainer.width($("#sectionFourDetail").width());
    forceGraphContainer.height(maxVertical - 60);

    var forceGraphDiv = $(".forcegraph");
    forceGraphDiv.empty();

    var width = forceGraphContainer.width(),
        height = Math.max(maxVertical - 60, 800),
        radius = 40;

    // Set color scheme for the underlying nodes (if shown).
    var color = d3.scale.ordinal()
        .range(["#3182bd", "#6baed6", "#FFEAC3", "#9ecae1", "#c6dbef", "#e7cb94", "#969696", "#bdbdbd"]);

    // Append an svg element to the page to contain the forcegraph.
    var svg = d3.select(".forcegraph")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("id", "forcegraph");

    // Get data for the page.
    var links = graph_links;
    nodes = [];
    for (var i = 0; i < graph_nodes.length; i++) {
        var node = {};
        node['index'] = i;
        node['title'] = graph_nodes[i].title;
        node['author'] = graph_nodes[i].author;
        node['cover'] = graph_nodes[i].cover;
        node['isbn'] = graph_nodes[i].isbn;
        node['austlitId'] = graph_nodes[i].austlitId;

        // Set starting position to be in the middle of the page.
        node['x'] = width / 2 * 0.90;
        node['y'] = height / 2 * 0.90;
        if (i == 0) node['fixed'] = true;

        nodes.push(node);
    }

    // Establish the dynamic force behaviour of the nodes
    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .linkDistance(function (link) {
            //console.log(link.similarity);
            return 150 + (Math.min(height,width) / 2 * 0.60 * link.similarity);
        })
        .charge([-1000])
        .gravity(0.01)
        .friction(0.01);

    // Draw the edges/links between the nodes
    var edges = svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#585858")
        .style("stroke-width", function (link) {
            return 1 + 8 * (1 - link.similarity);
        });

    // Draw the nodes
    var nodes = svg.selectAll(".nodes")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(force.drag);

    // Run the force effect in a stepped fashion.
    var coords = [];
    setTimeout(function() {

        var n = 12;
        force.start();
        for (var i = n * n; i > 0; --i) force.tick();
        force.stop();

        // Change position of the lines.
        edges.attr("x1", function (d) {return d.source.x + 40; })
            .attr("y1", function (d) {return d.source.y + 70; })
            .attr("x2", function (d) {return d.target.x + 40; })
            .attr("y2", function (d) {return d.target.y + 70; });

        // Change position of the nodes.
        nodes
            .attr("transform", function (d) {
                var coord = {x: d.x, y: d.y};
                coords.push(coord);
                return "translate(" + d.x + "," + d.y + ")";});

        // Append html objects to contain the books.
        nodes.append("foreignObject")
            .attr("width", 80)
            .attr("height", 160)
            .style("overflow", "scroll")
            .append("xhtml:div")
            .attr("class", "fg-book")
            .call(force.drag)
            .append("a")
            .attr("href", "#")
            .attr("onclick", function (d){
                return 'window.open("http://www.austlit.edu.au/austlit/page/' + encodeURI(d.austlitId) +
                    '", "_blank")' ;
            })
            .append("xhtml:div")
            .html(function (d, i) {
                return generate_small_book(d)
            });

        // Chrome doesn't accept element transform, so added the below to
        // translate the book elements to the right spot.
        if (checkBrowser() != "Firefox") {
            $(".fg-book").each(function (index) {
                $(this).css("left", coords[index].x);
                $(this).css("top", coords[index].y);
            });
        }

    }, 10);

    /**
     * Generates the html required to insert a book element on top of a node.
     */
    function generate_small_book(d){

        // Copy template.
        var template = $("#littleBookTemplate").clone();

        // Populate template.
        if (typeof(d.cover) == "object") {
            template.find(".littleIconContainer").html('<img src="' + d.cover[0] + '" alt="Icon"/>');
        } else if (typeof(d.cover) == "string") {
            var newV = (checkResource(d.cover) != "") ? checkResource(d.cover): "images/no-img_white.png";
            template.find(".littleIconContainer").html('<img src="' + newV + '" alt="Icon"/>');
        } else if (d.cover == ""){
            template.find(".littleIconContainer").html('<img src="images/no-img_white.png" alt="Icon"/>');
        }

        template.find(".title").html(d.title);
        template.find(".author").html(d.author);
        template.find(".isbn").html(d.isbn);

        // Set template to visible.
        template.css("display", "");

        return template.html();
    }

    /**
     * Check the type of browser in use.
     */
    function checkBrowser(){
        if (navigator.userAgent.search("Firefox") > -1){
            return "Firefox";
        }
        return "Other";
    }
}
