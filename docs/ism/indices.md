---
layout: default
title: Index Settings
nav_order: 1
parent: Index State Management
has_children: false
---

# Index settings


## Add ISM settings to indices

The Index State Management plugin only manages indices that specify certain ISM settings. To create a new index with ISM settings and a rollover alias:

```json
PUT some_index
{
  "settings": {
    "opendistro.index_state_management.policy_name": "ingest_policy",
    "opendistro.index_state_management.rollover_alias": "some_alias"
  },
  "aliases": {
    "some_alias": {
      "is_write_index": true
    }
  }
}
```
