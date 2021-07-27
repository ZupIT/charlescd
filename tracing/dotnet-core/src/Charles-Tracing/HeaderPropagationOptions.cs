using System.Collections.Generic;

namespace Zup.Tracing
{
    public class HeaderPropagationOptions
    {
        public IList<string> HeaderNames { get; set; } = new List<string>();
    }
}
