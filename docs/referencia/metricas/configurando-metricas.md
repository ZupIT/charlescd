# Configurando as métricas

## Cadastrando provedor de métricas

### Configurando Istio

As métricas relacionadas às requisições de cada círculo são quantificadas e expostas pelo Istio, por isso é necessário configurá-lo para que se tenha informações referentes à cada círculo.

{% hint style="info" %}
Se deseja entender um pouco mais sobre a telemetria do Istio, recomendamos que consulte a [doc oficial](https://istio.io/docs/tasks/observability/metrics/).
{% endhint %}

Para configurar seu Istio é necessário habilitá-lo para expor métricas, e configurá-lo para expor as métricas do charles.

Se seu Istio não está habilitado para expor métricas, siga os seguintes passos:

{% hint style="warning" %}
As configurações abaixo são referentes a versão 1.5 do Istio.
{% endhint %}

Crie um arquivo chamado **telemetry.yaml** com o conteúdo:

```yaml
apiVersion: install.istio.io/v1alpha2
kind: IstioControlPlane
spec:
  values:
    prometheus:
      enabled: false
    telemetry:
      v1:
        enabled: true
      v2:
        enabled: false
```

Execute o comando abaixo:

```bash
$ istioctl manifest apply -f telemetry.yaml
```

{% hint style="warning" %}
Para executar o comando acima é necessário ter configurado o istioctl, caso não tenha, clique [aqui](https://istio.io/docs/setup/getting-started/#download).
{% endhint %}

Para expor as métricas relacionadas ao Charles, é preciso executar o comando.

```bash
$ kubectl apply -f path/your-metrics-config.yaml
```

{% hint style="warning" %}
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

### Configurando sua ferramenta de métricas

Após feita a configuração do Istio é preciso configurar sua ferramenta para ser capaz de ler as métricas expostas.

O primeiro passo é selecionar qual das ferramentas aceitas pelo Charles que você utiliza.

{% hint style="danger" %}
Atualmente o Charles da suporte apenas  ao Prometheus como ferramenta de métricas, estamos trabalhando para trazer suporte a outras ferramentas no futuro.
{% endhint %}

{% hint style="info" %}
Caso a ferramenta que você utilize não seja aceita ainda, fique à vontade de [sugerir para nós](https://github.com/ZupIT/charlescd/issues), ou faça sua implementação e [contribua conosco](https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md). Faça nossa comunidade crescer cada vez mais. 
{% endhint %}

{% tabs %}
{% tab title="Prometheus" %}
Prometheus é uma ferramenta de código aberto focada em monitoramento e alertas. Sendo a principal recomendação para monitoramento do [Cloud Native Computing Foundation](https://cncf.io/), é uma das principais ferramentas do mercado.

{% hint style="info" %}
Se quiser saber mais, é só dar uma olhada na [doc oficial](https://prometheus.io/).
{% endhint %}

Para o Prometheus conseguir ler e armazenar os dados das métricas que configuramos à pouco, é preciso configurá-lo.

É preciso adicionar o job abaixo para que ele consiga ler as métricas geradas pelo Istio.

{% hint style="warning" %}
É importante lembrar que essas configurações consideram que seu Prometheus está no mesmo cluster Kubernetes que o Istio e o restante das suas aplicações.
{% endhint %}

```yaml
global:
  scrape_interval: 15s
  scrape_timeout: 10s
  evaluation_interval: 1m
scrape_configs:
- job_name: istio-mesh
  scrape_interval: 15s
  scrape_timeout: 10s
  metrics_path: /metrics
  scheme: http
  kubernetes_sd_configs:
  - role: endpoints
    namespaces:
      names:
      - istio-system #The namespace where your Istio is installed
  relabel_configs:
  - source_labels: [__meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
    separator: ;
    regex: istio-telemetry;prometheus
    replacement: $1
    action: keep
```

{% hint style="warning" %}
Fique atento à configuração "namespaces", o valor configurado deve ser o mesmo o qual foi instalado seu Istio.
{% endhint %}
{% endtab %}
{% endtabs %}

## 



