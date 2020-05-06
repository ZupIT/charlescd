# Configuração

## Configurando Istio

As métricas relacionadas à requisições de cada círculo são quantificadas e expostas pelo Istio, por isso é necessário configura-lo para que se tenha informações referentes à cada círculo.

{% hint style="info" %}
Se deseja entender um pouco mais sobre a metrificação do Istio, recomendamos que olhe [aqui](https://istio.io/docs/tasks/observability/metrics/).
{% endhint %}

Para configurar seu Istio para expor as métricas relacionas ao charles é necessário executar o seguinte comando no seu cluster Kubernetes.

```
$ kubectl apply -f metrics.yaml
```

{% hint style="info" %}
 O arquivo metrics.yaml que está sendo usado deve ser referente à ferramenta que você utiliza.
{% endhint %}



