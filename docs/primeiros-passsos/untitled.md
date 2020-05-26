# Instalando o Charles \(v2\)

Pensamos e desenvolvemos a instalação do produto visando alguns casos de uso, para cada caso aconselhamos um método, porém, caso sua necessidade fuja desses casos temos os helm charts isolados para customização.

## Componentes

A instalação do Charles no final consiste nos seguintes componentes:

* Sete módulos específicos do Charles, sendo eles:
  * Darwin-application
  * Darwin-circle-matcher
  * Darwin-deploy
  * Darwin-notifications
  * Darwin-ui-legacy
  * Darwin-ui-new
  * Darwin-villager
* Um banco Postgres para os módulos de back-end\(application, circle-matcher, deploy e villager\) e Keycloak
* Um Redis para uso do Circle Matcher.
* Keycloak, usado para autenticação e autorização no produto

Hoje temos suporte para duas plataformas de continuous delivery

* Spinnaker, plataforma largamente usada e com boa documentação, caso você já tenha o seu spinnaker configurado você pode reutilizar com nossa instalação.
* Octopipe, plataforma gerada pela nossa equipe do Charles, veio da necessidade de ter uma alternativa nativa ao produto, onde o usuário não precisa configurar nada, além de ter um consumo de recursos muito menor que o spinnaker.

Agora vamos aprofundar nos casos de uso e a forma de instalação mais adequada para cada um desses.

### Caso 1 - Instalação de testes

Em um cenário onde você nunca usou o Charles e quer ter o primeiro contato em um ambiente de testes, sem grandes preocupações de escalabilidade ou segurança, temos a instalação utilizando um arquivo yaml com todos os componentes e também com um Load Balancer pré configurado. Basta executar em algum cluster pré configurado \(minikube, GKE, EKS, etc.\)

Execute os seguintes passos:

```text
kubectl create namespace charles

kubectl apply -f arquivo.yaml
```

No final do processo você terá dentro do namespace Charles todos os módulos do produto mais suas dependências instaladas da forma mais simples possível. E por isso não recomendamos essa forma de instalação para ambientes produtivos, o Postgres, Redis e Nginx foram pensados nessa instalação para serem leves e fáceis de serem aplicados. Então não cuidamos de backups do banco, alta disponibilidade, etc.

### Caso 2 - Instalação customizada

Aqui temos um cenário onde você pode customizar alguns campos da instalação para adequar ao seu uso, toda a customização é feita através do nosso cli e um arquivo de configuração contendo todos os campos possíveis de serem editados.

Aqui abrimos a opção de você usar um banco gerenciado, adicionar novas credenciais de clusters, mudar a versão do Charles, utilizar um spinnaker já instalado previamente e habilitar ou não o load balancer padrão, entre outras coisas.

Essa forma de instalação pode ser usada tanto para testes quanto para ambiente produtivos, dependendo dos valores que você definir no arquivo de configuração. Caso você não altere nada terá o mesmo resultado da instalação com arquivo único.

Para utilizar nosso CLI basta acessar [link](https://google.com.br).

### Caso 3 - Instalação Terraform

Algumas empresas utilizam o terraform para criar e versionar sua infraestrutura, para esses casos deixamos um estrutura pronta para ser utilizada. Hoje temos suporte para GCP e AWS, e estamos trabalhando para adicionar suporte a AZURE, nesse [repo](https://google.com.br) deixamos prontos os resources de banco e Redis, além da execução de helm releases dos nossos módulos já consumindo os valores gerados pelos outros resources, tudo separado por cloud.

Essa instalação é pensada para casos muito específicos, então veja se os outros métodos não são mais adequados para você.

## Customização total

Caso você queira entender um pouco mais do processo ou queira editar mais campos dos que os disponibilizados pelo CLI, ou queria instalar módulos a parte para testes recomendamos os Charts puros do produto, disponíveis nesse [link](https://link.com.br).

### Especificidades

Aqui vamos colocar algumas informações essenciais caso você queria customizar sua instalação.

#### Ordem

Os módulos do charles não tem dependem um do outro para subir, ou seja, você pode subir qualquer módulo em qualquer ordem ou subir todos de uma vez. Porém alguns módulos dependem de alguma coisas já configuradas:

* Charles-move: precisa do keycloak configurado para funcionar, dentro das variáveis de ambiente você pode customizar a URL do keycloak, assim como o client e client-secret, se você usou a instalação com o CLI ou arquivo único isso não será problema, já em casos mais customizados é importante ter um cuidado a mais com isso.
* Charles-circle-matcher: Precisa de um redis para funcionar, e existem formas diferentes de se instalar o redis, então caso você use uma configuração diferente

