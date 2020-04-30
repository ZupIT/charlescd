# O que são e como criar hipóteses?

{% hint style="warning" %}
As hipóteses são alternativas que você cadastra para resolver algum problema relacionado às aplicações integradas ao Charles. 

É possível que a **hipótese** **tenha uma ou mais features**, que estão relacionadas diretamente aos módulos e/ou projetos que foram cadastrados anteriormente ao seu workspace.
{% endhint %}

O ciclo de vida de uma hipótese \(tempo entre a concepção e validação com clientes\) não pode ser longo, uma vez que quanto maior for o tempo gasto, maior será o custo e possibilidade dela ficar ultrapassada.

Imagine uma situação onde duas equipes trabalham no mesmo produto e têm ideias diferentes para aumentar a taxa de conversão de clientes. A equipe A sugere adicionar um botão na página, enquanto a equipe B acredita que incluir um box de "sugestão de venda" será mais assertivo. 

Com o Charles, é possível que as duas equipes criem duas hipóteses distintas. Assim, cada uma, poderá conduzir o desenvolvimento através um board que é gerado automaticamente. A partir daí, cada equipe poderá selecionar, de forma independente, os círculos com usuários distintos para validar os resultados de cada uma das hipóteses.

## Como criar hipóteses?

Ao cadastrar uma hipótese dentro do Charles, a sua requisição será encaminhada ao `charles-application`. 

{% hint style="warning" %}
Ao final desse processo, o sistema irá gerar automaticamente um [quadro \(board\)](https://docs.charlescd.io/hipoteses/como-criar-hipoteses/gestao-do-board) no qual é possível criar e **gerenciar cartões com as releases e ações necessárias para testar as hipóteses levantadas.** 
{% endhint %}

Esses cartões podem ser de dois tipos:

1. **Action:** são os cards que envolvem codificação, como a implementação de novas funcionalidades \(features\) ou ajustes em partes do projeto. 
2. **Feature:** são os cards que, como o nome sugere, indicam uma ação a ser feita. Por exemplo, realizar um teste de campo com os usuários. 

![](https://lh5.googleusercontent.com/1I3yXY8rsLsu3HgoIOOxH77NrMts42tKz30upnLI3qfRO9Ui6cD1NP-ZgtcSHZfji8kvN97DRfzSGj1fLjPCVg86lQVmVrHb-9gZaf2r4ymLdcIfEI_WrteXRJr9HUU0meFIFSyF)

Quando um cartão de feature é adicionado, o Charles cria uma nova branch no git do cliente que, por sua vez, é armazenada diretamente no SCM utilizado, seja ele Git ou Bitbucket por exemplo.  

A arquitetura funciona da seguinte maneira:

![](https://lh6.googleusercontent.com/s6GbTz2AW12QOGDsvY6GKquiN5sL43OH99qHiJDixrfTrNv32kzeAaiRZSN57nGm8FS0jGn38O0LDiIYsNzzpdZ4brVze91ok88cLD6aSmZSc_hRdqlCKwg7D4PG8JvKB9djJKVq)

  


