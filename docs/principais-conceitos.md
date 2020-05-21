---
description: >-
  You will find here definitions of the main concepts and expressions used on
  Charles' plataform and documentation.
---

# Key Concepts

### Circles

**Circles** are groups of users created from specific characteristics inside the same environment on Charles plataform. The developer is able to segment users according to the rules AND/OR that will make more sense to test that release later. 

 ****_são grupos de usuários criados a partir de características específicas dentro de um mesmo ambiente na plataforma do Charles. Dessa forma, o desenvolvedor pode segmentar os usuários de acordo com as regras \(AND ou OR\) que mais fizerem sentido para testar aquela release._ 

For example, it is possible to **create a circle** of engineers from north of Brazil and another one from the southeast, and a third one with all brazilian engineers. Based on this client segmentation, it is possible to make a variety of deployment logics. 

_Por exemplo, é possível_ [_**criar um círculo**_](https://docs.charlescd.io/referencia-1/circles) _****de engenheiros da região Norte do Brasil, outro de engenheiros do sudeste e um terceiro contendo todos os engenheiros brasileiros. Baseado nessa segmentação de clientes, pode-se elaborar diversas lógicas de deploy._

### **Hypothesis**

They are registred alternatives on the plataform to solve a problem or to validate changes on the application you have integrated on Charles. 

[_**São as alternativas cadastradas**_](https://docs.charlescd.io/referencia-1/hipotese) _****na plataforma para resolver algum problema ou validar uma ou mais mudanças nas aplicações que você integrou ao Charles._

Hypothesis can have features that are directly related to modules and/or projects that were previously registered in your workspace. 

_As hipóteses podem conter uma ou mais features, que estão relacionadas diretamente aos módulos e/ou projetos que foram cadastrados anteriormente ao seu **workspace**._

### **Circle Matcher**

It is a HTPP service that allows you to identify which segmentation the application belongs to based on predefined logic rules. For that, Circle Matcher receives a JSON request with the user's attributes, and also the circle identifier of which group that user belongs. 

_Trata-se de um serviço HTTP que permite você identificar a qual segmentação a aplicação pertence, a partir de regras lógicas previamente definidas. Para isso, o ****_[_**Circle Matcher**_ ](https://docs.charlescd.io/referencia-1/circle-matcher)_recebe na requisição um JSON com os atributos do usuário ou qualquer atributo relevante, além do identificador do círculo ao qual aquele usuário pertence._

### **Components**

Components are part of the modules you create on Charles. They work as application abstraction, which means they have their own configuration and every part of it belongs to a module application you are working on it. 

_Fazem parte dos_ [_**módulos**_](https://docs.charlescd.io/primeiros-passsos/modules) _que você cria dentro do Charles. Os componentes funcionam como abstrações das aplicações, o que significa dizer que eles possuem suas próprias configurações e que cada parte deles corresponde a uma aplicação do módulo em que você estiver trabalhando._

### Open Sea

This term was originated with Charles, it refers to a generic segmentation that are within all users inserted in the platform and that are not linked to a circle. 

For example, if you add 300 users to your database and don't specify which segmentation you want to direct your hypothesis, Charles will redirect it to all, that is when your hypothesis will fall into the open sea. 

_O termo, cunhado com o Charles, se refere a uma segmentação genérica em que estão presentes todos os usuários, inseridos na plataforma e que não estão vinculados a um círculo._ 

_Isso significa que se, por exemplo, você adicionar 300 usuários à sua base e não especificar para qual segmentação você quer direcionar sua hipótese, o Charles irá entregar a hipótese para todos, caindo assim no mar aberto._

