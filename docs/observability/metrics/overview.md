# Overview

O Charles dispõe de capacidade de ler métricas de cada um dos seus círculos, possibilitando assim análises sobre a saúde e o desempenho de cada um deles. 

Essas métricas são expostas pelo Istio e lidas pelo agente da sua ferramenta de métricas.

As métricas disponíveis para análise estão descritas na tabela abaixo.

| Nome da métrica | Descrição | Tipo da métrica |
| :--- | :--- | :--- |
| istio\_charles\_request\_total | Contagem do número de requisições | Contador |
| istio\_charles\_request\_duration\_seconds | Agrupamento do tempo de resposta de cada requisição | Histograma |

### Metainformações

Cada métrica possui uma gama de metainformações que permitem que sejam criados os mais variados tipos de filtro e análises. Essas metainformações estão descritas na seguinte tabela.

| Metadado | Descrição | Tipo | Métricas que estão presentes |
| :--- | :--- | :--- | :--- |
| source | Nome da POD da qual foi feita a requisição, ou "unknown" se a requisição tiver origem de fora da malha | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_pod | Nome da POD para onde foi destinada requisição, ou "unknown" se a requisição um destino fora da malha | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_host | Endereço para onde foi feito a requisição | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_component | Valor presente na label "app" da POD que recebeu a requisição , ou "unknown" se tal informação não estiver presente | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| circle\_id | Header "x-circle-id" que é passado nas requisições, ou "unknown" se o header não estiver presente | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| circle\_source | Header "x-circle-source" que é colocado pelo filtro do Envoy na interceptação de cada requisição | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| response\_status | O status HTTP da resposta daquela requisição | Numérico | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |

### Provedores aceitos

Os provedores de métrica aceitos pelo Charles são:

* [Prometheus](https://prometheus.io/)

Provedores que estão no nosso roadmap são:

* [DataDog](https://www.datadoghq.com/)
* [New Relic](https://newrelic.com/)

