---
layout: default
title: REST API Reference
parent: Elasticsearch
nav_order: 99
---

# Elasticsearch REST API reference

We generate this reference from the Elasticsearch REST API specification. As such, its usefulness depends on the accuracy of the specification.

For language issues, missing information, and inaccuracies, modify the JSON files in `rest-api-spec/src/main/resources/rest-api-spec/api` and submit pull requests to the upstream Elasticsearch repository.

---

## bulk

Allows to perform multiple index/update/delete operations in a single request.

```
POST _bulk
PUT _bulk
```

```
POST {index}/_bulk
PUT {index}/_bulk
```

```
POST {index}/{type}/_bulk
PUT {index}/{type}/_bulk
```

#### HTTP request body

The operation definition and data (action-data pairs), separated by newlines

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
wait_for_active_shards | string | Sets the number of shard copies that must be active before proceeding with the bulk operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
refresh | enum | If `true` then refresh the effected shards to make this operation visible to search, if `wait_for` then wait for a refresh to make this operation visible to search, if `false` (the default) then do nothing with refreshes.
routing | string | Specific routing value
timeout | time | Explicit operation timeout
type | string | Default document type for items which don't provide one
_source | list | True or false to return the _source field or not, or default list of fields to return, can be overridden on each sub-request
_source_excludes | list | Default list of fields to exclude from the returned _source field, can be overridden on each sub-request
_source_includes | list | Default list of fields to extract and return from the _source field, can be overridden on each sub-request
pipeline | string | The pipeline id to preprocess incoming documents with


## cat.aliases

Shows information about currently configured aliases to indices including filter and routing infos.

```
GET _cat/aliases
```

