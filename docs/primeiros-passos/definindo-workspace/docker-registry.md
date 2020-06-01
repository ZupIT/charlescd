# Docker Registry

Durante a configuração do seu workspace, é necessário cadastrar o registry onde as imagens das suas aplicações estão armazenadas. Esse acesso é importante, pois uma vez configurado, o CharlesCD pode **observar novas imagens sendo geradas e listar as imagens já salvas no seu registry** para implantá-las.

Existem duas categorias de cadastros de configuração que podem ser feitas pelo workspace; AWS e Azure, você escolhe e adiciona as seguintes informações:

### AWS

* **Nome**: esse nome representará sua configuração no Charles;
* **URL do seu registry**: segundo a convenção, a URL para o seu registry padrão é  https://**aws\_account\_id**.dkr.ecr.**region**.amazonaws.com;
* **Access Key**: informação de segurança gerada pela AWS ECR;
* **Secret Key**: informação de segurança gerada pela AWS ECR;
* **Region**: a região de onde você está operando. 

Em caso de dúvidas para encontrar essas informações, sugerimos a documentação da [**Amazon ECR**](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html).

### AZURE

* **Nome**: esse nome representará sua configuração no Charles;
* **URL do seu registry**: a URL para o seu registry padrão é [https://**aws\_account\_id**.dkr.ecr.region.amazonaws.com](https://aws_account_id.dkr.ecr.region.amazonaws.com).
* **Username**: ID da entidade de serviço que será usada pelo Kubernetes para acessar o registro;
* **Password**: Senha da entidade de serviço.

Em caso de dúvidas para encontrar essas informações, sugerimos a documentação da [**Azure Container Registry**](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-concepts).

