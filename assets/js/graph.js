var color_map =   {1:"red",
                   2:"pink",
                   3:"yellow",
                   4:"green"};

var w=900, h=80, parser = d3.time.format("%Y-%m").parse;
x = d3.time.scale().range([0, w - 200])

var dat = [];
var rows;
var countries = {};

var datedict = {0:"2008", 4:"2009", 8:"2010"};

var updateName = function(iso) {
  d3.select("#namer").text(countries[iso]);
};


var parse = function(date_str) {
  var year = date_str.slice(0, 4)
  var quarter = parseInt(date_str.slice(-2, date_str.length))

  // subtract two to get to first month of quarter
  var start_month = (quarter * 3) - 2

  return parser(year + "-" + start_month.toString())
};

var makeDataJSON = function(d) {
  return {"date": parse(d.period), "color": d.color}};

var setXDomain = function(data) {
  var max = d3.max(data, function(d) {return d.date});
  var min = d3.min(data, function(d) {return d.date});
  x.domain([min, max]);
}

var filter_data = function(rows, code) {

  var f = rows.filter(function(x) { return x.iso == code })
  var u = f.map(makeDataJSON);
  setXDomain(u);
  
  return u
};

var circles = function(dat) {
  svg.selectAll("circle")
   .data(dat)
   .enter()
       .append("svg:circle")
       .attr("class", "circle")
                      .attr("cx", function(d) { return x(d.date) + 10; })
       .attr("cy", function(d) { return 20; })
               .attr("r", 8)
       .attr("fill", function(d) { return d.color })

  svg.selectAll("text")
   .data(dat)
   .enter()
       .append("svg:text")
       .attr("class", "graph-text")
       .text(function(d) { if (d.date.getMonth() == 0) { return d.date.getFullYear() };})
    .attr("x", function(d) { return (x(d.date) - 5) ; })
       .attr("y", 50)
};


var graphColors = function(iso) {
      updateName(iso);
      console.log(iso);
      dat = filter_data(rows, iso);
      circles(dat);
      d3.selectAll("circle").transition()
          .duration(500)
          .attr("fill", function(d) { return d.color});

};


d3.csv("assets/data/fcpr_final.csv", function(loadedRows) {
    loadedRows.map(function(d) { if (d.iso == "CIV") // fix circumflex on 'o'
                          {
                            d.country = "Côte d'Ivoire"
                          }
                          countries[d.iso] = d.country});

    rows = loadedRows;
    rows.map(function(d) {
      d.x = x(parse(d.period));
      d.color = color_map[d.score];
    });
    dat = filter_data(loadedRows, "TRO"); // start with tropics
    updateName("TRO") // ditto
    circles(dat);
});

var svg = d3.select("#chart").append("svg:svg")
  .attr("width", w)
  .attr("height", h)
  .attr("id", "#chart-svg");

// svg.append("svg:rect")
//    .attr("width", w-4).attr("height",h-4)
//    .attr("fill", "rgb(255,255,255)");


// xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);


// // Add the x-axis.
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);
