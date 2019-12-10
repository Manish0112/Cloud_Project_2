<a href="https://manishlokhande.com/">
    <img src="https://manish-dropbox.s3.us-east-2.amazonaws.com/MedicationLogo.png" alt="My Medication" title="My Medication" align="right" height="100" />
</a>

My Medication 
======================
- University Name: [San jose state university](http://www.sjsu.edu/)
- Course: [Cloud Technologies](http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE281.html)
- Professor [Sanjay Garje](https://www.linkedin.com/in/sanjaygarje/)
- Student: 
  - [Manish Lokhande](https://www.linkedin.com/in/manish-lokhande-876571163/)
  - [Pankaj Patil](https://www.linkedin.com/in/pankajhpatil/)
  - [Bharat Medarametla](https://www.linkedin.com/in/bharathkmedarametla/)
- Project Introduction (What the application does, feature list)

Sample Demo Screenshots
========================
1. Landing Page
<img src="https://manish-dropbox.s3.us-east-2.amazonaws.com/Screenshots/Screen+Shot+2019-12-09+at+3.28.54+PM.png" alt="Landing Page" title="Landing Page" align="center" />

2. Upload Prescription
<img src="https://manish-dropbox.s3.us-east-2.amazonaws.com/Screenshots/Screen+Shot+2019-12-09+at+3.29.29+PM.png" alt="Upload Prescription" title="Upload Prescription" align="center" />

3. Preview Schedule
<img src="https://manish-dropbox.s3.us-east-2.amazonaws.com/Screenshots/Screen+Shot+2019-12-09+at+5.17.58+AM.png" alt="Preview Schedule" title="Preview Schedule" align="center" />

4. Alexa Display

Launch Screen             |  Your Prescription        |  Permissions         |  My Medication Skill
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![](https://manish-dropbox.s3.us-east-2.amazonaws.com/Screenshots/IMG_3081.jpg)  |  ![](https://manish-dropbox.s3.us-east-2.amazonaws.com/Screenshots/IMG_3082.jpg) |  ![](https://manish-dropbox.s3.us-east-2.amazonaws.com/Screenshots/IMG_3079.jpg)  |  ![](https://manish-dropbox.s3.us-east-2.amazonaws.com/Screenshots/IMG_3078.jpeg)

Getting Started
===============

These directions assume you want to develop on your local computer, and not
from the Amazon EC2 instance itself. If you're on the Amazon EC2 instance, the
virtual environment is already set up for you, and you can start working on the
code.

To work on the sample code, you'll need to clone your project's repository to your
local computer. If you haven't, do that first. You can find instructions in the
AWS CodeStar user guide.

1. Resources you need to configure on your AWS account
    - S3 Bucket - Create bucket with proper access policy
    - CloudFront Distribution
    - DynamoDB - Create table named as users and prescriptions
    - Textract
    - Create Alexa Skill and import the project

2. Install Node.js on your computer.  For details on available installers visit
   https://nodejs.org/en/download/.

3. Install NPM dependencies:

        $ npm install

4. Start the development server:

        $ node app.js

5. Open http://localhost:5000/ in a web browser to view your application.


What Should I Do Before Running My Project in Production?
===================

AWS recommends you review the security best practices recommended by the framework
author of your selected sample application before running it in production. You
should also regularly review and apply any available patches or associated security
advisories for dependencies used within your application.

Best Practices: https://docs.aws.amazon.com/codestar/latest/userguide/best-practices.html?icmpid=docs_acs_rm_sec


