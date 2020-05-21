# Release

Releases são as versões de uma aplicação. Diferente de outras formas de deploy, em que geralmente ela passa por diversos ambientes até chegar em produção, no Charles é possível que uma mesma release seja publicada para diferentes [**círculos**](https://docs.charlescd.io/referencia-1/circles). 

## Como criar releases através do Charles?

Após o cadastro de uma [**hipótese**](hipotese.md#como-criar-hipoteses) dentro do Charles, você pode utilizar o quadro que é gerado automaticamente para criar e gerenciar cartões que representam o desenvolvimento da sua hipótese.

Neste quadro, temos duas categorias de cartões: o **azul que representa a codificação de uma feature** e o **cinza que remete às ações que não necessariamente envolvem implementação**.

Para gerar novas releases, os cartões azuis, que representam features, são os que nos interessam. Uma vez que eles estão na coluna _Ready to Go_,  pode-se selecionar um ou um conjunto deles para construir a nossa release.

**\[GIF DA SELEÇÃO DOS CARDS\]**

Uma vez que a criação de uma release é acionada, uma branch com o prefixo "**release-darwin" será criada no repositório do módulo, disparando assim a ferramenta de CI configurada**. Além disso, um novo cartão com o estado "**Building**" aparecerá na coluna _Builds_ para representar o processo em andamento.

{% hint style="warning" %}
Ao acionar o pipeline da sua ferramenta de CI através do prefixo **"release-darwin"**, esperamos que ela gere uma imagem da sua aplicação e faça o push para o seu [**registry**](../primeiros-passsos/definindo-workspace/docker-registry.md).
{% endhint %}

A partir desse momento, o [**Villager**](https://github.com/ZupIT/charlescd/tree/master/villager) ****observará o seu registry em busca da release gerada. Aguarde até que o estado do cartão passe para "**Built**".

{% hint style="info" %}
Qualquer caso de sucesso ou erro estará refletido no estado do cartão da release.
{% endhint %}

## Como buscar uma release existente?

Caso a release tenha sido gerada através do [**quadro de hipóteses**](hipotese.md#gestao-do-board) ****no seu workspace, ao realizar o deploy em um círculo, você pode buscá-la através da opção: "**Search for existing releases"**. 

**\[GIF PROCURANDO UMA RELEASE ATRAVÉS DO DEPLOY NO CÍRCULO\]**

