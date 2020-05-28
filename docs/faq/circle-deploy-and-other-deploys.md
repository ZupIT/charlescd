---
description: >-
  In this section, you will find an explanation about the difference between
  circle deploy and other deployments methods.
---

# Circle deploy x Other deploys

## Circle deploy x Traditional deploy

In traditional deploys, it's common that the application has to pass into different environments until it gets to production. With Charles, the circle deploy system works only in production environment. The release validation is fragmented according to selected circles, in other words, you can open gradually the access to your release to more and more circles. 

![Process of traditional deploy ](../.gitbook/assets/deploy-tradicional.png)

![Process of circle deploy](../.gitbook/assets/deploy_em_circulos%20%283%29.png)



## Circle deploy x Blue-green deploys

At blue-green deployment, it's possible to create two identical environments in your infrastructure, but with different versions of an application implemented in each other. In this way, it's possible to test your hypothesis that, once confirmed, can be migrated to one version to another. 

The main benefit is that the downtime is zero, which brings more safety for the transition process. Despite this, it represents a higher cost because this deployment demands the double of infrastructure to be executed.

With Charles, the circle deploy offers to teams more confidence and agility on launching new versions, with zero downtime and no additional costs on infrastructure. Besides, it's possible to filter, through circles, which users will validate your new application version.

![Process of blue-green deploy](../.gitbook/assets/blue_green%20%281%29.png)



![Process of circle deploy](../.gitbook/assets/deploy_em_circulos%20%281%29.png)

## Circle deploy x Canary release 

At canary release, it is done the gradual publishing of a software new version from routing within the infrastructure. As soon as the version is tested and it's more trustworthy, your access is expanded to more users from your base. 

However, this technique doesn't have any strategy for choosing the users during this expansion. For this reason, it becomes more difficult to manage the existing versions of your system, which contributes for not working with many versions, generating limits of possibilities to test hypothesis. 

With Charles, the circle deploy logic follows a pattern similar to parallel change. That means that, in the platform, you can also start opening the access to a release to a reduced number of users and goes gradually expanding as soon as the system pass into tests.  

The main difference of Charles is that, if you find any error ou you have a hypothesis alredy validated, the reverse is easily done: you can take users off the circle or make a deploy of another version with that group or even bring a version of your application to [**open sea**](https://docs.charlescd.io/v/v0.2.1-en/key-concepts#open-sea). 

![Process of Canary Release](../.gitbook/assets/deploy_em_circulos_x_canary_releases.png)

![Process of circle deploy](../.gitbook/assets/deploy_em_circulos.png)



