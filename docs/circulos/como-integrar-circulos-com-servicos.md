# Como integrar círculos com serviços?

Uma vez detectado o **\*\*\[**círculo ao qual o usuário pertence\*\*\]\([https://app.gitbook.com/@zup-products/s/charles/v/v1.6/circulos/como-identificar-os-circulos](https://app.gitbook.com/@zup-products/s/charles/v/v1.6/circulos/como-identificar-os-circulos)\), essa informação deve ser repassada para todas as próximas requisições através do parâmetro x-circle-id no header. Isso acontece porque o Charles detecta pelo ID do círculo para qual versão da aplicação uma determinada requisição deve ser encaminhada. Vejamos o exemplo abaixo:

![](https://lh4.googleusercontent.com/Loz2rqbAeLX8DbdzQgZuhpNapQ8LrBT1OQhDm76LRX31VOuASMQOn-hdBQ4GTHhv9Hwcm3aoO_44_mUjtFqy7CFy5hPsWNu8-yNMI5M9Vbtv7fpFt_6kZVpwgXWI1fDGDvT1Jz-A)

Na prática, em algum momento durante a iteração do usuário com a sua aplicação \(App1\) - como no login, por exemplo - o `charles-circle-matcher` \(_Circle\_Matcher_\) **-** deverá ser acionado para obter o círculo.

Com isso, o ID deve ser repassado como valor no parâmetro x-circle-id localizado no header da requisição das próximas chamadas \(App2\). O Charles é responsável por propagar essa informação que, quando recebida no Kubernetes, seja utilizada para redirecionar a requisição para a versão correspondente ao deploy realizado no círculo.

Caso o x-circle-id não seja repassado, todas as requisições serão redirecionadas para versões de “Mar Aberto”, ou seja, para releases padrões das suas aplicações sem uma segmentação específica.

## **Caso de  mesclas de serviços com versões diferentes na minha release**

Para facilitar seu entendimento, vamos exemplificar com um um cenário onde a sua stack possui dois serviços: **Aplicação A** e **Aplicação B,** e os seus círculos devem fazer o uso das seguintes versões:

![](https://lh6.googleusercontent.com/PjntFPxklkheXaxENj4gPR4exVyRS7Y3vs8C7Ir5Pz8SV_mNeq5TBXUdmY75Fwlekm2lgLgm5jgoAoFCeuVXxaabUBWpuVVgNssHCpuhHu8Ky9RicGT6XANcmEYdrgLtPby5DhRG)

Sendo assim, a lógica de redirecionamento utilizando o x-circle-id será:

1. O usuário envia no header: `x-circle-id=”Círculo QA”`. Nesse círculo, a chamada será redirecionada para a **versão X** do serviço **Aplicação A** e a **versão Y** do serviço **Aplicação B**. 
2. O usuário envia no header: `x-circle-id=”Circulo Dev”`. Nesse círculo, a chamada será redirecionada para a **versão Z** do serviço **Aplicação A e a versão Z** do serviço **Aplicação B.**

![](https://lh4.googleusercontent.com/mt1IFhRcmDlL6g_lWSXmP4u93sowFc2VMMpcGz5sGUH9z8mRzvmzZwn4ZYu8LsbOHN5lzRf_ByiXaKnKjil_C4kWUKwrKfRD6ACd_9bvGwPCT48ff7uH2cULkR-JHq0IXT01ir5B)

