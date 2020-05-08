---
layout: default
title: Settings
parent: SQL
nav_order: 4
---

# Settings

When Elasticsearch bootstraps, SQL plugin will register a few settings
in Elasticsearch cluster settings. Most of the settings are able to
change dynamically so you can control the behavior of SQL plugin without
need to bounce your cluster.

You can update a setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -u admin:admin -k -XPUT https://localhost:9200/_cluster/settings -d '{
  "transient" : {
    "opendistro.sql.enabled" : false
  }
}'
```

You can update the following settings:

Setting | Default | Description
:--- | :--- | :---
`opendistro.sql.enabled` | True | You can disable SQL plugin to reject all coming requests.
`opendistro.sql.query.slowlog` | 2 seconds | You can configure the time limit (seconds) for slow query which would be logged as `Slow query: elapsed=xxx (ms)` in `elasticsearch.log`.
`opendistro.sql.query.analysis.enabled` | True | You can disable query analyzer to bypass strict syntactic and semantic analysis.
`opendistro.sql.query.analysis.semantic.suggestion` | False | You can enable query analyzer to suggest correct field names for quick fix.
`opendistro.sql.query.analysis.semantic.threshold` | 200 | Because query analysis needs to build semantic context in memory, index with large number of field would be skipped. You can update it to apply analysis to smaller or larger index as needed.
`opendistro.sql.query.response.format` | JDBC | You can set default response format of the query. The supported formats include: JDBC, JSON, CSV, raw, and table.
`opendistro.sql.cursor.enabled` | False | You can enable or disable pagination for all queries that are supported.
`opendistro.sql.cursor.fetch_size` | 1,000 | You can set the default `fetch_size` for all queries that are supported by pagination. An explicit `fetch_size` passed in request overrides this value.
`opendistro.sql.cursor.keep_alive` | 1 minute | You can set this value to indicate how long the cursor context is kept open. Cursor contexts are resource heavy, we recommend using a lower value, if possible.
