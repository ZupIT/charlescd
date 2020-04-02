---
description: >-
  Nesta seção, você vai compreender na prática o que diferencia o deploy em
  círculos da plataforma do Charles em relação à implantação blue-green, ou
  blue-green deployments.
---

# Deploys em círculos x blue-green deployments

### Blue-green deployments 

O blue-green deployment, ou implantação azul-verde, funciona por meio da criação de dois ambientes idênticos na infraestrutura, porém com diferentes versões de uma aplicação implantados em cada um. 

                                                                   **\[IMAGEM\]** 

Uma vez definido os ambientes "azuis e verdes", é possível configurar um load balancer responsável por direcionar o tráfego do ambiente atual para o outro desejado. Depois de confirmar que todas as validações estão dentro do esperado, você pode finalizar a transição o restante do tráfego para a nova versão.

O principal benefício desta técnica é que o downtime é zero, trazendo mais segurança para a transição. Apesar disso, o custo para o blue-green deployment é bastante elevado, já que demanda o dobro de infraestrutura para ser executado. 

### Deploys em círculos 

No caso do Charles, o deploy em círculos oferece ao time mais confiança e rapidez no lançamento de novas versões, com downtime zero e sem custos adicionais de infraestrutura. Ou seja, só vantagens! 

Além disso, é possível refinar através dos círculos quem serão os usuários que farão a validação da sua nova versão. 

![](../.gitbook/assets/conceito-de-deploy-em-circulos%20%284%29.png)

