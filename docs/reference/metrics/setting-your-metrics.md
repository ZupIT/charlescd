# Setting your metrics

## Register your metrics provider

### Istio Configuration

Metrics are related to circle requests are quantified and exposed by Istio, so it's necessary to configure it to get information about each circle.

{% hint style="info" %}
If you want to learn more about Istio's telemetry, check out their [**documentation**](https://istio.io/docs/tasks/observability/metrics/)**.**
{% endhint %}

To configure your Istio, it is necessary to enable it, so it will be able to show metrics and then you have to configure to show Charles' metrics. 

If your Istio is not enabled to show metrics, follow the next steps:

{% hint style="warning" %}
The configuration below refers to Istio's 1.5 version.
{% endhint %}

Create a file named **telemetry.yaml  with the following content:** 

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

After that, run the command below:

```bash
$ istioctl manifest apply -f telemetry.yaml
```

{% hint style="warning" %}
To run the command above, it is necessary to have configured the **istioctl**, if you haven't done that, please click [**here**](https://istio.io/docs/setup/getting-started/#download). 
{% endhint %}

To show the metrics related to Charles, you have to run the command: 

```bash
$ kubectl apply -f path/your-metrics-config.yaml
```

{% hint style="warning" %}
The file **your-metrics-config.yaml** that has been used mostly to refer the tool you use.
{% endhint %}

The files for configuration can be found below: 

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

### Configuring your metrics tool

After you finish your Istio configuration it is necessary configure your metrics tool.

The first step is select the right tool, so Charles will be able to read. 

{% hint style="danger" %}
At this moment, Charles only supports Prometheus as a metric tool. We are working on to bring others along the way.
{% endhint %}

{% hint style="info" %}
If the tool you use it isn't accepted yet, feel free to [**make a suggestion**](https://github.com/ZupIT/charlescd/issues) or make your own implementation and [**contribute with us**](https://github.com/ZupIT/charlescd/blob/master/CONTRIBUTING.md). Make our community grow more each day.
{% endhint %}

{% tabs %}
{% tab title="Prometheus" %}
Prometheus is an open source system for monitoring and alerting toolkit. It is the main monitoring recommendation on [Cloud Native Computing Foundation](https://cncf.io/).

{% hint style="info" %}
If you want to know more about Prometheus, check it out [their documentation](https://prometheus.io/).
{% endhint %}

In order to Prometheus to be able to read and store metrics data, we must configure it. 

To do so, it's necessary to add the job below so it will read Istio's generated metrics. 

{% hint style="warning" %}
It is important to remember that all these configuration considers that your Prometheus is on the same Kubernetes cluster as your Istio and the rest of your applications. 
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
Stay tuned about the configuration **namespaces**, the configured value must be the same installed on your Istio.
{% endhint %}
{% endtab %}
{% endtabs %}

## 



