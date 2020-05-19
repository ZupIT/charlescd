---
description: >-
  Nesta seção, você encontra definições para os principais termos e expressões
  utilizados na documentação e na plataforma do Charles ou ainda em discussões
  dentro da comunidade de desenvolvedores.
---

# Key Concepts

### **Círculos**

[**Círculos**](https://docs.charlescd.io/referencia-1/circulos) ****são grupos de usuários criados a partir de características específicas dentro de um mesmo ambiente na plataforma do Charles. Dessa forma, o desenvolvedor pode segmentar os usuários de acordo com as regras \(AND ou OR\) que mais fizerem sentido para testar aquela release. 

Por exemplo, é possível [**criar um círculo**](https://docs.charlescd.io/referencia-1/circles) ****de engenheiros da região Norte do Brasil, outro de engenheiros do sudeste e um terceiro contendo todos os engenheiros brasileiros. Baseado nessa segmentação de clientes, pode-se elaborar diversas lógicas de deploy.

### **Hipóteses**

[**São as alternativas cadastradas**](https://docs.charlescd.io/referencia-1/hipotese) ****na plataforma para resolver algum problema ou validar uma ou mais mudanças nas aplicações que você integrou ao Charles.

As hipóteses podem conter uma ou mais features, que estão relacionadas diretamente aos módulos e/ou projetos que foram cadastrados anteriormente ao seu **workspace**.

### **Circle Matcher**

Trata-se de um serviço HTTP que permite você identificar a qual segmentação a aplicação pertence, a partir de regras lógicas previamente definidas. Para isso, o ****[**Circle Matcher** ](https://docs.charlescd.io/referencia-1/circle-matcher)recebe na requisição um JSON com os atributos do usuário ou qualquer atributo relevante, além do identificador do círculo ao qual aquele usuário pertence.

### **Componentes**

Fazem parte dos [**módulos**](https://docs.charlescd.io/primeiros-passsos/modules) que você cria dentro do Charles. Os componentes funcionam como abstrações das aplicações, o que significa dizer que eles possuem suas próprias configurações e que cada parte deles corresponde a uma aplicação do módulo em que você estiver trabalhando.

### Mar Aberto \(Open Sea\)

O termo, cunhado com o Charles, se refere a uma segmentação genérica em que estão presentes todos os usuários, inseridos na plataforma e que não estão vinculados a um círculo. 

Isso significa que se, por exemplo, você adicionar 300 usuários à sua base e não especificar para qual segmentação você quer direcionar sua hipótese, o Charles irá entregar a hipótese para todos, caindo assim no mar aberto.

