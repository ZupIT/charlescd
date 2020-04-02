# Conceito de deploy em círculos

Quando analisamos a confiabilidade de um site, ou o Site Reliability Engineering \(SRE\), um dos indicadores mais importantes é o percentual de tolerância de erros que esse sistema deve apresentar, mais conhecido como error budget. Em geral, o valor médio deste error budget é 0,01%

Na prática, isso significa os times de desenvolvimento e de operações têm um espaço cada vez menor para instabilidades ou falhas no sistema. 

Por isso que um dos principais desafios é: 

#### **"Como realizar o deploy das aplicações de forma eficiente e com menor impacto possível ao error budget?"** 

O deployment em círculos foi criado com objetivo de sanar esse problema. Isto porque, ao criar círculos com grupos específicos de usuários, os desenvolvedores conseguem implantar releases que podem ser testadas e validadas simultaneamente, antecipando a identificação de erros antes que a release vá para ambiente de produção, trazendo assim mais segurança para aplicação.

![Deploy em c&#xED;rculos](../.gitbook/assets/conceito-de-deploy-em-circulos%20%282%29.png)

  
  
****Ainda em dúvidas sobre os conceitos de deploys ou dos círculos? Você pode consultar a seção [**círculos**](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/circulos/o-que-sao-circulos) ou o nosso [**glossário técnico**](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/apis/glossario-tecnico)**.**

