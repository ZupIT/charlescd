# Metrics

## What are metrics?

Metrics are indicators that allows you to quantify the performance and the applications status based on the analysis of exposed data from the own application and by the infrastructure tools.

CharlesCD allows you to get the metrics of all your circles, you will be able to see their [**health**](https://docs.charlescd.io/get-started/creating-your-first-module) analysis and performances.

## Charles' available metrics

CharlesCD metrics are:

| Metrics name | Description | Type of metric |
| :--- | :--- | :--- |
| istio\_charles\_request\_total | Total amount of requests | Counter |
| istio\_charles\_request\_duration\_seconds | Response time for each request | Histogram |

### Metadata

Each metric has a metadata range that allows a variety of filter and analysis types to be created. These metadata are described on the table below:

| Metadata | Description | Type | Metrics that are present |
| :--- | :--- | :--- | :--- |
| source | POD name from which the request was made or 'unknown' if the request originates outside. | Text | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_pod | POD's name where the targeted request went or unknown if the request was originated outside the mesh | Text | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_host | Address where the request was made | Text | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_component | Value on the label 'app' of the pod that received the request or unknown if there is no information about it. | Text | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| circle\_id | 'x-circle-id' header that goes through the request or 'unknown' if the header is not present. | Text | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| circle\_source | 'x-circle-source' header that is placed by the Envoy filter at the interception of each request. | Text | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| response\_status | HTTP status of the response. | Numeric | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |

