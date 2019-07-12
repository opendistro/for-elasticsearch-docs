---
layout: default
title: Management
parent: Index State Management
nav_order: 10
---

# Management


## ISM indices

Index state management stores its configuration in the `.opendistro-ism-config` index. Don't modify this index without using the ISM APIs.


## ISM settings

We don't recommend changing these settings; the defaults should work well for most use cases.

All settings are available using the Elasticsearch `_cluster/settings` API. None require a restart, and all can be marked `persistent` or `transient`.

Setting | Default | Description
:--- | :--- | :---
`opendistro.index_state_management.enabled` | true | Whether ISM is enabled or not.
`opendistro.index_state_management.backoff_millis` | 50ms | asdf
`opendistro.index_state_management.sweep_period` | 1m | asdf
`opendistro.index_state_management.backoff_count` | 2 | asdf
