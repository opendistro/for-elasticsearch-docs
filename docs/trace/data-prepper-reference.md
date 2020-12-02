---
layout: default
title: Configuration Reference
parent: Trace Analytics
nav_order: 25
---

# Data Prepper configuration reference

This page lists all supported Data Prepper sources, buffers, processors, and sinks, along with their associated options.


## Sources

### otel_trace_source

Source for the OpenTelemetry Collector.

Option | Required | Description
:--- | :--- | :---
ssl | No | Boolean, whether to connect to the OpenTelemetry Collector over SSL.
sslKeyCertChainFile | No | String, path to the security certificate (e.g. `"config/demo-data-prepper.crt"`.
sslKeyFile | No | String, path to the security certificate key (e.g. `"config/demo-data-prepper.key"`).

### file

Source for flat file input.

Option | Required | Description
:--- | :--- | :---
path | Yes | String, path to the input file (e.g. `logs/my-log.log`).


## Buffers

### bounded_blocking

The default buffer.

Option | Required | Description
:--- | :--- | :---
buffer_size | No | Maximum number of records the buffer accepts.
batch_size | No | Maximum number of records the buffer drains after each read.


## Processors

### otel_trace_raw_processor

Converts OpenTelemetry data to Elasticsearch-compatible JSON documents.


### service_map_stateful

Uses OpenTelemetry data to create a distributed service map for visualization in Kibana.


### string_converter

Converts strings to uppercase or lowercase. Mostly useful as an example if you want to develop your own processor.

Option | Required | Description
:--- | :--- | :---
upper_case | No | Boolean, whether to convert to uppercase (`true`) or lowercase (`false`).


## Sinks

### elasticsearch

Sink for an Elasticsearch cluster.

Option | Required | Description
:--- | :--- | :---
hosts | Yes | List of Elasticsearch hosts to write to (e.g. `["https://localhost:9200", "https://remote-cluster:9200"]`).
cert | No | String, path to the security certificate (e.g. `"config/root-ca.pem"`) if the cluster uses the Open Distro for Elasticsearch security plugin.
username | No | String, username for HTTP basic authentication.
password | No | String, password for HTTP basic authentication.
trace_analytics_raw | No | Boolean
trace_analytics_service_map | No | Boolean


### file

Sink for flat file output.

Option | Required | Description
:--- | :--- | :---
path | Yes | String, path for the output file (e.g. `logs/my-transformed-log.log`).
