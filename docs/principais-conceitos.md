---
description: >-
  Nesta seção, você encontra definições para os principais termos e expressões
  utilizadas na documentação e na plataforma do Charles ou ainda em discussões
  dentro da comunidade de desenvolvedores.
---

# Principais Conceitos

### **Circle Matcher**

Trata-se de um serviço HTTP que permite você identificar a qual segmentação o usuário pertence, a partir de regras lógicas previamente definidas. Para isso, o ****[**Circle Matcher**](referencia/circle-matcher.md) ****recebe na requisição um JSON com os atributos sobre o usuário, e retorna uma lista de círculos.

### **Círculos**

\*\*\*\*[**Círculos** ](referencia/circulos.md)são grupos de usuários criados a partir de características específicas dentro de um mesmo ambiente na plataforma do Charles. Dessa forma, o desenvolvedor pode segmentar os usuários de acordo com as regras \(AND ou OR\) que mais fizerem sentido para testar aquela release. 

Por exemplo, é possível [**criar um círculo**](referencia/circulos.md#como-criar-circulos) ****de engenheiros da região Norte do Brasil, outro de engenheiros do sudeste e um terceiro contendo todos os engenheiros brasileiros. Baseado nessa segmentação de clientes, pode-se elaborar diversas lógicas de deploy.

### **Componentes**

Fazem parte dos [**módulos**](primeiros-passos/criando-modulos.md) que são criados dentro do Charles. Os componentes funcionam como abstrações das aplicações, o que significa dizer que eles possuem suas próprias configurações e que cada parte deles corresponde a uma aplicação do módulo em que você estiver trabalhando. Caso você trabalhe com um monorepo, cada uma das suas aplicações serão cadastradas como componentes dentro de um único módulo.

### **Hipóteses**

Aplicando Desenvolvimento Orientado à Hipótese \(_Hypothesis-Driven Development_\) ou não, uma hipótese representará o desenvolvimento de uma nova ideia que será utilizada como experimento para alcançar um resultado esperado. Caso o resultado não seja atingido, novas hipóteses com outras abordagens podem ser criadas e mensuradas até que realmente se tenha o resultado desejado ou até mesmo se prove que a ideia não é viável.

No Charles, as hipóteses podem conter uma ou mais features, que estão relacionadas diretamente aos módulos foram cadastrados anteriormente ao seu [**workspace**.](primeiros-passos/definindo-workspace/)

### Mar Aberto \(Default\)

O termo, cunhado com o Charles, se refere a uma segmentação genérica em que estão presentes todos os usuários inseridos na plataforma que não estão vinculados a um círculo. 

Ou seja, nessa segmentação estará uma versão padrão da sua aplicação, onde todos os usuários, que não estão associados a um teste de hipóteses, acessarão. É nessa segmentação também que, dada uma hipótese validada, deverá ser implantada uma nova release para que todos acessem.

### Módulos

Módulo é a representação de um repositório no seu git. Além disso, um módulo pode conter uma ou mais aplicações, ou seja, um ou mais componentes.

