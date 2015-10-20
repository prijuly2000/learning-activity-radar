// Update the student dropdown on the selection of the category   
// The student dropdown will contain the student ID of the students 
// who belong to the respective risk category 
function updateDropdownList(filteredData)
{
    var studentOptions='<option value=""> All Students </option>';
    filteredData.forEach(function(d) 
    {   
          studentOptions += '<option value="'+d.ALTERNATIVE_ID+'">'+d.ALTERNATIVE_ID+'</option>';
    });
    return (studentOptions);
}

// This function highlights the benchark on selection of the student,
// on selection of a category and on page load when the chart is displayed.
function highlightBenchmark()
{
	 // For benchmark data, change the color of the whole polygon
	// Here changes the color of the stroke and the area , not the corner circle dots
	d3.select(".area:last-child path")
	.attr("fill","black")
	.attr("stroke","black");

	// Here it changes the color of the corner circles
	d3.select(".area:last-child")
	.attr("fill","black")
	.attr("stroke","black");
}

// benchMarkData is added and drawn on the selection of a particular student or 
// on selection of a particular category  	
var benchMarkData = {
		"ALTERNATIVE_ID" : "Bench Mark",
		"COURSE_ID" : "Bench_Mark",
		"SUBJECT" : "Bench_Mark",
		"ONLINE_FLAG" : "1",
		"ENROLLMENT" : 29,
		"RC_FINAL_GRADE" : 4,
		"PERCENTILE" : 74,
		"SAT_VERBAL" : 460,
		"SAT_MATH" : 480,
		"APTITUDE_SCORE" : 940,
		"AGE" : 22,
		"RC_GENDER" : 2,
		"RC_ENROLLMENT_STATUS" : "1",
		"RC_CLASS_CODE" : "5",
		"GPA_CUMULATIVE" : 3,
		"GPA_SEMESTER" : 3.72,
		"STANDING" : "2",
		"RMN_SCORE" : 100,
		"RMN_SCORE_PARTIAL" : 97.9625,
		"R_CONTENT_READ" : 100,
		"R_ASSMT_SUB" : null,
		"R_FORUM_POST" : 100,
		"R_FORUM_READ" : null,
		"R_LESSONS_VIEW" : 2.6,
		"R_ASSMT_TAKE" : null,
		"R_ASN_SUB" : 100,
		"R_ASN_READ" : null,
		"R_SESSIONS" : 100,
		"ACADEMIC_RISK" : "1",
		"FAIL_PROBABILITY" : 0.054521,
		"PASS_PROBABILITY" : 0.945479,
		"MODEL_RISK_CONFIDENCE" : "MEDIUM RISK"
	};

// Make all the values in the multiple of 100 to scale the values according to the domain
// and plot it on the graph.
function updateData(data)
{
    data.forEach(function(d) 
    {
              d.R_CONTENT_READ *= 100;
              d.R_FORUM_POST *= 100;
              d.R_ASN_SUB *= 100;
              d.R_SESSIONS *= 100;
              
    });

    return data;
}


