What is Learning Activity Radar?
================================

Learning Activity Radar tool provides a detailed visualization that gives a holistic view of student’s academic performance in a course. 

What can Learning Activity Radar tell me?
=========================================

The Learning Activity Radar gives the information about the student’s performance. User can select the risk category and the radar will show polygons for all the students who fall in that category. The color of the polygon will be green or red depending on the risk category as shown in the picture below.

!(resources/snap 2.PNG)

The user can also select indivisual student to see his performance. Along with the radar chart, indicator table (which contains academic information) and the profile table (which contains general information) are displayed.  Indicator table displays red or green circle in the last column to show the risk of the student in that metric as shown in the picture below.

!(resources/snap 1.PNG)

Install and deployment 
======================

Tomcat 7
---------
1.	Apache Tomcat - http://tomcat.apache.org/  Download the given website.
2.	Extract the files to C:\Tomcat
3.	Set environment variable: CATALINA_HOME=C:\Tomcat. Add $CATALINA_HOME\bin to PATH

Learning Activity Radar
-----------------------
1.	Download the source available in github https://github.com/sandeepmjay/learning-activity-radar  
2.	Place this folder in the webapps folder of Tomcat.
3.	Start Tomcat by running the C:\Tomcat\bin\startup.bat.
4.	Open Chrome and enter the URL http://localhost:8080/learning-activity-radar/example/index.html


Data Format
===========

The personal data includes all students and their demographic details.


COLUMN                  | FORMAT            | DESCRIPTION
----------------------- |:-----------------:|------------------------------------------
ALTERNATIVE_ID          | String(100)       | The CWID(College Wide ID) of the student replaced with some unique identifiers for security reasons.
COURSE_ID               |	String(100)       |	The unique identifier standard across SIS and LMS for the course. Usually in the format Subject_CourseNumber_Section_Term.
SUBJECT                 |	String(50)        |	The subject of the course.
PERCENTILE              | Float[0-100.0]    | The high school ranking of the students (e.g. 85 means 85th percentile).
SAT_VERBAL              | Integer[200-800]  | The numeric SAT verbal score (or 0/blank to indicate no score).
SAT_MATH                | Integer[200-800]  | The numeric SAT mathematics score (or 0/blank to indicate no score).
R_CONTENT_READ          |	Float	            | Its the score which keeps track of the content read in the course
AGE                     | Integer[1-150]    | The age of the student (in years)
R_ASN_SUB               |	Integer           |	Keeps track of the number of assignment submissions. 
RC_GENDER               | Integer[1,2]      | The gender of the student (self-reported) 1 = Male, 2 = female
RC_ENROLLMENT_STATUS    | [F,P]             | Code for full-time (F) or part-time (P) student (by credit hours currently enrolled).
R_SESSIONS              |	Integer           |	The total number of interaction with the course
GPA_CUMULATIVE          | Float[0-4.0]      | Cumulative university grade point average (float - four point scale - [0.00 - 4.00])
MODEL_RISK_CONFIDENCE   |	String [Low, High, medium, No Risk] |	Depending on the other metrics the risk category of the student is determined major factors are GPA, Gradebook, Assignment Submission, forum posts.
GPA_SEMESTER            | Float[0-4.0]      | Semester university grade point average (float - four point scale - [0.00 - 4.00])
STANDING                | [0-2] *See Notes* | Current university standing such as probation, regular standing or dean’s list/semester honors.
R_FORUM_POST            |	Integer           |	Shows number of forum posts done by the student
ONLINE_FLAG             |	[Y,N]             |	Y = Online, N = Classroom or other non-online
CLASS_CODE              | [FR,SO,JR,SR,GR]  | FR=Freshmen, SO=Sophomore, JR=Junior, SR=Senior, GR=Graduate





