---
description: É na fase de deploy que realizamos a implantação da release no kubernetes.
---

# 6 - Deployment

## 6.1 - Get builds

O primeiro passo para realizar um deploy é recuperar a release que você deseja. Veja o exemplo abaixo:

![](../../.gitbook/assets/6.1-get-builds.png)

1. Acesse a pasta Deployment da _collection_ _postman_ e selecione **"6.1 - Get builds".**
2. Adicione na uri o nome da release que deseja realizar o deploy.
3. Envie a requisição.
4. No response do request selecione o id que deseja realizar o deployer.

## 6.2 - Deploy Release

![](../../.gitbook/assets/6.2-deploy-release.png)

1. Acesse a pasta Deployment da _collection_ _postman_ e selecione **"6.2 - Deploy release".**
2. Preencha o buildId com o id selecionado no passo anterior.
3. Envia a requisição.

