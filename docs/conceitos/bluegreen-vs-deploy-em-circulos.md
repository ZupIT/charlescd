# Blue-Green Deployment vs Deploy em Círculos

## Blue-Green Deployment

O _Blue-Green Deployment_ \(também conhecido como _implantação azul-verde_\) baseia-se na existência de dois ambientes idênticos na infraestrutura, porém diferentes em relação à versão da aplicação. Com isso, um _load balancer_ é responsável por direcionar o tráfego do ambiente atual para o outro desejado. Assim que todas as validações estiverem dentro do esperado, o _load balancer_ pode ser configurado para fazer a transição o restante do tráfego para a nova versão.

O benefício dessa técnica é o fato que o _downtime_ é zero, e dá segurança para essa transição. Por outro lado, o custo é extremamente elevado, uma vez que é necessário o dobro da infraestrutura.😰

## Deploy em Círculos

A proposta do deploy em círculos é, de forma elegante, oferecer ao time confiança e rapidez no lançamento de novas versões. Da mesma forma que o Blue-Green o **downtime é zero**, MAS sem duplicar seus custos de infraestrutura! 🤩

Além disso, é possível refinar através dos círculos quem serão os usuários que farão a validação da sua nova versão.

