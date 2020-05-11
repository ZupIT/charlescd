# APIs

## Do Zero ao Deploy

Nesse tutorial você ira aprender a realizar todo o processo do zero ao seu primeiro deploy utilizando a api rest do charles.

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/1.0-colection.png)

A partir dessa _Collection_ do postman você deve seguir a ordem descrita acima onde iremos abordar desde a criação do seu usuário até a realização do deploy.

## 1 - Login

### 1.1 - Auth on Keycloak

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/obtendo-token.png)

1. Acesse a pasta login da _Collection_ _postman_ e selecione **"1.1 - Auth on Keycloak".**
2. Altere o _username_ e o _password_ para as credenciais que você recebeu da equipe do charles. Esse usuário será utilizado para criar novos usuários e seus grupos de acesso.
3. Clique em _Send_ para submeter a requisição de login

Após a execução dessa requisição um token de acesso deverá ser retornado. Esse token será injetado na variável **token** do postman para ser utilizado nas demais requisições.

## 2 - Groups

{% hint style="info" %}
O cadastro de grupos é aonde definimos todas as funcionalidades que os usuários vinculados ao grupo terão acesso ao logar no sistema.

Dessa forma cada funcionalidade no sistema, seja acessada através do menu principal, através de um botão, tem uma permissão relacionada no cadastro de grupos de usuários.
{% endhint %}

### 2.1 - Get all roles

Vamos recuperar os papeis que já existem no sistema para poder criar um novo grupo de acesso. Execute os passos abaixo:

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/2.1-get-all-roles.png)

1. Acesse a pasta Groups da _Collection_ _postman_ e selecione **"2.1 - Get all roles".**
2. Submeta a requisição para obter os papeis já cadastrados.
3. O resultado dessa requisição é inserido em uma variável de contexto **"all-roles"** onde será utilizado no próximo passo para criar um grupo com todos os papeis. Você pode optar por criar um grupo utilizando apenas as funcionalidades desejadas copiando os _ids_ de retorno ao invés da variável de contexto.
4. Você deve visualizar o retorno da requisição com todas as funcionalidades.

### 2.2 - Create group All permission

Você pode criar um grupo com todas as permissões utilizando a variável preenchida no passo anterior. Ou selecionar penas os ids recuperados na consulta anterior.

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/2.2-create-group-all-permission.png)

1. Acesse a pasta Groups da _Collection_ _postman_ e selecione **"2.2 - Create group All permission".**
2. Dê um nome para o grupo que irá cadastrar. A propriedade _roleIds_ pode ser preenchida com a variável de ambiente "**all roles**".
3. Submeta a requisição.

### 2.3 - Get all groups

Por ultimo verifique se seu novo grupo foi cadastrado executando a requisição abaixo:

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/2.3-get-all-groups.png)

1. Acesse a pasta Groups da _Collection_ _postman_ e selecione **"2.3 - Get all groups".**
2. Execute a requisição.
3. Verifique o retorno com todos os grupos.

## 3 - Users

### 3.1 - Create user

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/3.1-create-user.png)

1. Acesse a pasta Users da _collection_ _postman_ e selecione **"3.1 - Create user".**
2. Adicione os seus dados pessoais.
3. Submeta a requisição.

### 3.2 - Auth new User on Keycloak

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/3.2-auth-new-user-on-keycloak.png)

1. Acesse a pasta Users da _collection_ _postman_ e selecione **"3.2 - Auth new user on keycloak".**
2. Informe os dados de login cadastrados no passo anterior.
3. Submeta a requisição.
4. Você deve receber um token de autenticação que deverá ser utilizado nas próximas requisições.
5. Na aba de testes o token será armazenado em uma variável de contexto **"token"**.

### 3.3 - Add group to an user

Para que o usuário cadastrado na sessão anterior tenha acesso ao sistema é necessário que você atribua um grupo de permissões a ele. Veja abaixo:

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/3.3-add-group-to-an.png.png)

1. Acesse a pasta Users da
   1. _collection_

      _postman_ e selecione **"3.3 - Add group to an user".**
2. Adicione o id do grupo cadastrado na sessão: [2 - Groups](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/docs/apis/init-groups.md#2-2-create-group-all-permission)
3. Submeta a requisição.

## 4 - Credential Configurations

### 4.1 - Save git credential

Adicione sua conta do git para que o charles possa carregar os seus repositórios.

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/config-git.png)

1. Acesse a pasta Credential da _collection_ _postman_ e selecione **"4.1 - Save git credential".**
2. Altere as propriedades username e password para as da sua conta do github.
3. Execute a requisição para cadastrar sua credencial git.

### 4.2 - Save registry credential

Um dos fluxos do Chales é monitorar e utilizar as imagens dockers do seu repository. Para isso precisamos configurar o seu acesso.

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/4.2-save-registry-credencial.png)

1. Acesse a pasta Credential da _collection_ _postman_ e selecione **"4.2 -** Save registry credential**".**
2. Preencha as informações necessárias para acesso ao seu registry.
3. Envie a requisição para cadastro.

### 4.3 - Save k8s credential

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/4.3-save-ks8-credencial.png)

1. Acesse a pasta Credential da _collection_ _postman_ e selecione **"4.3 - Save k8s credential".**
2. Preencha as informações necessárias para acesso ao seu ks8.
3. Envie a requisição para cadastro.

## 5 - Circles

Veja mais detalhes sobre a definição de um círculo acessando o link abaixo:

A criação de um círculo inclui as regras que irão determinar qual usuário pertence aquele círculo.

{% hint style="info" %}
Você pode utilizar um arquivo csv para realizar o cadastro das regras para o seus círculo 😎
{% endhint %}

### 5.1 - Create Circle

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/5.1-create-circle.png)

1. Acesse a pasta Circles da _collection_ _postman_ e selecione **"5.1 - Create Circle".**
2. Dê um  nome ao seu círculo e adicione as regras que serão utilizadas para realizar o matcher com as características do usuário. No exemplo acima a regra adicionada para esse círculo é: "username" igual a "rafael" Veja mais sobre como é feito o matcher: [Charles Circle Matcher](./)
3. Submeta a requisição.

## 6 - Deployment

### 6.1 - Get builds

O primeiro passo para realizar um deploy é recuperar a release que você deseja. Veja o exemplo abaixo:

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/6.1-get-builds.png)

1. Acesse a pasta Deployment da _collection_ _postman_ e selecione **"6.1 - Get builds".**
2. Adicione na uri o nome da release que deseja realizar o deploy.
3. Envie a requisição.
4. No response do request selecione o id que deseja realizar o deployer.

### 6.2 - Deploy Release

![](https://github.com/ZupIT/charlescd/tree/6a4407e40fe676322f07bc6a75486a24d0b409c9/.gitbook/assets/6.2-deploy-release.png)

1. Acesse a pasta Deployment da _collection_ _postman_ e selecione **"6.2 - Deploy release".**
2. Preencha o buildId com o id selecionado no passo anterior.
3. Envia a requisição.

