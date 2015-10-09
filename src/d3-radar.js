
// Mouse hover event for tooltip
// The tooltip appears on hover over a polygon displaying the student ID
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
// When outside the area then 
var mouseout = function() 
{
  d3.select("#tooltip").classed("hidden", true);
};

// metricConfiguration is label , metric and domain sent 
// while calling the function.
function radar(metricConfiguration) 
{
  var color= d3.scale.category10();
  var metrics = metricConfiguration,
    margin = 40,
    radius = 200,
    pointRadius = 3,
    labelOffset = radius + 10;

  function chart(selection) 
  {
    // Side is the size of the SVG element and the chart
    // Increament the multiplying factor to increase the size of the chart
    var side = (radius + margin) * 2.5,
      pointCount = 0;

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

      var scaleGPA =d3.scale.linear()
                        .range([0,31.25,62.5,125,187.5,250])
                        .domain([0,1,2,3,4,5]);
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
      var svg = d3.select(this).selectAll('svg').data([metrics]);
     
      
      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter()
        .append('svg')
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
        });

      // Add the chart elements according to the data
      gEnter.selectAll('.radar')
        .data(data)
        .enter()
        .append('g')
        .attr('class','area')
        .attr("stroke",function(d,i){ return color(i)})
        .attr('fill',function(d,i){return color(i)})
        .each(function (d,i) {  index = i; chart.drawArea(d3.select(this));  })
        .on('mousemove',mousemove)
        .on('mouseout',mouseout);
        
        
    });
  }

  // Check for the arguments passed at the time of the 
  // function call in the begining
  chart.radius = function (_) 
  {
    if (!arguments.length) {
      return radius;
    }
    radius = _;
    return chart;
  };

  chart.margin = function (_) 
  {
    if (!arguments.length) 
    {
      return margin;
    }
    margin = _;
    return chart;
  };

  chart.pointRadius = function (_) 
  {
    if (!arguments.length) {
      return pointRadius;
    }
    pointRadius = _;
    return chart;
  };

  var numOfAxes = 6;
  
  // Draw the background circle for the chart 
  // Other style properties are set in the style.css
  chart.drawBackground = function (selection) 
    {

      var step = radius / 4;
      
      // Circle background for the chart
      selection.selectAll('.background')
        .data(([0,31.25,62.5,125,187.5,250]).reverse())
        .enter()
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('class', 'background')
        .attr('r', function (d) { return d; });
        
      // Ticks on the line axes
      var markers = [0,25,50,100,150,200];
      var markerPositions =[0,31.25,62.5,125,187.5,250];
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
           .attr("transform", "translate("+(markerPositions[j]-6*j)+",-"+(markerPositions[j]-30*j)+") ")
           .attr("fill", "#737373")
          .text(j);
            
      }
  };

  chart.drawAxisLabel = function (selection) 
  {

    selection.append('text')
      .text(function (d) { return d.label; })
      .attr('class', 'axisLabel')
      .attr('x', function (d) 
      {
          var pos = labelOffset * Math.cos(d.angle);

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
  // stored in data
  chart.drawArea = function (selection) 
  {
    // This is to connect all the points present on the chart using lines
    // which displays it as polygon
     selection.append('path')
        .attr('d', function (d,i) 
        {       
          return d3.svg.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .interpolate('linear-closed')
            .call(this, d.points);
        })
        .attr('stroke',function(){return color(index);})
        
    // This function plots all the circle dots on the chart
    selection.selectAll('.radarPoint')
      .data(function (d) { return d.points;})
      .enter()
      .append('circle')
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', pointRadius)
      .attr('class', 'radarPoint')
      .attr('id', function (d) { return 'radarPoint' + d.id; })
      .attr('fill-opacity','1')
      
  };

  return chart;
}
