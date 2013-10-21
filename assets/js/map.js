var width = 900,
    height = 500,
    centered;

var projection = d3.geo.equirectangular()
  .center([15, -10])
    .scale(140);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

d3.json("assets/data/world_forma.json", function(error, topology) {
  var features = topojson.feature(topology, topology.objects.ne_110m_admin_0_countries_forma).features;

  g.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(features)
    .enter().append("path")
    .attr("d", path)
    .attr("class", function(d) {if (d.properties.forma == 1) 
                         {return "forma"}
                         else {
                           if (d.properties.admin == "Antarctica" ) 
                           {return "antarctica"}
                           }})
      .on("click", clicked);
});
 
function clicked(d) {
  var x, y, k;
  if (d && centered !== d && d.properties.forma == 1) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4; // zoom factor
        centered = d;
        graphColors(d.properties.iso);
        g.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });
      }
    else {
      x = width / 2;
      y = height / 2;
      k = 1; // zoom factor
      centered = null;
      graphColors("TRO");
      g.selectAll("path").classed("active", null)
   }
    
    g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1 / k + "px");
}
