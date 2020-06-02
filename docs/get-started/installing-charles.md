# Installing Charles

{% hint style="info" %}
The installing process foi created considering some use cases, in which of them there is a specific tutorial. If you need to install CharlesCD in a different way, we suggest to check the **custom** section with isolated helm charts.
{% endhint %}

## Introduction

### Components

The CharlesCD installation consider these components:

1. Seven specific modules of **Charles' architecture;** 
2. **Keycloak**, used for product authentication and authorization;
3. A **PostgreSQL bank** for backend modules \( `charles-application`, `charles-circle-matcher`, deploy and villager\) and Keycloak;
4. A **Redis** to use the [**Circle Matcher**](https://docs.charlescd.io/referencia/circle-matcher). 

### Continuous Delivery Platform

At this moment, Charles can support two Continuous Delivery \(CD\) platforms:

* **Spinnaker:** if you have your spinnaker already configured, you can proceed with our installation.  
* **Octopipe:** a native platform created by our team to make easier an installation without previous configurations. 

{% hint style="info" %}
If you want more information about how to configure Spinnaker ir Octopipe, check the section **CD Configuration.**
{% endhint %}

## Main install cases

### Case \#1: Installation for tests

This installation is recommended for those who never used Charles before and just want a **first contact in testing environment**, _\*\*_without looking for scalability or security.

In this case, you will have to:

* Use a yaml file with all the **components**;
* Use a Load Balancer previously configured.

To create this structure, you have to execute the files in a configured cluster, such as minikube, GKE, EKS, etc. The steps to be executed are these:

```text
kubectl create namespace charles

kubectl apply -f arquivo.yaml
```

At the end of the process, you will have inside of a namespace Charles all the modules of the product, as well as your dependencies installed in a simpler way.

{% hint style="danger" %}
Como essa instalação serve apenas para o uso em ambiente de testes, não recomendamos esse caso de instalação para ambientes produtivos porque ele não inclui cuidados de backups do banco de dados, alta disponibilidade, entre outros.
{% endhint %}

### Case \#2: Customized installation

In this installation case, it's possible to customize some ~~information~~ through **our CLI** and a configuration file that contains all the available ~~information~~ to be edited.

With this custom file, you have the option to:

* Use a managed database; 
* Add news credentials to your clusters;
* Change the CharlesCD version;
* Use a previously installed Spinnaker;
* Enable \(or not\) a standard load balancer.

This installation can be used for tests or production environments, depending on which values you'll define in the configuration file. In case you decide not to change this file at all, you'll have the same result as if you install with a unique file.

### Case \#3: Installation with Terraform

This installation case is very specific and it's indicated only for those who use Terraform to create and manage your infrastructure versions.

For this cases, we can support GCP and AWS and we're working on add AZURE.

On this **repository**, you will find all the data and Redi resources, and also the helm releases execution of these modules already consumed the values from other resources. All of this separated by cloud.

## Total Customization

We recommend this type of installation in case you want to edit all the ~~information~~ available on our CLI or even in a context of installing the modules by yourself. In both cases, you can directly access the **pure charts of the product.**

### Specifications

When you decide to follow the total customization, it's necessary to keep in mind some specifications:

#### **Order**

Even though the Charles modules are independent, there are some cases in which are needed some previous configurations. Some of them are:

* `Charles-moove`: this module demands that your keycloak is already configured to work. To guarantee that, you can custom the keycloak URL, as wall as client e client-secret. 

{% hint style="info" %}
In case of installation with our CLI or a unique file, these steps won't be necessary.
{% endhint %}

* `Charles-circle-matcher`: this module demands a configured redis to work.

