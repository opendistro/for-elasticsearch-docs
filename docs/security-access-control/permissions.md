---
layout: default
title: Permissions
parent: Security - Access Control
nav_order: 70
---

# Permissions

This page is a complete list of available permissions in the security plugin. Each permission controls access to a data type or API.

Rather than creating new action groups from individual permissions, you can often achieve your desired security posture using some combination of the default action groups. To learn more, see [Default Action Groups](../default-action-groups).
{: .tip }


## Cluster

- cluster:admin/ingest/pipeline/delete
- cluster:admin/ingest/pipeline/get
- cluster:admin/ingest/pipeline/put
- cluster:admin/ingest/pipeline/simulate
- cluster:admin/ingest/processor/grok/get
- cluster:admin/reindex/rethrottle
- cluster:admin/repository/delete
- cluster:admin/repository/get
- cluster:admin/repository/put
- cluster:admin/repository/verify
- cluster:admin/reroute
- cluster:admin/script/delete
- cluster:admin/script/get
- cluster:admin/script/put
- cluster:admin/settings/update
- cluster:admin/snapshot/create
- cluster:admin/snapshot/delete
- cluster:admin/snapshot/get
- cluster:admin/snapshot/restore
- cluster:admin/snapshot/status
- cluster:admin/snapshot/status*
- cluster:admin/tasks/cancel
- cluster:admin/tasks/test
- cluster:admin/tasks/testunblock
- cluster:monitor/allocation/explain
- cluster:monitor/health
- cluster:monitor/main
- cluster:monitor/nodes/hot_threads
- cluster:monitor/nodes/info
- cluster:monitor/nodes/liveness
- cluster:monitor/nodes/stats
- cluster:monitor/nodes/usage
- cluster:monitor/remote/info
- cluster:monitor/state
- cluster:monitor/stats
- cluster:monitor/task
- cluster:monitor/task/get
- cluster:monitor/tasks/list


## Indices

- indices:admin/aliases
- indices:admin/aliases/exists
- indices:admin/aliases/get
- indices:admin/analyze
- indices:admin/cache/clear
- indices:admin/close
- indices:admin/create
- indices:admin/delete
- indices:admin/exists
- indices:admin/flush
- indices:admin/flush*
- indices:admin/forcemerge
- indices:admin/get
- indices:admin/mapping/put
- indices:admin/mappings/fields/get
- indices:admin/mappings/fields/get*
- indices:admin/mappings/get
- indices:admin/open
- indices:admin/refresh
- indices:admin/refresh*
- indices:admin/rollover
- indices:admin/seq_no/global_checkpoint_sync
- indices:admin/settings/update
- indices:admin/shards/search_shards
- indices:admin/shrink
- indices:admin/synced_flush
- indices:admin/template/delete
- indices:admin/template/get
- indices:admin/template/put
- indices:admin/types/exists
- indices:admin/upgrade
- indices:admin/validate/query
- indices:data/read/explain
- indices:data/read/field_caps
- indices:data/read/field_caps*
- indices:data/read/get
- indices:data/read/mget
- indices:data/read/mget*
- indices:data/read/msearch
- indices:data/read/msearch/template
- indices:data/read/mtv
- indices:data/read/mtv*
- indices:data/read/scroll
- indices:data/read/scroll/clear
- indices:data/read/search
- indices:data/read/search*
- indices:data/read/search/template
- indices:data/read/tv
- indices:data/write/bulk
- indices:data/write/bulk*
- indices:data/write/delete
- indices:data/write/delete/byquery
- indices:data/write/index
- indices:data/write/reindex
- indices:data/write/update
- indices:data/write/update/byquery
- indices:monitor/recovery
- indices:monitor/segments
- indices:monitor/settings/get
- indices:monitor/shard_stores
- indices:monitor/stats
- indices:monitor/upgrade
