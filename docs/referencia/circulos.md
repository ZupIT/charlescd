# Círculo

Os círculos são o principal diferencial do [**novo conceito de deploy**](https://meet.google.com/linkredirect?authuser=0&dest=https%3A%2F%2Fdocs.charlescd.io%2Ffaq-1%2Fconceito-de-deploy-em-circulos) trazido pelo Charles. Ele possibilita a criação de grupos de usuários a partir de diversas características e, dessa forma, promove testes simultâneos de aplicações para o maior número possível de usuários.

![Representa&#xE7;&#xE3;o dos c&#xED;rculos gerados no Charles](../.gitbook/assets/circles_bg_white.jpg)

Além de indicar as segmentações de clientes, os círculos também auxiliam na gestão de versões implantadas para este público.

Uma vez escolhidas as pessoas certas para terem acesso à sua release associada ao círculo, o Charles irá gerar uma [**série de métricas**](https://meet.google.com/linkredirect?authuser=0&dest=https%3A%2F%2Fdocs.charlescd.io%2Freferencia-1%2Fmetricas) ****de negócio ou desempenho. Essas informações te darão maior visibilidade dos resultados de uma hipótese ou feature em análise, possibilitando testes mais assertivos**.**

## Círculos ativos e inativos

O que define se um círculo é ativo ou não, é a existência de releases, isto é, de versões implantadas para aquela segmentação de usuários. Por isso, os círculos ativos são os que possuem releases implantadas, enquanto os círculos inativos ainda não possuem nenhuma.

![ Filtro de estado do c&#xED;rculo entre Ativo e Inativo.](../.gitbook/assets/chrome-capture-2-.gif)

## Como criar círculos?

Para você criar um círculo, siga os seguintes passos:

**1.** Clique em **Create Circle**.  
**2.** Dê um nome ao seu círculo.  
**3.** Defina uma segmentação.  
**4.** \[Opcional\] Implante uma release.

![Exemplo de como criar um c&#xED;rculo](../.gitbook/assets/criar-circulo.gif)

As segmentações são um conjunto de características que você define para agrupar seus usuários nos círculos. Para realizar essa ação, é possível segmentar seus usuários através do **preenchimento de informações de forma manual** ou por meio da **importação de um arquivo CSV**.

{% hint style="info" %}
Uma **grande vantagem de utilizar as segmentações** é a possibilidade fazer combinações lógicas entre vários atributos para criar diferentes categorias de públicos e, dessa forma, utilizá-los nos testes das hipóteses. Por exemplo, a partir da características “_profissão_” e “_região_”, pode-se criar um círculo de engenheiros da região norte, outro só com engenheiros do sudeste e um terceiro contendo todos os engenheiros do Brasil.
{% endhint %}

### **Segmentação manual**

Nesta segmentação, você define as lógicas que o círculo deve seguir para compor um match com usuários que atendam às características pré-determinadas.

Essas características podem ser definidas com base nas lógicas de:

* Equal to
* Not Equal
* Lower Than
* Lower or equal to
* Higher than
* Higher or equal to
* Starts With

Vamos a alguns exemplos:

![](../.gitbook/assets/chrome-capture-1-.jpg)

### **Segmentação por importação de CSV**

Nesta segmentação, é utilizada apenas a primeira coluna do CSV para criar as regras. ****Sendo assim, a primeira linha da primeira coluna deve conter o nome da chave e a mesma deve ser informada no campo _key._

![](../.gitbook/assets/image%20%282%29.png)

Depois de ter feito o upload do arquivo e salvado as configurações, aparecerá um overview demonstrando como está sua segmentação:

![](../.gitbook/assets/image%20%281%29.png)

Essa modalidade permite, por exemplo, extrair de uma base externa de IDs dos clientes um perfil específico e importá-los direto na plataforma do Charles. 

{% hint style="warning" %}
O único operador lógico suportado nesta segmentação é o OR.
{% endhint %}

## Como integrar círculos com serviços?

Uma vez detectado o [**círculo ao qual o usuário pertence**](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/circulos/como-identificar-os-circulos), essa informação deve ser repassada para todas as próximas requisições através do parâmetro **`x-circle-id`** no header. Isso acontece porque o Charles detecta pelo ID do círculo para qual versão da aplicação uma determinada requisição deve ser encaminhada. Vejamos o exemplo abaixo:

![](../.gitbook/assets/como_integrar_circulos_com_servicos%20%281%29.png)

Na prática, em algum momento durante a interação do usuário com a sua aplicação \(**`App1`**\) -  por exemplo, o login - o serviço **`Identify`** do **`charles-moove`** deverá ser acionado para obter o círculo.

Com isso, o ID deve ser repassado como valor no parâmetro **`x-circle-id`** localizado no header de todas as próximas chamadas dos seus serviços \(**`App2`**\). O Charles é responsável por propagar essa informação porque quando recebida no Kubernetes, será utilizada para redirecionar a requisição para a versão correspondente à release associada ao círculo.

Caso o **`x-circle-id`** não seja repassado, todas as requisições serão redirecionadas para versões **Default**, ou seja, para releases padrões das suas aplicações sem uma segmentação específica.

### **Mescla de serviços com versões diferentes na minha release**

Para facilitar o entendimento, vamos exemplificar com um cenário onde o seu ambiente possui dois serviços: **Aplicação A** e **Aplicação B** e os seus círculos devem fazer o uso das seguintes versões:

![](../.gitbook/assets/versoes_diferentes_na_minha_release%20%281%29.png)

Sendo assim, a lógica de redirecionamento utilizando o **`x-circle-id`**será:

1. O usuário envia no header: `x-circle-id="Círculo QA"`. Nesse círculo, a chamada será redirecionada para a **versão X** do serviço **Aplicação A** e a **versão Y** do serviço **Aplicação B**. 
2. O usuário envia no header: `x-circle-id=”Circulo Dev”`. Nesse círculo, a chamada será redirecionada para a **versão Z** do serviço **Aplicação A e a versão Z** do serviço **Aplicação B.**

![](../.gitbook/assets/versoes_diferentes_na_minha_release_ii.png)

## Como rotear círculos com cluster de Kubernetes?

O **Charles** envolve o [**Kubernetes**](https://kubernetes.io/docs/home/) ****e o [**Istio**](https://istio.io/docs/) ****no roteamento de tráfego, considere o seguinte cenário onde existe dois círculos:

* Moradores de Campinas \(identificado pelo ID 1234\);
* Moradores de Belo Horizonte \(identificado pelo ID 8746\).

Em ambos os círculos foram implantadas releases do serviço chamado "**application**", mas com versões diferentes:

* Moradores de Campinas \(1234\): utiliza a versão v2.
* Moradores de Belo Horizonte \(8746\): utiliza a versão v3.

Além disso, existe uma versão default \(v1\) para usuários que não se encaixam em algum círculo específico.

Suponha que, ao realizar a requisição para identificação do usuário, seja retornado o id 8756. Com isso, essa informação deverá ser repassada nas próximas interações com serviços através do header `x-circle-id`. A imagem abaixo retrata como o Charles utiliza internamente os recursos para rotear a release correta: 

![](../.gitbook/assets/cluster_de_kubernetes%20%281%29.png)

Ao realizar a implantação de uma versão em um círculo, o Charles realiza todas as configurações para que o roteamento seja feito da maneira correta. Para entender melhor como ele acontece, vamos utilizar um cenário onde uma requisição vem de um serviço fora da stack, como mostra na figura acima. 

A requisição será recebida pela Ingress, que realiza o controle do tráfego para a malha de serviços. 

1. Uma vez permitida a entrada da requisição, o Virtual Service consulta o conjunto de regras de roteamento de tráfego a serem aplicadas no host endereçado. Nesse caso, a avaliação acontece através da especificação do header `x-circle-id`de maneira que o tráfego corresponda ao serviço "**application**".  
2. Além do serviço, também é necessário saber qual subconjunto definido no registro. Essa verificação é feita no __**Destination Rules.**  
3. O redirecionamento do tráfego é realizado com base nas informações anteriores, chegando então à versão do serviço.   
4. Caso o `x-circle-id` não seja informado, existe uma regra definida no _Virtual Service_ que irá encaminhar para a versão padrão \(v1\).

