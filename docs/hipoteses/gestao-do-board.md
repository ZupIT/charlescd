# Gestão do board

Organizado com base em conceitos da metodologia ágil, o Board é estruturado para que, a partir de tarefas do backlog, você possa priorizar o que será feito \(to do\) e indicar o que está em andamento \(doing\).

À medida que o desenvolvimento da hipótese evolui, as tarefas vão avançando nas colunas do moove. Os possíveis status de cada atividade são:

* **To Do:** as tarefas foram priorizadas e precisam ser feitas. _\*\*_
* **Doing:** as tarefas estão em andamento. _\*\*_
* **Ready to go:** as atividades finalizadas. Caso seja do tipo feature card, é possível gerar um build. _\*\*_
* **Builds:** nesta coluna estão representados todos os builds gerados a partir da combinação de feature cards na coluna anterior \(Ready to go\). É possível expandir o cartão para ter mais informações.

Vale esclarecer que o Charles é responsável pela orquestração da resolução dos merges, principalmente caso surjam vários cartões que envolvam módulos iguais, porém com ramificações diferentes no git.

Depois que esse processo termina e todos os códigos são mesclados, uma nova ramificação de release é criada e o estado do cartão é alterado para "build".

* **Releases Deployed:** os cartões nessa coluna dão visibilidade de onde estão implantados os builds da hipótese.

![](https://lh6.googleusercontent.com/da5Jdg51wg8EAIJaGTvt9VsAzdn00RIBNJxieqhSVsPVzdS_bo066rGVvk_Olne6O-Jk_oaVT88EFbqPUvtsKdEZ_7mnreLadEmM2_R1Sm2GV3-tuWMXkW0EGZwpjJ3BytFKGwsI)

Quando uma hipótese é movida para coluna Ready To Go, você indica ao sistema que aquele cartão pode passar pelo processo de Generate Release Candidate. Em outras palavras, a hipótese se transformará em uma release branch da release master presente no seu git.

