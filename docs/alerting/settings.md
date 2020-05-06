---
layout: default
title: Management
parent: Alerting
nav_order: 2
---

# Management


## Alerting indices

The alerting feature creates several indices and one alias. Don't delete these or modify their contents without using the alerting APIs.

Index | Purpose
:--- | :---
`.opendistro-alerting-alerts` | Stores ongoing alerts.
`.opendistro-alerting-alert-history-<date>` | Stores a history of completed alerts.
`.opendistro-alerting-config` | Stores monitors, triggers, and destinations. [Take a snapshot](../../elasticsearch/snapshot-restore) of this index to back up your alerting configuration.
`.opendistro-alerting-alert-history-write` (alias) | Provides a consistent URI for the `.opendistro-alerting-alert-history-<date>` index.


## Alerting settings

We don't recommend changing these settings; the defaults should work well for most use cases.

All settings are available using the Elasticsearch `_cluster/settings` API. None require a restart, and all can be marked `persistent` or `transient`.

Setting | Default | Description
:--- | :--- | :---
`opendistro.scheduled_jobs.enabled` | true | Whether the alerting plugin is enabled or not. If disabled, all monitors immediately stop running.
`opendistro.alerting.index_timeout` | 60s | The timeout for creating monitors and destinations using the REST APIs.
`opendistro.alerting.request_timeout` | 10s | The timeout for miscellaneous requests from the plugin.
`opendistro.alerting.action_throttle_max_value` | 24h | The maximum amount of time you can set for action throttling. By default, this value displays as 1440 minutes in Kibana.
`opendistro.alerting.input_timeout` | 30s | How long the monitor can take to issue the search request.
`opendistro.alerting.bulk_timeout` | 120s | How long the monitor can write alerts to the alert index.
`opendistro.alerting.alert_backoff_count` | 2 | The number of retries for writing alerts before the operation fails.
`opendistro.alerting.alert_backoff_millis` | 50ms | The amount of time to wait between retries---increases exponentially after each failed retry.
`opendistro.alerting.alert_history_rollover_period` | 12h | How frequently to check whether the `.opendistro-alerting-alert-history-write` alias should roll over to a new history index and whether the Alerting plugin should delete any history indices.
`opendistro.alerting.move_alerts_backoff_millis` | 250 | The amount of time to wait between retries---increases exponentially after each failed retry.
`opendistro.alerting.move_alerts_backoff_count` | 3 | The number of retries for moving alerts to a deleted state after their monitor or trigger has been deleted.
`opendistro.alerting.monitor.max_monitors` | 1000 | The maximum number of monitors users can create.
`opendistro.alerting.alert_history_max_age` | 24h | The oldest document the `.opendistro-alert-history-<date>` index should keep.
`opendistro.alerting.alert_history_max_docs` | 1000 | The maximum number of documents the `.opendistro-alert-history-<date>` index should keep.
`opendistro.alerting.alert_history_enabled` | true | Whether to create `.opendistro-alerting-alert-history-<date>` indices.
`opendistro.alerting.alert_history_retention_period` | 30d | The amount of time to keep history indices before automatically deleting them.
`opendistro.scheduled_jobs.sweeper.period` | 5m | The alerting feature uses its "job sweeper" component to periodically check for new or updated jobs. This setting is the rate at which the sweeper checks to see if any jobs (monitors) have changed and need to be rescheduled.
`opendistro.scheduled_jobs.sweeper.page_size` | 100 | The page size for the sweeper. You shouldn't need to change this value.
`opendistro.scheduled_jobs.sweeper.backoff_millis` | 50ms | The amount of time the sweeper waits between retries---increases exponentially after each failed retry.
`opendistro.scheduled_jobs.sweeper.retry_count` | 3 | The total number of times the sweeper should retry before throwing an error.
`opendistro.scheduled_jobs.request_timeout` | 10s | The timeout for the request that sweeps shards for jobs.
