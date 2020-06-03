# Defining a Workspace

The workspace allows you to segment CharlesCD's use in your team, defining **personalized users permissions** that will assure safety to your project.

{% hint style="info" %}
You need only one installation, and the teams will be able to use Charles with different configurations, or you may create a workspace to represent different development environments, such as staging, production, etc.
{% endhint %}

Each workspace has the following configuration:

* Access control and **user groups permissions**;
* Register on [**Docker Registry**](https://docs.charlescd.io/v/v0.2.1-en/get-started/defining-a-workspace/docker-registry), [**Git**](https://docs.charlescd.io/v/v0.2.1-en/get-started/defining-a-workspace) **and** [**Continuous Deployment \(CD\)**](https://docs.charlescd.io/referencia/configuracao-cd);
* Customize the [**Circle Matcher**](../../reference/circle-matcher.md);
* Register your applications [**metrics provider**.](https://docs.charlescd.io/v/v0.2.1-en/referencia-1/metricas/provedor-metrica) 

{% hint style="warning" %}
The **root** user gives you the permission to create a workspace. However, users with **mantainer** profile are able to configure with the necessary information as well.
{% endhint %}

