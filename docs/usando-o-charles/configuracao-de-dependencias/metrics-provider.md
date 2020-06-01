# Provedor de Métricas

É possível também configurar um provedor de métricas, o qual vai ser utilizado pelo Charles para fazer leituras e permitir o acompanhamento da saúde de cada um dos seus círculos.

{% hint style="warning" %}
Para configurar sua ferramenta de métricas para ler e expor os dados dos círculos, sugiro dar uma olhada [aqui]().
{% endhint %}

1. Clique no seu nome, no canto inferior esquerdo e, em seguida, selecione **Settings**.
2. Clique em **Credentials**.
3. Clique em **Add Metric Provider**.
4. Selecione a **opção de ferramenta** que você utiliza.
5. Faça a **configuração** de acordo com sua ferramenta.

{% hint style="warning" %}
Você pode encontrar quais ferramentas o Charles aceita [aqui]().
{% endhint %}

![](../../.gitbook/assets/metrics-provider.gif)

## Prometheus 

Se deseja utilizar o Prometheus como seu provedor de métricas é preciso seguir os seguintes passos:

1. Selecione a opção **Prometheus** na listagem.
2. Clique em **Add**.
3. Digite a **URL** do seu Prometheus.
4. Clique em **Save**.

