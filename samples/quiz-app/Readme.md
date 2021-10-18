This folder contains two applications and two charts:
- quiz-app-backend
- quiz-app-frontend
- charts/quiz-app-backend
- charts/quiz-app-frontend

# Application and flow

The main goal of these applications is to simulate a common scenario of web applications with forms, in this application the user write some information about himself and after that some questions are presented with the percentage of success in the final step.

To use with charles we added a POST to a new module (charlescd-circle-matcher) to get the x-circle-id before the request to the questions API and frontend chunks, because of this the next screen (questions) will change according to the x-circle-id.

So in a hypothetical scenario with two circles:

- Default circle, don't need x-circle-id to be accessed and have quiz-app-backend/quiz-app-frontend with v1 version
- Test circle, need x-circle-id with 1111-2222-3333 value to be accessed and have quiz-app-backend/quiz-app-frontend with v2 version

1. The first request to get the form screen ALWAYS reach default circle and because of this the user will get quiz-app-frontend V1

2. After the user submits the form the frontend make a POST to charlescd-circle-matcher with the answers to find the x-circle-id

3. With the x-circle-id (default or test circle) frontend store the value in cookies and send the user to the /questions screen and make a request to questions API

4. If the x-circle-id value is equal to test circle user will get V2 and if x-circle-id is different user will get V1

# How to add quiz-app to charles

To add quiz-app to charles go to the modules screen and add a new module with the following information:

name: quiz-app
gitUrl: https://github.com/zupit/charlescd/samples/quiz-app