```
GET _cat/aliases/{name}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
local | boolean | Return local information, do not retrieve the state from master node (default: false)
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.allocation

Provides a snapshot of how many shards are allocated to each data node and how much disk space they are using.

```
GET _cat/allocation
```

```
GET _cat/allocation/{node_id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
bytes | enum | The unit in which to display byte values
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.count

Provides quick access to the document count of the entire cluster, or individual indices.

```
GET _cat/count
```

```
GET _cat/count/{index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.fielddata

Shows how much heap memory is currently being used by fielddata on every data node in the cluster.

```
GET _cat/fielddata
```

```
GET _cat/fielddata/{fields}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
bytes | enum | The unit in which to display byte values
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers
fields | list | A comma-separated list of fields to return in the output


## cat.health

Returns a concise representation of the cluster health.

```
GET _cat/health
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
time | enum | The unit in which to display time values
ts | boolean | Set to false to disable timestamping
v | boolean | Verbose mode. Display column headers


## cat.help

Returns help for the Cat APIs.

```
GET _cat
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by


## cat.indices

Returns information about indices: number of primaries and replicas, document counts, disk size, ...

```
GET _cat/indices
```

```
GET _cat/indices/{index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
bytes | enum | The unit in which to display byte values
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
health | enum | A health status ("green", "yellow", or "red" to filter only indices matching the specified health status
help | boolean | Return help information
pri | boolean | Set to true to return stats only for primary shards
s | list | Comma-separated list of column names or column aliases to sort by
time | enum | The unit in which to display time values
v | boolean | Verbose mode. Display column headers
include_unloaded_segments | boolean | If set to true segment stats will include stats for segments that are not currently loaded into memory


## cat.master

Returns information about the master node.

```
GET _cat/master
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.nodeattrs

Returns information about custom node attributes.

```
GET _cat/nodeattrs
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.nodes

Returns basic statistics about performance of cluster nodes.

```
GET _cat/nodes
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
bytes | enum | The unit in which to display byte values
format | string | a short version of the Accept header, e.g. json, yaml
full_id | boolean | Return the full node ID instead of the shortened version (default: false)
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
time | enum | The unit in which to display time values
v | boolean | Verbose mode. Display column headers


## cat.pending_tasks

Returns a concise representation of the cluster pending tasks.

```
GET _cat/pending_tasks
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
time | enum | The unit in which to display time values
v | boolean | Verbose mode. Display column headers


## cat.plugins

Returns information about installed plugins across nodes node.

```
GET _cat/plugins
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.recovery

Returns information about index shard recoveries, both on-going completed.

```
GET _cat/recovery
```

```
GET _cat/recovery/{index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
active_only | boolean | If `true`, the response only includes ongoing shard recoveries
bytes | enum | The unit in which to display byte values
detailed | boolean | If `true`, the response includes detailed information about shard recoveries
h | list | Comma-separated list of column names to display
help | boolean | Return help information
index | list | Comma-separated list or wildcard expression of index names to limit the returned information
s | list | Comma-separated list of column names or column aliases to sort by
time | enum | The unit in which to display time values
v | boolean | Verbose mode. Display column headers


## cat.repositories

Returns information about snapshot repositories registered in the cluster.

```
GET _cat/repositories
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
local | boolean | Return local information, do not retrieve the state from master node
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.segments

Provides low-level information about the segments in the shards of an index.

```
GET _cat/segments
```

```
GET _cat/segments/{index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
bytes | enum | The unit in which to display byte values
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.shards

Provides a detailed view of shard allocation on nodes.

```
GET _cat/shards
```

```
GET _cat/shards/{index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
bytes | enum | The unit in which to display byte values
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
time | enum | The unit in which to display time values
v | boolean | Verbose mode. Display column headers


## cat.snapshots

Returns all snapshots in a specific repository.

```
GET _cat/snapshots
```

```
GET _cat/snapshots/{repository}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
ignore_unavailable | boolean | Set to true to ignore unavailable snapshots
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
time | enum | The unit in which to display time values
v | boolean | Verbose mode. Display column headers


## cat.tasks

Returns information about the tasks currently executing on one or more nodes in the cluster.

```
GET _cat/tasks
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
node_id | list | A comma-separated list of node IDs or names to limit the returned information; use `_local` to return information from the node you're connecting to, leave empty to get information from all nodes
actions | list | A comma-separated list of actions that should be returned. Leave empty to return all.
detailed | boolean | Return detailed task information (default: false)
parent_task | number | Return tasks with specified parent task id. Set to -1 to return all.
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
time | enum | The unit in which to display time values
v | boolean | Verbose mode. Display column headers


## cat.templates

Returns information about existing templates.

```
GET _cat/templates
```

```
GET _cat/templates/{name}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## cat.thread_pool

Returns cluster-wide thread pool statistics per node.
By default the active, queue and rejected statistics are returned for all thread pools.

```
GET _cat/thread_pool
```

```
GET _cat/thread_pool/{thread_pool_patterns}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
format | string | a short version of the Accept header, e.g. json, yaml
size | enum | The multiplier in which to display values
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
h | list | Comma-separated list of column names to display
help | boolean | Return help information
s | list | Comma-separated list of column names or column aliases to sort by
v | boolean | Verbose mode. Display column headers


## clear_scroll

Explicitly clears the search context for a scroll.

```
DELETE _search/scroll
```

```
DELETE _search/scroll/{scroll_id}
```

#### HTTP request body

A comma-separated list of scroll IDs to clear if none was specified via the scroll_id parameter




## cluster.allocation_explain

Provides explanations for shard allocations in the cluster.

```
GET _cluster/allocation/explain
POST _cluster/allocation/explain
```

#### HTTP request body

The index, shard, and primary flag to explain. Empty means 'explain the first unassigned shard'


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_yes_decisions | boolean | Return 'YES' decisions in explanation (default: false)
include_disk_info | boolean | Return information about disk usage and shard sizes (default: false)


## cluster.get_settings

Returns cluster settings.

```
GET _cluster/settings
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
flat_settings | boolean | Return settings in flat format (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout
include_defaults | boolean | Whether to return all default clusters setting.


## cluster.health

Returns basic information about the health of the cluster.

```
GET _cluster/health
```

```
GET _cluster/health/{index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
level | enum | Specify the level of detail for returned information
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout
wait_for_active_shards | string | Wait until the specified number of shards is active
wait_for_nodes | string | Wait until the specified number of nodes is available
wait_for_events | enum | Wait until all currently queued events with the given priority are processed
wait_for_no_relocating_shards | boolean | Whether to wait until there are no relocating shards in the cluster
wait_for_no_initializing_shards | boolean | Whether to wait until there are no initializing shards in the cluster
wait_for_status | enum | Wait until cluster is in a specific state


## cluster.pending_tasks

Returns a list of any cluster-level changes (e.g. create index, update mapping,
allocate or fail shard) which have not yet been executed.

```
GET _cluster/pending_tasks
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Specify timeout for connection to master


## cluster.put_settings

Updates the cluster settings.

```
PUT _cluster/settings
```

#### HTTP request body

The settings to be updated. Can be either `transient` or `persistent` (survives cluster restart).

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
flat_settings | boolean | Return settings in flat format (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout


## cluster.remote_info

Returns the information about configured remote clusters.

```
GET _remote/info
```




## cluster.reroute

Allows to manually change the allocation of individual shards in the cluster.

```
POST _cluster/reroute
```

#### HTTP request body

The definition of `commands` to perform (`move`, `cancel`, `allocate`)


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
dry_run | boolean | Simulate the operation only and return the resulting state
explain | boolean | Return an explanation of why the commands can or cannot be executed
retry_failed | boolean | Retries allocation of shards that are blocked due to too many subsequent allocation failures
metric | list | Limit the information returned to the specified metrics. Defaults to all but metadata
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout


## cluster.state

Returns a comprehensive information about the state of the cluster.

```
GET _cluster/state
```

```
GET _cluster/state/{metric}
```

```
GET _cluster/state/{metric}/{index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
local | boolean | Return local information, do not retrieve the state from master node (default: false)
master_timeout | time | Specify timeout for connection to master
flat_settings | boolean | Return settings in flat format (default: false)
wait_for_metadata_version | number | Wait for the metadata version to be equal or greater than the specified metadata version
wait_for_timeout | time | The maximum time to wait for wait_for_metadata_version before timing out
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## cluster.stats

Returns high-level overview of cluster statistics.

```
GET _cluster/stats
```

```
GET _cluster/stats/nodes/{node_id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
flat_settings | boolean | Return settings in flat format (default: false)
timeout | time | Explicit operation timeout


## count

Returns number of documents matching a query.

```
POST _count
GET _count
```

```
POST {index}/_count
GET {index}/_count
```

```
POST {index}/{type}/_count
GET {index}/{type}/_count
```

#### HTTP request body

A query to restrict the results specified with the Query DSL (optional)


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
ignore_throttled | boolean | Whether specified concrete, expanded or aliased indices should be ignored when throttled
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
min_score | number | Include only documents with a specific `_score` value in the result
preference | string | Specify the node or shard the operation should be performed on (default: random)
routing | list | A comma-separated list of specific routing values
q | string | Query in the Lucene query string syntax
analyzer | string | The analyzer to use for the query string
analyze_wildcard | boolean | Specify whether wildcard and prefix queries should be analyzed (default: false)
default_operator | enum | The default operator for query string query (AND or OR)
df | string | The field to use as default where no field prefix is given in the query string
lenient | boolean | Specify whether format-based query failures (such as providing text to a numeric field) should be ignored
terminate_after | number | The maximum count for each shard, upon reaching which the query execution will terminate early


## create

Creates a new document in the index.

Returns a 409 response when a document with a same ID already exists in the index.

```
PUT {index}/_create/{id}
POST {index}/_create/{id}
```

```
PUT {index}/{type}/{id}/_create
POST {index}/{type}/{id}/_create
```

#### HTTP request body

The document

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
wait_for_active_shards | string | Sets the number of shard copies that must be active before proceeding with the index operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
refresh | enum | If `true` then refresh the affected shards to make this operation visible to search, if `wait_for` then wait for a refresh to make this operation visible to search, if `false` (the default) then do nothing with refreshes.
routing | string | Specific routing value
timeout | time | Explicit operation timeout
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type
pipeline | string | The pipeline id to preprocess incoming documents with


## delete

Removes a document from the index.

```
DELETE {index}/_doc/{id}
```

```
DELETE {index}/{type}/{id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
wait_for_active_shards | string | Sets the number of shard copies that must be active before proceeding with the delete operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
refresh | enum | If `true` then refresh the effected shards to make this operation visible to search, if `wait_for` then wait for a refresh to make this operation visible to search, if `false` (the default) then do nothing with refreshes.
routing | string | Specific routing value
timeout | time | Explicit operation timeout
if_seq_no | number | only perform the delete operation if the last operation that has changed the document has the specified sequence number
if_primary_term | number | only perform the delete operation if the last operation that has changed the document has the specified primary term
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type


## delete_by_query

Deletes documents matching the provided query.

```
POST {index}/_delete_by_query
```

```
POST {index}/{type}/_delete_by_query
```

#### HTTP request body

The search definition using the Query DSL

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
analyze_wildcard | boolean | Specify whether wildcard and prefix queries should be analyzed (default: false)
default_operator | enum | The default operator for query string query (AND or OR)
df | string | The field to use as default where no field prefix is given in the query string
from | number | Starting offset (default: 0)
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
conflicts | enum | What to do when the delete by query hits version conflicts?
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
lenient | boolean | Specify whether format-based query failures (such as providing text to a numeric field) should be ignored
preference | string | Specify the node or shard the operation should be performed on (default: random)
q | string | Query in the Lucene query string syntax
routing | list | A comma-separated list of specific routing values
scroll | time | Specify how long a consistent view of the index should be maintained for scrolled search
search_type | enum | Search operation type
search_timeout | time | Explicit timeout for each search request. Defaults to no timeout.
size | number | Deprecated, please use `max_docs` instead
max_docs | number | Maximum number of documents to process (default: all documents)
sort | list | A comma-separated list of <field>:<direction> pairs
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field
terminate_after | number | The maximum number of documents to collect for each shard, upon reaching which the query execution will terminate early.
stats | list | Specific 'tag' of the request for logging and statistical purposes
version | boolean | Specify whether to return document version as part of a hit
request_cache | boolean | Specify if request cache should be used for this request or not, defaults to index level setting
refresh | boolean | Should the effected indexes be refreshed?
timeout | time | Time each individual bulk request should wait for shards that are unavailable.
wait_for_active_shards | string | Sets the number of shard copies that must be active before proceeding with the delete by query operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
scroll_size | number | Size on the scroll request powering the delete by query
wait_for_completion | boolean | Should the request should block until the delete by query is complete.
requests_per_second | number | The throttle for this request in sub-requests per second. -1 means no throttle.
slices | number | The number of slices this task should be divided into. Defaults to 1 meaning the task isn't sliced into subtasks.


## delete_by_query_rethrottle

Changes the number of requests per second for a particular Delete By Query operation.

```
POST _delete_by_query/{task_id}/_rethrottle
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
requests_per_second | number | The throttle to set on this request in floating sub-requests per second. -1 means set no throttle.


## delete_script

Deletes a script.

```
DELETE _scripts/{id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master


## exists

Returns information about whether a document exists in an index.

```
HEAD {index}/_doc/{id}
```

```
HEAD {index}/{type}/{id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
stored_fields | list | A comma-separated list of stored fields to return in the response
preference | string | Specify the node or shard the operation should be performed on (default: random)
realtime | boolean | Specify whether to perform the operation in realtime or search mode
refresh | boolean | Refresh the shard containing the document before performing the operation
routing | string | Specific routing value
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type


## exists_source

Returns information about whether a document source exists in an index.

```
HEAD {index}/_source/{id}
```

```
HEAD {index}/{type}/{id}/_source
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
preference | string | Specify the node or shard the operation should be performed on (default: random)
realtime | boolean | Specify whether to perform the operation in realtime or search mode
refresh | boolean | Refresh the shard containing the document before performing the operation
routing | string | Specific routing value
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type


## explain

Returns information about why a specific matches (or doesn't match) a query.

```
GET {index}/_explain/{id}
POST {index}/_explain/{id}
```

```
GET {index}/{type}/{id}/_explain
POST {index}/{type}/{id}/_explain
```

#### HTTP request body

The query definition using the Query DSL


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
analyze_wildcard | boolean | Specify whether wildcards and prefix queries in the query string query should be analyzed (default: false)
analyzer | string | The analyzer for the query string query
default_operator | enum | The default operator for query string query (AND or OR)
df | string | The default field for query string query (default: _all)
stored_fields | list | A comma-separated list of stored fields to return in the response
lenient | boolean | Specify whether format-based query failures (such as providing text to a numeric field) should be ignored
preference | string | Specify the node or shard the operation should be performed on (default: random)
q | string | Query in the Lucene query string syntax
routing | string | Specific routing value
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field


## field_caps

Returns the information about the capabilities of fields among multiple indices.

```
GET _field_caps
POST _field_caps
```

```
GET {index}/_field_caps
POST {index}/_field_caps
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
fields | list | A comma-separated list of field names
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
include_unmapped | boolean | Indicates whether unmapped fields should be included in the response.


## get

Returns a document.

```
GET {index}/_doc/{id}
```

```
GET {index}/{type}/{id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
stored_fields | list | A comma-separated list of stored fields to return in the response
preference | string | Specify the node or shard the operation should be performed on (default: random)
realtime | boolean | Specify whether to perform the operation in realtime or search mode
refresh | boolean | Refresh the shard containing the document before performing the operation
routing | string | Specific routing value
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type


## get_script

Returns a script.

```
GET _scripts/{id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Specify timeout for connection to master


## get_source

Returns the source of a document.

```
GET {index}/_source/{id}
```

```
GET {index}/{type}/{id}/_source
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
preference | string | Specify the node or shard the operation should be performed on (default: random)
realtime | boolean | Specify whether to perform the operation in realtime or search mode
refresh | boolean | Refresh the shard containing the document before performing the operation
routing | string | Specific routing value
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type


## index

Creates or updates a document in an index.

```
POST {index}/_doc/{id}
PUT {index}/_doc/{id}
```

```
POST {index}/_doc
```

```
POST {index}/{type}
```

```
POST {index}/{type}/{id}
PUT {index}/{type}/{id}
```

#### HTTP request body

The document

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
wait_for_active_shards | string | Sets the number of shard copies that must be active before proceeding with the index operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
op_type | enum | Explicit operation type
refresh | enum | If `true` then refresh the affected shards to make this operation visible to search, if `wait_for` then wait for a refresh to make this operation visible to search, if `false` (the default) then do nothing with refreshes.
routing | string | Specific routing value
timeout | time | Explicit operation timeout
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type
if_seq_no | number | only perform the index operation if the last operation that has changed the document has the specified sequence number
if_primary_term | number | only perform the index operation if the last operation that has changed the document has the specified primary term
pipeline | string | The pipeline id to preprocess incoming documents with


## indices.analyze

Performs the analysis process on a text and return the tokens breakdown of the text.

```
GET _analyze
POST _analyze
```

```
GET {index}/_analyze
POST {index}/_analyze
```

#### HTTP request body

Define analyzer/tokenizer parameters and the text on which the analysis should be performed


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
index | string | The name of the index to scope the operation


## indices.clear_cache

Clears all or specific caches for one or more indices.

```
POST _cache/clear
```

```
POST {index}/_cache/clear
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
fielddata | boolean | Clear field data
fields | list | A comma-separated list of fields to clear when using the `fielddata` parameter (default: all)
query | boolean | Clear query caches
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
index | list | A comma-separated list of index name to limit the operation
request | boolean | Clear request cache


## indices.clone

Clones an index

```
PUT {index}/_clone/{target}
POST {index}/_clone/{target}
```

#### HTTP request body

The configuration for the target index (`settings` and `aliases`)


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
wait_for_active_shards | string | Set the number of active shards to wait for on the cloned index before the operation returns.


## indices.close

Closes an index.

```
POST {index}/_close
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
wait_for_active_shards | string | Sets the number of active shards to wait for before the operation returns.


## indices.create

Creates an index with optional settings and mappings.

```
PUT {index}
```

#### HTTP request body

The configuration for the index (`settings` and `mappings`)


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_type_name | boolean | Whether a type should be expected in the body of the mappings.
wait_for_active_shards | string | Set the number of active shards to wait for before the operation returns.
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master


## indices.delete

Deletes an index.

```
DELETE {index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
ignore_unavailable | boolean | Ignore unavailable indexes (default: false)
allow_no_indices | boolean | Ignore if a wildcard expression resolves to no concrete indices (default: false)
expand_wildcards | enum | Whether wildcard expressions should get expanded to open or closed indices (default: open)


## indices.delete_alias

Deletes an alias.

```
DELETE {index}/_alias/{name}
```

```
DELETE {index}/_aliases/{name}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit timestamp for the document
master_timeout | time | Specify timeout for connection to master


## indices.delete_template

Deletes an index template.

```
DELETE _template/{name}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master


## indices.exists

Returns information about whether a particular index exists.

```
HEAD {index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
local | boolean | Return local information, do not retrieve the state from master node (default: false)
ignore_unavailable | boolean | Ignore unavailable indexes (default: false)
allow_no_indices | boolean | Ignore if a wildcard expression resolves to no concrete indices (default: false)
expand_wildcards | enum | Whether wildcard expressions should get expanded to open or closed indices (default: open)
flat_settings | boolean | Return settings in flat format (default: false)
include_defaults | boolean | Whether to return all default setting for each of the indices.


## indices.exists_alias

Returns information about whether a particular alias exists.

```
HEAD _alias/{name}
```

```
HEAD {index}/_alias/{name}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
local | boolean | Return local information, do not retrieve the state from master node (default: false)


## indices.exists_template

Returns information about whether a particular index template exists.

```
HEAD _template/{name}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
flat_settings | boolean | Return settings in flat format (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
local | boolean | Return local information, do not retrieve the state from master node (default: false)


## indices.exists_type

Returns information about whether a particular document type exists. (DEPRECATED)

```
HEAD {index}/_mapping/{type}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
local | boolean | Return local information, do not retrieve the state from master node (default: false)


## indices.flush

Performs the flush operation on one or more indices.

```
POST _flush
GET _flush
```

```
POST {index}/_flush
GET {index}/_flush
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
force | boolean | Whether a flush should be forced even if it is not necessarily needed ie. if no changes will be committed to the index. This is useful if transaction log IDs should be incremented even if no uncommitted changes are present. (This setting can be considered as internal)
wait_if_ongoing | boolean | If set to true the flush operation will block until the flush can be executed if another flush operation is already executing. The default is true. If set to false the flush will be skipped iff if another flush operation is already running.
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## indices.flush_synced

Performs a synced flush operation on one or more indices.

```
POST _flush/synced
GET _flush/synced
```

```
POST {index}/_flush/synced
GET {index}/_flush/synced
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## indices.forcemerge

Performs the force merge operation on one or more indices.

```
POST _forcemerge
```

```
POST {index}/_forcemerge
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
flush | boolean | Specify whether the index should be flushed after performing the operation (default: true)
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
max_num_segments | number | The number of segments the index should be merged into (default: dynamic)
only_expunge_deletes | boolean | Specify whether the operation should only expunge deleted documents


## indices.get

Returns information about one or more indices.

```
GET {index}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_type_name | boolean | Whether to add the type name to the response (default: false)
local | boolean | Return local information, do not retrieve the state from master node (default: false)
ignore_unavailable | boolean | Ignore unavailable indexes (default: false)
allow_no_indices | boolean | Ignore if a wildcard expression resolves to no concrete indices (default: false)
expand_wildcards | enum | Whether wildcard expressions should get expanded to open or closed indices (default: open)
flat_settings | boolean | Return settings in flat format (default: false)
include_defaults | boolean | Whether to return all default setting for each of the indices.
master_timeout | time | Specify timeout for connection to master


## indices.get_alias

Returns an alias.

```
GET _alias
```

```
GET _alias/{name}
```

```
GET {index}/_alias/{name}
```

```
GET {index}/_alias
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
local | boolean | Return local information, do not retrieve the state from master node (default: false)


## indices.get_field_mapping

Returns mapping for one or more fields.

```
GET _mapping/field/{fields}
```

```
GET {index}/_mapping/field/{fields}
```

```
GET _mapping/{type}/field/{fields}
```

```
GET {index}/_mapping/{type}/field/{fields}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_type_name | boolean | Whether a type should be returned in the body of the mappings.
include_defaults | boolean | Whether the default mapping values should be returned as well
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
local | boolean | Return local information, do not retrieve the state from master node (default: false)


## indices.get_mapping

Returns mappings for one or more indices.

```
GET _mapping
```

```
GET {index}/_mapping
```

```
GET _mapping/{type}
```

```
GET {index}/_mapping/{type}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_type_name | boolean | Whether to add the type name to the response (default: false)
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
master_timeout | time | Specify timeout for connection to master
local | boolean | Return local information, do not retrieve the state from master node (default: false)


## indices.get_settings

Returns settings for one or more indices.

```
GET _settings
```

```
GET {index}/_settings
```

```
GET {index}/_settings/{name}
```

```
GET _settings/{name}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Specify timeout for connection to master
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
flat_settings | boolean | Return settings in flat format (default: false)
local | boolean | Return local information, do not retrieve the state from master node (default: false)
include_defaults | boolean | Whether to return all default setting for each of the indices.


## indices.get_template

Returns an index template.

```
GET _template
```

```
GET _template/{name}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_type_name | boolean | Whether a type should be returned in the body of the mappings.
flat_settings | boolean | Return settings in flat format (default: false)
master_timeout | time | Explicit operation timeout for connection to master node
local | boolean | Return local information, do not retrieve the state from master node (default: false)


## indices.get_upgrade

The _upgrade API is no longer useful and will be removed.

```
GET _upgrade
```

```
GET {index}/_upgrade
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## indices.open

Opens an index.

```
POST {index}/_open
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
wait_for_active_shards | string | Sets the number of active shards to wait for before the operation returns.


## indices.put_alias

Creates or updates an alias.

```
PUT {index}/_alias/{name}
POST {index}/_alias/{name}
```

```
PUT {index}/_aliases/{name}
POST {index}/_aliases/{name}
```

#### HTTP request body

The settings for the alias, such as `routing` or `filter`

**Required**: False


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit timestamp for the document
master_timeout | time | Specify timeout for connection to master


## indices.put_mapping

Updates the index mappings.

```
PUT index}/_mapping
POST index}/_mapping
```

```
PUT {index}/{type}/_mapping
POST {index}/{type}/_mapping
```

```
PUT {index}/_mapping/{type}
POST {index}/_mapping/{type}
```

```
PUT {index}/{type}/_mappings
POST {index}/{type}/_mappings
```

```
PUT {index}/_mappings/{type}
POST {index}/_mappings/{type}
```

```
PUT _mappings/{type}
POST _mappings/{type}
```

```
PUT index}/_mappings
POST index}/_mappings
```

```
PUT _mapping/{type}
POST _mapping/{type}
```

#### HTTP request body

The mapping definition

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_type_name | boolean | Whether a type should be expected in the body of the mappings.
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## indices.put_settings

Updates the index settings.

```
PUT _settings
```

```
PUT {index}/_settings
```

#### HTTP request body

The index settings to be updated

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Specify timeout for connection to master
timeout | time | Explicit operation timeout
preserve_existing | boolean | Whether to update existing settings. If set to `true` existing settings on an index remain unchanged, the default is `false`
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
flat_settings | boolean | Return settings in flat format (default: false)


## indices.put_template

Creates or updates an index template.

```
PUT _template/{name}
POST _template/{name}
```

#### HTTP request body

The template definition

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_type_name | boolean | Whether a type should be returned in the body of the mappings.
order | number | The order for this template when merging multiple matching ones (higher numbers are merged later, overriding the lower numbers)
create | boolean | Whether the index template should only be added if new or can also replace an existing one
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
flat_settings | boolean | Return settings in flat format (default: false)


## indices.recovery

Returns information about ongoing index shard recoveries.

```
GET _recovery
```

```
GET {index}/_recovery
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
detailed | boolean | Whether to display detailed information about shard recovery
active_only | boolean | Display only those recoveries that are currently on-going


## indices.refresh

Performs the refresh operation in one or more indices.

```
POST _refresh
GET _refresh
```

```
POST {index}/_refresh
GET {index}/_refresh
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## indices.rollover

Updates an alias to point to a new index when the existing index
is considered to be too large or too old.

```
POST {alias}/_rollover
```

```
POST {alias}/_rollover/{new_index}
```

#### HTTP request body

The conditions that needs to be met for executing rollover


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
include_type_name | boolean | Whether a type should be included in the body of the mappings.
timeout | time | Explicit operation timeout
dry_run | boolean | If set to true the rollover action will only be validated but not actually performed even if a condition matches. The default is false
master_timeout | time | Specify timeout for connection to master
wait_for_active_shards | string | Set the number of active shards to wait for on the newly created rollover index before the operation returns.


## indices.segments

Provides low-level information about segments in a Lucene index.

```
GET _segments
```

```
GET {index}/_segments
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
verbose | boolean | Includes detailed memory usage by Lucene.


## indices.shard_stores

Provides store information for shard copies of indices.

```
GET _shard_stores
```

```
GET {index}/_shard_stores
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
status | list | A comma-separated list of statuses used to filter on shards to get store information for
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## indices.shrink

Allow to shrink an existing index into a new index with fewer primary shards.

```
PUT {index}/_shrink/{target}
POST {index}/_shrink/{target}
```

#### HTTP request body

The configuration for the target index (`settings` and `aliases`)


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
copy_settings | boolean | whether or not to copy settings from the source index (defaults to false)
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
wait_for_active_shards | string | Set the number of active shards to wait for on the shrunken index before the operation returns.


## indices.split

Allows you to split an existing index into a new index with more primary shards.

```
PUT {index}/_split/{target}
POST {index}/_split/{target}
```

#### HTTP request body

The configuration for the target index (`settings` and `aliases`)


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
copy_settings | boolean | whether or not to copy settings from the source index (defaults to false)
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
wait_for_active_shards | string | Set the number of active shards to wait for on the shrunken index before the operation returns.


## indices.stats

Provides statistics on operations happening in an index.

```
GET _stats
```

```
GET _stats/{metric}
```

```
GET {index}/_stats
```

```
GET {index}/_stats/{metric}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
completion_fields | list | A comma-separated list of fields for `fielddata` and `suggest` index metric (supports wildcards)
fielddata_fields | list | A comma-separated list of fields for `fielddata` index metric (supports wildcards)
fields | list | A comma-separated list of fields for `fielddata` and `completion` index metric (supports wildcards)
groups | list | A comma-separated list of search groups for `search` index metric
level | enum | Return stats aggregated at cluster, index or shard level
types | list | A comma-separated list of document types for the `indexing` index metric
include_segment_file_sizes | boolean | Whether to report the aggregated disk usage of each one of the Lucene index files (only applies if segment stats are requested)
include_unloaded_segments | boolean | If set to true segment stats will include stats for segments that are not currently loaded into memory
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
forbid_closed_indices | boolean | If set to false stats will also collected from closed indices if explicitly specified or if expand_wildcards expands to closed indices


## indices.update_aliases

Updates index aliases.

```
POST _aliases
```

#### HTTP request body

The definition of `actions` to perform

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Request timeout
master_timeout | time | Specify timeout for connection to master


## indices.upgrade

The _upgrade API is no longer useful and will be removed.

```
POST _upgrade
```

```
POST {index}/_upgrade
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
wait_for_completion | boolean | Specify whether the request should block until the all segments are upgraded (default: false)
only_ancient_segments | boolean | If true, only ancient (an older Lucene major release) segments will be upgraded


## indices.validate_query

Allows a user to validate a potentially expensive query without executing it.

```
GET _validate/query
POST _validate/query
```

```
GET {index}/_validate/query
POST {index}/_validate/query
```

```
GET {index}/{type}/_validate/query
POST {index}/{type}/_validate/query
```

#### HTTP request body

The query definition specified with the Query DSL


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
explain | boolean | Return detailed information about the error
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
q | string | Query in the Lucene query string syntax
analyzer | string | The analyzer to use for the query string
analyze_wildcard | boolean | Specify whether wildcard and prefix queries should be analyzed (default: false)
default_operator | enum | The default operator for query string query (AND or OR)
df | string | The field to use as default where no field prefix is given in the query string
lenient | boolean | Specify whether format-based query failures (such as providing text to a numeric field) should be ignored
rewrite | boolean | Provide a more detailed explanation showing the actual Lucene query that will be executed.
all_shards | boolean | Execute validation on all shards instead of one random shard per index


## info

Returns basic information about the cluster.

```
GET 
```




## ingest.delete_pipeline

Deletes a pipeline.

```
DELETE _ingest/pipeline/{id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout


## ingest.get_pipeline

Returns a pipeline.

```
GET _ingest/pipeline
```

```
GET _ingest/pipeline/{id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node


## ingest.processor_grok

Returns a list of the built-in patterns.

```
GET _ingest/processor/grok
```




## ingest.put_pipeline

Creates or updates a pipeline.

```
PUT _ingest/pipeline/{id}
```

#### HTTP request body

The ingest definition

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout


## ingest.simulate

Allows to simulate a pipeline with example documents.

```
GET _ingest/pipeline/_simulate
POST _ingest/pipeline/_simulate
```

```
GET _ingest/pipeline/{id}/_simulate
POST _ingest/pipeline/{id}/_simulate
```

#### HTTP request body

The simulate definition

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
verbose | boolean | Verbose mode. Display data output for each processor in executed pipeline


## mget

Allows to get multiple documents in one request.

```
GET _mget
POST _mget
```

```
GET {index}/_mget
POST {index}/_mget
```

```
GET {index}/{type}/_mget
POST {index}/{type}/_mget
```

#### HTTP request body

Document identifiers; can be either `docs` (containing full document information) or `ids` (when index and type is provided in the URL.

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
stored_fields | list | A comma-separated list of stored fields to return in the response
preference | string | Specify the node or shard the operation should be performed on (default: random)
realtime | boolean | Specify whether to perform the operation in realtime or search mode
refresh | boolean | Refresh the shard containing the document before performing the operation
routing | string | Specific routing value
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field


## msearch

Allows to execute several search operations in one request.

```
GET _msearch
POST _msearch
```

```
GET {index}/_msearch
POST {index}/_msearch
```

```
GET {index}/{type}/_msearch
POST {index}/{type}/_msearch
```

#### HTTP request body

The request definitions (metadata-search request definition pairs), separated by newlines

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
search_type | enum | Search operation type
max_concurrent_searches | number | Controls the maximum number of concurrent searches the multi search api will execute
typed_keys | boolean | Specify whether aggregation and suggester names should be prefixed by their respective types in the response
pre_filter_shard_size | number | A threshold that enforces a pre-filter roundtrip to prefilter search shards based on query rewriting if the number of shards the search request expands to exceeds the threshold. This filter roundtrip can limit the number of shards significantly if for instance a shard can not match any documents based on it's rewrite method ie. if date filters are mandatory to match but the shard bounds and the query are disjoint.
max_concurrent_shard_requests | number | The number of concurrent shard requests each sub search executes concurrently per node. This value should be used to limit the impact of the search on the cluster in order to limit the number of concurrent shard requests
rest_total_hits_as_int | boolean | Indicates whether hits.total should be rendered as an integer or an object in the rest search response
ccs_minimize_roundtrips | boolean | Indicates whether network round-trips should be minimized as part of cross-cluster search requests execution


## msearch_template

Allows to execute several search template operations in one request.

```
GET _msearch/template
POST _msearch/template
```

```
GET {index}/_msearch/template
POST {index}/_msearch/template
```

```
GET {index}/{type}/_msearch/template
POST {index}/{type}/_msearch/template
```

#### HTTP request body

The request definitions (metadata-search request definition pairs), separated by newlines

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
search_type | enum | Search operation type
typed_keys | boolean | Specify whether aggregation and suggester names should be prefixed by their respective types in the response
max_concurrent_searches | number | Controls the maximum number of concurrent searches the multi search api will execute
rest_total_hits_as_int | boolean | Indicates whether hits.total should be rendered as an integer or an object in the rest search response


## mtermvectors

Returns multiple termvectors in one request.

```
GET _mtermvectors
POST _mtermvectors
```

```
GET {index}/_mtermvectors
POST {index}/_mtermvectors
```

```
GET {index}/{type}/_mtermvectors
POST {index}/{type}/_mtermvectors
```

#### HTTP request body

Define ids, documents, parameters or a list of parameters per document here. You must at least provide a list of document ids. See documentation.

**Required**: False


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ids | list | A comma-separated list of documents ids. You must define ids as parameter or set "ids" or "docs" in the request body
term_statistics | boolean | Specifies if total term frequency and document frequency should be returned. Applies to all returned documents unless otherwise specified in body "params" or "docs".
field_statistics | boolean | Specifies if document count, sum of document frequencies and sum of total term frequencies should be returned. Applies to all returned documents unless otherwise specified in body "params" or "docs".
fields | list | A comma-separated list of fields to return. Applies to all returned documents unless otherwise specified in body "params" or "docs".
offsets | boolean | Specifies if term offsets should be returned. Applies to all returned documents unless otherwise specified in body "params" or "docs".
positions | boolean | Specifies if term positions should be returned. Applies to all returned documents unless otherwise specified in body "params" or "docs".
payloads | boolean | Specifies if term payloads should be returned. Applies to all returned documents unless otherwise specified in body "params" or "docs".
preference | string | Specify the node or shard the operation should be performed on (default: random) .Applies to all returned documents unless otherwise specified in body "params" or "docs".
routing | string | Specific routing value. Applies to all returned documents unless otherwise specified in body "params" or "docs".
realtime | boolean | Specifies if requests are real-time as opposed to near-real-time (default: true).
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type


## nodes.hot_threads

Returns information about hot threads on each node in the cluster.

```
GET _nodes/hot_threads
```

```
GET _nodes/{node_id}/hot_threads
```

```
GET _cluster/nodes/hotthreads
```

```
GET _cluster/nodes/{node_id}/hotthreads
```

```
GET _nodes/hotthreads
```

```
GET _nodes/{node_id}/hotthreads
```

```
GET _cluster/nodes/hot_threads
```

```
GET _cluster/nodes/{node_id}/hot_threads
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
interval | time | The interval for the second sampling of threads
snapshots | number | Number of samples of thread stacktrace (default: 10)
threads | number | Specify the number of threads to provide information for (default: 3)
ignore_idle_threads | boolean | Don't show threads that are in known-idle places, such as waiting on a socket select or pulling from an empty task queue (default: true)
type | enum | The type to sample (default: cpu)
timeout | time | Explicit operation timeout


## nodes.info

Returns information about nodes in the cluster.

```
GET _nodes
```

```
GET _nodes/{node_id}
```

```
GET _nodes/{metric}
```

```
GET _nodes/{node_id}/{metric}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
flat_settings | boolean | Return settings in flat format (default: false)
timeout | time | Explicit operation timeout


## nodes.reload_secure_settings

Reloads secure settings.

```
POST _nodes/reload_secure_settings
```

```
POST _nodes/{node_id}/reload_secure_settings
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout


## nodes.stats

Returns statistical information about nodes in the cluster.

```
GET _nodes/stats
```

```
GET _nodes/{node_id}/stats
```

```
GET _nodes/stats/{metric}
```

```
GET _nodes/{node_id}/stats/{metric}
```

```
GET _nodes/stats/{metric}/{index_metric}
```

```
GET _nodes/{node_id}/stats/{metric}/{index_metric}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
completion_fields | list | A comma-separated list of fields for `fielddata` and `suggest` index metric (supports wildcards)
fielddata_fields | list | A comma-separated list of fields for `fielddata` index metric (supports wildcards)
fields | list | A comma-separated list of fields for `fielddata` and `completion` index metric (supports wildcards)
groups | boolean | A comma-separated list of search groups for `search` index metric
level | enum | Return indices stats aggregated at index, node or shard level
types | list | A comma-separated list of document types for the `indexing` index metric
timeout | time | Explicit operation timeout
include_segment_file_sizes | boolean | Whether to report the aggregated disk usage of each one of the Lucene index files (only applies if segment stats are requested)


## nodes.usage

Returns low-level information about REST actions usage on nodes.

```
GET _nodes/usage
```

```
GET _nodes/{node_id}/usage
```

```
GET _nodes/usage/{metric}
```

```
GET _nodes/{node_id}/usage/{metric}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout


## ping

Returns whether the cluster is running.

```
HEAD 
```




## put_script

Creates or updates a script.

```
PUT _scripts/{id}
POST _scripts/{id}
```

```
PUT _scripts/{id}/{context}
POST _scripts/{id}/{context}
```

#### HTTP request body

The document

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
timeout | time | Explicit operation timeout
master_timeout | time | Specify timeout for connection to master
context | string | Context name to compile script against


## rank_eval

Allows to evaluate the quality of ranked search results over a set of typical search queries

```
GET _rank_eval
POST _rank_eval
```

```
GET {index}/_rank_eval
POST {index}/_rank_eval
```

#### HTTP request body

The ranking evaluation search definition, including search requests, document ratings and ranking metric definition.

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## reindex

Allows to copy documents from one index to another, optionally filtering the source
documents by a query, changing the destination index settings, or fetching the
documents from a remote cluster.

```
POST _reindex
```

#### HTTP request body

The search definition using the Query DSL and the prototype for the index request.

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
refresh | boolean | Should the effected indexes be refreshed?
timeout | time | Time each individual bulk request should wait for shards that are unavailable.
wait_for_active_shards | string | Sets the number of shard copies that must be active before proceeding with the reindex operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
wait_for_completion | boolean | Should the request should block until the reindex is complete.
requests_per_second | number | The throttle to set on this request in sub-requests per second. -1 means no throttle.
scroll | time | Control how long to keep the search context alive
slices | number | The number of slices this task should be divided into. Defaults to 1 meaning the task isn't sliced into subtasks.
max_docs | number | Maximum number of documents to process (default: all documents)


## reindex_rethrottle

Changes the number of requests per second for a particular Reindex operation.

```
POST _reindex/{task_id}/_rethrottle
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
requests_per_second | number | The throttle to set on this request in floating sub-requests per second. -1 means set no throttle.


## render_search_template

Allows to use the Mustache language to pre-render a search definition.

```
GET _render/template
POST _render/template
```

```
GET _render/template/{id}
POST _render/template/{id}
```

#### HTTP request body

The search definition template and its params




## scripts_painless_execute

Allows an arbitrary script to be executed and a result to be returned

```
GET _scripts/painless/_execute
POST _scripts/painless/_execute
```

#### HTTP request body

The script to execute




## scroll

Allows to retrieve a large numbers of results from a single search request.

```
GET _search/scroll
POST _search/scroll
```

```
GET _search/scroll/{scroll_id}
POST _search/scroll/{scroll_id}
```

#### HTTP request body

The scroll ID if not passed by URL or query parameter.


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
scroll | time | Specify how long a consistent view of the index should be maintained for scrolled search
scroll_id | string | The scroll ID for scrolled search
rest_total_hits_as_int | boolean | Indicates whether hits.total should be rendered as an integer or an object in the rest search response


## search

Returns results matching a query.

```
GET _search
POST _search
```

```
GET {index}/_search
POST {index}/_search
```

```
GET {index}/{type}/_search
POST {index}/{type}/_search
```

#### HTTP request body

The search definition using the Query DSL


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
analyzer | string | The analyzer to use for the query string
analyze_wildcard | boolean | Specify whether wildcard and prefix queries should be analyzed (default: false)
ccs_minimize_roundtrips | boolean | Indicates whether network round-trips should be minimized as part of cross-cluster search requests execution
default_operator | enum | The default operator for query string query (AND or OR)
df | string | The field to use as default where no field prefix is given in the query string
explain | boolean | Specify whether to return detailed information about score computation as part of a hit
stored_fields | list | A comma-separated list of stored fields to return as part of a hit
docvalue_fields | list | A comma-separated list of fields to return as the docvalue representation of a field for each hit
from | number | Starting offset (default: 0)
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
ignore_throttled | boolean | Whether specified concrete, expanded or aliased indices should be ignored when throttled
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
lenient | boolean | Specify whether format-based query failures (such as providing text to a numeric field) should be ignored
preference | string | Specify the node or shard the operation should be performed on (default: random)
q | string | Query in the Lucene query string syntax
routing | list | A comma-separated list of specific routing values
scroll | time | Specify how long a consistent view of the index should be maintained for scrolled search
search_type | enum | Search operation type
size | number | Number of hits to return (default: 10)
sort | list | A comma-separated list of <field>:<direction> pairs
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field
terminate_after | number | The maximum number of documents to collect for each shard, upon reaching which the query execution will terminate early.
stats | list | Specific 'tag' of the request for logging and statistical purposes
suggest_field | string | Specify which field to use for suggestions
suggest_mode | enum | Specify suggest mode
suggest_size | number | How many suggestions to return in response
suggest_text | string | The source text for which the suggestions should be returned
timeout | time | Explicit operation timeout
track_scores | boolean | Whether to calculate and return scores even if they are not used for sorting
track_total_hits | boolean | Indicate if the number of documents that match the query should be tracked
allow_partial_search_results | boolean | Indicate if an error should be returned if there is a partial search failure or timeout
typed_keys | boolean | Specify whether aggregation and suggester names should be prefixed by their respective types in the response
version | boolean | Specify whether to return document version as part of a hit
seq_no_primary_term | boolean | Specify whether to return sequence number and primary term of the last modification of each hit
request_cache | boolean | Specify if request cache should be used for this request or not, defaults to index level setting
batched_reduce_size | number | The number of shard results that should be reduced at once on the coordinating node. This value should be used as a protection mechanism to reduce the memory overhead per search request if the potential number of shards in the request can be large.
max_concurrent_shard_requests | number | The number of concurrent shard requests per node this search executes concurrently. This value should be used to limit the impact of the search on the cluster in order to limit the number of concurrent shard requests
pre_filter_shard_size | number | A threshold that enforces a pre-filter roundtrip to prefilter search shards based on query rewriting if the number of shards the search request expands to exceeds the threshold. This filter roundtrip can limit the number of shards significantly if for instance a shard can not match any documents based on it's rewrite method ie. if date filters are mandatory to match but the shard bounds and the query are disjoint.
rest_total_hits_as_int | boolean | Indicates whether hits.total should be rendered as an integer or an object in the rest search response


## search_shards

Returns information about the indices and shards that a search request would be executed against.

```
GET _search_shards
POST _search_shards
```

```
GET {index}/_search_shards
POST {index}/_search_shards
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
preference | string | Specify the node or shard the operation should be performed on (default: random)
routing | string | Specific routing value
local | boolean | Return local information, do not retrieve the state from master node (default: false)
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.


## search_template

Allows to use the Mustache language to pre-render a search definition.

```
GET _search/template
POST _search/template
```

```
GET {index}/_search/template
POST {index}/_search/template
```

```
GET {index}/{type}/_search/template
POST {index}/{type}/_search/template
```

#### HTTP request body

The search definition template and its params

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
ignore_throttled | boolean | Whether specified concrete, expanded or aliased indices should be ignored when throttled
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
preference | string | Specify the node or shard the operation should be performed on (default: random)
routing | list | A comma-separated list of specific routing values
scroll | time | Specify how long a consistent view of the index should be maintained for scrolled search
search_type | enum | Search operation type
explain | boolean | Specify whether to return detailed information about score computation as part of a hit
profile | boolean | Specify whether to profile the query execution
typed_keys | boolean | Specify whether aggregation and suggester names should be prefixed by their respective types in the response
rest_total_hits_as_int | boolean | Indicates whether hits.total should be rendered as an integer or an object in the rest search response


## snapshot.cleanup_repository

Removes stale data from repository.

```
POST _snapshot/{repository}/_cleanup
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout


## snapshot.create

Creates a snapshot in a repository.

```
PUT _snapshot/{repository}/{snapshot}
POST _snapshot/{repository}/{snapshot}
```

#### HTTP request body

The snapshot definition

**Required**: False


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
wait_for_completion | boolean | Should this request wait until the operation has completed before returning


## snapshot.create_repository

Creates a repository.

```
PUT _snapshot/{repository}
POST _snapshot/{repository}
```

#### HTTP request body

The repository definition

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout
verify | boolean | Whether to verify the repository after creation


## snapshot.delete

Deletes a snapshot.

```
DELETE _snapshot/{repository}/{snapshot}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node


## snapshot.delete_repository

Deletes a repository.

```
DELETE _snapshot/{repository}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout


## snapshot.get

Returns information about a snapshot.

```
GET _snapshot/{repository}/{snapshot}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
ignore_unavailable | boolean | Whether to ignore unavailable snapshots, defaults to false which means a SnapshotMissingException is thrown
verbose | boolean | Whether to show verbose snapshot info or only show the basic info found in the repository index blob


## snapshot.get_repository

Returns information about a repository.

```
GET _snapshot
```

```
GET _snapshot/{repository}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
local | boolean | Return local information, do not retrieve the state from master node (default: false)


## snapshot.restore

Restores a snapshot.

```
POST _snapshot/{repository}/{snapshot}/_restore
```

#### HTTP request body

Details of what to restore

**Required**: False


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
wait_for_completion | boolean | Should this request wait until the operation has completed before returning


## snapshot.status

Returns information about the status of a snapshot.

```
GET _snapshot/_status
```

```
GET _snapshot/{repository}/_status
```

```
GET _snapshot/{repository}/{snapshot}/_status
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
ignore_unavailable | boolean | Whether to ignore unavailable snapshots, defaults to false which means a SnapshotMissingException is thrown


## snapshot.verify_repository

Verifies a repository.

```
POST _snapshot/{repository}/_verify
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | Explicit operation timeout for connection to master node
timeout | time | Explicit operation timeout


## tasks.cancel

Cancels a task, if it can be cancelled through an API.

```
POST _tasks/_cancel
```

```
POST _tasks/{task_id}/_cancel
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
nodes | list | A comma-separated list of node IDs or names to limit the returned information; use `_local` to return information from the node you're connecting to, leave empty to get information from all nodes
actions | list | A comma-separated list of actions that should be cancelled. Leave empty to cancel all.
parent_task_id | string | Cancel tasks with specified parent task id (node_id:task_number). Set to -1 to cancel all.


## tasks.get

Returns information about a task.

```
GET _tasks/{task_id}
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
wait_for_completion | boolean | Wait for the matching tasks to complete (default: false)
timeout | time | Explicit operation timeout


## tasks.list

Returns a list of tasks.

```
GET _tasks
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
nodes | list | A comma-separated list of node IDs or names to limit the returned information; use `_local` to return information from the node you're connecting to, leave empty to get information from all nodes
actions | list | A comma-separated list of actions that should be returned. Leave empty to return all.
detailed | boolean | Return detailed task information (default: false)
parent_task_id | string | Return tasks with specified parent task id (node_id:task_number). Set to -1 to return all.
wait_for_completion | boolean | Wait for the matching tasks to complete (default: false)
group_by | enum | Group tasks by nodes or parent/child relationships
timeout | time | Explicit operation timeout


## termvectors

Returns information and statistics about terms in the fields of a particular document.

```
GET {index}/_termvectors/{id}
POST {index}/_termvectors/{id}
```

```
GET {index}/_termvectors
POST {index}/_termvectors
```

```
GET {index}/{type}/{id}/_termvectors
POST {index}/{type}/{id}/_termvectors
```

```
GET {index}/{type}/_termvectors
POST {index}/{type}/_termvectors
```

#### HTTP request body

Define parameters and or supply a document to get termvectors for. See documentation.

**Required**: False


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
term_statistics | boolean | Specifies if total term frequency and document frequency should be returned.
field_statistics | boolean | Specifies if document count, sum of document frequencies and sum of total term frequencies should be returned.
fields | list | A comma-separated list of fields to return.
offsets | boolean | Specifies if term offsets should be returned.
positions | boolean | Specifies if term positions should be returned.
payloads | boolean | Specifies if term payloads should be returned.
preference | string | Specify the node or shard the operation should be performed on (default: random).
routing | string | Specific routing value.
realtime | boolean | Specifies if request is real-time as opposed to near-real-time (default: true).
version | number | Explicit version number for concurrency control
version_type | enum | Specific version type


## update

Updates a document with a script or partial document.

```
POST {index}/_update/{id}
```

```
POST {index}/{type}/{id}/_update
```

#### HTTP request body

The request definition requires either `script` or partial `doc`

**Required**: True


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
wait_for_active_shards | string | Sets the number of shard copies that must be active before proceeding with the update operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field
lang | string | The script language (default: painless)
refresh | enum | If `true` then refresh the effected shards to make this operation visible to search, if `wait_for` then wait for a refresh to make this operation visible to search, if `false` (the default) then do nothing with refreshes.
retry_on_conflict | number | Specify how many times should the operation be retried when a conflict occurs (default: 0)
routing | string | Specific routing value
timeout | time | Explicit operation timeout
if_seq_no | number | only perform the update operation if the last operation that has changed the document has the specified sequence number
if_primary_term | number | only perform the update operation if the last operation that has changed the document has the specified primary term


## update_by_query

Performs an update on every document in the index without changing the source,
for example to pick up a mapping change.

```
POST {index}/_update_by_query
```

```
POST {index}/{type}/_update_by_query
```

#### HTTP request body

The search definition using the Query DSL


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
analyzer | string | The analyzer to use for the query string
analyze_wildcard | boolean | Specify whether wildcard and prefix queries should be analyzed (default: false)
default_operator | enum | The default operator for query string query (AND or OR)
df | string | The field to use as default where no field prefix is given in the query string
from | number | Starting offset (default: 0)
ignore_unavailable | boolean | Whether specified concrete indices should be ignored when unavailable (missing or closed)
allow_no_indices | boolean | Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
conflicts | enum | What to do when the update by query hits version conflicts?
expand_wildcards | enum | Whether to expand wildcard expression to concrete indices that are open, closed or both.
lenient | boolean | Specify whether format-based query failures (such as providing text to a numeric field) should be ignored
pipeline | string | Ingest pipeline to set on index requests made by this action. (default: none)
preference | string | Specify the node or shard the operation should be performed on (default: random)
q | string | Query in the Lucene query string syntax
routing | list | A comma-separated list of specific routing values
scroll | time | Specify how long a consistent view of the index should be maintained for scrolled search
search_type | enum | Search operation type
search_timeout | time | Explicit timeout for each search request. Defaults to no timeout.
size | number | Deprecated, please use `max_docs` instead
max_docs | number | Maximum number of documents to process (default: all documents)
sort | list | A comma-separated list of <field>:<direction> pairs
_source | list | True or false to return the _source field or not, or a list of fields to return
_source_excludes | list | A list of fields to exclude from the returned _source field
_source_includes | list | A list of fields to extract and return from the _source field
terminate_after | number | The maximum number of documents to collect for each shard, upon reaching which the query execution will terminate early.
stats | list | Specific 'tag' of the request for logging and statistical purposes
version | boolean | Specify whether to return document version as part of a hit
version_type | boolean | Should the document increment the version number (internal) on hit or not (reindex)
request_cache | boolean | Specify if request cache should be used for this request or not, defaults to index level setting
refresh | boolean | Should the effected indexes be refreshed?
timeout | time | Time each individual bulk request should wait for shards that are unavailable.
wait_for_active_shards | string | Sets the number of shard copies that must be active before proceeding with the update by query operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
scroll_size | number | Size on the scroll request powering the update by query
wait_for_completion | boolean | Should the request should block until the update by query operation is complete.
requests_per_second | number | The throttle to set on this request in sub-requests per second. -1 means no throttle.
slices | number | The number of slices this task should be divided into. Defaults to 1 meaning the task isn't sliced into subtasks.


## update_by_query_rethrottle

Changes the number of requests per second for a particular Update By Query operation.

```
POST _update_by_query/{task_id}/_rethrottle
```


#### URL parameters

Parameter | Type | Description
:--- | :--- | :---
requests_per_second | number | The throttle to set on this request in floating sub-requests per second. -1 means set no throttle.


