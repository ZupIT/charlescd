# Installing Charles

{% hint style="info" %}
The installing process was created considering some use cases, and each of them have its own specific tutorial. If you need to install CharlesCD with more customization, we suggest to check the [**customized installation section**.](installing-charles.md#case-2-customized-installation)
{% endhint %}

## Introduction

### Components

The CharlesCD installation considers these components:

1. Seven specific modules of **Charles' architecture;** 
2. **Keycloak**, used for product authentication and authorization;
3. A **PostgreSQL database** for backend modules \( `charles-application`, `charles-circle-matcher`, `deploy` and `villager`\) and Keycloak;
4. A **Redis**, to be used by [**Circle Matcher**. ](../reference/circle-matcher.md)

### Continuous Delivery Platform

At this moment, Charles can support two Continuous Delivery \(CD\) platforms:

* **Spinnaker:** if you have your spinnaker already configured, you can proceed with our installation.  
* **Octopipe:** a native platform created by our team to make installation easier, without previous configurations. 

{% hint style="info" %}
If you want more information about how to configure Spinnaker or Octopipe, check the **CD Configuration** section.
{% endhint %}

## Main install cases

### Case \#1: Quick Installation

This installation is recommended for those who never used Charles before and just want a **first contact in testing environment**, without looking for scalability or security.

In this case, you will have to:

* Use an **yaml** file with all the [**components**](installing-charles.md#components);
* Use a **Load Balancer** previously configured.

To create this structure, you have to execute the files in a configured cluster, such as minikube, GKE, EKS, etc. The steps to be executed are:

```text
kubectl create namespace charles

kubectl apply -f file.yaml
```

At the end of the process, you will have inside of namespace `charles` all the modules of the product, as well your dependencies installed in a simpler way.

{% hint style="danger" %}
The purpose of this installation is only for tests. Using this for production environment is not recommended due to lack o backup, high availability, etc.
{% endhint %}

### Case \#2: Customized installation

This installation is recommended for those who already has an infrastructure to deal with a more complex environment or who has some limitations of security/scalability, which demands a **more complete install customization** of CharlesCD.  

### Prerequisites 

To run the process, you must have the following programs:

* Kubectl
* Helm 

### How does it works?

This installation is recommended for who has already setup your infrastructure due to a more complex environment or have some security or/and scalability limitations, which demands a **more complete installation customization** from CharlesCD.

You can find here all this [**documentation of editable fields.**](https://github.com/ZupIT/charlescd/blob/master/install/helm-chart/) 

{% hint style="info" %}
It's important to remember that, in case of no customization at all, the final result is the same as in case \#1 in which, for standard, we install the PostgreSQL, Redis, Keycloak and Octopipe. 

So, you must not forget to customize the fields in case you want something manageable. 
{% endhint %}

To execute the installation, just run the command below after you customized the charts: 

```text
// customize everything you need in the file values.yaml before you execute the following command
helm install charlescd <repo-folder> -n <namespace>
```



