# **CharlesCD UI**

## **Table of contents**
### 1. [**About**](#about)
### 2. [**Usage**](#usage)
>#### 2.1. [**Requirements**](#requirements)
>#### 2.2. [**Configuration**](#configuration)
### 3. [**Documentation**](#documentation)
### 4. [**Contributing**](#contributing)
### 5. [**License**](#license)
### 6. [**Community**](#community)


## **About**
The user interface is responsible for providing an easy-to-use interface for all resources, such as CharlesCD to facilitate your hypothesis testing and circle deployments.

## **Usage**

### **Requirements**
See below the requirements to run CharlesCD UI:
- [**Node**](https://nodejs.org/en/download/)
- [**npm**](https://docs.npmjs.com/cli/v7/commands/npm-install)

Change `REACT_APP_API_URI` value in [environments/dev] dir to access the [Charles application] API.

### **Configuration**

### **On terminal**

Run the following commands in the **root folder** to get all dependencies installed in the UI and to start the server:

```
npm install
npm run start
```

The app will start up on localhost:3000

### **How to start the app with mocks?**

Run the following commands in the **root folder** to get all dependencies installed in UI and to start the server:

```
npm install
npm run start:local
```

**`We are still working on mock improvements`**

### **Testing**

To run the tests, execute `npm run test`.

### **Run single test**

To run single test, execute `npm run test:watch -- --testPathPattern [your-file-path]`.

### **Building & Deploying**

To build the UI, run `npm run build`. The built UI lives in `build/`.

### **CRA**

We use [**create react app**](https://reactjs.org/docs/create-a-new-react-app.html) to create a user interface. You may need to define a new environment or set up a proxy, etc. For more information, check out [**React's documentation**](https://reactjs.org/docs/getting-started.html).

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

For this method, your name and e-mail must be the same registered on your GitHub account.

## **License**
[**Apache License 2.0**](https://github.com/ZupIT/charlescd/blob/main/LICENSE).

## **Community**

Do you have any question about CharlesCD? Let's chat in our [**forum**](https://forum.zup.com.br/). 

