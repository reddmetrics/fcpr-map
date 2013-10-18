var color_map =   {1:"red",
                   2:"pink",
                   3:"yellow",
                   4:"green"};

var w=900, h=80, parser = d3.time.format("%Y-%m").parse;

x = d3.time.scale().range([0, w])

var dat = [];
var rows;
var countries = {};

// add a new date to the bottom if there's more data

var convert_date = function(date_str) {
  var d = {
           "200804": 0,
           "200901": 1,
           "200902": 2,
           "200903": 3,
           "200904": 4,
           "201001": 5,
           "201002": 6,
           "201003": 7,
           "201004": 8,
           "201101": 9,
           "201102": 10,
           "201103": 11,
           "201104": 12,
           "201201": 13,
           "201202": 14,
           "201203": 15,
           "201204": 16,
           "201301": 17,
           "201302": 18
          };

  return d[date_str]
};

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

var makeDataJSON = function(d) {return {"x": convert_date(d.period), "color": d.color}};

var filter_data = function(rows, code) {

  var f = rows.filter(function(x) { return x.iso == code })
  var u = f.map(makeDataJSON);

  return u
};

var circles = function(dat) {svg.selectAll("circle")
   .data(dat)
   .enter()
       .append("svg:circle")
       .attr("class", "circle")
       .attr("cx", function(d) { return (1 + d.x) * 40; })
       .attr("cy", function(d) { return 10; })
               .attr("r", 8)
       .attr("fill", function(d) { return d.color })
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

// x = d3.time.scale().range([0, width]);
// x.domain([values[0].date, values[values.length - 1].date]);

// xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);


// // Add the x-axis.
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);
