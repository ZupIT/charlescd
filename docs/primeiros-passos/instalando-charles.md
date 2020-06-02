# Instalando o Charles

{% hint style="info" %}
O processo de instalação foi criado considerando alguns casos de uso. Logo, para cada um deles, você encontrará um tutorial específico. Se for necessário instalar o CharlesCD de outra maneira, sugerimos conferir a seção de [**customização**](https://docs.charlescd.io/primeiros-passos/instalando-charles#customizacao-total) com _helm charts isolados_. 
{% endhint %}

## Introdução

### Componentes

A instalação do CharlesCD consiste nos seguintes componentes:

1. Módulos específicos da [**arquitetura do Charles**](https://docs.charlescd.io/#arquitetura-do-sistema)**.** 
2. **Keycloak**, usado para autenticação e autorização no projeto.

3. Um **banco PostgreSQL** que servirá os módulos de back-end \(`charlescd-moove`, `charlescd-butler` e `charlescd-villager`\) e o Keycloak. 
4. Um **Redis** para uso do `charlescd-villager`.

### Plataforma de Continuous Delivery 

Atualmente, o Charles tem suporte para duas plataformas de Continuous Delivery \(CD\):

* **Spinnaker:** caso você já tenha o seu próprio Spinnaker configurado, ele poderá ser reutilizado.
* **Octopipe:** plataforma nativa, criada pela equipe do CharlesCD para possibilitar uma instalação sem configuração prévia.

{% hint style="info" %}
Você pode saber mais sobre a **configuração do Spinnaker e do Octopipe** na seção [**Configuração de CD**](https://docs.charlescd.io/referencia/configuracao-cd).
{% endhint %}

## Principais casos de instalação 

### Caso 1: Instalação para testes

Esta é a instalação mais recomendada para quem nunca usou o CharlesCD antes e já quer ter o **primeiro contato em um ambiente de testes,** sem olhar ainda para escalabilidade ou segurança.

Neste caso, você irá utilizar: 

* um arquivo _yaml_ com todos os [**componentes**](https://docs.charlescd.io/primeiros-passos/instalando-charles#componentes);
* um _Load Balancer_ pré-configurado. 

Para criar esta estrutura, basta executar os arquivos em algum cluster pré-configurado, como minikube, GKE, EKS, etc. Os passos a serem executados são estes:

```text
kubectl create namespace charles

kubectl apply -f arquivo.yaml
```

Ao final do processo, você terá dentro do namespace `charles` todos os módulos do projeto e suas dependências instaladas da forma mais simples possível. 

{% hint style="danger" %}
Como essa instalação serve **apenas para o uso em ambiente de testes**, não recomendamos esse caso de instalação para ambientes produtivos porque ele não inclui cuidados como: backups do banco de dados, alta disponibilidade, entre outros.
{% endhint %}

### Caso 2: Instalação customizada

Nesta forma de instalação, é possível customizar alguns campos por meio do **nosso CLI** e de um arquivo de configuração que contém todos os campos disponíveis para edição. 

Customizando o arquivo, você tem algumas opções, como:

* Usar um banco de dados gerenciado.
* Adicionar novas credenciais de clusters.
* Alterar a versão do CharlesCD.
* Utilizar um Spinnaker já instalado previamente.
* Habilitar \(ou não\) o Load Balancer padrão.

Essa instalação pode ser usada t**anto para testes quanto para ambiente produtivos**, tudo vai depender dos valores que você definir no arquivo de configuração. Caso você não altere nada, terá o mesmo resultado da instalação citada anteriormente - para testes -.

### Caso 3: Instalação com Terraform

Esta forma de instalação é muito específica, indicada somente para quem já utiliza o Terraform para criar e versionar sua infraestrutura. 

Para esse caso, temos atualmente suporte para **GCP** e **AWS,** e estamos no processo de adicionar a **AZURE**. 

Nesse **repositório**, você encontra todos os recursos de banco de dados \(_PostgreSQL e Redis_\), além da execução de _helm releases_ dos nossos módulos já consumindo os valores gerados pelos outros resources. Tudo isso separado por cloud.

### Caso 4: Customização total

Recomendamos este tipo de instalação caso você queira editar mais campos dos que os disponibilizados pelo CLI ou ainda instalar módulos à parte para testes. Nesses casos, você pode acessar direto os **charts puros do produto**.

### Especificidades

Se você optar pela customização total, é preciso ter em mente algumas especificações:

#### **Ordem**

Apesar dos módulos do charles serem independentes entre si, existem casos em são necessárias algumas pré-configurações. Abaixo, descrevemos melhor cada uma delas: 

* `charlescd-moove`: este módulo exige um banco de dados \(_PostgreSQL_\) e que o _Keycloak_ esteja configurado. Nessa configuração, você pode customizar a **URL** do _Keycloak_, assim como o _client_ e _client-secret_. 

{% hint style="info" %}
Caso tenha instalado com o caso para testes ou com a customização do CLI, não será necessário seguir esses passos. 
{% endhint %}

* `charlescd-circle-matcher`: este módulo exige um redis instalado para funcionar.

