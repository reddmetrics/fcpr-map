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

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

d3.json("assets/data/world_forma.json", function(error, topology) {
  g.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(topojson.feature(topology, topology.objects.ne_110m_admin_0_countries_forma).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", function(d) { if (d.properties.forma == 1) 
                            {return "forma"} })
    .attr("class", function(d) { if ( d.properties.admin == "Antarctica" ) 
                          {return "antarctica"}})
      .on("click", clicked);

  g.append("path")
      .datum(topojson.mesh(topology, topology.objects.ne_110m_admin_0_countries_forma, function(a, b) { return a !== b; }))
      .attr("class", "country-borders")
      .attr("d", path);
});

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    graphColors(d.properties.iso);
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
