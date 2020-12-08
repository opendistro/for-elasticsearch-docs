---
layout: default
title: Configuration Reference
parent: Trace Analytics
nav_order: 25
---

# Data Prepper configuration reference

This page lists all supported Data Prepper sources, buffers, processors, and sinks, along with their associated options. For example configuration files, see [Data Prepper](../data-prepper/).


## General pipeline options

Option | Required | Description
:--- | :--- | :---
workers | No | Integer, default 1. Essentially the number of application threads. As a starting point for your use case, try setting this value to the number of CPU cores on the machine.
delay | No | Integer (milliseconds), default 3,000. How long workers wait between buffer read attempts.


## Sources

Sources define where your data comes from.


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


### pipeline

Source for reading from another pipeline.

Option | Required | Description
:--- | :--- | :---
name | Yes | String, name of the pipeline to read from.


### stdin

Source for console input. Can be useful for testing. No options.


## Buffers

Buffers store data as it passes through the pipeline. If you implement a custom buffer, it can be memory-based (better performance) or disk-based (larger).


### bounded_blocking

The default buffer. Memory-based.

Option | Required | Description
:--- | :--- | :---
buffer_size | No | Integer, default 512. The maximum number of records the buffer accepts.
batch_size | No | Integer, default 8. The maximum number of records the buffer drains after each read.


## Processors

Processors perform some action on your data: filter, transform, enrich, etc.


### otel_trace_raw_processor

Converts OpenTelemetry data to Elasticsearch-compatible JSON documents. No options.


### service_map_stateful

Uses OpenTelemetry data to create a distributed service map for visualization in Kibana. No options.


### string_converter

Converts strings to uppercase or lowercase. Mostly useful as an example if you want to develop your own processor.

Option | Required | Description
:--- | :--- | :---
upper_case | No | Boolean, whether to convert to uppercase (`true`) or lowercase (`false`).


## Sinks

Sinks define where Data Prepper writes your data to.


### elasticsearch

Sink for an Elasticsearch cluster.

Option | Required | Description
:--- | :--- | :---
hosts | Yes | List of Elasticsearch hosts to write to (e.g. `["https://localhost:9200", "https://remote-cluster:9200"]`).
cert | No | String, path to the security certificate (e.g. `"config/root-ca.pem"`) if the cluster uses the Open Distro for Elasticsearch security plugin.
username | No | String, username for HTTP basic authentication.
password | No | String, password for HTTP basic authentication.
trace_analytics_raw | No | Boolean, default false. Whether to export as trace data to the `otel-v1-apm-span-*` index pattern (alias `otel-v1-apm-span`) for use with the Trace Analytics Kibana plugin.
trace_analytics_service_map | No | Boolean, default false. Whether to export as trace data to the `otel-v1-apm-service-map` index for use with the service map component of the Trace Analytics Kibana plugin.
index | No | String, name of the index to export to. Only required if you don't use the `trace_analytics_raw` or `trace_analytics_service_map` presets.
template_file | No | String, the path to a JSON [index template](https://opendistro.github.io/for-elasticsearch-docs/docs/elasticsearch/index-templates/) file (e.g. `/your/local/template-file.json` if you do not use the `trace_analytics_raw` or `trace_analytics_service_map`. See [otel-v1-apm-span-index-template.json](https://github.com/opendistro-for-elasticsearch/simple-ingest-transformation-utility-pipeline/blob/master/situp-plugins/elasticsearch/src/main/resources/otel-v1-apm-span-index-template.json) for an example.
document_id_field | No | String, the field from the source data to use for the Elasticsearch document ID (e.g. `"my-field"`) if you don't use the `trace_analytics_raw` or `trace_analytics_service_map` presets.
dlq_file | No | String, the path to your preferred dead letter queue file (e.g. `/your/local/dlq-file`). Data Prepper writes to this file when it fails to index a document on the Elasticsearch cluster.
bulk_size | No | Integer (long), default 5. The maximum size (in MiB) of bulk requests to the Elasticsearch cluster. Values below 0 indicate an unlimited size. If a single document exceeds the maximum bulk request size, Data Prepper sends it individually.


### file

Sink for flat file output.

Option | Required | Description
:--- | :--- | :---
path | Yes | String, path for the output file (e.g. `logs/my-transformed-log.log`).


### pipeline

Sink for writing to another pipeline.

Option | Required | Description
:--- | :--- | :---
name | Yes | String, name of the pipeline to write to.


### stdout

Sink for console output. Can be useful for testing. No options.
