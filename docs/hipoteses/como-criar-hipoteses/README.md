# Como criar hipóteses?

Ao cadastrar uma hipótese dentro do Charles, a sua requisição será encaminhada ao `charles-application`. Ao final desse processo, o sistema irá gerar automaticamente um quadro \(board\) no qual é possível criar e gerenciar cartões com as releases e ações necessárias para testar as hipóteses levantadas.

Esses cartões podem ser de dois tipos:

1. **Action:** são os cards que envolvem codificação, como a implementação de novas funcionalidades \(features\) ou ajustes em partes do projeto. 
2. **Feature:** são os cards que, como o nome sugere, indicam uma ação a ser feita. Por exemplo, realizar um teste de campo com os usuários. 

![](https://lh5.googleusercontent.com/1I3yXY8rsLsu3HgoIOOxH77NrMts42tKz30upnLI3qfRO9Ui6cD1NP-ZgtcSHZfji8kvN97DRfzSGj1fLjPCVg86lQVmVrHb-9gZaf2r4ymLdcIfEI_WrteXRJr9HUU0meFIFSyF)

Quando um cartão de feature é adicionado, o Charles cria uma nova branch no git do cliente que, por sua vez, é armazenada diretamente no SCM utilizado, seja ele Git ou Bitbucket por exemplo.

A arquitetura fica da seguinte maneira:

![](https://lh6.googleusercontent.com/s6GbTz2AW12QOGDsvY6GKquiN5sL43OH99qHiJDixrfTrNv32kzeAaiRZSN57nGm8FS0jGn38O0LDiIYsNzzpdZ4brVze91ok88cLD6aSmZSc_hRdqlCKwg7D4PG8JvKB9djJKVq)

