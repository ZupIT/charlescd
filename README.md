![build butler](https://github.com/ZupIT/charlescd/workflows/build%20butler/badge.svg)
![build circle-matcher](https://github.com/ZupIT/charlescd/workflows/build%20circle-matcher/badge.svg)
![build compass](https://github.com/ZupIT/charlescd/workflows/build%20compass/badge.svg)
![build moove](https://github.com/ZupIT/charlescd/workflows/build%20moove/badge.svg)
![build octopipe](https://github.com/ZupIT/charlescd/workflows/build%20octopipe/badge.svg)
![build villager](https://github.com/ZupIT/charlescd/workflows/build%20villager/badge.svg)
[![codecov](https://codecov.io/gh/ZupIT/charlescd/branch/master/graph/badge.svg)](https://codecov.io/gh/ZupIT/charlescd)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)


<img class="special-img-class" src="/images/logo.png"  alt="CharlesCD logo"/>


## **Table of contents**
1. [**About**](#About)
2. [**How was the project created?**](#How-was-the-project-created?)
3. [**What does Charles do?**](#What-does-Charles-do?)
4. [**Start using CharlesCD**](#Start-using-CharlesCD)
    1. [Installing Charles](#Installing-Charles)
    2. [Requirements](#Requirements)
    3. [Usage](#Usage)
5. [**Help us to evolve CharlesCD**](#Help-us-to-evolve-CharlesCD)
    1. [Developer Certificate of Origin - DCO](#Developer-Certificate-of-Origin-DCO)
6. [**License**](#License)
7. [**Forum**](#Community)

 
<br>
<br>
<br>

# **About**
CharlesCD is an open source project that deploys quickly, continuously, and securely. It allows development teams to simultaneously perform hypothesis validations with specific groups of users.

It is possible to segment your customers through specific characteristics (circles) and, at the same time, submit several versions of the same application for testing with users of the circles.

## **How was the project created?**
The project's concept refers to the theory proposed by biologist Charles Darwin (1809-1882), that evolution occurs through adaptation to a new environment. In the development's case, this logic happens through constant improvements in applications, for example, when you build and test hypotheses to deploy more effective releases.

CharlesCD offers a solution to the community: we want to enhance the deployment and  hypotheses testing work, because it will allow you to identify problems faster and  execute possible solutions to solve them.

For this reason, we consider CharlesCD a Darwinism's application within the development and programming universe.

## **What does Charles do?**
* Simple segmentation of users based on their profile or even demographic data;
* Creation of deployment strategies in an easier and more sophisticated way using circles;
* Easy version management in case of multiple releases in parallel in the production environment;
* Monitoring the impacts of each version using metrics defined during the creation of the deployment.

## **Start using CharlesCD**
### **Installing Charles**
CharlesCD's installation considers these components:

1. Charles' architecture specific modules; 
2. **Keycloak**, used for the project's authentication and authorization. However, if you already have an Identity Manager (IDM) and you want to use it, you have just to configure it during Charles' installation;
3. A PostgreSQL database for backend modules (`charlescd-moove`, `charlescd-butler`,`charlescd-villager`, `charlescd-gate` e `charlescd-compass`) and Keycloak;
4. A **Redis** to be used by `charlescd-circle-matcher`;
5. A **RabbitMQ** for `charlescd-hermes` use.
6. **Ingress** which is used to expose the HTTP and HTTPS routes outside the cluster to services inside the cluster. When you install Charles, it already has a default ingress, however, you can use your own.

### **Requirements**
To install Charles your environment needs the following requisites: 
- Kubernetes
- Helm
- Istio (version>= 1.7 and enabled sidecar injection on the deploy namespace of your application).
- Prometheus, in case you want to use metrics. 

### **Usage**
For more details, check out the [**documentation**](https://docs.charlescd.io).

## **Help us to evolve CharlesCD**
We will be happy with your ideas! Please see our [**contributing guide**](CONTRIBUTING.md).

### **Developer Certificate of Origin - DCO**

 This is a security layer for the project and for the developers. It is mandatory.
 
 There are two ways to use DCO, see them below: 
 
**1. Command line**
 Follow the steps: 
 **Step 1:** Check out your local git:

 ```
git config --global user.name “Name”
git config --global user.email “email@domain.com.br”
```
**Step 2:** When you commit, add the sigoff via `-s` flag:

```
$ git commit -s -m "This is my commit message"
```
**2. GitHub website**

**Step 1:** When the commit changes box opens, add 
```
$ git commit -m “My signed commit” Signed-off-by: username <email address>
```
Note: For this option, your e-mail must be the same in registered in GitHub. 

## **License**
 [**Apache License 2.0**](https://github.com/ZupIT/charlescd/blob/main/LICENSE).

## **Forum** 
If you have any questions or ideas, let's chat in our [**forum**](https://forum.zup.com.br/c/en/charles/13).

Keep evolving.