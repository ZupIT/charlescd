# Circle Matcher

{% hint style="info" %}
Para facilitar a validação ou teste das regras criadas, o Charles possui na página dos círculos a área do _Circle Matcher._ 
{% endhint %}

Basta apenas preencher os parâmetros simulando o payload que descreveria o usuário e realizar as verificações. Caso existam círculos que correspondam, ele estará listado:

![Busca com correspond&#xEA;ncias](../.gitbook/assets/circle-matcher-ok-chrome-capture.gif)

Caso contrário, a resposta indicará que o usuário se encaixa no "Mar Aberto". O Charles define como Mar Aberto o ambiente com as versões padrões, onde todos os usuários que não se encaixam em círculos estão incluídos.

![](../.gitbook/assets/circle-matcher-open-sea-chrome-capture.gif)

