# Círculos

Os círculos são a base para o **novo conceito de deploy** criado pelo Charles. Ao criá-los, é preciso definir um grupo de usuários e uma release.

![](../.gitbook/assets/conceito-de-deploy-em-circulos%20%286%29.png)

Eles não são apenas a representação da segmentação de clientes baseados em características específicas, eles também fazem a **gestão da nova versão implantada** para este público.

Uma vez escolhidas as pessoas certas para terem acesso à sua release associada ao círculo, o Charles irá gerar uma série de métricas de negócio ou desempenho. Essas informações te darão o poder de decisão sobre a hipótese, ou feature em análise, possibilitando testes mais assertivos**.**

## Círculos ativos e inativos

O que define se um círculo é ativo ou não é a existência de releases, isto é, de versões implantadas para aquele segmentação de usuários. Logo, os círculos ativos são aqueles que possuem releases implantadas, enquanto os círculos inativos ainda não possuem nenhuma delas.

## Como criar círculos?

Para você criar um círculo, basta fazer o seguinte passo a passo:

**1.** Clique em Create Circle.  
**2.** Dê um nome ao seu círculo.  
**3.** Defina uma segmentação.  
**4.** \[Opcional\] Implante uma release.

![Exemplo de como criar um c&#xED;rculo](../.gitbook/assets/criar-circulo.gif)

As segmentações são um conjunto de características que você define para agrupar seus usuários nos círculos do Charles. Para realizar essa ação, é possível segmentar seus usuários através do preenchimento de informações de forma manual ou por meio da importação de um arquivo csv.

Uma grande vantagem de utilizar as segmentações é porque, com elas, é possível fazer combinações lógicas entre vários atributos para criar diferentes tipos de públicos e, dessa forma, utilizá-los nos testes das hipóteses. Por exemplo, a partir da características “profissão” e “região”, pode-se criar um círculo de engenheiros da região norte, outro só com engenheiros do sudeste e um terceiro contendo todos os engenheiros do Brasil.

### **Segmentação manual**

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

### **Segmentação por importação de csv**

Neste tipo de segmentação, é utilizada apenas a primeira coluna do csv para criar as regras. O único operador lógico suportado até o momento é o OR.

Na prática, essa modalidade permite que você possa, por exemplo, extrair de uma database externa os IDs dos clientes com um perfil específico e importá-los direto na plataforma do Charles.

## Identificação de círculos

Se após a criação do círculo for necessária a utilização do Circle Matcher para testar suas regras de segmentação, você pode integrar nas suas aplicações o recurso Identify do módulo `charles-circle-matcher` para detectar os círculos aos quais o seu usuário pertence.

Por exemplo, dada a utilização dos seguintes parâmetros ao segmentar:

![](https://lh6.googleusercontent.com/q573-961WtpntVK8NfXXvPgzSPrxLwxjx3QXRqM3vBlHFM8nAoDkpn1KD26Zfw3_wJtjnhVldYcwRUUzhbveEvqJz6n16NQFkxi0S3hh8rk6Y7OUmWtnBOl_qJekzoymQ64mFF8k)

Ao realizar a requisição de identificação com as seguintes informações, círculos compatíveis serão retornados:

{% api-method method="get" host="https:" path="//api.charles-circle-matcher.com/identify" %}
{% api-method-summary %}
Identify
{% endapi-method-summary %}

{% api-method-description %}

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

O círculo “Stony Brook’s Citizens” foi criado para a identificar usuários que tenham como característica a chave “city” e o exato valor “Stony Brook”. Sendo assim, ele não estará na listagem ao realizar uma requisição para o Identify caso seja informado o body como no exemplo abaixo.

Outro ponto é que, quando o usuário não se enquadra em nenhuma segmentação, o sistema retorna indicando que ele se encaixa no “Mar Aberto”, isto é, em uma espécie de segmentação geral que inclui todos os usuários que estão fora de um círculo específico:

{% api-method method="get" host="https://" path="api.charles-circle-matcher.com/identify" %}
{% api-method-summary %}
Mar Aberto
{% endapi-method-summary %}

{% api-method-description %}

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

Uma boa prática é realizar essa identificação sempre que o usuário faz login na aplicação. Entretanto, isso pode ser alterado de acordo com a necessidade da sua regra de negócio.

## Como integrar círculos com serviços?

Uma vez detectado o [círculo ao qual o usuário pertence](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/circulos/como-identificar-os-circulos), essa informação deve ser repassada para todas as próximas requisições através do parâmetro x-circle-id no header. Isso acontece porque o Charles detecta pelo ID do círculo para qual versão da aplicação uma determinada requisição deve ser encaminhada. Vejamos o exemplo abaixo:

![](../.gitbook/assets/17.png)

Na prática, em algum momento durante a iteração do usuário com a sua aplicação \(App1\) - como no login, por exemplo - o `charles-circle-matcher` \(_Circle\_Matcher_\) **-** deverá ser acionado para obter o círculo.

Com isso, o ID deve ser repassado como valor no parâmetro x-circle-id localizado no header da requisição das próximas chamadas \(App2\). O Charles é responsável por propagar essa informação que, quando recebida no Kubernetes, seja utilizada para redirecionar a requisição para a versão correspondente ao deploy realizado no círculo.

Caso o x-circle-id não seja repassado, todas as requisições serão redirecionadas para versões de “Mar Aberto”, ou seja, para releases padrões das suas aplicações sem uma segmentação específica.

### **Mescla de serviços com versões diferentes na minha release**

Para facilitar seu entendimento, vamos exemplificar com um um cenário onde a sua stack possui dois serviços: **Aplicação A** e **Aplicação B,** e os seus círculos devem fazer o uso das seguintes versões:

![](../.gitbook/assets/18.png)

Sendo assim, a lógica de redirecionamento utilizando o x-circle-id será:

1. O usuário envia no header: `x-circle-id=”Círculo QA”`. Nesse círculo, a chamada será redirecionada para a **versão X** do serviço **Aplicação A** e a **versão Y** do serviço **Aplicação B**. 
2. O usuário envia no header: `x-circle-id=”Circulo Dev”`. Nesse círculo, a chamada será redirecionada para a **versão Z** do serviço **Aplicação A e a versão Z** do serviço **Aplicação B.**

![](../.gitbook/assets/19.png)

## Como rotear círculos com cluster de Kubernetes?

Para entendermos melhor como o **Charles** envolve o **Kubernetes** e o Istio no roteamento de tráfego, considere o seguinte cenário onde existem dois círculos:

* Moradores de Campinas \(identificado pelo ID 1234\);
* Moradores de Belo Horizonte \(identificado pelo ID 8746\).

Em ambos círculos foram implantadas releases do serviço chamado "application", entretanto com versões diferentes:

* Moradores de Campinas \(1234\): utiliza a versão v2.
* Moradores de Belo Horizonte \(8746\): utiliza a versão v3.

Além disso, existe uma versão default \(v1\) para usuários que não se encaixam em algum círculo específico.

Suponha que, ao realizar a requisição para identificação do usuário, seja retornado o id 8756. Com isso, essa informação deverá ser repassada nas próximas interações com serviços através do header x-circle-id. A imagem abaixo retrata como que, internamente, o Charles utiliza os recursos para rotear para a release correta:

![](../.gitbook/assets/20%20%281%29.png)

Ao realizar a implantação de uma versão em um círculo, o Charles realiza todas as configurações para que o roteamento seja feito da maneira correta. Entretanto, para entender melhor como ele acontece, vamos utilizar um cenário onde uma requisição vem de um serviço fora da stack, como mostra na figura abaixo:

1. A requisição será recebida pela Ingress, que realiza o controle do tráfego para a malha de serviços.  
2. Uma vez permitida a entrada da requisição, o Virtual Service consulta o conjunto de regras de roteamento de tráfego a serem aplicadas no host endereçado. Nesse caso, a avaliação acontece através da especificação do header x-circle-id, de maneira que o tráfego corresponda ao serviço "application".  
3. Além do serviço, também é necessário saber qual subconjunto definido no registro. Essa verificação é feita no Destination Rules.  
4. O redirecionamento do tráfego é realizado com base nas informações anteriores, chegando então à versão do serviço.  

Caso o x-circle-id não seja informado, existe uma regra definida no Virtual Service que irá encaminhar para a versão padrão \(v1\).

![](https://lh3.googleusercontent.com/lDpIwX99uSkIyT08s5R5d5wakyTpDjgc2NUmERB2M5HK2QVSXRsitpB5QXyMHTGUXtXGgG5Ib4xCO2WW1rn2Rhf5Jihuc7vZKT4A_5GLImUtwkS3fBw1EqbGafbIQgIKyQHLz_1t)





