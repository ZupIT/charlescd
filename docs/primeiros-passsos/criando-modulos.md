# Creating your First Module

Uma vez criado e configurado o seu [**workspace**](https://docs.charlescd.io/primeiros-passsos/definindo-workspace), também é necessário adicionar os módulos com os quais pretende trabalhar suas aplicações. Para isso, basta seguir o passo a passo abaixo:

1. Clique na opção **Modules** que aparece na barra lateral esquerda da página inicial; 
2. Clique em **Create module**;
3. Defina um **nome** para o módulo;
4. Digite um **git address** para seu módulo;
5. Selecione uma **git configuration** para o módulo. Exemplo: github-test;
6. Selecione uma **registry configuration** para o módulo. Exemplo: registry-example;
7. Selecione uma **k8s configuration.** Exemplo: kubernetes example;
8. Por fim, preencha os campos com componentes do kubernetes e o módulo está criado.

## Componentes 

{% hint style="warning" %}
Componentes são a abstração das aplicações, sendo que cada componente corresponde à uma aplicação daquele módulo, e cada um de seus componentes tem sua própria configuração.
{% endhint %}

### Configuração

Para cadastrar um componente é necessário apenas escolher o nome do seu componente e salvar.

### Limites de saúde

Para cada componente é possível cadastrar alguns limites para análise da saúde do componente. 

É possível cadastrar os limites de Latência e percentagem de erros HTTP daquele componente, e quando esses limites forem atingidos, ou estiverem à menos de 10% de serem atingidos, você receberá alertas sobre o status daquele componente para o círculo que demonstra o problema.

