# Defining a Workspace

The workspace allows you to segment CharlesCD's use in your team, it will define **personalized users permissions**, that will assure safety to your project.  

O workspace permite que você segmente o uso do CharlesCD dentro da sua empresa ou do seu time, definindo **permissões personalizadas dos usuários**, o que garante mais segurança para o seu projeto.

{% hint style="info" %}
You only need one installation and the teams will be able to use Charles with different configurations or you may even create a workspace to represent diferent development environment such as ratification, production, etc.  

Com apenas uma instalação, vários times podem utilizar o Charles com configurações distintas ou, se preferir, criar um workspace para representar ambientes de desenvolvimento diferentes como, por exemplo, de homologação, produção, etc. 
{% endhint %}

Each workspace has the following configuration: 

* Access definition and **user groups permissions**;
* Register on [**Docker Registry**](https://docs.charlescd.io/primeiros-passsos/definindo-workspace/docker-registry), [**Git**](https://docs.charlescd.io/primeiros-passsos/definindo-workspace/github) ****and ****[**Continuous Deployment \(CD\)**](https://docs.charlescd.io/referencia/configuracao-cd)**;**
* Customize a [**Circle Matcher**](../../referencia-1/circle-matcher.md)**;**
* Register your applications **metrics provider**. 

{% hint style="warning" %}
The **root** user gives you the permission to create a workspace. However, users with **mantainer** profile are able to configure with the necessary information as well.
{% endhint %}

