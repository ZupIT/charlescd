# Creating your First Module

After creating and configuring your workspace, it is necessary to add the modules. _Depois de criar e configurar o seu workspace, agora é necessário adicionar os módulos._ 

{% hint style="info" %}
A **module** is your application stored in a Git repository, previously registered. Um **módulo** é a sua aplicação que está armazenada em um repositório do ****[**Git cadastrado anteriormente**](defining-a-workspace/github.md).
{% endhint %}

To add it, access the menu Modules on your workspace and follow the steps:

* **Name**: the module name must be your same repository name; 
* **Git URL**:  add your repository's URL. For example: [https://github.com/ZupIT/charlescd](https://github.com/ZupIT/charlescd).

If you have a lot of applications on your repository, register them with the components and add the following: 

* **Name**: application's name, the same on your repository;
* **Metrics**: latency \(ms\) and HTTP error \(%\). Both cases you must add a risk value that you want to receive an alert for if your component reaches or surpasses the rate. 

In both cases, you need to inform the risk value you'd like to be alerted in case your component reach it or overtake it. 

![Creating a module screen](../.gitbook/assets/criac-a-o-de-modulo.png)

## Components

{% hint style="info" %}
Components are the applications abstractions. If in your repository are lots of applications, and every component will match each one of them.
{% endhint %}

### Health metrics

For every component is possible to register metrics for health analysis: **latency** \(ms\) and **HTTP error** \(%\). When the limits are reached, or at least 10%, you will receive an alert that will show your  application status on the circle that may have an issue. 

