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

// benchMarkData is added and drawn on the selection of a particular student or 
// on selection of a particular category  	
var benchMarkData = {
		"ALTERNATIVE_ID" : "Class Benchmark Performance",
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
		"MODEL_RISK_CONFIDENCE" : "BENCHMARK"
	};

function colorIndicator(field, value)
{
  var color ;
  var indicatorFunction;
  if(field=="GPA_CUMULATIVE")
    indicatorFunction=d3.scale.quantize().domain([0,4]).range(["red","red","red", "green"]);
  else 
    indicatorFunction=d3.scale.quantize().domain([0,200]).range(["red", "green"]);

  color = (value === null ? "red" : indicatorFunction(value));
  return color;
}

var subjectToCourseId = {"Management":"MBA 101","EPSY":"EPSY 173","HLTH":"HLTH 677","MSIS":"MSIS 541","PSYC":"PSYC 786","MATH":"MATH 213","CRDV":"CRDV 343","CSIS":"CSIS 987","REST":"REST 439","ECON":"ECON 978","INTD":"INTD 563","ITS":"ITS 458","HIST":"HIST 226","PHIL":"PHIL 223","COM":"COM 102","BIOL":"BIOL 667","ENG":"ENG 112","ANTH":"ANTH 413","FASH":"FASH 321"}

 
// Make all the values in the multiple of 100 to scale the values according to the domain
// and plot it on the graph.
function updateData(data)
{
  var count=1;
  data.forEach(function(d) 
  {
            // Update the data required to plot on the chart
            d.R_CONTENT_READ *= 100;
            d.R_FORUM_POST *= 100;
            d.R_ASN_SUB *= 100;
            d.R_SESSIONS *= 100;

            // NOTE: This could be temporary as the logic to get back the original student id is to be defined here
            // Replace the managled student id and course id with some other id
            d.ALTERNATIVE_ID = "Student" + count;
            d.COURSE_ID = subjectToCourseId[d.SUBJECT];
        
            // Increment the count for the next student
            count++;           
  });

  return data;
}

var courseData=[];

d3.json("resources/sample.json", function(error, data) 
{	  

  console.log(data)
  var selectedCourse="";
  $('#courseList').change( function()
      {
        var studentOptions='<option value=""> All Students </option>';
        selectedCourse = $("#courseList").val() ;
        $("#courseLabel").text("Course : " +  selectedCourse).fadeIn();
        if(selectedCourse!="")
        {          
          courseData = data.filter(function (el) 
          {
                return el.COURSE_ID == selectedCourse;
          });
        }
        $("#studentList").html(updateDropdownList(courseData));
       
        // Hide all the tables as more than one student data is drawn
        $(".CSSTableGenerator").fadeOut();
        $(".profilepic").fadeOut();      
        $("#histogram").fadeOut(); 
      });

	updateData(data);

  // Update the course laber with course id
  // NOTE : random course name is given for now
  var courseLabel = {"PHIL":"Philosophy 101", "COM":"Communication 101","BIOL":"Biology 200","ENG":"English 101"};
  


	// Hide both the tables in the begining
	$(".CSSTableGenerator").hide();
  $(".profilepic").hide();
	$("#courseLabel").hide();  
  $("#histogram").hide();

	// Populate the student and the risk category the dropdown lists.
	var studentOptions='<option value=""> All Students </option>';
	var courseOptions= '<option value=""> All Courses </option>';
	var uniqueCourseList = [];
	data.forEach(function(d) 
	{
	 //studentOptions += '<option value="'+d.ALTERNATIVE_ID+'">'+d.ALTERNATIVE_ID+'</option>';
    if($.inArray(d.COURSE_ID,uniqueCourseList)==-1)
    {
      courseOptions += '<option value="'+d.COURSE_ID+'">'+d.COURSE_ID+'</option>';	
      uniqueCourseList.push(d.COURSE_ID) 
    }
	});   
	$("#studentList").html(studentOptions);
	$("#courseList").html(courseOptions);

  // Filter the data according to the selected category and update 
	// the students dropdown list
	var selectedCategory="";
	$('#riskCategoryList').change( function()
	    {
	      selectedCategory = $("#riskCategoryList").val() ;
	      var filteredData=[];
	      if(selectedCategory!="")
	      {
          filteredData = courseData.filter(function (el) 
          {
                return el.MODEL_RISK_CONFIDENCE == selectedCategory;
          });
	      }
	      else 
	      {
          // Deep copy the data to filteredData, otherwise benchmark will be added to the original data.
	        filteredData = $.extend(true, [], courseData);
	      }
	      $("#studentList").html(updateDropdownList(filteredData));
	     
	      // Add the benchmark data
	     	//filteredData.push(benchMarkData);
        filteredData.unshift(benchMarkData);

	      // Draw the filtered data again
	      d3.select("svg").remove();
	       d3.select("#content")
	      .datum(filteredData)
	      .call(chart);

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

  // On selection of the student, update the profile and 
  // indicator table with the selected student's information
  var filteredData="";
  $('#studentList').change(function()
      {
        var selectedStudent = $("#studentList").val() ;
        
        if(selectedStudent!="")
        {
            filteredData = courseData.filter(function (el) 
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
            tableData="<tr><td colspan='4'>Indicator</td></tr>";
            for (var i = 0; i < d.length; i++) 
            {                                                    
                tableData +="<tr><td>"+d[i]["label"]+"</td>"
                        //+"<td>"+(parseFloat(filteredData[0][d[i]["metric"]]).toFixed(2) || 0) +"</td>" // If value if NULL then replace with 0                        
                        +"<td><div id='circle' style='background:"+colorIndicator(d[i]["metric"],(filteredData[0][d[i]["metric"]] || 0))+";'></div></td>"
                        +"</tr>";              
            }
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
              filteredData = courseData.filter(function (el) 
              {
                    return el.MODEL_RISK_CONFIDENCE == selectedCategory;
              });
          }
          else
          {
              // Deep copy data to filteredData, otherwise benchmark till be added to the original data
              filteredData = $.extend(true, [], courseData);
          }
           $(".CSSTableGenerator").fadeOut(); 
           $(".profilepic").fadeOut(); 
             
        }
        
        // Add the benchmark to the filtered data to draw the benchmark
        //filteredData.push(benchMarkData);
        filteredData.unshift(benchMarkData);
        
        // Render the filtered data
        d3.select("svg").remove();
         d3.select("#content")
        .datum(filteredData)
        .call(chart);

      });

});