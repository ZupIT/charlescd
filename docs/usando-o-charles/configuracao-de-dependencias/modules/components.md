---
description: >-
  Componentes são a abstração das aplicações, sendo que cada componente
  corresponde à uma aplicação daquele módulo, e cada um de seus componentes tem
  sua própria configuração.
---

# Componentes

## Configuração

Para cadastrar um componente tudo que é preciso é escolher o nome do seu componente e salvar.

{% hint style="warning" %}
O nome do componente **deve ser** o mesmo da imagem Docker gerada no seu registry.
{% endhint %}

### Limites de saúde

Para cada componente é possível cadastrar alguns limites para análise da saúde do componente. É possível cadastrar os limites de Latência e percentagem de erros HTTP daquele componente, e quando esses limites forem atingidos, ou estiverem à menos de 10% de serem atingidos, você receberá alertas sobre o status daquele componente para o círculo que demonstra o problema.

{gif cadastrando um componente}

