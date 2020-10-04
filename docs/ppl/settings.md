---
layout: default
title: Settings
parent: PPL
nav_order: 3
---

# Settings

The PPL plugin adds a few settings to the standard Elasticsearch cluster settings. Most are dynamic, so you can change the default behavior of the plugin without restarting your cluster.

You can update these settings like any other cluster setting:

```json
PUT _cluster/settings
{
  "transient": {
    "opendistro": {
      "ppl": {
        "enabled": "false"
      }
    }
  }
}
```

Requests to `_opendistro/_ppl` include index names in the request body, so they have the same access policy considerations as the `bulk`, `mget`, and `msearch` operations. If you set the `rest.action.multi.allow_explicit_index` parameter to `false`, the PPL plugin is disabled.

You can specify the settings shown in the following table:

Setting | Default | Description
:--- | :--- | :---
`opendistro.ppl.enabled` | True | Change to `false` to disable the plugin.
`opendistro.ppl.query.memory_limit` | 85% | Set heap memory usage limit. If a query crosses this limit, it's terminated.
`opendistro.query.size_limit` | 200 | Set the maximum number of results that you want to see. This impacts the accuracy of aggregation operations. For example, if you have 1000 documents in an index, by default, only 200 documents are extracted from the index for aggregation.
