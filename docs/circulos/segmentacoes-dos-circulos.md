# Como segmentar e identificar os círculos?

{% hint style="warning" %}
As segmentações são um conjunto de características que você define para agrupar seus usuários nos círculos do Charles. 

É  possível segmentar seus usuários através do preenchimento de informações de **forma manual** ou por meio da **importação de um arquivo csv.**
{% endhint %}

Uma grande vantagem de utilizar as segmentações é porque, com elas, é possível fazer combinações lógicas entre vários atributos para criar diferentes tipos de públicos e, dessa forma, utilizá-los nos testes das hipóteses. Por exemplo, a partir da características “profissão” e “região”, pode-se criar um círculo de engenheiros da região norte, outro só com engenheiros do sudeste e um terceiro contendo todos os engenheiros do Brasil.

###  **Segmentação manual** 

Neste tipo de segmentação, você define as lógicas que o círculo deve seguir para compor um match com usuários que atendam às características pré-determinadas. 

Essas características podem ser definidas com base nas lógicas de: 

* Equal to
* Not Equal
* Lower Than
* Lower or equal to
* Higher than
* Higher or equal to
* Between
* Starts With

Isso significa que, ao setar na plataforma do Charles uma segmentação considerando um dessas variáveis acima, o sistema irá retornar com um círculo cuja base será composta por estes usuários. 

Vamos a alguns exemplos:

![](https://lh6.googleusercontent.com/5hg_2ZW34hb69J69-MtDNctjLJX5-gwBP9kgN6Bto9_tm2tK9DL-rgmvTleoVihRft37P2QmcA6MzBc3Uj_vguGM9VQVc9fhKEpittLr8LXxvThC3dewpNGsEYSHXp6KfhX8GGx_)

![](../.gitbook/assets/criar-segmento-manual.gif)

###  **Segmentação por csv**

Neste tipo de segmentação, é utilizada apenas a primeira coluna do csv para criar as regras. O único operador lógico suportado até o momento é o OR. 

Na prática, essa modalidade permite que você possa, por exemplo, extrair de uma database externa os IDs dos clientes com um perfil específico e importá-los direto na plataforma do Charles.

![](../.gitbook/assets/criar-segmento-csv.gif)

## Identificação dos círculos

Depois de segmentados os círculos, como você pode buscá-los dentro da plataforma do Charles? 

{% hint style="warning" %}
Se após a criação do círculo for necessária a utilização do Circle Matcher para testar suas regras de segmentação, você pode integrar nas suas aplicações o recurso Identify do módulo `charles-circle-matcher` para detectar os círculos aos quais  o seu usuário pertence.
{% endhint %}

Por exemplo, dada a utilização dos seguintes parâmetros ao segmentar:

![](https://lh6.googleusercontent.com/q573-961WtpntVK8NfXXvPgzSPrxLwxjx3QXRqM3vBlHFM8nAoDkpn1KD26Zfw3_wJtjnhVldYcwRUUzhbveEvqJz6n16NQFkxi0S3hh8rk6Y7OUmWtnBOl_qJekzoymQ64mFF8k)

  
Ao realizar a requisição de identificação com as seguintes informações, círculos compatíveis serão retornados:

{% api-method method="get" host="https:" path="//api.charles-circle-matcher.com/identify" %}
{% api-method-summary %}
Identify
{% endapi-method-summary %}

{% api-method-description %}
Este endpoint identifica a quais círculos o usuário pertence 
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="x-application-id" type="string" required=true %}
Workspace's ID
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-body-parameters %}
{% api-method-parameter name="Estado" type="string" required=false %}
NY
{% endapi-method-parameter %}

{% api-method-parameter name="Profissão" type="string" required=false %}
Lawyer 
{% endapi-method-parameter %}

{% api-method-parameter name="Idade " type="number" required=false %}
46 
{% endapi-method-parameter %}

{% api-method-parameter name="Cidade" type="string" required=false %}
Stony Brook
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```
{ 
    "circles": [ 
    { 
    "id": "6577ae92-648c-11ea-bc55-0242ac130003", "name": "NY Lawyers" 
},  { 
    "id": "6577b112-648c-11ea-bc55-0242ac130003", 
    "name": "Stony Brook's Citizens" 
    } 
  ] 
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

Como no nosso exemplo existem círculos correspondentes com as informações sobre o usuário, o charles-circle-matcher está retornando uma lista com eles. Neste caso, dois círculos se encaixaram: NY Lawyers e Stony Brook’s Citizens.

Nessa requisição, apenas o parâmetro x-application-id é obrigatório. O body é totalmente flexível, porém vale lembrar que as chaves devem ter a mesma nomenclatura definida nas regras de segmentação do círculo. Veja no caso a seguir:

![](https://lh3.googleusercontent.com/FdPVIHDFeYJCkC_6Y1P3ZOBSqmNlGkl9q2_XyIayNKQo2Mp9IXBY7PzvpzW0Mej1P9Ox8AG12QiA1H0w5uozWP1UYWafcfwXLKBOf3G-ObIVoPHtYGOlWd5Ju01uLuScqtCn8qQ1)

\*\*\*\*

O círculo “Stony Brook’s Citizens” foi criado para a identificar usuários que tenham como característica a chave “city” e o exato valor “Stony Brook”. Sendo assim, ele não estará na listagem ao realizar uma requisição para o Identify caso seja informado o body como no exemplo abaixo. 

{% hint style="warning" %}
Quando o usuário não se enquadra em nenhuma segmentação, o sistema retorna indicando que ele se encaixa no “**Mar Aberto**”. 

O Mar Aberto, no contexto do Charles, é como **segmentação geral** que inclui todos os usuários que estão fora de um círculo específico
{% endhint %}

Uma boa prática é realizar essa identificação sempre que o usuário faz login na aplicação. Entretanto, isso pode ser alterado de acordo com a necessidade da sua regra de negócio.

{% api-method method="get" host="https://" path="api.charles-circle-matcher.com/identify" %}
{% api-method-summary %}
Mar Aberto
{% endapi-method-summary %}

{% api-method-description %}
Esta endpoint demonstra como aparece o Mar Aberto no Charles 
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="x-application-id" type="string" required=true %}
Workspace's ID 
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="Idade " type="number" required=false %}
46
{% endapi-method-parameter %}

{% api-method-parameter name="Cidade" type="string" required=false %}
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
{
   "circles":  [
    {
       "id": 6577ae92-648c-11ea-bc55-0242ac130003", 
       "name": "NY Lawyers"
    },
    { 
       "id": 6577b1112-648c-11ea-bc55-0242ac30003",
       "name": "Stony Brook's Citizens"
    }
  ]
}   
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

