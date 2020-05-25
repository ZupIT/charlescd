# Criando seu Primeiro Módulo

Depois de criar e configurar o seu workspace, agora é necessário adicionar os módulos. 

{% hint style="info" %}
Um **módulo** é a sua aplicação que está armazenada em um repositório do ****[**Git cadastrado anteriormente**](definindo-workspace/github.md).
{% endhint %}

Para adicioná-los, acesse o menu **Modules** __no **workspace** desejado, e __siga os seguintes passos:

* **Nome**: o nome do módulo deve ser o mesmo nome do seu repositório. 
* **Git URL**: informe a URL do seu repositório. Por exemplo: [https://github.com/ZupIT/charlescd](https://github.com/ZupIT/charlescd).

Se seu repositório tem várias aplicações, cadastre-as como componentes e informe: 

* **Nome**: o nome da aplicação, conforme está no repositório.
* **Métricas**: latência \(ms\) e erro HTTP \(%\). Em ambos os casos, deve-se informar um valor de risco que você gostaria de ser alertado caso seu componente alcançasse ou ultrapassasse.

## Componentes 

{% hint style="info" %}
Componentes são abstrações das aplicações. Se dentro do seu repositório há múltiplas aplicações, cada componente corresponderá a uma delas.
{% endhint %}

### Métricas de saúde

Para cada componente é possível cadastrar as seguintes métricas para análise de saúde: **latência** \(ms\) e **erro HTTP** \(%\). Quando os limites forem atingidos, ou estiverem à menos de 10%, você receberá um alerta informando o estado da sua aplicação no círculo que demonstra o problema.

