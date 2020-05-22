# Configurando seu Cluster

Ao configurar seu workspace é preciso cadastrar as credenciais de acesso ao cluster [**Kubernetes**](https://kubernetes.io/). Essas configurações são específicas para cada uma das ferramentas de Continuous Deployment \(CD\) que são integradas ao Charles, que até o momento são [**Spinnaker**](https://www.spinnaker.io/) e Octopipe. 

O Octopipe foi desenvolvido pela equipe do Charles, é mais leve, de baixo custo e consegue fazer deploys em clusters Kubernetes.

Segue abaixo o exemplo de como realizar seu deploy usando o mesmo cluster de instalação: 

1. Na tela inicial do Charles, selecione **Settings** no canto esquerdo inferior;
2. Clique em **Credentials**;
3. Clique em **Add CD Configuration**;
4. Selecione a opção **Octopipe.**

Após esses passos, preencha os campos a seguir:

1. **Name:** Nome da configuração que será criada;
2. **Namespace:** Defina o namespace que será utilizado nos deploys no cluster Kubernetes;
3. **Git provider**: Defina o provedor de git a ser utilizado \(**GitHub ou GitLab**\);
4. **Git token:** Insira o token de autenticação para o seu repositório git. Este será utilizado para a obtenção dos templates Helm;
5. Selecione a opção **Default.**

Depois de finalizar sua configuração, você pode futuramente associá-la a um módulo. Para mais informações, acesse a página de [**Referência**](https://docs.charlescd.io/referencia/configuracao-cd).

