---
description: >-
  Esta é uma área onde pode-se visualizar todos os círculos vinculados a uma
  hipótese, além de gerenciar seus deploys.
---

# Deploy em Círculos

Cada hipótese tem uma área de deploy em círculos. Para realizar um deploy em um círculo, navegue até o final do quadro da hipótese e clique em **"Go to deploy".**

Um _dashboard_ irá abrir, e nele será possível visualizar todos os círculos que serão utilizados para realizar os testes da sua hipótese.

Para adicionar um novo círculo a sua hipótese clique em **"add circle"** e selecione o que fizer sentido para a validação proposta.

{% hint style="info" %}
Veja como[ criar um círculo](./).
{% endhint %}

![](../../.gitbook/assets/14.gif)

## Implantando em um círculo

Escolha o círculo que deseja realizar um deploy e clique em **"add release candidate".** Com isso, basta selecionar a sua _release candidate_. Veja um exemplo abaixo:

![](../../.gitbook/assets/15.gif)

O Charles irá realizar a implantação da sua _release_ no círculo selecionado. O processo de implantação pode ser acompanhado através das indicações visuais e estado do cartão.

Ao finalizar, você pode testar a implantação acessando sua aplicação e realizando login com um perfil que se encaixe no círculo onde a nova versão foi implantada.

