
/*
This file is mainly to plot the histogram. The histogram is displayed on the click event of the axis label.
The axis label and the field name associated with the axis is passed to the histogram function. Depensing on the selected 
axis the histogram is plotted for the currently selected course. If the course if not selected then the histogram won't be displayed. 
*/
var histogramChart = function(label,metricSelected){

// The div in which the histogram is going to be displayed is hidden in the bigging so we have show it first.
$("#histogram").empty().fadeIn();

// Add the axis label which is being rendered in the histogram
$("#histogram").html("<h4>"+label+"</h4>");

// A formatter for counts.
var formatCount = d3.format(",.0f");


// Create a new array of values that needs to be plotted. The values only be selected metric values of each json object.
var values =courseData.map(function(d){return d[metricSelected];})

// Set all the dimentions of the chart
var margin = {top: 10, right: 30, bottom: 40, left: 30},
    width = 420 - margin.left - margin.right,
    height = 310 - margin.top - margin.bottom;

// We set the number of bars that needs to  be plotted
var barNumber = 0;

//  Range array contains the output range for the input domain of the selected metrics
var range=[];

// tickScale decides the ticks displayed on the x axis.
var tickScale = null;
if(metricSelected != "GPA_CUMULATIVE")
{
	// Metrics other than Cumulative GPA has same scale
	// All the metrics except GPA, has 10 bars to display
	barNumber =10;

	// Output range 200 is divided into 10 values 
	range = [0,20,40,60,80,100,120,140,160,180,200]

	// Scale to plot ticks for metrics other than GPA
	tickScale = d3.scale.linear().domain([0, 200]).range([0, width]);
}
else 
{
	// Cumulative GPA has limitted input domain and output range. So the calculations also differ
	// Display 8 bar with 0.5 difference in tick values
	barNumber =8;

	//Output range to sort the input values
	range = [0,0.5,1,1.5,2,2.5,3,3.5,4]

	// Scale to plot ticks the GPA 
	tickScale = d3.scale.linear().domain([0, 4]).range([0, width]);
}


var x = d3.scale.linear()
    .domain([0, barNumber])
    .range([0, width]);

// Display the tip on hover over each bar of the chart
// Tip contains information like the range of values and the count of students that fall in that range
var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d,i) {
		var tipInfo = "<strong>Range : </strong> <span style='color:red'>" +d.x + " - " + (d.x+d.dx) + "</span><br>";
		tipInfo += "<br><strong>Count : </strong> <span style='color:red'>" +d.length + "</span>"
		return tipInfo;
	})

// Generate a histogram using twenty uniformly-spaced bins.
// Bins is nothing but counting the number of students which fall in each category
// Depending on the range, the input values are categorised into different groups.
var data = d3.layout.histogram()
    .bins(range)
    (values);

// Set the height according to the max input of count that is there in the data 
var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

// Create an x axis with customized tick values and scale
var xAxis = d3.svg.axis()
    .scale(tickScale)
    .tickValues(range)
    .orient("bottom")

// create a SVG element and append it with appropriate height and width
// Move it to the appropriate place
var svg = d3.select("div #histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Call function which invokes on hover over an of the bar
svg.call(tip);

// Create bars depending on the data supplied
var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d,i) { return "translate(" + x(i) + "," + y(d.y) + ")"; })
    .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

// The bar is nothing but the rectangle element. 
// The width of the bar is decided on the number of the bars to be plotted
// Height depends on the current count d that needs to be displayed
bar.append("rect")
    .attr("x", 1)
    .attr("width", width/barNumber - 3 )
    .attr("height", function(d) { return height - y(d.length); });

// Add label on the bar to display the count that is represented by that bar
bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", 15)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

// Add X axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

 // Add title to the x axis
svg.append("text")
  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
  .attr("transform", "translate("+ (width/2) +","+(height+35)+")")  // text is drawn off the screen top left, move down and out and rotate
  .text("Range");

 // Add title to the y axis
svg.append("text")
  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
  .attr("transform", "translate(-20,"+height/2+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
  .text("Count");    

}
