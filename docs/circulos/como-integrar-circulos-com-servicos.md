# Outras configurações

## Como integrar círculos com serviços?

Uma vez detectado o [círculo ao qual o usuário pertence](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/circulos/como-identificar-os-circulos), esta informação deve ser repassada para todas as próximas requisições através do parâmetro `x-circle-id` no cabeçalho. Isto deve ser feito para que o Charles detecte, pelo ID do círculo, para qual versão da aplicação uma determinada requisição será encaminhada. Observando o exemplo abaixo:

![](https://lh4.googleusercontent.com/Loz2rqbAeLX8DbdzQgZuhpNapQ8LrBT1OQhDm76LRX31VOuASMQOn-hdBQ4GTHhv9Hwcm3aoO_44_mUjtFqy7CFy5hPsWNu8-yNMI5M9Vbtv7fpFt_6kZVpwgXWI1fDGDvT1Jz-A)

Na prática, em algum momento durante a iteração do usuário com a aplicação \(App1\) - como no login, por exemplo - o `charles-circle-matcher` \(_Circle\_Matcher_\) **-** deverá ser acionado para obter o círculo.

Com isto, o ID deve ser repassado como valor no parâmetro `x-circle-id` localizado no cabeçalho da requisição das próximas chamadas \(App2\). O Charles é responsável por propagar essa informação que, quando recebida pelo Kubernetes, é então utilizada para redirecionar a requisição para a versão correspondente ao *deploy* realizado no círculo.

Caso o `x-circle-id` não seja repassado, todas as requisições serão redirecionadas para versões de “Mar Aberto”, ou seja, para *releases* padrões das suas aplicações sem uma segmentação específica.

## **Caso de mesclas de serviços com versões diferentes na release**

Para facilitar o entendimento, vamos exemplificar com um cenário onde a stack possui dois serviços: **Aplicação A** e **Aplicação B,** e os círculos devem fazer o uso das seguintes versões:

![](https://lh6.googleusercontent.com/PjntFPxklkheXaxENj4gPR4exVyRS7Y3vs8C7Ir5Pz8SV_mNeq5TBXUdmY75Fwlekm2lgLgm5jgoAoFCeuVXxaabUBWpuVVgNssHCpuhHu8Ky9RicGT6XANcmEYdrgLtPby5DhRG)

Sendo assim, a lógica de redirecionamento utilizando o `x-circle-id` será:

1. O usuário envia no cabeçalho: `x-circle-id=”Círculo QA”`. Neste círculo, a chamada será redirecionada para a **versão X** do serviço **Aplicação A** e a **versão Y** do serviço **Aplicação B**. 
2. O usuário envia no cabeçalho: `x-circle-id=”Circulo Dev”`. Neste círculo, a chamada será redirecionada para a **versão Z** do serviço **Aplicação A e a versão Z** do serviço **Aplicação B.**

![](https://lh4.googleusercontent.com/mt1IFhRcmDlL6g_lWSXmP4u93sowFc2VMMpcGz5sGUH9z8mRzvmzZwn4ZYu8LsbOHN5lzRf_ByiXaKnKjil_C4kWUKwrKfRD6ACd_9bvGwPCT48ff7uH2cULkR-JHq0IXT01ir5B)

## Como rotear círculos com o cluster de Kubernetes?

Para entender melhor como o **Charles** envolve o **Kubernetes** e o **Istio** no roteamento de requisições, considere o seguinte cenário onde existem dois círculos:

* Moradores de Campinas \(identificados pelo ID 1234\);
* Moradores de Belo Horizonte \(identificadoss pelo ID 8746\).

Em ambos os círculos, foram implantadas *releases* do serviço chamado "application", entretanto com versões diferentes:

* Moradores de Campinas \(1234\): utilizam a versão v2.
* Moradores de Belo Horizonte \(8746\): utilizam a versão v3.

Além disto, existe uma versão *default* \(v1\) para usuários que não se encaixam em nenhum círculo específico.

Supondo que, ao realizar a requisição para identificação do usuário, seja indicado o id 8756. Com isto, esta informação deverá ser repassada nas próximas interações com os serviços, através do cabeçalho `x-circle-id`.

A imagem abaixo apresenta o fluxo que o Charles utiliza para rotear a requisição para a release correta:

![](https://lh6.googleusercontent.com/YlEzKbbMWP3BLlrv_mlc9YHSu1B5neFnTeh7Eek1_j2pt386usmVgmTAGEaL0PU_g6496btCR5zT2ej-_IQQYds7NhordMDpu9n1FgLkQL4MsKxGvepW-U1oEePFhX9N3V6UsYSI)

Ao realizar a implantação de uma versão em um círculo, o Charles realiza todas as configurações para que o roteamento seja feito da maneira correta. Entretanto, para entender melhor como ele acontece, vamos utilizar um cenário onde uma requisição vem de um serviço fora da stack, como mostra na figura abaixo:

1. A requisição será recebida pela **Ingress**, que realiza o controle do tráfego para a malha de serviços. 
2. Uma vez permitida a entrada da requisição, o **Virtual Service** consulta o conjunto de regras de roteamento de tráfego a serem aplicadas ao *host* endereçado. Neste caso, a avaliação acontece através da especificação do cabeçalho `x-circle-id`, de maneira que o tráfego corresponda ao serviço "application". 
3. Além do serviço, também é necessário saber qual é o subconjunto definido no registro. Esta verificação é feita no **Destination Rules**. 
4. O redirecionamento do tráfego é realizado com base nas informações anteriores, chegando então à versão do serviço.  

Caso o `x-circle-id` não seja informado, existe uma regra definida no **Virtual Service** que irá encaminhar para a versão padrão \(v1\).

![](https://lh3.googleusercontent.com/lDpIwX99uSkIyT08s5R5d5wakyTpDjgc2NUmERB2M5HK2QVSXRsitpB5QXyMHTGUXtXGgG5Ib4xCO2WW1rn2Rhf5Jihuc7vZKT4A_5GLImUtwkS3fBw1EqbGafbIQgIKyQHLz_1t)

