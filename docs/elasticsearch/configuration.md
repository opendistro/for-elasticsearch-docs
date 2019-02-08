---
layout: default
title: Configuration
parent: Elasticsearch
nav_order: 1
---

# Elasticsearch Configuration

Most Elasticsearch configuration can take place in the cluster settings API. Certain operations require you to modify `elasticsearch.yml` and restart the cluster.

Whenever possible, use the cluster settings API instead; `elasticsearch.yml` is local to each node, whereas the API applies the setting to all nodes in the cluster.


## The cluster settings API

The first step in changing a setting is to view the current settings:

```
GET _cluster/settings?include_defaults=true
```

For a more concise summary of non-default settings:

```
GET _cluster/settings
```

Three categories of setting exist in the cluster settings API: persistent, transient, and default. Persistent settings, well, persist after a cluster restart. After a restart, Elasticsearch clears transient settings.

If you specify the same setting in multiple places, Elasticsearch uses the following precedence:

1. Transient settings
2. Persistent settings
3. Settings from `elasticsearch.yml`
4. Default settings

To change a setting, just specify the new one as either persistent or transient. This example shows the flat settings form:

```json
PUT /_cluster/settings
{
  "persistent" : {
    "action.auto_create_index" : false
  }
}
```

You can also use the expanded form, which lets you copy and paste from the GET response and change existing values:

```json
PUT /_cluster/settings
{
  "persistent": {
    "action": {
      "auto_create_index": false
    }
  }
}
```

---

{::comment}
## The configuration file
{:/comment}
