# Segmentações dos círculos

As segmentações são um conjunto de características que você define para agrupar seus usuários nos círculos do Charles. Para realizar essa ação, é possível segmentar seus usuários através do preenchimento de informações de forma manual ou por meio da importação de um arquivo csv.

Uma grande vantagem de utilizar as segmentações é porque, com elas, é possível fazer combinações lógicas entre vários atributos para criar diferentes tipos de públicos e, dessa forma, utilizá-los nos testes das hipóteses. Por exemplo, a partir da características “profissão” e “região”, pode-se criar um círculo de engenheiros da região norte, outro só com engenheiros do sudeste e um terceiro contendo todos os engenheiros do Brasil.

###  **Segmentação manual** 

Neste tipo de segmentação, você define as lógicas que o círculo deve seguir para compor um match com usuários que atendam às características pré-determinadas. 

Essas características podem ser definidas com base nas lógicas de: 

* Equal to
* Not Equal
* Lower Than
* Lower or equal to
* Higher than
* Higher or equal to
* Between
* Starts With

Isso significa que, ao setar na plataforma do Charles uma segmentação considerando um dessas variáveis acima, o sistema irá retornar com um círculo cuja base será composta por estes usuários. 

Vamos a alguns exemplos:

![](https://lh6.googleusercontent.com/5hg_2ZW34hb69J69-MtDNctjLJX5-gwBP9kgN6Bto9_tm2tK9DL-rgmvTleoVihRft37P2QmcA6MzBc3Uj_vguGM9VQVc9fhKEpittLr8LXxvThC3dewpNGsEYSHXp6KfhX8GGx_)

###  **Segmentação por importação de csv**

Neste tipo de segmentação, é utilizada apenas a primeira coluna do csv para criar as regras. O único operador lógico suportado até o momento é o OR. 

Na prática, essa modalidade permite que você possa, por exemplo, extrair de uma database externa os IDs dos clientes com um perfil específico e importá-los direto na plataforma do Charles.  


