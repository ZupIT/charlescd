# Sobre o Charles

## O que é o Charles? 

O Charles é uma ferramenta open source de continuous deployment que realiza deploys de forma ágil, contínua e segura, permitindo que sejam feitas, de forma simultânea, validações de hipóteses com grupos específicos de usuários.

## O que é deploy em círculos? 

O deploy em círculos é um conceito pioneiro trazido pelo Charles. Graças a ele, é possível que você realize o deploy de uma mesma aplicação para diferentes segmentações de usuários ao mesmo tempo. 

## Qual diferencial do Charles? 

Diferente de outras modalidades de deploy, o Charles possibilita a realização simultânea de segmentações de usuários por meio de [**círculos**. ](../referencia/circulos.md)

Utilizando a ferramenta, o processo de entrega que em ambientes tradicionais ocorre em frequências demoradas - semanal, quinzenal ou até mesmo mensal -, ganha um novo ritmo. O ciclo de feedback do seu produto se torna mais rápido e eficaz e, com isso, você consegue fazer a gestão do timing de forma mais inteligente e assertiva. 

Além disso, os desenvolvedores são encorajados a inovarem e realizarem várias implantações de novas versões, pois a identificação de bugs ocorre em menos tempo e a criação de círculos auxilia na minimização do error budget.

\*\*\*\*

A plataforma foi construída utilizando a abordagem de microsserviços e possui os seguintes módulos:

![](../.gitbook/assets/arquitetura-charles-nova.png)

* `charlescd-ui:` responsável por prover uma interface de fácil usabilidade para todas as features fornecida pelo CharlesCD, no intuito de simplificar testes de hipóteses e _circle deployment_.

* `charlescd-moove:` é um serviço backend que orquestra os testes de hipóteses de seus produtos e o pipeline de entrega até atingir seus círculos, facilitando a ponte entre **Butler**, **Villager** e **Circle Matcher**.  
* `charlescd-butler:` responsável por orquestrar e gerenciar as releases e deploys realizados. 
* `charlescd-circle-matcher:`gerencia todos os círculos criados, além de indicar a qual círculo um usuário pertence, com base em um conjunto de características.

