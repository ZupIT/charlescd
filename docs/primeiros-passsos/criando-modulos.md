# Creating your First Module

After creating and configuring your workspace, it is necessary to add the modules. _Depois de criar e configurar o seu workspace, agora é necessário adicionar os módulos._ 

{% hint style="info" %}
A **module** is your application stored in a Git repository, previously registered. Um **módulo** é a sua aplicação que está armazenada em um repositório do ****[**Git cadastrado anteriormente**](definindo-workspace/github.md).
{% endhint %}

To add it, access the menu Modules on your workspace and follow the steps: _Para adicioná-los, acesse o menu **Modules** no **workspace** desejado, e siga os seguintes passos:_

* **Name**: the module name must be your same repository name; 
* **Git URL**:  add your repository's URL. For example: [https://github.com/ZupIT/charlescd](https://github.com/ZupIT/charlescd).

If you have a lot of applications on your repository, register them with the components and add the following: _Se seu repositório tem várias aplicações, cadastre-as como componentes e informe:_ 

* **Name**: application's name, the same on your repository;
* **Metrics**: latency \(ms\) and HTTP error \(%\). Both cases you must add a risk value that you want to receive an alert for if your component reaches or surpasses the rate. 

_Em ambos os casos, deve-se informar um valor de risco que você gostaria de ser alertado caso seu componente alcançasse ou ultrapassasse._

## Components

{% hint style="info" %}
Components are the applications abstractions. If in your repository are lots of applications, every component will match each one of them. _Componentes são abstrações das aplicações. Se dentro do seu repositório há múltiplas aplicações, cada componente corresponderá a uma delas._
{% endhint %}

### Health metrics

For every component is possible to register metrics for health analysis: **latency** \(ms\) and **HTTP error** \(%\). When the limits are reached, or at least 10%, you will receive an alert that will show your  application status on the circle that may have an issue. 

_Para cada componente é possível cadastrar as seguintes métricas para análise de saúde: **latência** \(ms\) e **erro HTTP** \(%\). Quando os limites forem atingidos, ou estiverem à menos de 10%, você receberá um alerta informando o estado da sua aplicação no círculo que demonstra o problema._

