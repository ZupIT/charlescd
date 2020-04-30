# O que são e como criar releases?

{% hint style="warning" %}
Releases são as versões de uma aplicação. 
{% endhint %}

Dependendo da modalidade de deployment adotada pelo time de desenvolvimento, as releases podem passar por diversos ambientes até chegar em produção. ****No caso do Charles, você pode publicar a mesma release em diversos [círculos](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/circulos/o-que-sao-circulos). 

## Como criar releases?

{% hint style="warning" %}
Ao arrastar sua hipótese para a coluna de Ready To Go, dentro de um Board, você indica ao sistema irá quer transformar aquela hipótese em uma release. 
{% endhint %}

Para isso, é necessário preencher algumas informações. 

Existe a restrição de não adicionar o mesmo componente duas vezes. Entretanto, pode-se adicionar múltiplos módulos para compor a nova release.  


| **DADO** |                                                        **DESCRIÇÃO** |
| :--- | :--- |
|  **Release Name** | As releases sempre terão o prefixo "release-darwin", entretanto o sulfixo pode ser determinado pelo usuário. Ele identificará a nova versão. |
|  **Module** | Aparecerá uma lista de todos os módulos cadastrados anteriormente. |
|  **Component** | Caso o módulo possua mais de um componente cadastrado, eles serão listados nesse campo. |
|  **Version** | Todas as versões existentes desse componente do módulo estarão listadas. |

Após finalizar esse processo, será feito automaticamente um merge entre a release master e a branch relacionado aquela feature. Na sequência, o cartão é imediatamente movido para coluna de Builds, na qual o primeiro círculo de uma feature já é implantado.  

{% hint style="success" %}
É possível ter dois status referente ao build da feature:

1. **Build success:** significa que a imagem foi gerada pelo CI do cliente e enviada ao docker registry. Em outras palavras: o deploy da imagem foi executado. ****
2. **Build fail / Error:** significa que ou a imagem não foi gerada, ou o tempo de espera excedeu o tempo configurado no board ou houve falha no deploy.
{% endhint %}

### **Arquitetura do processo**

1. A aplicação web \(`charles-ui`\) solicita ao orquestrador \(`charles-application`\) que sejam feitos o merge e a geração da branch a partir dos metadados fornecidos pelo usuário. 
2. O orquestrador do `charles-application` processa essa solicitação e gera uma nova branch dentro do SCM do cliente através de um merge entre a release master e a branch da feature. 
3. Nesse momento, um webhook é disparado para o CI do cliente informando que é necessário executar o pipeline da nova branch. Para que esse processo funcione, é necessário ter configurado o webhook para que ele reconheça branchs que iniciem com nome `release-charles`. 
4. O CI então executa um processo de geração da imagem da branch em questão e adiciona a nova imagem gerada no docker registry do cliente. 
5. Enquanto essa nova imagem está em processamento, o `charles-villager` monitora o docker registry. Depois que ele identifica que foi gerada uma nova versão da branch, ele avisa ao orquestrador do `charles-application` que deu certo o processamento do pipeline.   

O village aguarda a criação da nova versão por até 15 minutos. Caso ela não seja feita nesse intervalo, é considerado time out \(que pode ser configurado via aplicação\) e, por isso, ele dispara um aviso ao orquestrador do board informando que o processo falhou.

![](https://lh6.googleusercontent.com/mUOoYf54FIvLtLk-PVH2GwHOwg-aVaziiHjNR5z4bgIkoK1aphdLWd2ototSsGOrUP-q4sf0uAmrGzt2vTLKw4DRPnwdp1JBHtit6CgRlwF35yCtIMtVPYx9dWGvetB9A32Ctqls)



## Como buscar uma release existente?

Caso a release tenha sido gerada através do Board, você pode buscá-la filtrando e selecionando a versão anterior. Isso porque o arquivo, nesse caso, pode ser composto por versões de diversos módulos com vários componentes.  
  
 Dessa forma, a realização do [deploy em círculos](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/conceitos/conceito-de-deploy-em-circulos) se torna mais ágil.

