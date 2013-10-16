var color_map =   {1:"red",
                   2:"pink",
                   3:"yellow",
                   4:"green"};

var w=900, h=80, parser = d3.time.format("%Y-%m").parse;
var cols = ["red", "pink", "yellow", "green"]

x = d3.time.scale().range([0, w])

var dd;

var parse = function(date_str) {
  var year = date_str.slice(0, 4)
  var quarter = parseInt(date_str.slice(-2, date_str.length))

  // subtract two to get to first month of quarter
  var start_month = (quarter * 3) - 2

  return parser(year + "-" + start_month.toString())
};

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

var filter_data = function(rows, iso) {
  var f = rows.filter(function(x) { return x.iso == iso })
  var u = f.map(function(e) { return {"x": convert_date(e.period), "color": e.color}} )
  return u
}

var dat = [];
var rows;
var iso = "IDN";

var circles = function(dat) {svg.selectAll("circle")
   .data(dat)
   .enter()
       .append("svg:circle")
       .attr("cx", function(d) { return (1 + d.x) * 40; })
       .attr("cy", function(d) { return 10; })
               .attr("r", 8)
       .attr("fill", function(d) { return d.color })
   };

d3.csv("assets/data/fcpr_final.csv", function(loadedRows) {
    rows = loadedRows;
    dd = rows.map(function(d) {
    d.x = x(parse(d.period));
    d.color = color_map[d.score];
  })
    dat = filter_data(loadedRows, iso);
    circles(dat);
});


var svg = d3.select("#chart").append("svg:svg")
                      .attr("width", w)
                      .attr("height", h);

svg.append("svg:rect")
   .attr("width", w-4).attr("height",h-4)
   .attr("fill", "rgb(255,255,255)");


var coll_iso =  ["IDN", "MYS", "COG", "NPL"];
var iso_next;

var graphColors = function(iso) {

      console.log(iso);
      dat = filter_data(rows, iso);
      circles(dat);
      d3.selectAll("circle").transition()
          .duration(500)
          .attr("fill", function(d) { return d.color});

};
