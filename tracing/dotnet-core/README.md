### Bibloteca de propagação de header Charles - Zup
Biblioteca simples para propagaçao do "header" de tracing do "Charles".

#### Como iniciar
Primeiro importe biblioteca em sua aplicação:

```csharp
using Zup.Tracing;
```

Posteriormente no método `ConfigureServices` da classe `Startup` diga ao pipeline do asp.net que iremos usar a propagação de "headers" necessários para o fucionamento do "Charles" adicionando a lina abaixo:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddCharles();
    ...
}
```
Entao em sua aplicação basta usar normalmente o a sua classe `HttpClient` a partir da injeção de dependência da interface `IHttpClientFactory`:

```csharp
[Route("api/[controller]")]
[ApiController]
public class FooController : ControllerBase
{
    private readonly IHttpClientFactory _factory;
    public FooController(IHttpClientFactory factory)
    {
        _factory = factory;
    }
    ...
    [HttpPost]
    public async Task<IActionResult> Post()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("http://www.contoso.com/");
        return Ok();
    }
}
```

#### Configuraçoes extras

Por padrão qualquer objeto da classe `HttpClient` irá repassar o "header" `x-circle-id` caso a requisição o receba, porém é possivel trabalhar com clientes nomeados e/ou propagar mais "headers" usando as sobrecargas que fornecem opções adicionais de configuração do serviço:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddCharles("charlesClient", options =>
    {
        options.HeaderNames.Add("x-circle-id");
        options.HeaderNames.Add("x-another-header");
    });
}
```
É importante salientar que usando esta configuração, é necessário adicionar o header `x-circle-id` novamente uma vez a opção sobrescreve a configuração padrão.