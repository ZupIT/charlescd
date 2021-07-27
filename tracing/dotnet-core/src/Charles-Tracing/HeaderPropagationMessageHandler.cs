using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Zup.Tracing
{
    public class HeaderPropagationMessageHandler : DelegatingHandler
    {
        private readonly HeaderPropagationOptions _options;
        private readonly IHttpContextAccessor _contextAccessor;

        public HeaderPropagationMessageHandler(HeaderPropagationOptions options, IHttpContextAccessor contextAccessor)
        {
            _options = options;
            _contextAccessor = contextAccessor;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            foreach (var header in _options.HeaderNames)
            {
                var value = _contextAccessor.HttpContext?.Request.Headers[header];
                if (!value.HasValue || StringValues.IsNullOrEmpty(value.Value))
                    continue;
                request.Headers.TryAddWithoutValidation(header, value.Value.ToString());
            }
            return base.SendAsync(request, cancellationToken);
        }
    }
}
