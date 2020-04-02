# Criar Nova Release

Ao escolher realizar uma implantação em um círculo gerando uma nova release, é necessário preencher algumas informações:

| Dado | Descrição |
| :--- | :--- |
| _Release Name_ | As releases sempre terão o prefixo _"release-darwin",_ entretanto o sulfixo pode ser determinado pelo usuário. Ele identificará a nova versão. |
| _Module_ | Aparecerá uma lista de todos os [módulos cadastrados](../settings.md#modules) anteriormente. |
| _Component_ | Caso o módulo possua mais de um componente cadastrado, eles serão listados nesse campo. |
| _Version_ | Todas as versões existentes desse componente do módulo estarão listadas. |

![](../../.gitbook/assets/deploy-generate-releasechrome-capture.gif)

Existe a restrição de não adicionar o mesmo componente duas vezes. Entretanto, pode-se adicionar múltiplos módulos para compor a nova release.

