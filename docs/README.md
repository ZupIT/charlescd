---
description: >-
  In this section, we will help you find all the basic information about
  Charles.
---

# Overview

## What is Charles?

CharlesCD is an open source tool that makes deployments more agile, continuous and safe, which allows development teams to perform hypothesis validations with a specific group of users, simultaneously.

{% hint style="warning" %}
The product brings a new concept to the community: **deployment in circles of users on Kubernetes clusters**.
{% endhint %}

This kind of deploy makes it possible to create a segment with your clients' specific characteristics and, at the same time, submit several versions of the same application to test this circle of users.

## How was the project created?

Charles was created to offer a more efficient solution for the community to create deployments and test hypothesis together, which allows the identification of errors and the execution of possible solution to solve bugs faster.

The concept behind the tool goes back to the theory proposed by the biologist Charles Darwin \(1809-1882\), in which evolution goes by the adaptation to a new environment. In the development's scenario, this evolution goes by constant improvements on the applications to build and test hypothesis in order to implement more reliable releases.

For this reason, we believe CharlesCD is the darwinism's application inside the development and programming world.

## What does Charles do?

The methodology implemented by Charles brings a lot of advantages such as:

* Simple segmentation of users based on their profiles or demographic data; 
* Easy and sophisticated creation of implementation strategies using circles;  
* Easy version management, allowing multiple parallel releases of the same application in the production environment; 
* Monitoring the impact of each version through predefined metrics during the implementation creation.

  **System architecture**

The platform was built using a microservice approach, and it has the following modules:

![Charles architecture](.gitbook/assets/arquitetura-charles-nova%20%283%29%20%281%29%20%282%29.png)

* `charlescd-ui:`  mirrors on front-end the workspace configuration, users, modules, hypothesis and boards. It is the platform graphical interface.  
* `charles-moove:` manages workspaces, users, modules, hypothesis and boards. It is the whole platform structure.   
* `charles-butler:` orchestrates and manages releases and deploys. 
* `charles-circle-matcher:`manages all created circles, and points out which circle each user belongs, based on their characteristics. 

