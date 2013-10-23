var color_map =   {1:"red",
                   2:"pink",
                   3:"yellow",
                   4:"green"};

var w=900, h=80, parser = d3.time.format("%Y-%m").parse;
x = d3.time.scale().range([0, w - 200])

var dat = [];
var rows, svg;
var countries = {};

var datedict = {0:"2008", 4:"2009", 8:"2010"};

var updateName = function(iso) {
  d3.select("#namer").text(iso);
};

var parse = function(date_str) {
  var year = date_str.slice(0, 4)
  var quarter = parseInt(date_str.slice(-2, date_str.length))

  // subtract two to get to first month of quarter
  var start_month = (quarter * 3) - 2

  return parser(year + "-" + start_month.toString())
}

var setXDomain = function(data) {
  var max = d3.max(data, function(d) {return d.date});
  var min = d3.min(data, function(d) {return d.date});
  x.domain([min, max]);
}

var setX = function(rows, code) {
  // this is messy - goes through all data yet again

  var f = rows.filter(function(x) { return x.iso == code })
  var u = f.map(makeDataJSON);
  setXDomain(u);
  
  return u
};

var makeDataJSON = function(d) {
  return {"iso":d.iso, "date": parse(d.period), "color": d.color}}


var addCountryGraphDiv = function(iso) {
  d3.select("#country-charts")
    .append("div")
    .attr("id", iso)
    .append("div")
    .text(countries[iso].name);
}

var addAllCountries = function() {
  Object.keys(countries).map(function(iso) {
    addCountryGraphDiv(iso);
  })
}

var addDataToCountries = function(data) {
  data.map(function(d) {
    d3.select("#" + d.iso)
      .append("div")
      .text(d.period);
  })
}

var makeChart = function(iso) {
  svg = d3.select("#" + iso).append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "#" + iso + "-svg");
  
  return svg
}

var addCircles = function(d) {
  svg.selectAll(".circles")
    .data(d)
    .enter()
    .append("svg:circle")
    .attr("class", d.iso + "-circle")
    .attr("cx", function(d) { return x(d.date) + 10; })
    .attr("cy", function(d) { return 20; })
    .attr("r", 8)
    .attr("fill", function(d) { return d.color });
}

var makeCircle = function(d) {
  d3.select("#" + d.iso + "-svg")
    .data(d)
    .enter()
    .append("svg:circle");
}

var updateCountriesData = function(d) {
  //same as makeDataJSON
  countries[d.iso].data.push({"iso":d.iso, "date": parse(d.period), "color": color_map[d.score]})
}

d3.csv("assets/data/fcpr_final.csv", function(loadedRows) {
    loadedRows.map(function(d) { if (d.iso == "CIV") // fix circumflex on 'o'
                          {
                            d.country = "Côte d'Ivoire"
                          }
                          countries[d.iso] = {"name":d.country, "data":[]}
//                          updateCountriesData(d);
                        });
  loadedRows.map(function(d) {updateCountriesData(d)});
    rows = loadedRows;
    rows.map(function(d) {
      d.x = x(parse(d.period));
      d.color = color_map[d.score];
    });
//    dat = filter_data(loadedRows, "TRO"); // start with tropics
//    updateName("TRO") // ditto
//    circles(dat);

  addAllCountries();
//addDataToCountries(rows);
  setX(loadedRows, "AFR")
//  svg = makeChart("AFR");


  Object.keys(countries).map(function(iso) {
    svg = makeChart(iso);
    addCircles(countries[iso].data);
  })
  
  
  //addCircles(countries["AFR"].data);
//loadedRows.map();

});
