# Circle Matcher

O Circle Matcher possui um recurso te permite validar se os seus [**círculos**](circulos.md#como-criar-circulos) estão com segmentações coerentes. Além de isso, você também pode utilizá-lo em suas aplicações para determinar em qual círculo os seus usuários se encaixam.

{% hint style="info" %}
Uma boa prática é realizar essa identificação sempre que o usuário faz login na aplicação. Entretanto, isso pode ser alterado de acordo com a necessidade da sua regra de negócio.
{% endhint %}

### Identificando círculos através do CharlesCD

Utilizando a interface, existem duas formas de realizar essa verificação. Para isto, basta acessar menu _Circles_ dentro de um workspace e selecionar o ícone: 

![Identifica&#xE7;&#xE3;o do &#xED;cone do Circle Matcher](../.gitbook/assets/chrome-capture.jpg)

As duas formas de realizar essa validação são:

* **Default:** nessa opção, você vai adicionando manualmente chaves e valores que definem as características de um usuário de teste. E, com base nisso, ao executar o "**Try**", você receberá todos os círculos que ele se encaixa.  

![Testando a identifica&#xE7;&#xE3;o dos seus c&#xED;rculos atrav&#xE9;s da op&#xE7;&#xE3;o Default.](../.gitbook/assets/circle-matcher-default.gif)

* **JSON:** ocorre de maneira similar à opção anterior, a diferença é que você pode copiar e colar no **campo de payload** um **JSON** do seu ambiente produtivo ao invés de ir adicionando manualmente.

![Testando a identifica&#xE7;&#xE3;o dos seus c&#xED;rculos atrav&#xE9;s da op&#xE7;&#xE3;o JSON.](../.gitbook/assets/circle-matcher-json.gif)

{% hint style="warning" %}
Caso aconteça de você passar informações que estejam fora das condições lógicas configuradas nos círculos, o sistema irá retornar que aquele usuário está no círculo _Default_, ou seja, na versão padrão da sua aplicação.
{% endhint %}

## Identificação de círculos através da API

Você pode integrar nas suas aplicações o recurso **Identify** do módulo [`charle-moove`](https://github.com/ZupIT/charlescd/tree/master/moove) para detectar os círculos aos quais o seu usuário pertence.

Por exemplo, dada a utilização dos seguintes parâmetros ao segmentar:

![](https://lh6.googleusercontent.com/q573-961WtpntVK8NfXXvPgzSPrxLwxjx3QXRqM3vBlHFM8nAoDkpn1KD26Zfw3_wJtjnhVldYcwRUUzhbveEvqJz6n16NQFkxi0S3hh8rk6Y7OUmWtnBOl_qJekzoymQ64mFF8k)

Ao realizar a requisição de identificação com as seguintes informações, círculos compatíveis serão retornados:

{% api-method method="post" host="https:" path="//api.charles-moove.com/identify" %}
{% api-method-summary %}
Identify
{% endapi-method-summary %}

{% api-method-description %}
Método utilizado para identificar círculos, baseado em características de um usuário.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="X-Workspace-Id" type="string" required=true %}
Workspace's ID
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="state" type="string" required=false %}
NY
{% endapi-method-parameter %}

{% api-method-parameter name="profession" type="string" required=false %}
Lawyer 
{% endapi-method-parameter %}

{% api-method-parameter name="age" type="number" required=false %}
46 
{% endapi-method-parameter %}

{% api-method-parameter name="city" type="string" required=false %}
Stony Brook
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```
[
  {
    "id": "6577ae92-648c-11ea-bc55-0242ac130003",
    "name": "NY Lawyers"
  },
  {
    "id": "6577b112-648c-11ea-bc55-0242ac130003",
    "name": "Stony Brook's Citizens"
  }
]
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

Como no nosso exemplo existem círculos correspondentes com as informações sobre o usuário, o **`charles-moove`**está retornando uma lista com eles. Neste caso, dois círculos se encaixaram: NY Lawyers e Stony Brook’s Citizens.

Nessa requisição, apenas o parâmetro **`X-Workspace-Id`** é obrigatório. O corpo da requisição é totalmente flexível, porém vale lembrar que as chaves devem ter a mesma nomenclatura definida nas regras de segmentação do círculo. Veja no caso a seguir:

![](https://lh3.googleusercontent.com/FdPVIHDFeYJCkC_6Y1P3ZOBSqmNlGkl9q2_XyIayNKQo2Mp9IXBY7PzvpzW0Mej1P9Ox8AG12QiA1H0w5uozWP1UYWafcfwXLKBOf3G-ObIVoPHtYGOlWd5Ju01uLuScqtCn8qQ1)

O círculo “**Stony Brook’s Citizens**” foi criado para a identificar usuários que tenham como característica a chave **`city`** e o exato valor **`Stony Brook`**. Sendo assim, ele não estará na listagem ao realizar uma requisição para o **`Identify`** caso seja informado o corpo da requisição como no exemplo abaixo.

{% api-method method="post" host="https://" path="api.charles-circle-matcher.com/identify" %}
{% api-method-summary %}
Identify
{% endapi-method-summary %}

{% api-method-description %}
Método utilizado para identificar círculos, baseado em características de um usuário.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="X-Workspace-Id" type="string" required=true %}
Workspace's ID 
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="aGEee" type="number" required=false %}
46
{% endapi-method-parameter %}

{% api-method-parameter name="city" type="string" required=false %}
Stony Brook
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Listagem de todos os círculos aos quais o usuário pertence 
{% endapi-method-response-example-description %}

```
[
  {
    "id": "6577ae92-648c-11ea-bc55-0242ac130003",
    "name": "Default"
  }
]
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}



