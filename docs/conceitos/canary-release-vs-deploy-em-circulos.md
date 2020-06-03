# Canary Release vs Deploy em Círculos

## Canary Release

A Implantação Canário \(ou _Canary Release_\) preza a implantação de uma nova versão do _software_ de forma gradual. Dado que o novo artefato está na infraestrutura, já é possível realizar o roteamento para uma pequena parte da base de usuários e ir expandindo a medida que essa versão se torna mais confiável.

Entretanto, essa técnica não propõe nenhuma estratégia de escolha de usuários para a expansão. Ademais, se torna difícil o gerenciamento das versões existentes, te levando a ter o mínimo possível.

## Deploy em Círculos

Assim como a _Implantação Canário_, o **Deploy em Círculos** também segue o padrão de _mudança paralela_. A nova versão é testada em grupos de usuários pequenos, até se expandir para todos. Além disso, caso algum problema seja encontrado ou a hipótese já tenha sido validada, a **reversão é realizada de forma simples**: pode-se retirar os usuários daquele círculo ou realizar o deploy de outra versão para o mesmo.

A metodologia implementada pelo Charles traz vários diferenciais como:

* é simples a segmentação dos usuários com base em seu perfil ou até mesmo dados demográficos;
* criação de estratégias de implantação é sofisticada e fácil utilizando os círculos;
* em caso de múltiplas versões em paralelo no ambiente produtivo, a plataforma oferece gerenciamento;
* através de métricas, definidas durante a criação da implantação, é possível capturar e monitorar o impacto da nova versão.

