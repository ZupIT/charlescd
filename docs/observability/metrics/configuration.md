# Configuração

## Configurando Istio

As métricas relacionadas à requisições de cada círculo são quantificadas e expostas pelo Istio, por isso é necessário configura-lo para que se tenha informações referentes à cada círculo.

{% hint style="info" %}
Se deseja entender um pouco mais sobre a metrificação do Istio, recomendamos que olhe [aqui](https://istio.io/docs/tasks/observability/metrics/).
{% endhint %}

Para configurar seu Istio para expor as métricas relacionas ao charles é necessário executar o seguinte comando no seu cluster Kubernetes.

```bash
$ kubectl apply -f path/your-metrics-config.yaml
```

{% hint style="info" %}
 O arquivo your-metrics-config.yaml que está sendo usado deve ser referente à ferramenta que você utiliza.
{% endhint %}

Os arquivos para configuração podem ser encontrados abaixo.

{% tabs %}
{% tab title="Prometheus" %}
```yaml
# Configuration for request count metric instance
apiVersion: config.istio.io/v1alpha2
kind: instance
metadata:
  name: charlesrequesttotal
  namespace: istio-system
spec:
  compiledTemplate: metric
  params:
    value: "1"
    dimensions:
      source: source.workload.name | "unknown"
      destination_pod: destination.workload.name | "unknown"
      destination_host: request.host | "unknown"
      destination_component: destination.labels["app"] | "unknown"
      circle_id: request.headers["x-circle-id"] | "unknown"
      circle_source: request.headers["x-circle-source"] | "unknown"
      response_status: response.code | 200
    monitoredResourceType: '"UNSPECIFIED"'
---
# Configuration for response duration metric instance
apiVersion: config.istio.io/v1alpha2
kind: instance
metadata: 
  name: charlesrequestduration
  namespace: istio-system
spec: 
  compiledTemplate: metric
  params: 
    value: response.duration | "0ms"
    dimensions:
      source: source.workload.name | "unknown"
      destination_pod: destination.workload.name | "unknown"
      destination_host: request.host | "unknown"
      destination_component: destination.labels["app"] | "unknown"
      circle_id: request.headers["x-circle-id"] | "unknown"
      circle_source: request.headers["x-circle-source"] | "unknown"
      response_status: response.code | 200
    monitoredResourceType: '"UNSPECIFIED"'
---     
# Configuration for a Prometheus handler
apiVersion: config.istio.io/v1alpha2
kind: handler
metadata:
  name: charleshandler
  namespace: istio-system
spec:
  compiledAdapter: prometheus
  params:  
    metrics:
    - name: charles_request_total # Prometheus metric name
      instance_name: charlesrequesttotal.instance.istio-system
      kind: COUNTER
      label_names:
      - source
      - destination_pod
      - destination_host
      - destination_component
      - circle_id
      - circle_source
      - response_status
    - name: charles_request_duration_seconds # Prometheus metric name
      instance_name: charlesrequestduration.instance.istio-system
      kind: DISTRIBUTION
      label_names:
      - source
      - destination_pod
      - destination_host
      - destination_component
      - circle_id
      - circle_source
      - response_status
      buckets:
        explicit_buckets:
          bounds:
          - 0.01
          - 0.025
          - 0.05
          - 0.1
          - 0.25
          - 0.5
          - 0.75
          - 1
          - 2.5
          - 5
          - 10
---
# Rule to send metric instances to a Prometheus handler
apiVersion: config.istio.io/v1alpha2
kind: rule
metadata:
  name: charlesprom
  namespace: istio-system
spec:
  actions:
  - handler: charleshandler
    instances:
    - charlesrequesttotal
    - charlesrequestduration
```
{% endtab %}
{% endtabs %}



