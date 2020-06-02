# Configurando as métricas

A configuração de métricas no Charles é realiza em duas partes, a primeira delas é feita no **Istio** e a segunda no seu **próprio provedor**. Vamos detalhar cada uma delas abaixo.

## Configurando Istio

As métricas relacionadas às requisições de cada círculo podem ser quantificadas e expostas pelo Istio.

{% hint style="info" %}
Antes, caso queira entender mais sobre telemetria no Istio, recomendamos que consulte a [**doc oficial**](https://istio.io/docs/tasks/observability/metrics/).
{% endhint %}

### **Parte** 1: Habilitando o Istio

Para começar, é necessário primeiro garantir que você já tem o seu **Istio habilitado para expor métricas**. Feito isso, você deve configurá-lo para expor as métricas dentro do Charles.

Caso você já tenha feito essa habilitação, pode seguir direto para segunda parte. Se este não for o seu caso, siga os seguintes passos:

{% hint style="warning" %}
Antes, vale reforçar que as configurações abaixo se referem à versões superiores à 1.5 do Istio.
{% endhint %}

**Passo 1:** Crie um arquivo chamado **telemetry.yaml** com o conteúdo abaixo.

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

**Passo 2:** Execute o comando abaixo.

{% hint style="warning" %}
É necessário ter configurado o istioctl para executar o comando caso não tenha, clique [**aqui**](https://istio.io/docs/setup/getting-started/#download).
{% endhint %}

```bash
$ istioctl manifest apply -f telemetry.yaml
```



### **Parte 2: Adicionando as métricas do Charles no Istio**

Uma vez feita a habilitação do Istio, você precisa executar o comando abaixo para configurar a opção de expor as métricas relacionadas ao Charles:

```bash
$ kubectl apply -f your-metrics-config.yaml
```

{% hint style="warning" %}
O arquivo your-metrics-config.yaml que está sendo usado deve ser referente à ferramenta que você utiliza.
{% endhint %}

Atualmente, o Charles oferece suporte apenas o Prometheus como ferramenta de métricas. Você encontra abaixo o arquivo para sua configuração.

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

## Configurando sua própria ferramenta de métricas

Depois de habilitar o Istio, você precisa configurar sua ferramenta para que ela possa ler as métricas expostas.

O primeiro passo é selecionar qual das **ferramentas aceitas pelo Charles** que você utiliza.

{% hint style="info" %}
Caso a ferramenta que você utilize não seja aceita ainda, fique à vontade de [**sugerir para nós**](https://github.com/ZupIT/charlescd/issues), ou faça sua implementação e [**contribua conosco**](https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md). Faça nossa comunidade crescer cada vez mais.
{% endhint %}

Abaixo, você confere detalhes da ferramenta compatível com Charles.

{% tabs %}
{% tab title="Prometheus" %}
O Prometheus é uma ferramenta de código aberto focada em monitoramento e alertas. É considerada a principal recomendação para monitoramento do [**Cloud Native Computing Foundation**](https://cncf.io/), além de uma das principais ferramentas do mercado.

{% hint style="info" %}
Se quiser saber mais, sugerimos a [**doc oficial**](https://prometheus.io/).
{% endhint %}

É preciso configurar o Prometheus para que ele consiga ler e armazenar os dados das métricas que habilitamos, conforme o tutorial que explicamos no início.

{% hint style="warning" %}
É importante lembrar que, para que essas configurações funcionem, é necessário que seu Prometheus esteja no mesmo cluster de Kubernetes que o Istio e o restante das suas aplicações.
{% endhint %}

Basta adicionar o job abaixo para realizar a configuração. Só fique atento para que a configuração `namespaces`, pois o valor configurado deve ser igual ao que foi instalado no seu Istio.

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
{% endtab %}
{% endtabs %}

