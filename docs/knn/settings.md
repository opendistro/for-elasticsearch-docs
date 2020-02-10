---
layout: default
title: Settings
parent: KNN
nav_order: 10
---

# KNN Settings

The KNN plugin adds several new index settings, cluster settings, and statistics.


## Index settings

The default values should work well for most use cases, but you can change these settings when you create the index.

Setting | Default | Description
:--- | :--- | :---
`index.knn.algo_param.ef_search` | 512 | The size of the dynamic list used during KNN searches. Higher values lead to more accurate, but slower searches.
`index.knn.algo_param.ef_construction` | 512 | The size of the dynamic list used during KNN graph creation. Higher values lead to a more accurate graph, but slower indexing speed.
`index.knn.algo_param.m` | 16 | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2-100.


## Cluster settings

Setting | Default | Description
:--- | :--- | :---
`knn.algo_param.index_thread_qty` | 1 | The number of threads used for graph creation. Keeping this value low reduces the CPU impact of the KNN plugin, but also reduces indexing performance.
`knn.cache.item.expiry.enabled` | false | Whether to remove graphs that have not been accessed for a certain duration from memory.
`knn.cache.item.expiry.minutes` | 3h | If enabled, the idle time before removing a graph from memory.
`knn.circuit_breaker.unset.percentage` | 75.0 | The native memory usage threshold for the circuit breaker. Memory usage must be below this percentage of `knn.memory.circuit_breaker.limit` for `knn.circuit_breaker.triggered` to remain false.
`knn.circuit_breaker.triggered` | false | True when memory usage exceeds the `knn.circuit_breaker.unset.percentage` value.
`knn.memory.circuit_breaker.limit` | 60% | The native memory limit for graphs. At the default value, if a machine has 100 GB of memory and the JVM uses 32 GB, KNN uses 60% of the remaining 68 GB (40.8 GB). If memory usage exceeds this value, KNN removes the least recently used graphs.
`knn.memory.circuit_breaker.enabled` | true | Whether to enable the KNN memory circuit breaker.
`knn.plugin.enabled`| true | Enables or disables the KNN plugin.


## Statistics

KNN includes statistics that can give you a sense for how the plugin is performing:

```
GET _opendistro/_knn/stats
```

You can also filter by node and/or statistic:

```
GET /_opendistro/_knn/nodeId1,nodeId2/stats/statName1,statName2
```

Statistic |  Description
:--- | :---
`totalLoadTime` | The time in nanoseconds that KNN has taken to load graphs into the cache.
`evictionCount` | The number of graphs that have been evicted from the cache due to memory constraints or idle time.
`hitCount` | The number of cache hits. A cache hit occurs when a user queries a graph and it is already loaded into memory.
`cacheCapacityReached` | Whether `knn.memory.circuit_breaker.limit` has been reached.
`loadSuccessCount` | The number of times KNN successfully loaded a graph into the cache.
`graphMemoryUsage` | Current cache size (total size of all graphs in memory) in kilobytes.
`missCount` | The number of cache misses. A cache miss occurs when a user queries a graph and it has not yet been loaded into memory.
`loadExceptionCount` | The number of times an exception occurred when trying to load a graph into the cache.
