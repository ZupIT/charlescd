# Criando seu Primeiro Módulo

Uma vez criado e configurado o seu [**workspace**](https://docs.charlescd.io/primeiros-passsos/definindo-workspace), também é necessário adicionar os módulos. 

{% hint style="info" %}
Um **módulo** nada mais é que a sua aplicação que está armazenada em um repositório do ****[**Git cadastrado anteriormente**](definindo-workspace/github.md).
{% endhint %}

Para isso, basta acessar o menu _Modules_ no _workspace_ desejado, e __seguir os seguintes passos:

* **Nome**: o nome do módulo deve ser o mesmo nome do seu repositório. 
* **Git URL**: informe a URL do seu repositório. Por exemplo: [https://github.com/ZupIT/charlescd](https://github.com/ZupIT/charlescd).

Caso seu repositório tenha várias aplicações, as cadastre como componentes informando:

* **Nome**: o nome da aplicação, conforme está no repositório.
* **Métricas**: latência \(ms\) e erro HTTP \(%\). Em ambos os casos, deve-se informar um valor de risco que você gostaria de ser alertado caso seu componente alcançasse ou ultrapassasse.

## Componentes 

{% hint style="info" %}
Componentes são abstrações das aplicações. Dentro do seu repositório, caso ele tenha múltiplas aplicações, cada componente corresponderá à uma delas.
{% endhint %}

### Métricas de saúde

Para cada componente é possível cadastrar as seguintes métricas para análise de saúde: **latência** \(ms\) e **erro HTTP** \(%\). Quando os limites forem atingidos, ou estiverem à menos de 10%, você receberá alerta informando o estado da sua aplicação no círculo que demonstra o problema.

