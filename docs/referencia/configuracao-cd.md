---
description: Detalhes sobre a configuração das ferramentas de Continuous Deployment (CD).
---

# Configuração de CD

O Charles utiliza uma arquitetura apropriada para ferramentas de Continuous Deployment \(CD\) e isso possibilita que ele se encaixe no ecossistema escolhido por você. Estas ferramentas são utilizadas para realizar a execução dos manifestos Kubernetes no cluster configurado e para fazer a autenticação com diversos provedores de cloud \(e.g. AWS, GCP, Azure\).

Oferecemos suporte para duas ferramentas de CD. O [**Spinnaker**](https://www.spinnaker.io/)**,** ferramenta criada pela Netflix e que hoje é mantida por diversas empresas e a comunidade e o **Octopipe**, que é uma ferramenta leve e de baixo custo e foi criada sob medida para integração com o Charles.

Para cadastrar qualquer uma delas, siga os seguintes passos:

1. Na tela inicial do Charles, selecione **Settings** no canto esquerdo inferior;
2. Clique em **Credentials**;
3. Clique em **Add CD Configuration**;
4. Selecione as opções **Octopipe** ou **Spinnaker**, dependendo da sua preferência.

![Processo inicial de cadastro de configura&#xE7;&#xF5;es de CD](../.gitbook/assets/cd-configuration-2-1%20%281%29.gif)

## Utilizando Spinnaker

1. **Name:** Nome da configuração que será criada;
2. **Namespace:** Defina o namespace que será utilizado nos deploys no cluster Kubernetes;
3. **URL**: Insira a URL de acesso ao Spinnaker;
4. **Git account:** Insira o nome da configuração de git criada na instalação do Spinnaker;
5. **Kubernetes account:** Insira o nome da configuração de acesso ao cluster Kubernetes criado na instalação do Spinnaker;

## Utilizando Octopipe

1. **Name:** Nome da configuração que será criada;
2. **Namespace:** Defina o namespace que será utilizado nos deploys no cluster Kubernetes;
3. **Git provider**: Defina o provedor de git a ser utilizado \(**GitHub ou GitLab**\);
4. **Git token:** Insira o token de autenticação para o seu repositório git. Este será utilizado para a obtenção dos templates Helm;
5. Por fim, selecione um **manager** para associar à CD Configuration. As opções são: **Default**, **EKS**, **Others.**

### Default:

Esta opção deve ser utilizada quando o cluster de destino das aplicações é o mesmo em que o Octopipe está instalado. Desta forma, não é necessário criar nenhum mecanismo extra de autenticação.

### EKS:

Para clusters gerenciados pelo EKS \(Elastic Kubernetes Service\), basta selecionar a opção e inserir os seguintes campos:

1. **AWS SID**: Statement ID;
2. **AWS Secret**: Chave de acesso ao cluster EKS;
3. **AWS Region**: Região onde o cluster EKS está instalado;
4. **AWS Cluster Name**: Nome do cluster EKS.

### Others:

Para outros provedores de cloud, utilizamos uma abordagem mais simples onde apenas alguns campos do _kubeconfig_ devem ser utilizados. São eles:

1. **Host**: Url de acesso ao cluster;
2. **Client Certificate**: Campo "client-certificate-data" do _kubeconfig_;
3. **Client Key**: Campo "client-key-data" do _kubeconfig_;
4. **CA Data**: Campo "certificate-authority-data" do _kubeconfig._

Todas as informações providenciadas acima são criptografadas pelo Charles. Uma vez que este processo foi feito, é possível associar as configurações em módulos e em seguida realizar o deploy de versões deles.