d3.json("riskscores2.json", function(error, data) 
{	
	//console.log(benchMarkData[0])
	updateData(data);

	// Hide both the tables in the begining
	$(".CSSTableGenerator").hide();
	$(".profilepic").hide();

	// Populate the student and the risk category the dropdown lists.
	var studentOptions='<option value=""> All Students </option>';
	var riskCategoryOptions= '<option value=""> All Categories </option>';
	var uniqueRiskCategory = [];
	data.forEach(function(d) 
	{
	  studentOptions += '<option value="'+d.ALTERNATIVE_ID+'">'+d.ALTERNATIVE_ID+'</option>';
	  if($.inArray(d.MODEL_RISK_CONFIDENCE, uniqueRiskCategory)==-1)
	  {
	    riskCategoryOptions += '<option value="'+d.MODEL_RISK_CONFIDENCE+'">'+d.MODEL_RISK_CONFIDENCE+'</option>';
	    uniqueRiskCategory.push(d.MODEL_RISK_CONFIDENCE);
	  }
	});   
	$("#studentList").html(studentOptions);
	$("#riskCategoryList").html(riskCategoryOptions);

	// Filter the data according to the selected category and update 
	// the students dropdown list
	var selectedCategory="";
	$('#riskCategoryList').change( function()
	    {
	      selectedCategory = $("#riskCategoryList").val() ;
	      var filteredData="";
	      if(selectedCategory!="")
	      {
	          filteredData = data.filter(function (el) 
	          {
	                return el.MODEL_RISK_CONFIDENCE == selectedCategory;
	          });

	      }
	      else 
	      {
	          filteredData = data;
	      }
	      $("#studentList").html(updateDropdownList(filteredData));
	     
	     // Don't add the benchmark polygon if all the data is being displayed
	      if(selectedCategory!="")
	      	filteredData.push(benchMarkData);

	      // Draw the filtered data again
	      d3.select("svg").remove();
	       d3.select("#content")
	      .datum(filteredData)
	      .call(chart);

	      // For benchmark data, change the color of the whole polygon
	      if(selectedCategory!="")
	      {
	      	highlightBenchmark();
		    }

	      // Hide all the tables as more than one student data is drawn
	      $(".CSSTableGenerator").fadeOut();
	      $(".profilepic").fadeOut();                 
	      
	    });

  // d contains all the information about the fields 
  // that needs to be plotted on the chart
  	var d=[
    {
      "label" : "Content Read",     // label is the name to be displayed on the axis
      "metric" : "R_CONTENT_READ",  // metric is the name of th field that is to be plotted on the current axes
      "domain" : [0, 200]           // Domain for the scale and input values. 
    },
    {
      "label": "Cumulative GPA",
      "metric": "GPA_CUMULATIVE",
      "domain" : [0, 4]
    },
    {
      "label": "Gradebook Score",
      "metric": "RMN_SCORE",
      "domain" : [0, 200]
    },
    {
      "label": "Forums Activity",
      "metric": "R_FORUM_POST",
      "domain" : [0, 200]
    },
    {
      "label": "Assignment Activity",
      "metric": "R_ASN_SUB",
      "domain" : [0, 200]
    },
    {
      "label": "Sessions Activity",
      "metric": "R_SESSIONS",
      "domain" : [0, 200]
    }];   
  
  
  var chart = radar(d)
  .radius(200)
  .margin(60)
  .pointRadius(3);

  chart.drawLabel = function (selection) 
  {
    selection.selectAll('.radarPoint')
  };

  // Render the benchmark on page load 
  d3.select("#content")
      .datum([benchMarkData])
      .call(chart);

  highlightBenchmark();
      
  // On selection of the student, update the profile and 
  // indicator table with the selected student's information
  var filteredData="";
  $('#studentList').change(function()
      {
        var selectedStudent = $("#studentList").val() ;
        
        if(selectedStudent!="")
        {
            filteredData = data.filter(function (el) 
            {
                  return el.ALTERNATIVE_ID == selectedStudent;
            });
            
            // Generate the proper HTML code to display the profile table
            var tableData = "<tr><td colspan='2'>Profile</td></tr>";
            var displayFields = {"ALTERNATIVE_ID":"Student Id" , "RC_GENDER":"Gender" ,"AGE":"Age", "COURSE_ID" :"Course Id","SUBJECT" :"Subject", "MODEL_RISK_CONFIDENCE":"Risk Level"};
            for(var key in displayFields) 
            {
                tableData += "<tr><td>"+displayFields[key]+"</td><td>";
                if(key == "RC_GENDER")
                {
                    // The in-coming data has digits to specify the gender ( 1 value for female and 2 value for male ) 
                    // so map the value to the respective gender
                    var gender = {1:"Female",2:"Male"};
                    tableData += gender[filteredData[0][key]]+"</td></tr>";
                }
                else
                {    
                    tableData += (filteredData[0][key])+"</td></tr>";
                }
                
            }             
            $("#profile").html(tableData);
            
            // Generate the proper HTML code to display the indicator table
            // var indGPA=d3.scale.linear().domain([0,3,4]).range(["red","red", "green"]);
            tableData="<tr><td colspan='3'>Indicator</td></tr>";
            for (var i = 0; i < d.length; i++) 
            {                                                    
                tableData +="<tr><td>"+d[i]["label"]+"</td><td>"
                        +(parseFloat(filteredData[0][d[i]["metric"]]).toFixed(2) || 0) // If value if NULL then replace with 0
                        +"</td>"
                        +"<td><svg height='15px' width='20px'><g transform='translate(7,7)'><circle r='5px' cx='0px' cx='0px' style='fill:green;' width='15px' height='15px'></circle></g></svg></td>"
                        +"</tr>";              
            }
            console.log(tableData);
            $("#indicator").html(tableData);
            $(".CSSTableGenerator").fadeIn();
            $(".profilepic").fadeIn();
           
        }
        else
        {
          // If All Categories option is selected then populate the students 
          // list with all students present in the data
          if(selectedCategory!="")
          {
              filteredData = data.filter(function (el) 
              {
                    return el.MODEL_RISK_CONFIDENCE == selectedCategory;
              });
          }
          else
          {
              filteredData = data;
          }
           $(".CSSTableGenerator").fadeOut(); 
           $(".profilepic").fadeOut(); 
             
        }
        
        // Add the benchmark to the filtered data to draw the benchmark
        filteredData.push(benchMarkData);

        // Render the filtered data
        d3.select("svg").remove();
         d3.select("#content")
        .datum(filteredData)
        .call(chart);

        // Call method to highlight the benchmark
        highlightBenchmark();		
      });

});