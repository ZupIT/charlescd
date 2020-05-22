# O que é deploy em círculos?

## **"Como realizar o deploy das aplicações de forma eficiente e com menor impacto possível ao error budget?"**

O deployment em círculos foi criado com objetivo de sanar esse problema. Isto porque, ao criar círculos com grupos específicos de usuários, os desenvolvedores conseguem implantar releases que podem ser testadas e validadas simultaneamente, antecipando a identificação de erros antes que a release vá para ambiente de produção, trazendo assim mais segurança para aplicação.

Quando analisamos a confiabilidade de um site, ou o Site Reliability Engineering \(SRE\), um dos indicadores mais importantes é o percentual de tolerância de erros que esse sistema deve apresentar, mais conhecido como error budget. Em geral, o valor médio deste error budget é 0,01%

Na prática, isso significa os times de desenvolvimento e de operações têm um espaço cada vez menor para instabilidades ou falhas no sistema.

Por isso que um dos principais desafios é:

\*\*\*\*

