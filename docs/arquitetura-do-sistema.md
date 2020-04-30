# Arquitetura do sistema

A plataforma, construída utilizando a abordagem de microsserviços, possui os seguintes módulos:

* `charles-application:` responsável pelo gerenciamento de usuários, módulos, hipóteses e boards. _\*\*_
* `charles-notification:` realiza a gestão todas as notificações dentro da plataforma. _\*\*_
* `charles-circle-deploy:` responsável por orquestrar, implantar ou remover versões de suas aplicações nos ambientes. _\*\*_
* `charles-releases:` faz a busca no registry da imagem gerada após a criação da release candidate de uma nova versão. _\*\*_
* `charles-circle-matcher:` gerencia todos os círculos criados, além de indicar a qual círculo um usuário pertence, com base em um conjunto de características.

![Arquitetura do Charles ](.gitbook/assets/arquitetura-do-sistema.png)

