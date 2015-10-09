

// Index is required to set the color according to the index of the data
// so that each polygons and the related circles get the separate color
var index=0;

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

// Make all the values in the multiple of 100 to scale the values according to the domain
// and plot it on the graph.
// While plotting , 100 is the bench mark ie the thick dark circle is 100 scale
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
              filteredData=data;
          }
          $("#studentList").html(updateDropdownList(filteredData));
          d3.select("svg").remove();
           d3.select("#content")
          .datum(filteredData)
          .call(chart);
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
      "domain" : [0, 5]
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

  
  d3.select("#content")
      .datum(data)
      .call(chart);
      
  // On selection of the student, update the profile and 
  // indicator table with the selected student's information
  $('#studentList').change(function()
      {
        var selectedStudent = $("#studentList").val() ;
        var filteredData="";
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
            {                                                    // If value if NULL then replace with 0
                tableData +="<tr><td>"+d[i]["label"]+"</td><td>"
                        +(parseFloat(filteredData[0][d[i]["metric"]]).toFixed(2) || 0)
                        +"</td>"
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
        d3.select("svg").remove();
         d3.select("#content")
        .datum(filteredData)
        .call(chart);
        
      });
  
});