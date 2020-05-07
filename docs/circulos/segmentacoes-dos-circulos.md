# Como segmentar e identificar os círculos?

As segmentações são um conjunto de características que você define para agrupar seus usuários nos círculos do Charles. Para realizar essa ação, é possível segmentar seus usuários através do preenchimento de informações de forma manual ou por meio da importação de um arquivo csv.

Uma grande vantagem de utilizar as segmentações é porque, com elas, é possível fazer combinações lógicas entre vários atributos para criar diferentes tipos de públicos e, dessa forma, utilizá-los nos testes das hipóteses. Por exemplo, a partir da características “profissão” e “região”, pode-se criar um círculo de engenheiros da região norte, outro só com engenheiros do sudeste e um terceiro contendo todos os engenheiros do Brasil.

## **Segmentação manual**

Neste tipo de segmentação, você define as lógicas que o círculo deve seguir para compor um match com usuários que atendam às características pré-determinadas.

Essas características podem ser definidas com base nas lógicas de:

* Equal to
* Not Equal
* Lower Than
* Lower or equal to
* Higher than
* Higher or equal to
* Between
* Starts With

Isso significa que, ao setar na plataforma do Charles uma segmentação considerando um dessas variáveis acima, o sistema irá retornar com um círculo cuja base será composta por estes usuários.

Vamos a alguns exemplos:

![](https://lh6.googleusercontent.com/5hg_2ZW34hb69J69-MtDNctjLJX5-gwBP9kgN6Bto9_tm2tK9DL-rgmvTleoVihRft37P2QmcA6MzBc3Uj_vguGM9VQVc9fhKEpittLr8LXxvThC3dewpNGsEYSHXp6KfhX8GGx_)

## **Segmentação por importação de csv**

Neste tipo de segmentação, é utilizada apenas a primeira coluna do csv para criar as regras. O único operador lógico suportado até o momento é o OR.

Na prática, essa modalidade permite que você possa, por exemplo, extrair de uma database externa os IDs dos clientes com um perfil específico e importá-los direto na plataforma do Charles.

## Identificação de círculos

Se após a criação do círculo for necessária a utilização do Circle Matcher para testar suas regras de segmentação, você pode integrar nas suas aplicações o recurso Identify do módulo `charles-circle-matcher` para detectar os círculos aos quais o seu usuário pertence.

Por exemplo, dada a utilização dos seguintes parâmetros ao segmentar:

![](https://lh6.googleusercontent.com/q573-961WtpntVK8NfXXvPgzSPrxLwxjx3QXRqM3vBlHFM8nAoDkpn1KD26Zfw3_wJtjnhVldYcwRUUzhbveEvqJz6n16NQFkxi0S3hh8rk6Y7OUmWtnBOl_qJekzoymQ64mFF8k)

Ao realizar a requisição de identificação com as seguintes informações, círculos compatíveis serão retornados:

![](https://lh4.googleusercontent.com/U9V5QwHFcbIWmw9TSKGtyDPNsR2ODnDmSpqaTnIv8zEfcWpp0ud9YLlukw7AAt8CMdhFXBWRH0V11ZD8mx9vgt854-S15VPsE2A3cMKjgphKmFTGUxDOvqgr0gYOu1J7-fevCswe)

![](https://lh3.googleusercontent.com/R7aStOsBMdYV48RIgGuINlI2bF6_zI4gjGBnlQd2a_VsP9wmRCAH1rQfHNQzeq1nfMT78SC_Ll1Fm8LxjcbtLMhuVV57t55mRniUhMHqNAdsjBBUK6pPAbXGrOy6aokc36gX0DWn)

Como no nosso exemplo existem círculos correspondentes com as informações sobre o usuário, o charles-circle-matcher está retornando uma lista com eles. Neste caso, dois círculos se encaixaram: NY Lawyers e Stony Brook’s Citizens.

Nessa requisição, apenas o parâmetro x-application-id é obrigatório. O body é totalmente flexível, porém vale lembrar que as chaves devem ter a mesma nomenclatura definida nas regras de segmentação do círculo. Veja no caso a seguir:

![](https://lh3.googleusercontent.com/FdPVIHDFeYJCkC_6Y1P3ZOBSqmNlGkl9q2_XyIayNKQo2Mp9IXBY7PzvpzW0Mej1P9Ox8AG12QiA1H0w5uozWP1UYWafcfwXLKBOf3G-ObIVoPHtYGOlWd5Ju01uLuScqtCn8qQ1)

\*\*\*\*

O círculo “Stony Brook’s Citizens” foi criado para a identificar usuários que tenham como característica a chave “city” e o exato valor “Stony Brook”. Sendo assim, ele não estará na listagem ao realizar uma requisição para o Identify caso seja informado o body como no exemplo abaixo.

Outro ponto é que, quando o usuário não se enquadra em nenhuma segmentação, o sistema retorna indicando que ele se encaixa no “Mar Aberto”, isto é, em uma espécie de segmentação geral que inclui todos os usuários que estão fora de um círculo específico:

![](https://lh5.googleusercontent.com/at32ZBnZy2LQEAp8VUb_MZpn86B1OPBZA0oZfOtPjjdZvuGORSBrXpYmwf_4M2w-Y7y9C6xkB9ODrjnJdIMR8xRCxcnCwPWbL3LF_WT_jBxYc6MU2eP11wgbDQJv9s3LFIdqSaXI)

![](https://lh6.googleusercontent.com/R4YBSG1zeNhr_6ZMs3hnbr0rMV_uSI20T_oKj3wcYYN0uKwE6FpbUP19513kIGypm5ZvbhRqjUx2TtZTXR_PXAXbGwQ5un9kivPHeGBex47M_-5gH_Nkti9VT9R-b6KHmDzO3iW4)

Uma boa prática é realizar essa identificação sempre que o usuário faz login na aplicação. Entretanto, isso pode ser alterado de acordo com a necessidade da sua regra de negócio.

