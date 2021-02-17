---
layout: default
title: Settings
parent: Index State Management
nav_order: 4
---

# ISM Settings

We don't recommend changing these settings; the defaults should work well for most use cases.

Index State Management (ISM) stores its configuration in the `.opendistro-ism-config` index. Don't modify this index without using the [ISM API operations](../api/).

All settings are available using the Elasticsearch `_cluster/settings` operation. None require a restart, and all can be marked `persistent` or `transient`.

Setting | Default | Description
:--- | :--- | :---
`opendistro.index_state_management.enabled` | True | Specifies whether ISM is enabled or not.
`opendistro.index_state_management.job_interval` | 5 minutes | The interval at which the managed index jobs are run.
`opendistro.index_state_management.coordinator.sweep_period` | 10 minutes | How often the routine background sweep is run.
`opendistro.index_state_management.coordinator.backoff_millis` | 50 milliseconds | The backoff time between retries for failures in the `ManagedIndexCoordinator` (such as when we update managed indices).
`opendistro.index_state_management.coordinator.backoff_count` | 2 | The count of retries for failures in the `ManagedIndexCoordinator`.
`opendistro.index_state_management.history.enabled` | True | Specifies whether audit history is enabled or not. The logs from ISM are automatically indexed to a logs document.
`opendistro.index_state_management.history.max_docs` | 2,500,000 | The maximum number of documents before rolling over the audit history index.
`opendistro.index_state_management.history.max_age` | 24 hours | The maximum age before rolling over the audit history index.
`opendistro.index_state_management.history.rollover_check_period` | 8 hours | The time between rollover checks for the audit history index.
`opendistro.index_state_management.history.rollover_retention_period` | 30 days | How long audit history indices are kept.
`opendistro.index_state_management.allow_list` | All actions | List of actions that you can use.


## Audit history indices

If you don't want to disable ISM audit history or shorten the retention period, you can create an [index template](../../elasticsearch/index-templates/) to reduce the shard count of the history indices:

```json
PUT _index_template/ism_history_indices
{
  "index_patterns": [
    ".opendistro-ism-managed-index-history-*"
  ],
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
```
