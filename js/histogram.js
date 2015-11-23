
var histogramChart = function(label,metricSelected){

$("#histogram").empty().fadeIn();

$("#histogram").html("<h4>"+label+"</h4>");

var numberOfStudents = 1//courseData.length;

// A formatter for counts.
var formatCount = d3.format(",.0f");



// Generate a Bates distribution of 10 random variables.
var values =courseData.map(function(d){return d[metricSelected];})


var margin = {top: 10, right: 30, bottom: 40, left: 30},
    width = 420 - margin.left - margin.right,
    height = 310 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, 10])
    .range([0, width]);


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d,i) {
    var tipInfo = "<strong>Range : </strong> <span style='color:red'>" +d.x + " - " + (d.x+d.dx) + "</span><br>";
    tipInfo += "<br><strong>Count : </strong> <span style='color:red'>" +d.length + "</span>"
    return tipInfo;
  })

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins([0,20,40,60,80,100,120,140,160,180,200])
    (values);

console.log(data)

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(d3.scale.linear().domain([0, 200]).range([0, width]))
    .tickValues([0,20,40,60,80,100,120,140,160,180,200])
    .orient("bottom")

var svg = d3.select("div #histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.call(tip);

var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d,i) { return "translate(" + x(i) + "," + y(d.y) + ")"; })
    .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

bar.append("rect")
    .attr("x", 1)
    .attr("width", width/10 - 3 ) //width/10 - 10)
    .attr("height", function(d) { return height - y(d.length); });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", x(data[0].dx) /2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

 // now add titles to the x axis
svg.append("text")
  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
  .attr("transform", "translate("+ (width/2) +","+(height+35)+")")  // text is drawn off the screen top left, move down and out and rotate
  .text("Range");

 // now add titles to the y axis
svg.append("text")
  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
  .attr("transform", "translate(-20,"+height/2+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
  .text("Count");


    

}
