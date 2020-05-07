# Prometheus

### Overview

Prometheus é uma ferramenta de código aberto focada em monitoramento e alertas. Sendo a principal recomendação para monitoramento do [Cloud Native Computing Foundation](https://cncf.io/), é uma das principais ferramentas do mercado.

{% hint style="info" %}
Se quiser saber mais, é só dar uma olhada no [site oficial](https://prometheus.io/).
{% endhint %}

### Configuração

Para o Prometheus conseguir ler e armazenar os dados das métricas que configuramos à pouco, é preciso configura-lo.

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

{% hint style="info" %}
Fique atento à configuração "namespaces", o valor configurado deve ser o mesmo o qual foi instalado seu Istio.
{% endhint %}

