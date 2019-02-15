---
layout: default
title: Audit Logs
parent: Security
nav_order: 8
---

# Enable audit logs

Audit logs let you track access to your Elasticsearch cluster and are useful for compliance purposes or in the aftermath of a security breach. You can configure the categories to be logged, the detail level of the logged messages, and where to store the logs.

To enable audit logging:

1. Add the following line to `elasticsearch.yml` on each node:

   ```yml
   security-plugin-placeholder.audit.type: internal_elasticsearch
   ```

   This setting stores audit logs on the current cluster. For other storage options, see [Audit Log Storage Types](../storage-types).

2. Restart each node.


---

#### Table of contents
1. TOC
{:toc}


---

## Tracked events

Audit logging records events in two ways: HTTP requests (REST) and the transport layer.

Event | Logged on REST | Logged on transport | Description
:--- | :--- | :--- | :---
`FAILED_LOGIN` | Yes | Yes | The credentials of a request could not be validated, most likely because the user does not exist or the password is incorrect.
`AUTHENTICATED` | Yes | Yes | A user successfully authenticated.
`MISSING_PRIVILEGES` | No | Yes | The user does not have the required permissions to execute the request.
`GRANTED_PRIVILEGES` | No | Yes | A user made a successful request to Elasticsearch.
`SSL_EXCEPTION` | Yes | Yes | An attempt was made to access Elasticsearch without a valid SSL/TLS certificate.
`SG_INDEX_ATTEMPT` | No | Yes | An attempt was made to modify the Security plugin internal user and privileges index without the required permissions or TLS admin certificate.
`BAD_HEADERS` | Yes | Yes | An attempt was made to spoof a request to Elasticsearch with the Security plugin internal headers.

These default log settings work well for most use cases, but you can change settings to save storage space or adapt the information to your exact needs.


## Exclude categories

To exclude categories, set:

```yml
security-plugin-placeholder.audit.config.disabled_rest_categories: <disabled categories>
security-plugin-placeholder.audit.config.disabled_transport_categories: <disabled categories>
```

For example:

```yml
security-plugin-placeholder.audit.config.disabled_rest_categories: AUTHENTICATED, SG_INDEX_ATTEMPT
security-plugin-placeholder.audit.config.disabled_transport_categories: GRANTED_PRIVILEGES
```

If you want to log events in all categories, use `NONE`:

```yml
security-plugin-placeholder.audit.config.disabled_rest_categories: NONE
security-plugin-placeholder.audit.config.disabled_transport_categories: NONE
```


## Disable REST or the transport layer

By default, the Security plugin logs events on both REST and the transport layer. You can disable either type:

```yml
security-plugin-placeholder.audit.enable_rest: true
security-plugin-placeholder.audit.enable_transport: false
```


## Disable request body logging

By default, the Security plugin includes the body of the request (if available) for both REST and the transport layer. If you do not want or need the request body, you can disable it:

```yml
security-plugin-placeholder.audit.log_request_body: false
```


## Log index names

By default, the Security plugin logs all indices affected by a request. Because index names can be an aliases and contain wildcards/date patterns, the Security plugin logs the index name that the user submitted *and* the actual index name to which it resolves.

For example, if you use an alias or a wildcard, the the audit event might look like:

```json
audit_trace_indices: [
  "human*"
],
audit_trace_resolved_indices: [
  "humanresources"
]
```

You can disable this feature by setting:

```yml
security-plugin-placeholder.audit.resolve_indices: false
```

Disabling this feature only takes effect if `security-plugin-placeholder.audit.log_request_body` is also set to `false`.
{: .note }


## Configure bulk request handling

Bulk requests can contain many indexing operations. By default, the Security plugin only logs the single bulk request, not each individual operation.

The Security plugin can be configured to log each indexing operation as a separate event:

```yml
security-plugin-placeholder.audit.resolve_bulk_requests: true
```

This change can create a massive number of events in the audit logs, so we don't recommend enabling this setting if you make heavy use of the `_bulk` API.


## Exclude requests

You can exclude certain requests from being logged completely, by either configuring actions (for transport requests) and/or HTTP request paths (REST):

```yml
security-plugin-placeholder.audit.ignore_requests: ["indices:data/read/*", "SearchRequest"]
```


## Exclude users

By default, the Security plugin logs events from all users, but excludes the internal Kibana server user `kibanaserver`. You can exclude other users:

```yml
security-plugin-placeholder.audit.ignore_users:
  - kibanaserver
  - admin
```

If requests from all users should be logged, use `NONE`:

```yml
security-plugin-placeholder.audit.ignore_users: NONE
```


## Configure the audit log index name

By default, the Security plugin stores audit events in a daily rolling index named `sg6-auditlog-YYYY.MM.dd`. You can configure the name of the index in `elasticsearch.yml`:

```yml
security-plugin-placeholder.audit.config.index: myauditlogindex
```

Use a date pattern in the index name to configure daily, weekly, or monthly rolling indices:

```yml
security-plugin-placeholder.audit.config.index: "'sg6-auditlog-'YYYY.MM.dd"
```

For a reference on the date pattern format, see the [Joda DateTimeFormat documentation](http://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html).


## (Advanced) Tune the thread pool

The Search plugin logs events asynchronously, which keeps performance impact on your cluster minimal. The plugin uses a fixed thread pool to log events. You can define the number of threads in the pool in `elasticsearch.yml`:

```yml
security-plugin-placeholder.audit.threadpool.size: <integer>
```

The default setting is `10`. Setting this value to `0` disables the thread pool, which means the plugin logs events synchronously. To set the maximum queue length per thread:

```yml
security-plugin-placeholder.audit.threadpool.max_queue_len: 100000
```
