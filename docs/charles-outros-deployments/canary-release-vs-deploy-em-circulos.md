---
description: >-
  Nesta seção, você vai compreender na prática o que diferencia o deploy em
  círculos da plataforma do Charles em relação à implantação canário, ou canary
  release.
---

# Deploys em círculos x canary releases

O canary release, ou implantação canário, funciona por meio da publicação gradual da nova versão de um software.

![](../.gitbook/assets/deploys-em-circulos-vs.-canary-release%20%282%29.png)

Para isso, é feito um roteamento dentro da infraestrutura onde o sistema foi desenvolvido, de modo que uma pequena base de usuários tenha acesso à nova release. À medida em que a versão é testada e se torna mais confiável, seu acesso é expandido a mais usuários da base.

Entretanto, essa técnica não propõe nenhuma estratégia de escolha de usuários para a expansão. Por esse motivo, torna-se mais difícil gerenciar as versões existentes do sistema, o que contribui para que você não opere com tanto versionamento e, assim, limite suas possibilidades de testar hipóteses.

## Deploys em círculos

No caso do Charles, a lógica de deploys em círculos segue um padrão parecido de mudança paralela. Isto significa que na plataforma você também começa liberando o acesso à release a um número reduzido de usuários e vai expandindo o acesso à medida que o sistema passa por testes.

![](https://github.com/ZupIT/charlescd/tree/3f920366062d055b4fa05ddbd1bb5b360d9f749f/docs/.gitbook/assets/conceito-de-deploy-em-circulos-1.png)

O grande diferencial da plataforma é que, caso algum problema seja encontrado ou a hipótese já tenha sido validada, a reversão é realizada de forma simples: você pode retirar os usuários daquele círculo, realizar o deploy de outra versão para aquele grupo ou levar a versão da aplicação para mar aberto, isto é, para todos os clientes que não estão inseridos em um círculo dentro do Charles.

