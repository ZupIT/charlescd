# Metrics

## O que são as métricas?

As métricas são os indicadores que permitem quantificar o desempenho e o status de suas aplicações a partir da análise de dados expostos pelas próprias aplicações e pelas ferramentas de infraestrutura. 

O Charles permite que você obtenha métricas de cada um dos seus círculos, possibilitando assim análises sobre a [**saúde** ](https://docs.charlescd.io/primeiros-passsos/modules#limites-de-saude)e o desempenho dos círculos. 



## As métricas disponíveis no Charles

As métricas relacionadas ao CharlesCD são :

| Nome da métrica | Descrição | Tipo da métrica |
| :--- | :--- | :--- |
| istio\_charles\_request\_total | Contagem do número de requisições | Contador |
| istio\_charles\_request\_duration\_seconds | Agrupamento do tempo de resposta de cada requisição | Histograma |

### Metainformações

Cada métrica possui uma gama de metainformações que permitem que sejam criados os mais variados tipos de filtros e análises. Essas metainformações estão descritas na seguinte tabela.

| Metadado | Descrição | Tipo | Métricas que estão presentes |
| :--- | :--- | :--- | :--- |
| source | Nome da POD da qual foi feita a requisição, ou "unknown" se a requisição tiver origem de fora da malha | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_pod | Nome da POD para onde foi destinada requisição, ou "unknown" se a requisição um destino fora da malha | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_host | Endereço para onde foi feito a requisição | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_component | Valor presente na label "app" da POD que recebeu a requisição , ou "unknown" se tal informação não estiver presente | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| circle\_id | Header "x-circle-id" que é passado nas requisições, ou "unknown" se o header não estiver presente | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| circle\_source | Header "x-circle-source" que é colocado pelo filtro do Envoy na interceptação de cada requisição | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| response\_status | O status HTTP da resposta daquela requisição | Numérico | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |

