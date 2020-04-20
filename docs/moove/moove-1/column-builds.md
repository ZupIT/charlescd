# Coluna: Builds

{% hint style="info" %}
Após a solicitação para gerar uma **release candidate**, um novo cartão será criado nessa coluna com o estado "_**Merging**"_.
{% endhint %}

![](../../.gitbook/assets/generating-release-candidate-capture.gif)

O Charles será responsável pela orquestração da resolução dos _merges_ \(caso tenham vários cartões que envolvam em módulos iguais, porém com ramificações diferentes no _git_\). Assim que esse processo for finalizado e todos os códigos tenham sido mesclados, uma nova ramificação de _release_ será criada e o estado do cartão será "_**Building**_".

{% hint style="warning" %}
Para não ser invasivo, o Charles não se envolve com a ferramenta de _Continous Integration_ \(CI\) onde está personalizado o pipeline do projeto. Portanto, espera-se que exista uma configuração que, a criação de branches com o prefixo "**release-charles**" seja um gatilho para a execução do CI.

Além disso, um dos passos obrigatórios desse processo é a geração e envio da imagem da aplicação para o[ Registry](../settings.md#registry) definido.
{% endhint %}

O microsserviço _Villager_ é o responsável de verificar que a imagem foi enviada para o _registry_ e notificar os outros serviços. Ao final de todo esse processo, caso tenha concluído com sucesso, o estado do cartão será "_**Built**_**"**.

