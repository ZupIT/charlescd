# Instalando o Charles

{% hint style="info" %}
O processo de instalação foi criado considerando alguns casos de uso em que, para cada um deles, você encontrará um tutorial específico. Se for necessário instalar o CharlesCD de outra maneira, sugerimos conferir a seção de [**customização**](https://docs.charlescd.io/primeiros-passos/instalando-charles#customizacao-total) com os helm charts isolados. 
{% endhint %}

## Introdução

### Componentes

A instalação do CharlesCD consiste nos seguintes componentes:

1. Sete módulos específicos da [**arquitetura do Charles**](https://docs.charlescd.io/#arquitetura-do-sistema)**;** 
2. **Keycloak**, usado para autenticação e autorização no produto;

3. Um **banco PostgreSQL** para os módulos de back-end\( `charles-application`, `charles-circle-matcher`, deploy e villager\) e do Keycloak; 
4. Um **Redis** para uso do [**Circle Matcher**](https://docs.charlescd.io/referencia/circle-matcher). 

### Plataforma de Continuous Delivery 

Atualmente, o Charles tem suporte para duas plataformas de Continuous Delivery \(CD\):

* **Spinnaker:** caso você já tenha o seu spinnaker configurado, você pode reutilizar com nossa instalação. 
* **Octopipe:** plataforma nativa, criada pela equipe do Charles para possibilitar uma instalação sem configuração prévia

{% hint style="info" %}
Você pode saber mais sobre a **configuração do Spinnaker e do Octopipe** na seção [**Configuração de CD**](https://docs.charlescd.io/referencia/configuracao-cd).
{% endhint %}

## Principais casos de instalação 

### Caso 1: Instalação de testes

Esta é a instalação mais recomendada para quem nunca usou o Charles antes e já quer ter o **primeiro contato em um ambiente de testes,** sem olhar ainda para escalabilidade ou segurança.

Neste caso, você irá utilizar: 

* Utilizar um arquivo yaml com todos os [**componentes**](https://docs.charlescd.io/primeiros-passos/instalando-charles#componentes);
* Usar um Load Balancer pré-configurado. 

Para criar esta estrutura, basta executar os arquivos em algum cluster pré-configurado, como minikube, GKE, EKS, etc. Os passos a serem executados são estes:

```text
kubectl create namespace charles

kubectl apply -f arquivo.yaml
```

Ao final do processo, você terá dentro do namespace Charles todos os módulos do produto e suas dependências instalados da forma mais simples possível. 

{% hint style="danger" %}
Como essa instalação serve apenas para o uso em ambiente de testes, não recomendamos esse caso de instalação para ambientes produtivos porque ele não inclui cuidados de backups do banco de dados, alta disponibilidade, entre outros.
{% endhint %}

### 

### Caso 2: Instalação customizada

Nesta forma de instalação, é possível customizar alguns campos por meio do **nosso CLI** e de um arquivo de configuração que contém todos os campos disponíveis para edição. 

Customizando o arquivo, você tem algumas opção, como: 

* Usar um banco de dados gerenciado; 
* Adicionar novas credenciais de clusters;
* Mudar a versão do CharlesCD;
* Utilizar um Spinnaker já instalado previamente;
* Habilitar \(ou não\) o load balancer padrão.

Essa instalação pode ser usada tanto para testes quanto para ambiente produtivos, tudo vai depender dos valores que você definir no arquivo de configuração. Caso você não altere nada, terá o mesmo resultado da instalação com arquivo único.

### 

### Caso 3: Instalação Terraform

Esta é a uma forma de instalação é muito específica, indicada somente para quem utiliza o Terraform para criar e versionar sua infraestrutura. 

Para esses casos, temos atualmente suporte para GCP e AWS e estamos no processo de adicionar a AZURE. 

Nesse **repositório**, você encontra todos os recursos de banco de dados e Redis, além da execução de helm releases dos nossos módulos já consumindo os valores gerados pelos outros resources. Tudo isso separado por cloud.

## Customização total

Recomendamos este tipo de instalação caso você queira editar mais campos dos que os disponibilizados pelo CLI ou ainda instalar módulos à parte para testes. Nesses casos, você pode acessar direto os **charts puros do produto**.

### Especificidades

Se você optar pela customização total, é preciso ter em mente algumas especificações:

#### **Ordem**

Apesar dos módulos do charles serem independentes entre si, existem casos em são necessárias algumas pré-configurações. Abaixo, descrevemos melhor cada uma delas: 

* `Charles-moove`: este módulo exige que o keycloak esteja configurado para funcionar. Nessa configuração, você pode customizar a URL do keycloak, assim como o client e client-secret. 

{% hint style="info" %}
Caso tenha instalado com CLI ou arquivo único, não será necessário seguir esses passos. 
{% endhint %}

* `Charles-circle-matcher`: este módulo exige um redis instalado para funcionar.

