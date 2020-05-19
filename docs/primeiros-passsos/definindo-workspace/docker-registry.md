# Docker Registry

O acesso ao seu Docker Registry é importante, pois, uma vez dado, o CharlesCD ganha visibilidade das imagens existentes da sua aplicação. Existem duas categorias de cadastros dessa configuração que podem ser feitas através do workspace:

### AWS

* **Nome**: esse nome representará sua configuração no Charles.
* **URL do seu registry**: segundo a convenção, a URL para o seu registry padrão é [https://**aws\_account\_id**.dkr.ecr.**region**.amazonaws.com](https://aws_account_id.dkr.ecr.region.amazonaws.com).
* **Access Key**: informação de segurança gerada pela AWS ECR.
* **Secret Key**: informação de segurança gerada pela AWS ECR.
* **Region**: a região onde você está operando. 

Em caso de dúvidas para encontrar ou gerar essas informações, sugerimos a documentação da [**Amazon ECR**](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html).

### AZURE

* **Nome**: esse nome representará sua configuração no Charles.
* **URL do seu registry**: a URL para o seu registry padrão é [https://**aws\_account\_id**.dkr.ecr.region.amazonaws.com](https://aws_account_id.dkr.ecr.region.amazonaws.com).
* **Username**: ID da entidade de serviço que será usada pelo Kubernetes para acessar o registro.
* **Password**: Senha da entidade de serviço.

Em caso de dúvidas para encontrar ou gerar essas informações, sugerimos a documentação da [**Azure Container Registry**](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-concepts).

