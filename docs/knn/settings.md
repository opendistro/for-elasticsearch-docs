---
layout: default
title: Settings
parent: KNN
nav_order: 10
---

# Settings

The KNN plugin adds several new index settings, cluster settings, and statistics.


## Index settings

The default values should work well for most use cases, but you can change them when you create the index.

Setting | Default | Description
:--- | :--- | :---
`index.knn.algo_param.ef_search` | 512 | The size of the dynamic list used during KNN searches. Higher values lead to more accurate, but slower searches.
`index.knn.algo_param.ef_construction` | 512 | The size of the dynamic list used during KNN graph creation. Higher values lead to a more accurate graph, but slower indexing speed.
`index.knn.algo_param.m` | 16 | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2-100.


## Cluster settings

Setting | Default | Description
:--- | :--- | :---
`knn.algo_param.index_thread_qty` | 1 | The number of threads used for graph creation.
`knn.cache.item.expiry.enabled` | false |Whether to remove graphs that have not been accessed for a certain duration from memory.
`knn.cache.item.expiry.minutes` | 3h | If enabled, the idle time before removing a graph from memory.
`knn.circuit_breaker.unset.percentage` | 75.0 | The native memory usage threshold for the circuit breaker.
`knn.circuit_breaker.triggered` | false | True when memory usage exceeds the `knn.circuit_breaker.unset.percentage` value.
`knn.memory.circuit_breaker.limit` | 60% | The native memory limit for graphs. If this limit triggers, KNN removes the least recently used graphs.
`knn.memory.circuit_breaker.enabled` | true | Whether to enable the KNN memory circuit breaker.
`knn.plugin.enabled`| true | Enables or disables the KNN plugin.


## Statistics

KNN includes statistics that can give you a sense for how the plugin is performing:

```
GET _opendistro/_knn/stats
```

Statistic |  Description
:--- | :---
totalLoadTime | asdf
evictionCount | asdf
hitCount | asdf
cacheCapacityReached | asdf
loadSuccessCount | asdf
graphMemoryUsage | asdf
missCount | asdf
loadExceptionCount | asdf
