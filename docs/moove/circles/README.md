---
description: Entendendo a estrutura de círculos
---

# Círculos

Círculos são segmentações de clientes baseados em características.

{% hint style="info" %}
É possível fazer combinações lógicas entre vários atributos para criar diferentes tipos de públicos e utilizá-los nos testes das hipóteses.
{% endhint %}

Por exemplo, dada um software de odontologia que possui clientes em Minas Gerais, caso exista a necessidade de testar uma nova _feature,_ a seguinte estratégia poderia ser seguida:

Segmentação da base de usuários em dois círculos: _dentistas de Uberlândia e de Belo Horizonte._ Após gerar e validar uma nova versão, ela pode ser disponibilizada para _dentistas de Uberlândia_. Esse será o primeiro contato com os clientes, e, a partir disso, métricas podem ser extraídas e analisadas. Caso a hipótese mostre uma entrega de valor, pode-se expandir essa versão também para o círculo de dentistas Belo Horizonte.

![Cria&#xE7;&#xE3;o de c&#xED;rculo](../../.gitbook/assets/chrome-capture-2.gif)

Por fim, uma vez que todas as validações foram bem sucedidas, a versão pode ser implantada em **mar aberto**, ou seja, todos os outros clientes. 🚀

{% hint style="info" %}
Durante as validações se a expansão da versão para novos círculos não fizer sentido, basta executar o undeploy. 🙌
{% endhint %}

