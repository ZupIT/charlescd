# Zup Tracing
Lib that decorates jaeger-opentracing lib to propagate `x-circle-id` through all services.

## Configurations
Here you can find some properties to customize the lib, if needed.  

|          Property                |            Description                |    Default    |
|----------------------------------|---------------------------------------|---------------|
|  `charles.tracing.header.name`   | The default headers prefix to extract | `x-circle-id` |
