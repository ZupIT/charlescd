using System;
using Microsoft.Extensions.DependencyInjection;

namespace Zup.Tracing
{
    public static class CharlesTracingExtension
    {

        public static IServiceCollection AddCharles(this IServiceCollection services)
        {
            return services.AddCharles(c => c.HeaderNames.Add("x-circle-id"));
        }

        public static IServiceCollection AddCharles(this IServiceCollection services, Action<HeaderPropagationOptions> configure)
        {
            return services
                .AddHttpClient()
                .AddHeaderPropagation(configure);
        }

        public static IServiceCollection AddCharles(this IServiceCollection services, string name, Action<HeaderPropagationOptions> configure)
        {
            services
                .AddHttpClient(name)
                .AddHeaderPropagation(configure);
            return services;
        }
    }
}
