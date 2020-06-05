# Instalando o Charles

{% hint style="info" %}
O processo de instalação foi criado considerando alguns casos de uso. Logo, para cada um deles, você encontrará um tutorial específico. Se for necessário instalar o CharlesCD com algumas customizações, sugerimos conferir a seção de [**instalação com helm charts**](https://docs.charlescd.io/v/v0.2.7/primeiros-passos/instalando-charles#caso-2-instalacao-com-helm-charts). 
{% endhint %}

## Introdução

### Componentes

A instalação do CharlesCD consiste nos seguintes **componentes**:

1. Módulos específicos da [**arquitetura do Charles**](https://docs.charlescd.io/v/v0.2.7/#arquitetura-do-sistema)**.** 
2. **Keycloak**, usado para autenticação e autorização no projeto.

3. Um **banco PostgreSQL** que servirá os módulos de back-end \(`charlescd-moove`, `charlescd-butler` e `charlescd-villager`\) e o Keycloak. 
4. Um **Redis** para uso do `charlescd-villager`.

### Plataforma de Continuous Delivery 

Atualmente, o Charles tem suporte para duas plataformas de Continuous Delivery \(CD\):

* **Spinnaker:** caso você já tenha o seu próprio Spinnaker configurado, ele poderá ser reutilizado.
* **Octopipe:** plataforma nativa, criada pela equipe do CharlesCD para possibilitar uma instalação sem configuração prévia.

{% hint style="info" %}
Você pode saber mais sobre a **configuração do Spinnaker e do Octopipe** na seção [**Configuração de CD**.](https://docs.charlescd.io/v/v0.2.7/referencia/configuracao-cd)
{% endhint %}

## Principais casos de instalação 

### Caso 1: Instalação rápida 

Esta é a instalação mais recomendada para quem nunca usou o CharlesCD antes e já quer ter o **primeiro contato em um ambiente de testes,** sem olhar ainda para escalabilidade ou segurança.

Neste caso, você irá utilizar: 

* um arquivo _yaml_ com todos os [**componentes**](https://docs.charlescd.io/v/v0.2.7/primeiros-passos/instalando-charles#componentes);
* um _Load Balancer_ pré-configurado. 

Para criar esta estrutura, basta executar os arquivos em algum cluster pré-configurado, como minikube, GKE, EKS, etc. Os passos a serem executados são estes:

```text
kubectl create namespace charles

kubectl apply -f arquivo.yaml
```

Ao final do processo, você terá dentro do namespace `charles` todos os módulos do projeto e suas dependências instaladas da forma mais simples possível. No link, você encontra os [**arquivos no nosso repositório**](https://raw.githubusercontent.com/ZupIT/charlescd/master/install/helm-chart/single-file.yaml). 

{% hint style="danger" %}
Como essa instalação serve **apenas para o uso em ambiente de testes**, não recomendamos esse caso de instalação para ambientes produtivos porque ele não inclui cuidados como: backups do banco de dados, alta disponibilidade, entre outros.
{% endhint %}

### 

### Caso 2: Instalação com helm charts

Esta é a instalação indicada para quem possui uma infraestrutura já montada devido a um ambiente mais complexo ou possua algumas limitações de segurança e/ou escalabilidade, exigindo uma **customização mais completa da instalação** do CharlesCD.

### Pré-requisitos 

Para realizar o processo, é necessário ter os seguintes programas: 

* Kubectl
* Helm 

### Como funciona

Neste tipo de instalação, o principal diferencial é a customização. Para isso, disponibilizamos um **template helm** com todos os campos disponíveis para alteração, incluindo os de banco de dados e recursos consumidos. 

Você encontra aqui toda a [**documentação dos campos editáveis**](https://github.com/ZupIT/charlescd/blob/master/install/helm-chart/). 

{% hint style="info" %}
É importante lembrar que, caso não seja feita nenhuma customização, o resultado final será igual ao do **caso 1** em que, por padrão, instalamos o PostgreSQL, Redis, Keycloak e Octopipe. 

Por isso, não deixe de customizar os campos caso queira algo gerenciável. 
{% endhint %}

Para realizar a instalação, basta executar o comando abaixo depois de customizar os campos:

```text
// customize tudo que precisa no arquivo values.yaml antes de executar o seguinte comando
helm install charlescd <repo-folder> -n <namespace>
```



