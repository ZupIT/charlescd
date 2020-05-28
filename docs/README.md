---
description: >-
  In this section, you will help you find all the basic information about
  Charles.
---

# Overview

## What is Charles?

CharlesCD is an open source tool that makes more agile, continuous and safe deployments, which allows development teams to perform hypothesis validations with a specific group of users, simultaneously. 

{% hint style="warning" %}
The product brings a new concept to the community: **deployment in circles of users on Kubernetes clusters**. 
{% endhint %}

This kind of deploy makes it possible to create a segment with your clients' specific characteristics and, at the same time, submit several versions of the same application to test this circle of users. 

## How was the project created?

Charles was created to offer a more efficient solution for the community to create deployments and test hypothesis together, which allows the identification of errors and the execution of possible solution to solve bugs faster. 

The concept behind the tool goes back to the theory proposed by the biologist Charles Darwin \(1809-1882\), in which evolution goes by the adaptation to a new environment. In the development's case, this evolution goes by constant improvements on the applications to build and to test hypothesis in order to implement more effective releases.

For this reason, we believe CharlesCD is the darwinism's application inside the development and programming world. 

## What does Charles do?

The methodology implemented by Charles brings a lot of advantages such as:  

* Simple users segment based on their profile or demographic data; 
* Easy and sophisticated creation of implementation strategies using circles;  
*  Easy version management in case of multiple parallel releases in the production environment 
* Monitoring each version impact through predefined metrics during the implementation creation. _Monitoramento dos impactos de cada versão por meio de métricas definidas durante a criação da implantação._

## System architecture

The plataform was built using a microservice approach and it has the following modules:

![Charles architecture](.gitbook/assets/arquitetura-charles-nova%20%283%29.png)

* `charlescd-ui:`  mirrors on front-end the workspace configuration, users, modules, hypothesis and boards, it is the plataform graphic interface.  
* `charles-moove:` manages workspace, users, modules, hypothesis and boards, it is the whole plataform structure.   
* `charles-butler:` orchestrates and manages releases and deploys. 
* `charles-circle-matcher:`manages all created circles, and also points out which circle the user belongs based on their characteristics. 

