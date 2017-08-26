/**
 * Create a wordcloud from Austlit location data
 */
function createWordCloud(data)
{
    // Obtain information from the containing divs.
    var wordCloudDiv = $(".wordcloud");
    wordCloudDiv.empty();
    wordCloudDiv.width($("#sectionFiveHeader").width());
    wordCloudDiv.height(maxVertical * 0.9);
    var width = wordCloudDiv.width(),
        height = maxVertical * 0.90;

    var maxSize = _.max(data, function(data){return data.size}).size;
    var minSize = _.min(data, function(data){return data.size}).size;
    var factor = 70 / (maxSize - minSize);

    // Set the wordcloud color scheme.
    var color = d3.scale.ordinal()
        .range(["#cfd666", "#d19f24", "#b16f3f", "#c11d2c", "#9d275b",
            "#342663", "#006ba9", "#1e808d", "#707378", "#5d803c", "#222", "#111"]);

    // Transform data
    $.each(data, function(i, v) {
        v.size = v.size - minSize;
    });
    data = _.filter(data, function(v) { return v.size > 10 });

    // Setup the D3 layout for the wordcloud.
    d3.layout.cloud().size([width, height])
        .words(data)
        .padding(1)
        .rotate(0)
        .text(function(d) { return d.text; })
        .fontSize(function (d) {
            return d.size * factor;
        })
        .on("end", draw)
        .start();

    // Draw the wordcloud.
    function draw(words) {
        d3.select(".wordcloud").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "wordcloud")
            .append("g")
            .attr("transform", function(d) {
                return "translate(" + width / 2 + "," + height / 2 + ")";
            })
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .attr("onclick", function (d){
                return "window.location='accordion.php?s=1" +
                    "&location=" + encodeURI(d.text) + "'";
            })
            .text(function(d) { return d.text; });
    }
}