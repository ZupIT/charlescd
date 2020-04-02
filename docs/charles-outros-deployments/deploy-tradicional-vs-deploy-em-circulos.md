---
description: >-
  Nesta seção, você vai compreender na prática o que diferencia o deploy em
  círculos da plataforma do Charles em relação aos deploys tradicionais.
---

# Deploys em círculos x deploys tradicionais

### Deploys tradicionais 

Enquanto que nos deploys em círculos você trabalha em um só ambiente, segmentando os usuários pelos círculos, na forma tradicional o desenvolvedor opera com uma série de ambientes configurados distintos e que geralmente são definidos como:

![](../.gitbook/assets/deploys-em-circulos-vs.deploys-tradicionais%20%281%29.png)

* **Área de desenvolvimento:** onde o sistema \(e suas releases\) é criado.  ****
* **Área de Staging \(Homologação\):** onde são realizados testes   na release, principalmente os de QA.   ****
* **Área de pré-produção:** onde a aplicação é publicada e validada, realizando as correções necessárias antes de aplicá-las para área de produção.  
* **Área de produção:** área onde o usuário final tem acesso ao sistema.

À medida que a release vai migrando de um ambiente para o outro, ela é testada para mitigar o maior número possível de erros até ela ser publicada em produção. A grande questão é que, caso um problema não seja identificado até o final da esteira de desenvolvimento, isso irá impactar toda a base de clientes e, além disso, afetará diretamente o error budget.  
****

### **Deploy em círculos**

No caso do Charles, o sistema de deploys em círculos funciona somente em um ambiente que, no caso, seria de produção. A validação por release é fragmentada de acordo com os círculos selecionados, ou seja, você pode ir ampliando gradativamente o acesso à release a mais e mais círculos. 

![](../.gitbook/assets/conceito-de-deploy-em-circulos.png)

Com o deploy em círculos, o desenvolvedor tem a possibilidade de, por exemplo, testar sua hipótese apenas para o seu time de desenvolvimento e ir evoluindo a sua feature para grupos maiores até chegar a todos os usuários. Para a equipe de negócio, é dada a possibilidade de realizar testes de hipótese em fluxos de valores com círculos personalizados.

Dessa forma, o impacto de um erro se torna mínimo, dando a possibilidade de realizar diversos deploys. Além do mais, a quantidade de hipóteses que podem ser testadas tendem ao infinito considerando o 0,01% do error budget. 

## 



