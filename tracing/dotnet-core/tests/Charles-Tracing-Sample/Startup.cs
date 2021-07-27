using System;
using System.Net.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Zup.Tracing;

namespace Zup.Tracing.Sample
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddCharles("charlesClient", options =>
            {
                options.HeaderNames.Add("x-circle-id");
                options.HeaderNames.Add("x-another-header");
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHttpClientFactory clientFactory)
        {
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    var value = Guid.NewGuid().ToString();
                    var client = clientFactory.CreateClient();
                    client.DefaultRequestHeaders.TryAddWithoutValidation("x-circle-id", value);
                    var uri = UriHelper.BuildAbsolute(context.Request.Scheme, context.Request.Host, context.Request.PathBase, "/forwarded");
                    var response = await client.GetAsync(uri);
                    await context.Response.WriteAsync(await response.Content.ReadAsStringAsync());
                    await context.Response.WriteAsync($"x-circle-id: {value}\r\n");
                });

                endpoints.MapGet("/forwarded", async context =>
                {
                    foreach (var header in context.Request.Headers)
                        await context.Response.WriteAsync($"{header.Key}: {string.Join(", ", header.Value)}\r\n");
                });
            });
        }
    }
}
