---
layout: default
title: Indices
nav_order: 2
parent: Index State Management
has_children: false
---

# Indices

The ISM plugin only manages indices that contain ISM settings. To create a new index with ISM settings and set a rollover alias:

```json
PUT my-index1
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

In this case, the `ingest_policy` is applied to `my-index1` with the rollover action defined in `some_alias`.
