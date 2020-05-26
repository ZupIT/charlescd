# Hipótese

As hipóteses são as alternativas cadastradas na plataforma para resolver algum problema ou validar mudanças nas aplicações que você integrou ao Charles. 

É possível que uma hipótese contenha um ou mais features, e eles estão relacionadas diretamente aos módulos e/ou projetos que foram cadastrados anteriormente no seu workspace.

Imagine uma situação na qual duas equipes trabalham no mesmo produto e têm ideias diferentes para aumentar a taxa de conversão de clientes. A equipe A sugere adicionar um botão na página, enquanto a equipe B acredita que incluir um box de "sugestão de venda" será mais assertivo.

O Charles possibilita que as duas equipes criem duas hipóteses distintas. Assim, cada uma, poderá conduzir o desenvolvimento por meio de um board gerado automaticamente. A partir disso, cada equipe poderá selecionar de forma independente, os círculos com usuários distintos para validar os resultados de cada uma das hipóteses.

## Como criar hipóteses?

Ao cadastrar uma hipótese dentro do Charles, a sua requisição será encaminhada ao `charlescd-moove`. Ao final desse processo, o sistema irá gerar automaticamente um quadro \(board\) no qual é possível criar e gerenciar cartões com as releases e as ações necessárias para testar as hipóteses levantadas.

Esses cartões podem ser de dois tipos:

1. **Action:** são os cartões que envolvem codificação, como a implementação de novas funcionalidades \(features\) ou ajustes em partes do projeto. 
2. **Feature:** são os cartões que indicam uma ação a ser feita, como por exemplo, realizar um teste de campo com os usuários. 

![](https://lh5.googleusercontent.com/1I3yXY8rsLsu3HgoIOOxH77NrMts42tKz30upnLI3qfRO9Ui6cD1NP-ZgtcSHZfji8kvN97DRfzSGj1fLjPCVg86lQVmVrHb-9gZaf2r4ymLdcIfEI_WrteXRJr9HUU0meFIFSyF)

Quando um cartão de feature é adicionado, o Charles cria uma nova branch no git do cliente que, por sua vez, é armazenada diretamente no SCM utilizado, seja ele Git ou Bitbucket.

## Gestão do Board

Organizado com base em conceitos da metodologia ágil, o Board é estruturado para que, a partir de tarefas do backlog, você possa priorizar o que será feito \(to do\) e indicar o que está em andamento \(doing\).

A medida que o desenvolvimento da hipótese evolui, as tarefas avançam nas colunas do moove. Os possíveis status de cada atividade são:

* **To Do:** as tarefas foram priorizadas e precisam ser feitas. _\*\*_
* **Doing:** as tarefas estão em andamento. _\*\*_
* **Ready to go:** as atividades finalizadas. Caso seja do tipo feature card, é possível gerar um build. _\*\*_
* **Builds:** aqui estão representados todos os builds gerados a partir da combinação de feature nos cartões da coluna anterior \(Ready to go\). É possível expandir o cartão para ter mais informações.

O Charles é responsável pela orquestração da resolução dos merges, principalmente caso surjam vários cartões que envolvam módulos iguais, porém com ramificações diferentes no git.

Depois que esse processo termina e todos os códigos são mesclados, uma nova ramificação de release é criada e o estado do cartão é alterado para **build**.

* **Releases Deployed:** os cartões nessa coluna mostram de onde estão implantados os builds da hipótese.

![](https://lh6.googleusercontent.com/da5Jdg51wg8EAIJaGTvt9VsAzdn00RIBNJxieqhSVsPVzdS_bo066rGVvk_Olne6O-Jk_oaVT88EFbqPUvtsKdEZ_7mnreLadEmM2_R1Sm2GV3-tuWMXkW0EGZwpjJ3BytFKGwsI)

Quando uma hipótese é movida para coluna **Ready To Go**, você indica ao sistema que aquele cartão pode passar pelo processo de **Generate Release Candidate**, ou seja, a hipótese se transformará em uma release branch da release master presente no seu git.

