# Cadastrando Provedor de Métricas

Para um uso completo da ferramenta, recomendamos que o módulo de métricas esteja configurado. Elas permitem quantificar a performance e o status de suas aplicações.

Para configurar as métricas no charles é necessário tanto configurar a sua ferramenta de métricas para coletar as métricas das aplicações, quanto o charles para conseguir acessar esse provedor e ler essas métricas.

{% hint style="info" %}
Você pode encontrar quais ferramentas o Charles se integra [aqui](metrics.md#provedores-aceitos).
{% endhint %}

## Configuração da ferramenta

Para configurar sua ferramenta de métricas para ler e expor os dados dos círculos, acesse [aqui](metrics.md#configuracoes-das-metricas).

## Configuração do Charles

Para configurar o Charles para ler as métricas expostas pela sua ferramenta, siga os passos abaixo.

1. Clique no seu nome, no canto inferior esquerdo e, em seguida, selecione **Settings**.
2. Clique em **Credentials**.
3. Clique em **Add Metric Provider**.
4. Selecione a **opção de ferramenta** que você utiliza.
5. Faça a configuração baseada na ferramenta selecionada.

![](../../.gitbook/assets/metrics-provider.gif)

