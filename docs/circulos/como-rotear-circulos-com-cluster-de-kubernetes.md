# Como rotear círculos com cluster de Kubernetes?

Para entendermos melhor como o **Charles** envolve o **Kubernetes** e o Istio no roteamento de tráfego, considere o seguinte cenário onde existem dois círculos:

* Moradores de Campinas \(identificado pelo ID 1234\);
* Moradores de Belo Horizonte \(identificado pelo ID 8746\).

Em ambos círculos foram implantadas releases do serviço chamado "application", entretanto com versões diferentes:

* Moradores de Campinas \(1234\): utiliza a versão v2.
* Moradores de Belo Horizonte \(8746\): utiliza a versão v3.

Além disso, existe uma versão default \(v1\) para usuários que não se encaixam em algum círculo específico.

Suponha que, ao realizar a requisição para identificação do usuário, seja retornado o id 8756. Com isso, essa informação deverá ser repassada nas próximas interações com serviços através do header x-circle-id. A imagem abaixo retrata como que, internamente, o Charles utiliza os recursos para rotear para a release correta:

![](https://lh6.googleusercontent.com/YlEzKbbMWP3BLlrv_mlc9YHSu1B5neFnTeh7Eek1_j2pt386usmVgmTAGEaL0PU_g6496btCR5zT2ej-_IQQYds7NhordMDpu9n1FgLkQL4MsKxGvepW-U1oEePFhX9N3V6UsYSI)

Ao realizar a implantação de uma versão em um círculo, o Charles realiza todas as configurações para que o roteamento seja feito da maneira correta. Entretanto, para entender melhor como ele acontece, vamos utilizar um cenário onde uma requisição vem de um serviço fora da stack, como mostra na figura abaixo:  


1. A requisição será recebida pela Ingress, que realiza o controle do tráfego para a malha de serviços. 
2. Uma vez permitida a entrada da requisição, o Virtual Service consulta o conjunto de regras de roteamento de tráfego a serem aplicadas no host endereçado. Nesse caso, a avaliação acontece através da especificação do header x-circle-id, de maneira que o tráfego corresponda ao serviço "application". 
3. Além do serviço, também é necessário saber qual subconjunto definido no registro. Essa verificação é feita no Destination Rules. 
4. O redirecionamento do tráfego é realizado com base nas informações anteriores, chegando então à versão do serviço.  


   Caso o x-circle-id não seja informado, existe uma regra definida no Virtual Service que irá encaminhar para a versão padrão \(v1\).



![](https://lh3.googleusercontent.com/lDpIwX99uSkIyT08s5R5d5wakyTpDjgc2NUmERB2M5HK2QVSXRsitpB5QXyMHTGUXtXGgG5Ib4xCO2WW1rn2Rhf5Jihuc7vZKT4A_5GLImUtwkS3fBw1EqbGafbIQgIKyQHLz_1t)

