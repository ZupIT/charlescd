# Arquitetura do sistema

A plataforma, construída utilizando a abordagem de microsserviços, possui os seguintes módulos:

![](.gitbook/assets/nova-arquitetura-charles.png)

* `charles-application:` responsável pelo gerenciamento de usuários, módulos, hipóteses e boards.  
* `charles-notification:` realiza a gestão todas as notificações dentro da plataforma. 
* `charles-circle-deploy:` responsável por orquestrar, implantar ou remover versões de suas aplicações nos ambientes. 
* `charles-releases:` faz a busca no registry da imagem gerada após a criação da release candidate de uma nova versão. 
* `charles-circle-matcher:` gerencia todos os círculos criados, além de indicar a qual círculo um usuário pertence, com base em um conjunto de características.

