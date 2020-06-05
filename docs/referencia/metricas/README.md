# Métricas

As métricas são os indicadores que permitem você quantificar o **desempenho e o status de suas aplicações** a partir da análise de dados expostos pelas próprias aplicações e pelas ferramentas de infraestrutura.

Com o Charles, você pode obter métricas de cada um dos seus círculos, possibilitando assim análises sobre a[ **saúde**](../../primeiros-passos/criando-modulos.md#metricas-de-saude) ****de cada um deles.

![Painel de m&#xE9;tricas no Charles ](../../.gitbook/assets/metricas%20%281%29.png)

## Quais as métricas disponíveis no Charles?

Atualmente, é possível extrair duas métricas relacionadas ao CharlesCD, que são:

| Nome da métrica | Qual informação gerada | Tipo da métrica |
| :--- | :--- | :--- |
| istio\_charles\_request\_total | Número total de requisições | Contador |
| istio\_charles\_request\_duration\_seconds | Agrupamento do tempo de resposta de cada requisição | Histograma |

### Metainformações

A partir de cada métrica, é possível extrair uma série de metainformações, ou seja, de atributos ou informações complementares a essas métricas e que podem ser obtidas com diversos tipos de filtros e análises.

Na tabela abaixo, estão algumas metainformações existentes nas métricas do CharlesCD:

| Metadado | Descrição | Tipo | Métricas que estão presentes |
| :--- | :--- | :--- | :--- |
| source | Nome da POD da qual foi feita a requisição, ou "unknown" se a requisição tiver origem fora da malha | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_pod | Nome da POD para onde foi destinada requisição ou "unknown" se a requisição tiver um destino fora da malha | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_host | Endereço para onde foi feito a requisição | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| destination\_component | Valor presente na label "app" da POD que recebeu a requisição ou "unknown" se a informação não estiver presente | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| circle\_id | Header "x-circle-id" que é passado nas requisições ou "unknown" se o header não estiver presente | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| circle\_source | Header "x-circle-source" que é colocado pelo filtro do Envoy na interceptação de cada requisição | Texto | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |
| response\_status | O status HTTP da resposta daquela requisição | Número | istio\_charles\_request\_total, istio\_charles\_request\_duration\_seconds |

