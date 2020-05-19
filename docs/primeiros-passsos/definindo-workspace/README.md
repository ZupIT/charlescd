# Definindo um Workspace

Através do Workspace você pode segmentar a utilização do CharlesCD dentro da sua empresa ou até mesmo no time, definindo permissionamentos personalizados dos usuários para garantir maior segurança do seu projeto. 

{% hint style="info" %}
Com apenas uma instalação, vários times podem utilizar o Charles com configurações distintas ou pode-se criar um Workspace para representar ambientes de desenvolvimento diferentes \(homologação, produção etc\).
{% endhint %}

Cada Workspace contempla nas suas configurações:

* Definição dos acessos e [**permissionamentos dos grupos de usuários**](../../referencia/grupos-de-usuarios.md).
* Cadastros de credenciais do [**Git**](https://docs.charlescd.io/primeiros-passsos/configurando-workspace/github%20)**,** [**Registry**](https://docs.charlescd.io/primeiros-passsos/configurando-workspace/registry) ****e de ****[**Continous Deployment**](https://docs.charlescd.io/referencia-1/cd-configuration).
* Personalização do [**Circle Matcher**](../../referencia/circle-matcher.md).
* Registro do[ **Provedor de Métricas**](../../referencia/metricas/) das suas aplicações.

{% hint style="warning" %}
A criação do workspace pode ser feita apenas pelo usuário **root**. Entretanto, o preenchimento das configurações podem ser feitas tanto por ele quanto pelos usuários associados ao workspace com perfil de **mantenedor**.
{% endhint %}

