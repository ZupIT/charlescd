# Metrics

## What are metrics? 

Metrics are indicators that allows you to quantify the performance and the applications status based on the analysis of exposed data from the own application and by the infrastructure tools.

Charles allows you to get the metrics of all your circles, you will be able to see their **health** analysis and performances.

_As métricas são os indicadores que permitem quantificar o desempenho e o status de suas aplicações a partir da análise de dados expostos pelas próprias aplicações e pelas ferramentas de infraestrutura._ 

_O Charles permite que você obtenha métricas de cada um dos seus círculos, possibilitando assim análises sobre a_ [_**saúde**_ ](https://docs.charlescd.io/primeiros-passsos/modules#limites-de-saude)_e o desempenho dos círculos._ 

## Charles' available metrics 

CharlesCD metrics are:

| Metrics name | Description | Type of metric |
| :--- | :--- | :--- |
| istio\_charles\_request\_total | Total amount of request _Contagem do número de requisições_ | Counter |
| istio\_charles\_request\_duration\_seconds | Response time for each request _Agrupamento do tempo de resposta de cada requisição_ | Histogram |

### Metadata

Each metric has a metadata range that allows a variety of filter and analysis types to be created. These metada are described on the table below:

_Cada métrica possui uma gama de metainformações que permitem que sejam criados os mais variados tipos de filtros e análises. Essas metainformações estão descritas na seguinte tabela._

<table>
  <thead>
    <tr>
      <th style="text-align:left">Metadata</th>
      <th style="text-align:left">Description</th>
      <th style="text-align:left">Type</th>
      <th style="text-align:left">Metrics that are present</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">source</td>
      <td style="text-align:left">POD name from which the request was made or &apos;unknown&apos; if the
        request originates outside . <em>Nome da POD da qual foi feita a requisi&#xE7;&#xE3;o, ou &quot;unknown&quot; se a requisi&#xE7;&#xE3;o tiver origem de fora da malha</em>
      </td>
      <td style="text-align:left">Text</td>
      <td style="text-align:left">istio_charles_request_total, istio_charles_request_duration_seconds</td>
    </tr>
    <tr>
      <td style="text-align:left">destination_pod</td>
      <td style="text-align:left">
        <p>POD&apos;s name where the targeted request went or unknown if the request
          is ...</p>
        <p><em>Nome da POD para onde foi destinada requisi&#xE7;&#xE3;o, ou &quot;unknown&quot; se a requisi&#xE7;&#xE3;o um destino fora da malha</em>
        </p>
      </td>
      <td style="text-align:left">Text</td>
      <td style="text-align:left">istio_charles_request_total, istio_charles_request_duration_seconds</td>
    </tr>
    <tr>
      <td style="text-align:left">destination_host</td>
      <td style="text-align:left">Address where the request was made</td>
      <td style="text-align:left">Text</td>
      <td style="text-align:left">istio_charles_request_total, istio_charles_request_duration_seconds</td>
    </tr>
    <tr>
      <td style="text-align:left">destination_component</td>
      <td style="text-align:left">Value on the label &apos;app&apos; of the pod that received the request
        or unknown if there is no information about it</td>
      <td style="text-align:left">Text</td>
      <td style="text-align:left">istio_charles_request_total, istio_charles_request_duration_seconds</td>
    </tr>
    <tr>
      <td style="text-align:left">circle_id</td>
      <td style="text-align:left">&apos;x-circle-id&apos; header that goes through the request or &apos;unknown&apos;
        if the header is not present</td>
      <td style="text-align:left">Text</td>
      <td style="text-align:left">istio_charles_request_total, istio_charles_request_duration_seconds</td>
    </tr>
    <tr>
      <td style="text-align:left">circle_source</td>
      <td style="text-align:left">&apos;x-circle-source&apos; header that is placed by the Envoy filter
        at the interception of each request</td>
      <td style="text-align:left">Text</td>
      <td style="text-align:left">istio_charles_request_total, istio_charles_request_duration_seconds</td>
    </tr>
    <tr>
      <td style="text-align:left">response_status</td>
      <td style="text-align:left">HTTP status of the response</td>
      <td style="text-align:left">Numeric</td>
      <td style="text-align:left">istio_charles_request_total, istio_charles_request_duration_seconds</td>
    </tr>
  </tbody>
</table>