# **Quiz-app**

## **Table of contents**
### 1. [**About**](#about)
### 2. [**Application and flow**](#application-and-flow)
### 3. [**How to add quiz-app to CharlesCD**](#how-to-add-quiz-app-to-charlescd)
### 4. [**Documentation**](#documentation)
### 5. [**Contributing**](#contributing)
### 6. [**License**](#license)
### 7. [**Community**](#community)

# **About**
This folder contains two applications and two charts:
- quiz-app-backend
- quiz-app-frontend
- charts/quiz-app-backend
- charts/quiz-app-frontend

# **Application and flow**

These applications simulate a common scenario of web applications with forms. The user writes personal information, and after that, some questions show up with the percentage of success in the final step.

To use this feature with Charles, we added a POST to a new module (charlescd-circle-matcher) to get the `x-circle-id` before the request to the questions API and frontend chunks, because of this the next screen (questions) will change according to the `x-circle-id`.

In a hypothetical scenario with two circles:

**1. Default circle:** It doesn't need `x-circle-id` to be accessed and it has quiz-app-backend/quiz-app-frontend with v1 version.
**2. Test circle:** It needs `x-circle-id` with 1111-2222-3333 value to be accessed and it has quiz-app-backend/quiz-app-frontend with v2 version.

Then: 
1. The first request to get the form screen **always** reaches the default circle. The user will get quiz-app-frontend V1.

2. After the user submits the form the frontend, it makes a POST to charlescd-circle-matcher with the answers to find the `x-circle-id`.

3. The `x-circle-id` (default or test circle) frontend stores the value in cookies and sends the user to the /questions screen to make a request to questions API.

4. If the `x-circle-id` value is equal to the test circle, the user gets V2 and, if the `x-circle-id` is different, the user gets V1.

# **How to add quiz-app to CharlesCD**

To add quiz-app to Charles 
- Go to the modules screen and add a new module with the following information:

> name: quiz-app
> gitUrl: https://github.com/zupit/charlescd/samples/quiz-app

## **Documentation**

For more information about CharlesCD, please check out the [**documentation**](https://docs.charlescd.io/).

## **Contributing**

If you want to contribute to this module, access our [**Contributing Guide**](https://github.com/ZupIT/charlescd/blob/main/CONTRIBUTING.md).

### **Developer Certificate of Origin - DCO**

 This is a security layer for the project and for the developers. It is mandatory.
 
 Follow one of these two methods to add DCO to your commits:
 
**1. Command line**
 Follow the steps: 
 **Step 1:** Configure your local git environment adding the same name and e-mail configured at your GitHub account. It helps to sign commits manually during reviews and suggestions.

 ```
git config --global user.name “Name”
git config --global user.email “email@domain.com.br”
```
**Step 2:** Add the Signed-off-by line with the `'-s'` flag in the git commit command:

```
$ git commit -s -m "This is my commit message"
```

**2. GitHub website**
You can also manually sign your commits during GitHub reviews and suggestions, follow the steps below: 

**Step 1:** When the commit changes box opens, manually type or paste your signature in the comment box, see the example:

```
Signed-off-by: Name < e-mail address >
```

For this method, your name and e-mail must be the same registered to your GitHub account.

[Charles Documentation]: https://docs.charlescd.io/
[Node environment]: https://nodejs.org/en/
[Docker]: https://docs.docker.com/get-docker/
[Swagger API Documentation]: http://localhost:3000/api/swagger
[Postman Collection]: src/resources/postman/Charles_Butler.postman_collection.json
[Contributing Guide]: https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md

## **License**
[**Apache License 2.0**](https://github.com/ZupIT/charlescd/blob/main/LICENSE).

## **Community**

Do you have any question about CharlesCD? Let's chat in our [**forum**](https://forum.zup.com.br/).

