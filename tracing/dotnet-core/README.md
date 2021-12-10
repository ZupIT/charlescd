# **Library to propagate Charles header - Zup**
Simple library to propagate Charles' tracing "header".

#### **How to begin?**
**Step 1.** Import the library in your application: 

```csharp
using Zup.Tracing;
```

**Step 2.** In the `ConfigureServices` method of the `Startup`class, tell the asp.net pipeline, we will use headers propagation to make Charles work. Add the line below: 

```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddCharles();
    ...
}
```
**Step 3.** In your application, use your the `HttpClient` class from the interface `IHttpClientFactory`dependency:

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

### **Configuration**

Any `HttpClient` class object will pass the `x-circle-id` header by default, in case the request receives it. However, it is possible to work with named clients and/or propagate more header using the overloads that provide additional service configuration options:


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
When you use this configuration, it is necessary to add the  `x-circle-id` header again, once it overwrites the default configuration.
