---
description: This section you will help you find all the basic information about Charles.
---

# Overview

## What is Charles?

Charles is an open source tool that makes deployment more agile, continuous and safe. It allows development teams to perform hypothesis validations with a specific group of users, simultaneously. 

_O Charles é uma ferramenta open source que realiza deploys de forma ágil, contínua e segura, permitindo que as equipes de desenvolvimento realizem simultaneamente validações de hipóteses com grupos específicos de usuários._ 

{% hint style="warning" %}
The product brings a new concept to the community: **deployment in circles of users on Kubernetes clusters**. 

O produto traz um conceito pioneiro no mercado e para a comunidade: **deploys em círculos de usuários em clusters de Kubernetes.** 
{% endhint %}

This kind of deploy makes it possible to create a segment with your clients' specific characteristics, and at the same time, submit several versions of the same application to test this circle of users. 

_Neste modelo de deploy, é possível **segmentar seus clientes através de características específicas** e, ao mesmo tempo, submeter diversas versões de uma mesma aplicação para teste com os usuários dos círculos._ 

## How was the project created?

Charles was created to offer a more efficient solution for the community to create deployment and test hypothesis together, which allows the identification of errors and the execution of possible solution to solve bugs faster. 

_O Charles surgiu da necessidade de oferecer para a comunidade uma solução mais eficaz no trabalho de fazer deploys e testar hipóteses simultaneamente, permitindo mais rapidez na identificação de erros e execução de possíveis soluções para resolver os bugs._ 

The concept behind the tool goes back to the theory proposed by the biologist Charles Darwin \(1809-1882\), evolution goes by the adaptation to a new environment. In the development's case, this evolution goes by constant improvements on the applications to build and to test hypothesis in order to implement more effective releases.

For this reason, we believe Charles is the darwinism's application inside the development and programming world. 

 _O conceito por trás da ferramenta remete à teoria proposta pelo biólogo Charles Darwin \(1809-1882\), ou seja, a de que a evolução se dá pela adaptação a um novo ambiente. No caso do desenvolvimento, essa evolução se dá por meio de constantes melhorias nas aplicações ao construir e testar hipóteses de maneira a implantar as releases mais precisas e eficazes._ 

_Por esse motivo, consideramos que o Charles é a aplicação do darwinismo dentro do universo de desenvolvimento e programação._

## What does Charles do?

_A metodologia implementada pelo Charles traz várias vantagens, como:_

The metodology implemented by Charles brings a lot of advantages such as:  

* Simple users segment based on their profile or demographic data; 
* Easy and sophisticated creation of implementation strategies using circles;  
*  Easy version management in case of multiple parallel releases in the production environment

_Fácil gerenciamento de versões em caso de múltiplas releases em paralelo no ambiente produtivo;_  


* Monitoring each version impact through predefined metrics during the implementation creation. _Monitoramento dos impactos de cada versão por meio de métricas definidas durante a criação da implantação._

## System architecture

The plataform was built using a microservice approach and it has the following modules:

![Charles architecture](.gitbook/assets/charles_c.d_v3.png)

* `charlescd-ui:`  mirrors on front-end the workspace configuration, users, modules, hypothesis and boards, it is the plataform graphic interface.  
* `charles-moove:` manages workspace, users, modules, hypothesis and boards, it is the whole plataform structure.   
* `charles-butler:` orchestrates and manages releases and deploys. 
* `charles-circle-matcher:`manages all created circles, and also points out which circle the user belongs based on their characteristics. 

