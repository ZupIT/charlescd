using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Charles.Tracing.Sample
{
    [Route("api/[controller]")]
    [ApiController]
    public class FooController : ControllerBase
    {
        private readonly IHttpClientFactory _factory;
        public FooController(IHttpClientFactory factory)
        {
            _factory = factory;
        }
        
        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("http://www.contoso.com/");
            return Ok();
        }
    }
}