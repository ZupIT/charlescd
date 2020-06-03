# Circle Matcher

O Circle Matcher é uma funcionalidade que permite validar e/ou identificar se as regras lógicas definidas para criar segmentações nos círculos realmente estão correspondendo com os usuários adequados.

Neste sentido, existem duas formas pelas quais podem ser validadas as segmentações através do Circle Matcher. São elas:

1. **Default:** é a validação manual, onde são adicionadas todas as chaves que definem as características pré-determinadas para o círculo.  
2. **Edit JSON:** é a validação na qual é editado diretamente o JSON correspondente ao ambiente produtivo, inserindo no campo de payload para, em seguida, fazer o teste.

Em ambas as formas, o Circle Matcher indica em quais círculos se encaixam os atributos que estão sendo pesquisados. Caso aconteça de ser informado um atributo que esteja fora das condicionais configuradas nos círculos, o sistema irá indicar que aquele usuário está em "mar aberto", ou seja, no círculo *default*.

