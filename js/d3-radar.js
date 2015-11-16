
// Mouse hover event for tooltip
// The tooltip appears on hover over a polygon displaying the student ID
// d3.event gives the co-ordinates to display the tooltip 
var mousemove = function(d) 
{
  var xPosition = d3.event.pageX + 5;
  var yPosition = d3.event.pageY + 5;

  d3.select("#tooltip")
    .style("left", xPosition + "px")
    .style("top", yPosition + "px");
  d3.select("#tooltip #heading")
    .text(d.ALTERNATIVE_ID);

  d3.select("#tooltip").classed("hidden", false);
};

// Mouse out for tooltip
// When outside the polygon then hide the tooltip
var mouseout = function() 
{
  d3.select("#tooltip").classed("hidden", true);
};


// metricConfiguration is label , metric and domain sent 
// while calling the function. (check d variable in the mainscript.js)
function radar(metricConfiguration) 
{
  // Color provides the range of the colors that can be alloted to the polygons 
  // depending on the risk category of the data that is being plotted
  // for NO RISK and LOW RISK, Green color
  // for MEDIUM RISK , Orange color
  // for HIGH RISK, Red color
  var color=d3.scale.ordinal()
            .domain(["NO RISK","LOW RISK","MEDIUM RISK","HIGH RISK","BENCHMARK"])
            .range(["green","orange","#A6038D","#F70000","black"]);
  
  // Metrics is the label, field (or metric) and domain 
  // for the axes provided while calling the function
  var metrics = metricConfiguration,
    margin = 40,
    // Radius provides the radius of the background circles 
    // and the range for plotting the polygon
    radius = 200,
    // pointRadius is the radius of the points plotted 
    // on the corners of the polygon
    pointRadius = 3,
    // lebelOffset provides the offset for the position of the axes label 
    labelOffset = radius;

  function chart(selection) 
  {
    // Side is the size of the SVG element and the chart
    // Increament the multiplying factor to increase the size of the chart
    var side = (radius + margin) * 2.65;
    selection.each(function (data) 
    {

      // Compute configuration
      // Comfiguration contains the angle , scale required to plot the element
      metrics = metrics.map(function (metric, i) 
      {
        // This  sets the scale for the data.
        // clamp function is set to assign the max range value to the field values which 
        // exceed the max domain value        
        metric.scale = d3.scale.linear()
          .range([ 0, radius+50 ])
          .domain(metric.domain)
          .clamp(true);
        
        // set angle to plot the elements of the chart at a particular angle          
        metric.angle = 2 * Math.PI * i / metrics.length - Math.PI / 2;
        
        return metric;
      });

      //console.log(selection);
      var scaleGPA =d3.scale.linear()
                    .range([0,62.5,125,187.5,250])
                    .domain([0,1,2,3,4]);

      // Augment data.
      // Generate X & Y co-ordinates for the data according to the data values and scale
      data = data.map(function (d) 
            {
                d.points = metrics.map(function (metric,i) 
                {
                    var origX;
                    if(metric.metric=='GPA_CUMULATIVE')
                    { 
                        // Use different scale for GPA as GPA goes from 1 to 4 only
                        origX = scaleGPA(d[metric.metric])
                    }                    
                    else
                    { 
                        // Default scale for all other fields
                        origX= metric.scale(d[metric.metric]);
                    }

                    return {
                      'x': origX * Math.cos(metric.angle),
                      'y': origX * Math.sin(metric.angle)              
                     
                    };
                });

                return d;
            });

      // Select the svg element, if it exists.
      var svg = d3.select(this)
      .selectAll('.chartsvg')
      .data([metrics]);
     
      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter()
        .append('svg')
        .attr("class","chartsvg")
        .append('g')
        .attr('transform', 'translate(' + (side / 2) + ', ' + (side / 2) + ')');//center chart

     // Update the outer dimensions.
      svg.attr('width', side)
        .attr('height', side);

      // Generate cosmetic background
      // The background color and other style properties are defined in style.css
      chart.drawBackground(gEnter);

      
      // Generate axes. 
      // These are line axes
      gEnter.selectAll('.axis')
        .data(function (d) { return d; })
        .enter()
        .append('g')
        .attr('class', 'axis')
        .each(function (d) 
        {
            // Plot and position the axes
              d3.select(this).append('g')
                .attr('class', d.metric + ' axisScale')
                .attr('transform', 'rotate(' + (d.angle * 180 / Math.PI) + ')')
                .call(d3.svg.axis().scale(d.scale));
                
              chart.drawAxisLabel(d3.select(this));
        })
        .on("click",function(){
          console.log(data);
          if(data.length==1)
          $("#histogram").empty();
          histogramChart(data); 
        });

      // Add the chart elements according to the data
      gEnter.selectAll('.radar')
        .data(data)
        .enter()
        .append('g')
        .attr('class','area')
        .attr("stroke",function(d,i){ return color(d.MODEL_RISK_CONFIDENCE)})
        .attr('fill',function(d,i){return color(d.MODEL_RISK_CONFIDENCE)})
        .each(function (d) { chart.drawArea(d3.select(this));  })
        .on('mousemove',mousemove)
        .on('mouseout',mouseout);       
        
    });
  }

  // Check if the radius has been set while calling the function 
  // If nothing is given then return undefined to stop the further execution
  // If some value is passed then store it in the radius variable for further reference 
  // This radius is used to draw the background circles and set the scale 
  // to draw other elements like circle points at the corners, polygons etc
  chart.radius = function (_) 
  {
    if (!arguments.length) 
    {
      return radius;
    }
    radius = _;
    return chart;
  };

  // Check if the margin has been set while calling the function 
  // If nothing is given then return undefined to stop the further execution
  // If some value is passed then store it in the margin variable for further reference 
  // Margin is used to position the chart with specified margin
  chart.margin = function (_) 
  {
    if (!arguments.length) 
    {
      return margin;
    }
    margin = _;
    return chart;
  };

  // Check if the radius has been set while calling the function 
  // If nothing is given then return undefined to stopt the further execution
  // If some value is passed then store it in the radius variable for further reference 
  // This radius is used to set the radius for the circles drawn at the 
  // corners of the polygon on the axes
  chart.pointRadius = function (_) 
  {
    if (!arguments.length) 
    {
      return pointRadius;
    }
    pointRadius = _;
    return chart;
  };

  // This is the total number of axes that will be drawn
  var numOfAxes = 5;
  
  // Draw the background circle for the chart 
  // 
  // Other style properties are set in the style.css
  chart.drawBackground = function (selection) 
    {
      
      // Circle background for the chart
      // Data is passed according to the scaling of the marks or ticks
      // like 25 goes to 31.25, 50 goes to 62.5 likewise
      selection.selectAll('.background')
        .data(([0,62.5,125,187.5,250]).reverse())
        .enter()
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('class', 'background')
        .attr('r', function (d) { return d; });
        
      // Ticks on the line axes
      // Ticks or markers are drawn in a way that 3 becomes benchmark
      // for GPA and 100 becomes benchmark for the other axes
      var markers = [0,50,100,150,200];
      var markerPositions =[0,62.5,125,187.5,250];
      for(var j=0; j<numOfAxes; j++)
      {
          // Ticks 
          selection.selectAll(".tick")
           .data([1]) //dummy data
           .enter()
           .append("svg:text")
           .attr("x", "0")
           .attr("y", "0")
           .attr("class", "legend")
           .style("font-family", "sans-serif")
           .style("font-size", "14px")
           .attr("transform", "translate(5,-"+markerPositions[j]+")")
           .attr("fill", "#737373")
          .text(markers[j]);
          
          // Skip the 0 tick for GPA as its already been plotted
          if(j == 0)
            continue;

          selection.selectAll(".tick")
           .data([1]) //dummy data
           .enter()
           .append("svg:text")
           .attr("x", "0")
           .attr("y", "0")
           .attr("class", "legend")
           .style("font-family", "sans-serif")
           .style("font-size", "14px")
           .attr("transform", "translate("+(markerPositions[j]-10*j)+","+(markerPositions[j]-30*j-10)+")")
           .attr("fill", "#737373")
          .text(markers[j]);

          selection.selectAll(".tick")
           .data([1]) //dummy data
           .enter()
           .append("svg:text")
           .attr("x", "0")
           .attr("y", "0")
           .attr("class", "legend")
           .style("font-family", "sans-serif")
           .style("font-size", "14px")
           .attr("transform", "translate(5,"+(markerPositions[j])+")")
           .attr("fill", "#737373")
          .text(markers[j]);
          
          selection.selectAll(".tick")
           .data([1]) //dummy data
           .enter()
           .append("svg:text")
           .attr("x", "0")
           .attr("y", "0")
           .attr("class", "legend")
           .style("font-family", "sans-serif")
           .style("font-size", "14px")
           .attr("transform", "translate(-"+(markerPositions[j])+","+(markerPositions[j]-30*j-10)+")")
           .attr("fill", "#737373")
          .text(markers[j]);

          selection.selectAll(".tick")
           .data([1]) //dummy data
           .enter()
           .append("svg:text")
           .attr("x", "0")
           .attr("y", "0")
           .attr("class", "legend")
           .style("font-family", "sans-serif")
           .style("font-size", "14px")
           .attr("transform", "translate(-"+(markerPositions[j]-5*j+10)+",-"+(markerPositions[j]-30*j-30)+")")
           .attr("fill", "#737373")
          .text(markers[j]);

          // Ticks  for only GPA
          selection.selectAll(".tick")
           .data([1]) //dummy data
           .enter()
           .append("svg:text")
           .attr("x", "0")
           .attr("y", "0")
           .attr("class", "legend")
           .style("font-family", "sans-serif")
           .style("font-size", "16px")
           .attr("transform", "translate("+(markerPositions[j]-10*j)+",-"+(markerPositions[j]-30*j-25)+") ")
           .attr("fill", "#737373")
          .text(j);
            
      }
  };

  // Draw the labels for the axes. Add the text element first at 
  // an appropriate place and position it according to the need by
  // adding some value to the labelOffset
  // The position is decided based on the angle provided by the data variable
  // The angle is generated in the 
  chart.drawAxisLabel = function (selection) 
  {

    selection.append('text')
      .text(function (d) { return d.label; })
      .attr('class', 'axisLabel')
      .attr('x', function (d) 
      {
          var pos = (labelOffset + 40) * Math.cos(d.angle);

          if (Math.PI / 2 === Math.abs(d.angle)) 
          {
            pos -= this.getComputedTextLength() / 2;
          } 
          else if (Math.abs(d.angle) > Math.PI / 2) 
          {
            pos -= this.getComputedTextLength();
          }

          return pos;
      })
      .attr('y', function (d) { return (labelOffset + 85) * Math.sin(d.angle); });

  };

  // This function draws the polygon based on the calculated values 
  // stored in the data. The values are calculated at the begining of the chart function
  // in the Compute configuration phase.
  chart.drawArea = function (selection) 
  {
    // This is to connect all the points present on the chart using lines
    // which displays it as polygon.
     selection.append('path')
        .attr('d', function (d,i) 
        {       
            return d3.svg.line()
            .x(function (d) { return (d.x || 0); })
            .y(function (d) { return (d.y || 0); })
            .interpolate('linear-closed')
            .call(this, d.points);
        })
        .attr('stroke',function(d){return color(d.MODEL_RISK_CONFIDENCE);})
        
    // This function plots all the circle dots on the chart
    // These circles are drawn on the axes which are the corners of the
    // polygon. They signify the value at the position on the axes
    // The radius of the circles is the pointRadius set at the begining
    selection.selectAll('.radarPoint')
      .data(function (d) { return d.points;})
      .enter()
      .append('circle')
      .attr('cx', function (d) {  return (d.x || 0); })
      .attr('cy', function (d) {  return (d.y || 0); })
      .attr('r', pointRadius)
      .attr('class', 'radarPoint')
      .attr('id', function (d) { return 'radarPoint' + d.id; })
      .attr('fill-opacity','1')
      
  };

  return chart;
}


