# Docker Registry

Durante a configuração do seu workspace, é necessário cadastrar um registry vinculado ao seu docker. Esse acesso é importante pois, uma vez configurado, o CharlesCD ganha **visibilidade das imagens existentes da sua aplicação**. 

Existem duas categorias de cadastros dessa configuração que podem ser feitas pelo workspace. Para isso, basta realizar os seguintes passos:

1. Clique no seu nome, no canto superior direito e, em seguida, selecione **Settings**;
2. Clique em **Credentials**;
3. Clique em **Add Registry**;
4. Defina um **nome** para o Registry;
5. Defina para qual **cloud** você deseja vincular o Registry: AWS, AZURE, GCP ou STANDARD;
6. Defina o **tipo de autorização:** Basic ou Bearer;
7. Digite a **URL** do seu registry;
8. Na sequência, digite o **hostname.** Para finalizar, digite o seu username e senha. 

### AWS

* **Nome**: esse nome representará sua configuração no Charles;
* **URL do seu registry**: segundo a convenção, a URL para o seu registry padrão é [https://**aws\_account\_id**.dkr.ecr.**region**.amazonaws.com](https://aws_account_id.dkr.ecr.region.amazonaws.com).
* **Access Key**: informação de segurança gerada pela AWS ECR;
* **Secret Key**: informação de segurança gerada pela AWS ECR;
* **Region**: a região onde você está operando. 

Em caso de dúvidas para encontrar ou gerar essas informações, sugerimos a documentação da [**Amazon ECR**](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html).

### AZURE

* **Nome**: esse nome representará sua configuração no Charles;
* **URL do seu registry**: a URL para o seu registry padrão é [https://**aws\_account\_id**.dkr.ecr.region.amazonaws.com](https://aws_account_id.dkr.ecr.region.amazonaws.com).
* **Username**: ID da entidade de serviço que será usada pelo Kubernetes para acessar o registro;
* **Password**: Senha da entidade de serviço.

Em caso de dúvidas para encontrar ou gerar essas informações, sugerimos a documentação da [**Azure Container Registry**](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-concepts).

