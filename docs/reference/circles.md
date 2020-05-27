# Circles

Circles are the main approach related to the **new deploy concept** brought by Charles. It enables user groups creation with several characteristics and promotes simultaneous application tests for a great number of possible users. 

![Circle generation with Charles deployments](../.gitbook/assets/circles_bg_white.jpg)

 Circles indicate client segmentation and also support the version management created for a specific audience. 

Once the right people are chosen to have access to your release associated to a circle, Charles will generate a [**series of business or performance metrics**](https://docs.charlescd.io/v/v0.2.1-en/reference/metrics). This information will give you better hypothesis results or even a better view on a feature in analysis and that will enable more assertive tests.

## Active and inactive circles

O que define se um círculo é ativo ou não é a existência de releases, isto é, de versões implantadas para aquele segmentação de usuários. Logo, os círculos ativos são aqueles que possuem releases implantadas, enquanto os círculos inativos ainda não possuem nenhuma delas.

## How to create circles?

To create a circle, you just have to follow these steps:

**1.** Click on Create Circle.  
**2.** Give a name to your circle.  
**3.** Define a segmentation.  
**4.** \[Optional\] Implement a release.

![Exemplo de como criar um c&#xED;rculo](../.gitbook/assets/criar-circulo.gif)

As segmentações são um conjunto de características que você define para agrupar seus usuários nos círculos do Charles. Para realizar essa ação, é possível segmentar seus usuários através do preenchimento de informações de forma manual ou por meio da importação de um arquivo csv.

Uma grande vantagem de utilizar as segmentações é porque, com elas, é possível fazer combinações lógicas entre vários atributos para criar diferentes tipos de públicos e, dessa forma, utilizá-los nos testes das hipóteses. Por exemplo, a partir da características “profissão” e “região”, pode-se criar um círculo de engenheiros da região norte, outro só com engenheiros do sudeste e um terceiro contendo todos os engenheiros do Brasil.

### **Manual segmentation**

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

![Exemplo de segmenta&#xE7;&#xE3;o manual](https://lh6.googleusercontent.com/5hg_2ZW34hb69J69-MtDNctjLJX5-gwBP9kgN6Bto9_tm2tK9DL-rgmvTleoVihRft37P2QmcA6MzBc3Uj_vguGM9VQVc9fhKEpittLr8LXxvThC3dewpNGsEYSHXp6KfhX8GGx_)

### **Segmentation by CSV importation**

Neste tipo de segmentação, é utilizada apenas a primeira coluna do csv para criar as regras. O único operador lógico suportado até o momento é o OR.

Na prática, essa modalidade permite que você possa, por exemplo, extrair de uma database externa os IDs dos clientes com um perfil específico e importá-los direto na plataforma do Charles.

## How to integrate circle with services?

Uma vez detectado o [círculo ao qual o usuário pertence](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/circulos/como-identificar-os-circulos), essa informação deve ser repassada para todas as próximas requisições através do parâmetro x-circle-id no header. Isso acontece porque o Charles detecta pelo ID do círculo para qual versão da aplicação uma determinada requisição deve ser encaminhada. Vejamos o exemplo abaixo:

![](../.gitbook/assets/17.png)

Na prática, em algum momento durante a iteração do usuário com a sua aplicação \(App1\) - como no login, por exemplo - o `charles-circle-matcher` \(_Circle\_Matcher_\) **-** deverá ser acionado para obter o círculo.

Com isso, o ID deve ser repassado como valor no parâmetro x-circle-id localizado no header da requisição das próximas chamadas \(App2\). O Charles é responsável por propagar essa informação que, quando recebida no Kubernetes, seja utilizada para redirecionar a requisição para a versão correspondente ao deploy realizado no círculo.

Caso o x-circle-id não seja repassado, todas as requisições serão redirecionadas para versões de “Mar Aberto”, ou seja, para releases padrões das suas aplicações sem uma segmentação específica.

### **Mix of services with different versions of my release** 

Para facilitar seu entendimento, vamos exemplificar com um um cenário onde a sua stack possui dois serviços: **Aplicação A** e **Aplicação B,** e os seus círculos devem fazer o uso das seguintes versões:

![](../.gitbook/assets/18.png)

Sendo assim, a lógica de redirecionamento utilizando o x-circle-id será:

1. O usuário envia no header: `x-circle-id=”Círculo QA”`. Nesse círculo, a chamada será redirecionada para a **versão X** do serviço **Aplicação A** e a **versão Y** do serviço **Aplicação B**. 
2. O usuário envia no header: `x-circle-id=”Circulo Dev”`. Nesse círculo, a chamada será redirecionada para a **versão Z** do serviço **Aplicação A e a versão Z** do serviço **Aplicação B.**

![](../.gitbook/assets/19.png)

## How to route your circles with Kubernetes Clusters? 

Para entendermos melhor como o **Charles** envolve o [Kubernetes](https://kubernetes.io/docs/home/) e o [Istio](https://istio.io/docs/) no roteamento de tráfego, considere o seguinte cenário onde existem dois círculos:

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

