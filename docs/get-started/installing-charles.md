# Installing Charles

{% hint style="info" %}
The installing process was created considering some use cases, and each of them have its own specific tutorial. If you need to install CharlesCD in a different way, we suggest to check the **custom** section with isolated helm charts.
{% endhint %}

## Introduction

### Components

The CharlesCD installation considers these components:

1. Seven specific modules of **Charles' architecture;** 
2. **Keycloak**, used for product authentication and authorization;
3. A **PostgreSQL database** for backend modules \( `charles-application`, `charles-circle-matcher`, `deploy` and `villager`\) and Keycloak;
4. A **Redis**, to be used by [**Circle Matcher**](https://docs.charlescd.io/referencia/circle-matcher). 

### Continuous Delivery Platform

At this moment, Charles can support two Continuous Delivery \(CD\) platforms:

* **Spinnaker:** if you have your spinnaker already configured, you can proceed with our installation.  
* **Octopipe:** a native platform created by our team to make installation easier, without previous configurations. 

{% hint style="info" %}
If you want more information about how to configure Spinnaker or Octopipe, check the **CD Configuration** section.
{% endhint %}

## Main install cases

### Case \#1: Installation for tests

This installation is recommended for those who never used Charles before and just want a **first contact in testing environment**, without looking for scalability or security.

In this case, you will have to:

* Use an **yaml** file with all the **components**;
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

In this installation method, it is possible to customize some features through **our CLI** and edit the configuration file that contains all the available components.

With this custom file, you have the options to:

* Use a managed database; 
* Add new credentials to your clusters;
* Change the CharlesCD version;
* Use a previously installed Spinnaker;
* Enable \(or not\) a standard load balancer.

This installation can be used for tests or production environments, depending on which values you will define in the configuration file. In case you decide not to change this file at all, you will have the same result as if you install with an unique file.

### Case \#3: Installation with Terraform

This installation method is very specific, and it is recommended only for those who use Terraform to create and manage the infrastructure versions.

For this case, we can support GCP and AWS, and we are working on add AZURE.

On this **repository**, you will find all the data and Redis resources, and the helm releases execution of these modules already consumed the values from other resources. All of this separated by cloud.

### Case \#4: Total Customization

We recommend this installation method in case you want to edit all the available features on our CLI or even in a context of installing the modules by yourself. In both cases, you can directly access the **pure charts of the product.**

### Specifications

If you decide to follow the total customization, it is necessary to keep in mind some concepts:

#### **Order**

Even though the Charles modules are independent, there are some cases in which are needed some previous configurations. Some of them are:

* `Charles-moove`: this module demands that your keycloak is already configured to work. To guarantee that, you can customize the keycloak URL, as well `client-id` and `client-secret`. 

{% hint style="info" %}
In case of installation with our CLI or a unique file, these steps won't be necessary.
{% endhint %}

* `Charles-circle-matcher`: this module demands a configured **Redis** to work.

