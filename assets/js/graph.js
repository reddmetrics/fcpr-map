var countries, f, newval, graph;
var m = [40, 40, 40, 40],
    w = 400 - m[1] - m[3],
    h = 400 - m[0] - m[2]
// Scales and axes. Note the inverted domain for the y-scale: bigger is up!
var x = d3.time.scale().range([0, w]),
    y = d3.scale.linear().range([h, 0]),
    xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true),
    yAxis = d3.svg.axis().scale(y).orient("right");


parser = d3.time.format("%Y-%m").parse

var parse = function(date_str) {
  var year = date_str.slice(0, 4)
  var quarter = parseInt(date_str.slice(-2, date_str.length))

  // subtract two to get to first month of quarter
  var start_month = (quarter * 3) - 2

  return parser(year + "-" + start_month.toString())
}

// An area generator, for the light fill.
var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(h)
    .y1(function(d) { return y(d.score); });

// A line generator, for the dark stroke.
var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.score); });

var createGraph = function() {

  // Add an SVG element with the desired dimensions and margin.
  graph = d3.select("#graph").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
    .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
};

var updateGraph = function (iso) {

    newval = f.filter(function(d) {
    return d.iso == iso;
  });

  // Compute the minimum and maximum date, and the maximum price.
  x.domain([newval[0].date, newval[newval.length - 1].date]);
  y.domain([0, d3.max(newval, function(d) { return d.score; })]).nice();

  // Add the clip path.
  graph.append("svg:clipPath")
      .attr("id", "clip")
    .append("svg:rect")
      .attr("width", w)
      .attr("height", h);

  // Add the area path.
  graph.append("svg:path")
      .attr("class", "area")
      .attr("clip-path", "url(#clip)")
      .attr("d", area(newval));

  // Add the x-axis.
  graph.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

  // Add the y-axis.
  graph.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + w + ",0)")
      .call(yAxis);

  // Add the line path.
  graph.append("svg:path")
      .attr("class", "line")
      .attr("clip-path", "url(#clip)")
      .attr("d", line(newval));

  // Add a small label for the symbol name.
  graph.append("svg:text")
      .attr("x", w - 6)
      .attr("y", h - 6)
      .attr("text-anchor", "end")
      .text(newval[0].symbol);

  // On click, update the x-axis.
    var t = graph.transition().duration(300);
    t.select(".y.axis").call(yAxis);
    t.select(".area").attr("d", area(newval));
    t.select(".line").attr("d", line(newval));
}


d3.csv("../assets/data/fcpr_final.csv", function(data) {
  // make data accessible outside of the scope of this function
  f = data
  
  // build set of country codes so we can check map click for whether
  // there's FCPR data to work with
  countries = d3.set(data.map(function(d) { return d.iso })).values();

  // Parse dates and numbers. We assume values are sorted by date.
  f.forEach(function(d) {
    d.date = parse(d.period);
  });  
});
