# Definindo um Workspace

O workspace permite que você segmente o uso do CharlesCD dentro da sua empresa ou do seu time. Com ele se define as **permissões personalizadas dos usuários**, o que garante mais segurança para o seu projeto.

{% hint style="info" %}
Com apenas uma instalação, vários times podem utilizar o Charles com configurações distintas ou, se preferir, criar um workspace para representar ambientes de desenvolvimento diferentes como, por exemplo, de homologação, produção, etc. 
{% endhint %}

Cada workspace possui as seguintes configurações:

* Definição dos acessos e [**permissões dos grupos de usuários**](../../referencia/grupos-de-usuarios.md).
* Cadastros de credenciais do [**Docker Registry**](https://docs.charlescd.io/primeiros-passsos/definindo-workspace/docker-registry), [**Git**](https://docs.charlescd.io/primeiros-passsos/definindo-workspace/github) ****e de ****[**Continuous Deployment \(CD\)**](https://docs.charlescd.io/referencia/configuracao-cd).
* Personalização do [**Circle Matcher**](../../referencia/circle-matcher.md).
* Registro do[ **Provedor de Métricas**](../../referencia/metricas/) das suas aplicações.

{% hint style="warning" %}
A criação do workspace pode ser feita apenas pelo usuário **root**. Entretanto, o preenchimento das configurações podem ser feitas por ele, e também pelos usuários associados ao workspace com perfil de **mantenedor**.
{% endhint %}

