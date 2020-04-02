# 1 - Login

## 1.1 - Auth on Keycloak

![](../../.gitbook/assets/obtendo-token.png)

1. Acesse a pasta login da _Collection_ _postman_ e selecione **"1.1 - Auth on Keycloak".**
2. Altere o _username_ e o _password_ para as credenciais que você recebeu da equipe do charles. Esse usuário será utilizado para criar novos usuários e seus grupos de acesso.
3. Clique em _Send_ para submeter a requisição de login

Após a execução dessa requisição um token de acesso deverá ser retornado. Esse token será injetado na variável **token** do postman para ser utilizado nas demais requisições.

