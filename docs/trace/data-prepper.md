---
layout: default
title: Data Prepper
parent: Trace Analytics
nav_order: 20
---

# Data Prepper

Data Prepper is an independent component, not an Elasticsearch plugin, that converts data for use with Elasticsearch.


## Install Data Prepper

To use the Docker image, pull it like any other image:

```bash
docker pull <>
```

Otherwise, [download](https://opendistro.github.io/for-elasticsearch/downloads.html) the appropriate TAR file for your operating system and unzip it.


## Configure pipelines

To use Data Prepper, you define pipelines in a configuration YAML file. Each pipeline is a combination of a source, a buffer, zero or more processors, and one or more sinks:

```yml
sample-pipeline:
  workers: 4 # the number of workers
  delay: 100 # in milliseconds, how long workers wait between read attempts
  source:
    otel_trace_source:
      ssl: true
      sslKeyCertChainFile: "config/demo-data-prepper.crt"
      sslKeyFile: "config/demo-data-prepper.key"
  buffer:
    bounded_blocking:
      buffer_size: 1024 # max number of records the buffer accepts
      batch_size: 256 # max number of records the buffer drains after each read
  processor:
    - otel_trace_raw_processor:
  sink:
    - elasticsearch:
        hosts: ["https:localhost:9200"]
        cert: "config/root-ca.pem"
        username: "ta-user"
        password: "ta-password"
        trace_analytics_raw: true
```

- Sources define where your data comes from. In this case, the source is the OpenTelemetry Collector (`otel_trace_source`) with some optional SSL settings.

- Buffers store data as it passes through the pipeline.

  By default, Data Prepper uses its one and only buffer, the `bounded_blocking` buffer, so you can omit this section unless you developed a custom buffer or need to tune the buffer settings.

- Processors perform some action on your data: filter, transform, enrich, etc.

  You can have multiple processors, which run sequentially from top to bottom, not in parallel. The `otel_trace_raw_processor` processor converts OpenTelemetry data into Elasticsearch-compatible JSON documents.

- Sinks define where your data goes. In this case, the sink is an Open Distro for Elasticsearch cluster.

Pipelines can act as the source for other pipelines. In the following example, a pipeline takes data from the OpenTelemetry Collector and uses two other pipelines as sinks:

```yml
entry-pipeline:
  delay: "100"
  source:
    otel_trace_source:
  sink:
    - pipeline:
        name: "raw-pipeline"
    - pipeline:
        name: "service-map-pipeline"
raw-pipeline:
  source:
    pipeline:
      name: "entry-pipeline"
  processor:
    - string_converter:
        upper_case: true
    - otel_trace_raw_processor:
  sink:
    - elasticsearch:
        hosts: ["https://localhost:9200" ]
        cert: "config/root-ca.pem"
        username: "ta-user"
        password: "ta-password"
        trace_analytics_raw: true
service-map-pipeline:
  delay: "100"
  source:
    pipeline:
      name: "entry-pipeline"
  processor:
    - service_map_stateful:
  sink:
    - elasticsearch:
        hosts: ["https://localhost:9200"]
        cert: "config/root-ca.pem"
        username: "ta-user"
        password: "ta-password"
        trace_analytics_service_map: true
```

To learn more, see the [Data Prepper configuration reference](../data-prepper-reference/).


## Start Data Prepper

**Docker**

```bash
docker run --name data-prepper --expose 21890 --read-only -v /full/path/to/my-data-prepper-config.yml:/usr/share/data-prepper/data-prepper.yml data-prepper/data-prepper:0.1.0
```

**macOS and Linux**

```bash
./data-prepper-tar-install.sh config/my-data-prepper-config.yml
```

For production workloads, you likely want to run Data Prepper on a dedicated machine, which makes connectivity a concern. Data Prepper uses port 21890 and must be able to connect to both the OpenTelemetry Collector and the Elasticsearch cluster. In the [sample applications](https://github.com/opendistro-for-elasticsearch/Data-Prepper/tree/master/examples), you can see that all components use the same Docker network and expose the appropriate ports.
