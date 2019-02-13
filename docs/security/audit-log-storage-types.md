---
layout: default
title: Audit Log Storage Types
parent: Security
nav_order: 9
---

# Audit log storage types

Audit logs can take up quite a bit of space, so the Security plugin offers several options for storage locations.

Setting | Description
:--- | :---
debug | Outputs to stdout. Useful for testing and debugging.
internal_elasticsearch | Writes to an audit index on the current Elasticsearch cluster.
external_elasticsearch | Writes to an audit index on a remote Elasticsearch cluster.
webhook | Sends events to an arbitrary HTTP endpoint.
log4j | Writes the events to a Log4j logger. You can use any Log4j [appender](https://logging.apache.org/log4j/2.x/manual/appenders.html), such as SNMP, JDBC, Cassandra, and Kafka.

You configure the output location in `elasticsearch.yml`:

```
security-plugin-placeholder.audit.type: <debug|internal_elasticsearch|external_elasticsearch|webhook|log4j>
```

`external_elasticsearch`, `webhook`, and `log4j` all have additional configuration options. Details follow.


## External Elasticsearch

The `external_elasticsearch` storage type requires one or more Elasticsearch endpoints with a host/IP address and port. Optionally, provide the index name and a document type.

```yaml
security-plugin-placeholder.audit.type: external_elasticsearch
security-plugin-placeholder.audit.config.http_endpoints: [<endpoints>]
security-plugin-placeholder.audit.config.index: <indexname>
security-plugin-placeholder.audit.config.type: _doc
```

The Security plugin uses the Elasticsearch REST API to send events, just like any other indexing request. For `security-plugin-placeholder.audit.config.http_endpoints`, use a comma-separated list of hosts/IP addresses and the REST port (default 9200).

```
security-plugin-placeholder.audit.config.http_endpoints: [192.168.178.1:9200,192.168.178.2:9200]
```

If you use `external_elasticsearch` and the remote cluster also uses the Security plugin, you must supply some additional parameters for authentication. These parameters depend on which authentication type you configured for the remote cluster.


### TLS settings

Name | Data Type | Description
:--- | :--- | :---
`security-plugin-placeholder.audit.config.enable_ssl` | Boolean | If you enabled SSL/TLS on the receiving cluster, set to true. The default is false.
`security-plugin-placeholder.audit.config.verify_hostnames` |  Boolean | Whether to verify the hostname of the SSL/TLS certificate of the receiving cluster. Default is true.
`security-plugin-placeholder.audit.config.pemtrustedcas_filepath` | String | The trusted root certificate of the external Elasticsearch cluster, relative to the `config` directory.
`security-plugin-placeholder.audit.config.pemtrustedcas_content` | String | Instead of specifying the path (`security-plugin-placeholder.audit.config.pemtrustedcas_filepath`), you can configure the Base64-encoded certificate content directly.
`security-plugin-placeholder.audit.config.enable_ssl_client_auth` | Boolean | Whether to enable SSL/TLS client authentication. If you set this to true, the audit log module sends the node's certificate along with the request. The receiving cluster can use this certificate to verify the identity of the caller.
`security-plugin-placeholder.audit.config.pemcert_filepath` | String | The path to the TLS certificate to send to the external Elasticsearch cluster, relative to the `config` directory.
`security-plugin-placeholder.audit.config.pemcert_content` | String | Instead of specifying the path (`security-plugin-placeholder.audit.config.pemcert_filepath`), you can configure the Base64-encoded certificate content directly.
`security-plugin-placeholder.audit.config.pemkey_filepath` | String | The path to the private key of the TLS certificate to send to the external Elasticsearch cluster, relative to the `config` directory.
`security-plugin-placeholder.audit.config.pemkey_content` | String | Instead of specifying the path (`security-plugin-placeholder.audit.config.pemkey_filepath`), you can configure the Base64-encoded certificate content directly.
`security-plugin-placeholder.audit.config.pemkey_password` | String | The password of the private key.


### Basic auth settings

If you enabled HTTP basic authentication on the receiving cluster, use these settings to specify the username and password:

```yaml
security-plugin-placeholder.audit.config.username: <username>
security-plugin-placeholder.audit.config.password: <password>
```


## Webhook

Use the following keys to configure the `webhook` storage type.

Name | Data Type | Description
:--- | :--- | :---
`security-plugin-placeholder.audit.config.webhook.url` | String | The HTTP or HTTPS URL to send the logs to.
`security-plugin-placeholder.audit.config.webhook.ssl.verify` | Boolean | If true, the TLS certificate provided by the endpoint (if any) will be verified. If set to false, no verification is performed. You can disable this check if you use self-signed certificates.
`security-plugin-placeholder.audit.config.webhook.ssl.pemtrustedcas_filepath` | String | The path to the trusted certificate against which the webhook's TLS certificate is validated.
`security-plugin-placeholder.audit.config.webhook.ssl.pemtrustedcas_content` | String | Same as `security-plugin-placeholder.audit.config.webhook.ssl.pemtrustedcas_content`, but you can configure the base 64 encoded certificate content directly.
`security-plugin-placeholder.audit.config.webhook.format` | String | The format in which the audit log message is logged, can be one of `URL_PARAMETER_GET`, `URL_PARAMETER_POST`, `TEXT`, `JSON`, `SLACK`. See [Formats](#formats).


### Formats

Format | Description
:--- | :---
`URL_PARAMETER_GET` | Uses HTTP GET to send logs to the webhook URL. All logged information is appended to the URL as request parameters.
`URL_PARAMETER_POST` | Uses HTTP POST to send logs to the webhook URL. All logged information is appended to the URL as request parameters.
`TEXT` | Uses HTTP POST to send logs to the webhook URL. The request body contains the audit log message in plain text format.
`JSON` | Uses HTTP POST to send logs to the webhook URL. The request body contains the audit log message in JSON format.
`SLACK` | Uses HTTP POST to send logs to the webhook URL. The request body contains the audit log message in JSON format suitable for consumption by Slack. The default implementation returns `"text": "<AuditMessage#toText>"`.


## Log4j

The `log4j` storage type lets you specify the name of the logger and log level.

```yaml
security-plugin-placeholder.audit.config.log4j.logger_name: sgaudit
security-plugin-placeholder.audit.config.log4j.level: INFO
```

By default, the Security plugin uses the logger name `sgaudit` and logs the events on `INFO` level. Audit events are stored in JSON format.
