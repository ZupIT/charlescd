# Deploy Tradicional vs Deploy em Círculos

## Deploy Tradicional

Ao analisar o **Site Reliability Engineering \(SRE\)** das empresas, foi pontuado que o valor médio do _error budget_ é de 0,01%. Dado valor tão baixo, surgem dúvidas como, por exemplo:

> "Como realizar o deploy das aplicações de forma eficiente e impactando minimamente o _error budget?"_

![](../.gitbook/assets/image-11x-1.png)

A resposta para essa pergunta está na imagem abaixo:

![](../.gitbook/assets/untitled1x.png)

A forma tradicional prevê uma série de ambientes configurados, onde eles geralmente são definidos como: desenvolvimento, homologação, pré-produção e produção. Baseado nisso, a _release_ vai evoluindo em cada ambiente até chegar em produção, onde atinge todos os usuários.

Devido à burocracia do processo descrito, a velocidade de entrega é reduzida, impactando muitas vezes no atraso de ter no mercado _features_ decisivas para o produto. Além disso, após passar por toda esteira tradicional de desenvolvimento, caso seja identificado algum problema com a _release_, toda a base de clientes já estará atingida, afetando diretamente o _error budget_.

No intuito de mitigar tais situações do modelo tradicional, um novo conceito foi desenvolvido no Charles: _**deploy**_ **em círculos**.

## Deploy em Círculos

{% hint style="info" %}
**Círculos** são grupos de usuários criados a partir de características específicas. 😉

Por exemplo, é possível criar um círculo de engenheiros da região Norte do Brasil, outro de engenheiros do sudeste e um terceiro contendo todos os engenheiros brasileiros. Baseado nessa segmentação de clientes, pode-se elaborar diversas lógicas de deploy.
{% endhint %}

No modelo proposto **existe apenas um ambiente, o produtivo**. Entretanto, a base de usuário que irá receber a nova _release_ é fragmentada de acordo com círculo escolhido. Quanto mais você diminui a quantidade de usuários que irá ter acesso à nova _release_, o impacto de um erro se torna mínimo, dando a possibilidade de realizar diversos _deploys_ sem afetar o _error budget_. Além do mais, a quantidade de hipóteses que podem ser testadas tendem ao infinito considerando o 0,01% do _error budget_.

O _deploy em círculos_ concede ao desenvolvedor a possibilidade de testar sua hipótese apenas para o seu time de desenvolvimento e ir evoluindo a sua _feature_ para grupos maiores até chegar a todos os usuários. Da mesma forma, para a equipe de negócio, é dada a possibilidade de realizar testes de hipótese em fluxos de valores com círculos personalizados.

