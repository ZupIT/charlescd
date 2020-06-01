# Usando Círculos

1- Instalação e configuração do Circle Matcher \(referenciar, OBS: configurar no workspace\)

2- Criar círculo \(citar um cenário de segmentação\)

3- Utilizando circle matcher.

4- Deploy no círculo criado anteriormente \(deploy de uma v2 da applicação demo\).





-----

**Colocar em referência:**

O Circle Matcher é uma feature que permite você validar e/ou identificar se as regras lógicas definidas para criar segmentações nos seus círculos realmente estão puxando os usuários que você quer.

Nesse sentido, existem duas formas de você validar as segmentações através do Circle Matcher. São elas:

1. **Default:** é a validação manual, em que você vai adicionando todas as chaves que definem as características pré-determinadas para círculo.  
2. **Edit JSON:** é a validação na qual você vai direto no JSON do seu ambiente produtivo e insere no campo de payload para, em seguida, fazer o try.

Em ambas as maneiras, o Circle Matcher retorna para você em quais círculos se encaixam os atributos que estou pesquisando. Caso aconteça de você passar um atributo que esteja fora das condicionais configuradas nos círculos, o sistema irá retornar que aquele usuário está em "mar aberto", ou seja, no círculo default.

