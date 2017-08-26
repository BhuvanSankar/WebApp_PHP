/**
 * Creates a treemap from book topic data.
 */
function generateTreemap(data)
{
    $(".treemap").empty();

    // Amend the data set to include elements required by D3 to create the
    // treemap.
    data = {
        "name": "",
        "children": data
    };

    // Set the treemap colors.
    var color = d3.scale.ordinal()
        .range(['rgba(49, 130, 189, 0.65)', 'rgba(107, 174, 214, 0.65)',
            'rgba(255, 234, 195, 0.65)', 'rgba(158, 202, 225, 0.65)',
            'rgba(198, 219, 239, 0.65)', 'rgba(231, 203, 148, 0.65)',
            'rgba(150, 150, 150, 0.65)', 'rgba(189, 189, 189, 0.65)']);

    // Setup the default treemap layout.
    var treemap =
        d3.layout.treemap()
            // use 100 x 100 px, which we'll apply as % later
            .size([100, 100])
            .sticky(true)
            .value(function (d) {
                return d.mcap;
            });

    var div = d3.select(".treemap");

    // Calculate position of the nodes/boxes.
    function position() {
        this
            .style("left", function (d) {return d.x + "%";})
            .style("top", function (d) {return d.y + "%";})
            .style("width", function (d) {return d.dx + "%";})
            .style("height", function (d) {return d.dy + "%";});
    }

    // Create and apply box properties to the nodes required.
    var node =
        div.datum(data).selectAll(".node")
            .data(treemap.nodes)
            .enter().append("div")
            .attr("class", "node")
            .call(position)
            .style("background-color", function (d) {
                return color(d.name);
            })
            .append('div')
            .attr("class", "topic-image")
            .attr("onclick", function (d){
                return "window.location='accordion.php?s=1" +
                    "&topic=" + encodeURI(d.name) + "'";
                //"&topic=" + encodeURI(d.name + " " + keyWord) + "'";
            })
            .style("font-size", "18px")
            .style("background-image", function(d){return "url('images/" + d.bg + "')";})
            .style("background-repeat", "no-repeat")
            .style("background-position", "center")
            .style("-webkit-background-size", "cover")
            .style("-moz-background-size", "cover")
            .style("-o-background-size", "cover")
            .style("background-size", "cover")
            .style("position", "absolute")
            .style("top", "0")
            .style("left", "0")
            .style("right", "0")
            .style("bottom", "0")
            .append('div')
            .style("background-color", "rgba(255, 255, 255, 0.35)")
            .style("padding", "0")
            .append('p')
            .style("margin-top", "0")
            .text(function (d){return d.name;})
}