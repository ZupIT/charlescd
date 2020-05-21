# Configurando seu Cluster

Durante a configuração do seu workspace, é necessário cadastrar as credenciais de acesso ao cluster [Kubernetes](https://kubernetes.io/). Estas são específicas para cada uma das ferramentas de Continuous Deployment \(CD\) que o Charles possui integração.

Hoje, oferecemos suporte a duas ferramentas: O [Spinnaker](https://www.spinnaker.io/) e o Octopipe, uma ferramenta leve e de baixo custo desenvolvida pela equipe do Charles. Nesta seção de primeiros passos ensinaremos como realizar o seu deploy da forma mais simples possível, utilizando a nossa própria ferramenta de CD com deploys no mesmo cluster de sua instalação. Para realizar este processo, basta seguir os passos:

1. Na tela inicial do Charles, selecione **Settings** no canto esquerdo inferior;
2. Clique em **Credentials**;
3. Clique em **Add CD Configuration**;
4. Selecione a opção **Octopipe;**

Após isso, preencha os campos a seguir:

1. **Name:** Nome da configuração que será criada;
2. **Namespace:** Defina o namespace que será utilizado nos deploys no cluster Kubernetes;
3. **Git provider**: Defina o provedor de git a ser utilizado \(**GITHUB ou GITLAB**\);
4. **Git token:** Insira o token de autenticação para o seu repositório git. Este será utilizado para a obtenção dos templates Helm;
5. Selecione a opção **Default**;

Agora a configuração está criada e você poderá associa-la futuramente em um módulo. Para mais informações a respeito de configuração de CDs, por favor acesse a [referência](https://docs.charlescd.io/referencia/configuracao-cd).  




