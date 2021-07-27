using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Http;
using Microsoft.Extensions.Options;

namespace Zup.Tracing
{
    public static class HeaderPropagationExtensions
    {
        public static IServiceCollection AddHeaderPropagation(this IServiceCollection services, Action<HeaderPropagationOptions> configure)
        {
            services.Configure(configure);
            services.AddHttpContextAccessor();
            services.TryAddSingleton<IHttpMessageHandlerBuilderFilter, HeaderPropagationMessageHandlerBuilderFilter>();
            return services;
        }

        public static IHttpClientBuilder AddHeaderPropagation(this IHttpClientBuilder builder, Action<HeaderPropagationOptions> configure)
        {
            builder.Services.Configure(configure);
            builder.Services.AddHttpContextAccessor();
            builder.AddHttpMessageHandler(serviceProvider =>
            {
                var options = serviceProvider.GetRequiredService<IOptions<HeaderPropagationOptions>>();
                var contextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
                return new HeaderPropagationMessageHandler(options.Value, contextAccessor);
            });
            return builder;
        }
    }
}
