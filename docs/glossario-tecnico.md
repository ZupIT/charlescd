---
description: >-
  Nesta seção, você encontra definições para os principais termos e expressões
  utilizados na documentação e na plataforma do Charles ou ainda em discussões
  dentro da comunidade de desenvolvedores.
---

# Principais conceitos

## **Círculos**

São grupos de usuários criados a partir de características específicas dentro de um mesmo ambiente na plataforma do Charles. Dessa forma, o desenvolvedor pode segmentar os usuários de acordo com as regras \(AND ou OR\) que mais fizerem sentido para testar aquela release.

Por exemplo, é possível criar um círculo de engenheiros da região Norte do Brasil, outro de engenheiros do sudeste e um terceiro contendo todos os engenheiros brasileiros. Baseado nessa segmentação de clientes, pode-se elaborar diversas lógicas de deploy.

## **Cluster**

O termo, traduzido do inglês, significa grupos ou agrupamentos. No caso dos ambientes em containers, um cluster é um grupo de nós \(máquinas físicas ou virtuais\) que trabalham de maneira unificada para rodar um sistema operacional.

## **Containers**

É uma forma de virtualização\*/organização que permite rodar, em um só sistema operacional, diversos sistemas isolados. Costuma ser muito usado em ambientes de desenvolvimento, staging \(testes, QA\) e produção de sistemas. Um aglomerado de containers é também chamado de cluster.

Eles podem compartilhar do mesmo kernel do sistema operacional, o que é a grande sacada dessa modalidade de arquitetura de software porque permite "separar" bem os containers, dentro de um conjunto, para que cada um assuma um papel dentro do sistema. Exemplo: um roda PHP, enquanto outro roda JS.

Dessa forma, você divide responsabilidades de cada ferramenta dentro daquela aplicação/daquele sistema, isolando os processos delas para que não entrem em conflito. Além disso, torna a estrutura fácil de se interligar, mais segura e flexível. Permite ainda um ganho de escala e performance. O principal software conhecido no mercado para criação desses containers em ambientes de desenvolvimento e de produção é o chamado docker.

## **Deploys**

Significa implantar, colocar disponível para uso ou "colocar no ar" uma aplicação ou feature que está sendo desenvolvida dentro de um sistema Existem 3 maneiras de fazer uma deploy: manual, parcialmente automatizado e totalmente automatizado. Possibilita trabalhar com diversas integrações/arquivos criados por uma equipe de desenvolvimento.

## **Docker**

Plataforma open source escrita em linguagem Go que tem por objetivo facilitar a criação e administração de ambientes em containers.

## Error Budget

Índice de tolerância de erros permitido em um sistema para que ele possa ser considerado confiável, de acordo com o Site Reliability Engineering \(SRE\). Em geral, o percentual médio admitido hoje no mercado é de 0,01%.

## Kernel

É um "organizador" responsável por rodar todos os programas que permitem que aquele software rode sem complicações. No caso do computador, por exemplo, é o kernel quem faz a ligação de hardware e software.

## Kubernetes

Sistema open source de orquestração de containers desenvolvido pelo Google que tem como objetivo automatizar a implantação, dimensionamento e gestão de aplicações em containers.

## Load Balancer

Responsável por dividir as requisições e/ou tarefas entre os clusters presentes em uma rede.

## "Mar Aberto"

Termo que se refere a todos os usuários, inseridos na plataforma do Charles, que não estão vinculados a um círculo. É como se fosse uma segmentação genérica.

## Módulos

São artefatos de programação que podem ser desenvolvidos e compilados separadamente de outras partes da aplicação.

## Orquestração

É o processo de administração de ferramentas e/ou aplicações dentro de um sistema. No caso dos containers, é o nome dado para gerenciamento de um conjunto de containers.

O Doker é o principal programa hoje para criação dos containers e que, apesar de ter um sistema próprio de gerenciamento, não é muito utilizado nesses casos. Os sistemas mais comuns são o OpenShift e o Kubernetes\*, sistema desenvolvido pelo Google que auxilia os desenvolvedores a organizar, gerenciar e monitorar esses containers.

Esses sistemas de orquestração permitem provisionar e retirar containers de acordo com a demanda de requisições durante a construção de um software.

## Pipeline

Conjunto de elementos de processamento de dados conectados em série, onde a saída de um elemento é a entrada do próximo.

## Registry

No Docker, o Registry funciona como um armazenamento de versões de arquivos organizados por tagueamento.

