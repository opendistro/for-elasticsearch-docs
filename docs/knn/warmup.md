---
layout: default
title: Warmup API
parent: KNN
nav_order: 5
has_children: false
has_toc: false
has_math: false
---

# Warmup API

The HNSW graphs used to perform k-Approximate Nearest Neighbor Search are stored as `.hnsw` files with other Lucene segment files. In order to perform search on these graphs, they need to be loaded into native memory. If the graphs have not yet been loaded into native memory, upon search, they will first be loaded and then searched. This loading time can cause high latency during initial queries. To avoid this situation, users will often run random queries during a warmup period. After this warmup period, the graphs will be loaded into native memory and their production workloads can begin. This loading process is indirect and requires extra effort.

As an alternative, you can run the k-NN plugin's warmup API on whatever indices you are interested in searching over. This API loads all the graphs for all of the shards (primaries and replicas) of all the indices specified in the request into native memory. After this process completes, you can start searching against their indices with no initial latency penalties. The warmup API is idempotent, so if a segment's graphs are already loaded into memory, this operation has no impact on those graphs. It only loads graphs not currently in memory.

## Usage
This request performs a warmup on three indices:

```json
GET /_opendistro/_knn/warmup/index1,index2,index3?pretty
{
  "_shards" : {
    "total" : 6,
    "successful" : 6,
    "failed" : 0
  }
}
```

`total` indicates how many shards the k-NN plugin attempted to warm up. The response also includes the number of shards the plugin succeeded and failed to warm up.

The call does not return until the warmup operation is complete or the request times out. If the request times out, the operation still continues in the cluster. To monitor this, use the Elasticsearch `_tasks` API.

Following the completion of the operation, use the k-NN `_stats` API to see what the k-NN plugin loaded into the graph.

## Best practices
In order for the warmup API to function properly, you need to follow a few best practices. First, do not run  merge operations on indices that you want to warm up. During merge, the k-NN plugin creates new segments, and old segments are (sometimes) deleted. For example, you could encounter a situation in which the warmup API loads graphs A and B into native memory, but segment C is created from segments A and B being merged. The graphs for A and B will no longer be in memory and neither will the graph for C. Then, the initial penalty of loading graph C on the first queries is still be present.

Second, confirm that all graphs you want to warm up fit into native memory. See the [knn.memory.circuit_breaker.limit statistic](../settings/#cluster-settings) for more information about the native memory limit. High graph memory usage causes cache thrashing.

Lastly, do not index any documents you want to load into the cache. Writing new information to segments prevents the warmup API from loading the graphs until they are searchable, so you would have to run the warmup API again after indexing finishes.
