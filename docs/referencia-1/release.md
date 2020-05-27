# Release

Releases are application versions. It is different from other ways of deploy that releases generally go through lots of environments until they reach production, with CharlesCD it is possible that the same release will be published for different ****[**circles**](https://docs.charlescd.io/referencia/circulos).

_Releases são as versões de uma aplicação. Diferente de outras formas de deploy, em que as releases geralmente passam por diversos ambientes até chegar ao de produção, no CharlesCD é possível que uma mesma release seja publicada para diferentes_ [_**círculos**_](https://docs.charlescd.io/referencia/circulos)_**.**_ 

## How to create releases with Charles?

There are two ways to create releases with Charles:

1. Hypothesis board;
2. Existing images on docker registry.

The first one offers a better use of the product, because it works with the hypothesis concept tests during the development cycle. The second option offers the flexibility needed if you want cases which the generation of artifacts or the development process are apart from CharlesCD.

_A primeira delas oferece todo o potencial de uso do produto, pois trabalha com o conceito de teste de hipóteses durante todo o ciclo de desenvolvimento. Já a segunda oferece a flexibilidade necessária para casos em que é desejado que toda a parte de desenvolvimento e geração de artefatos estejam apartadas do CharlesCD._

### Releases through hypothesis board

After registering a **hypothesis** on Charles, you can use the board that is automatically generated to create and manage cards that represents your hypothesis development. 

This boards shows two cards categories: **the blue one represents a feature coding** and **the gray one a action that does not involve implementation.** 

_Após o cadastro de uma_ [_**hipótese**_](hipotese.md#como-criar-hipoteses) _dentro do Charles, você pode utilizar o quadro que é gerado automaticamente para criar e gerenciar cartões que representam o desenvolvimento da sua hipótese._

_Neste quadro, temos duas categorias de cartões: o **azul que representa a codificação de uma feature** e o **cinza que caracteriza às ações que não envolvem implementação**._

If you want to generate new releases, the blue cards represent features, when they are on the **Ready to Go** column, you select only one or a subset of them to build a release. 

_Para gerar novas releases, os cartões azuis, que representam as features, são os que importam. Quando eles estão na coluna **Ready to Go**,  você seleciona apenas um ou um conjunto deles para construir a release._

**\[GIF DA SELEÇÃO DOS CARDS\]**

When a release creation is triggered, a new branch with the prefix **release-darwin** will be created on the module repository and the configured CI tool will go off. Besides that, a new card with the **'Building'** status will show up on the **Builds** column to represent a process in progress.

_Assim que a criação de uma release é acionada, uma branch com o prefixo **release-darwin** será criada no **repositório do módulo, disparando a ferramenta de CI configurada**. Além disso, um novo cartão com o estado "**Building**" aparecerá na coluna **Builds** para representar o processo em andamento._

{% hint style="warning" %}
Triggering the pipeline of your CI tool through release-darwin prefix, it is expected that it will generate a image of your application and make the push for your **registry**.

Ao acionar o pipeline da sua ferramenta de CI através do prefixo **release-darwin**, é esperado que ela gere uma imagem da sua aplicação e faça o push para o seu [**registry**](../primeiros-passsos/defining-a-workspace/docker-registry.md).
{% endhint %}

Now, the [**Villager**](https://github.com/ZupIT/charlescd/tree/master/villager) will watch your registry to search for the generated release. Hold on until you card status is changed to **Built**. 

_A partir desse momento, o_ [_**Villager**_](https://github.com/ZupIT/charlescd/tree/master/villager) _****observará o seu registry em busca da release gerada. Aguarde até que o estado do cartão passe para **Built**._

{% hint style="info" %}
Any cases of success or failure will be shown on your release card.
{% endhint %}

**\[GIF DE CASOS DE SUCESSOS, ERROS E ANDAMENTO DE BUILDS\]**

### **Releases through existing images on configured Docker Registry** 

To create a release without using the hypothesis board, it is necessary that the Docker images are already available on you **configured registry** for the module. If this requirement is done, just click on the **Circles** option on Charles menu and select the circle for a release deploy to be created. 

_Para criar uma release sem passar pelo quadro de hipóteses, é preciso que as imagens no Docker já estejam disponíveis no_ [_**registry configurado**_](https://docs.charlescd.io/primeiros-passsos/definindo-workspace/docker-registry) _para o módulo. Se esse requisito já estiver feito, basta clicar na opção **Circles** no menu do Charles e selecionar o círculo desejado para o deploy da release a ser criada._

If you are creating the circle at this moment, click on **Insert release** and then Create release. If the circle is already created, click on **Override release** and then **Create release**.

_Caso o círculo esteja sendo criado neste momento, clique em **Insert release** e logo após em **Create release**. Se o círculo já existir, clique em **Override release** e depois em **Create release.**_

On the release creation screen, fill the name and select one module and its component. On the field beside, all available images on that component will be listed on the registry. Select one and if it is necessary, add more modules to the release, click on **Add module** and repeat the previous process. When all your modules are registered, click **deploy**.

_Na tela de criação de releases, preencha o nome e selecione um módulo e sua componente. No campo ao lado, todas as imagens disponíveis daquela componente serão listadas no registry. Selecione uma e se for necessário adicione mais módulos a release, clique em **Add modules** e repita o processo anterior. Quando todos os seus módulos estiverem cadastrados, clique em **deploy**._

**\[GIF DA CRIAÇAO DE RELEASE A PARTIR DE IMAGENS EXISTENTES\]**

After this new release deploy, it will be available to use in other circles, just look for '**Search for existing releases'** option. 

_Após o deploy desta nova release, ela estará disponível para utilização em outros círculos a partir da opção **"Search for existing releases".**_

## How to search for an existing release?

If the release was generated through hypothesis board on your workspace, when you create a circle deploy, you are able to search for it on '**Search for existing releases**'.

_Se a release foi gerada através do_ [_**quadro de hipóteses**_](hipotese.md#gestao-do-board) _****no seu workspace, ao realizar o deploy em um círculo, você pode buscá-la através da opção: "**Search for existing releases"**._ 

**\[GIF PROCURANDO UMA RELEASE ATRAVÉS DO DEPLOY NO CÍRCULO\]**

