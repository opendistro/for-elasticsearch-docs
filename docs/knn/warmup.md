---
layout: default
title: Warmup API
parent: KNN
nav_order: 5
has_children: false
has_toc: false
has_math: false
---

# Warmup API operation for the k-NN plugin

The Hierarchical Navigable Small World (HNSW) graphs that are used to perform an approximate k-Nearest Neighbor (k-NN) search are stored as `.hnsw` files with other Apache Lucene segment files. In order for you to perform a search on these graphs using the k-NN plugin, these files need to be loaded into native memory.

If the plugin has not loaded the graphs into native memory, it loads them when it receives a search request. This loading time can cause high latency during initial queries. To avoid this situation, users often run random queries during a warmup period. After this warmup period, the graphs are loaded into native memory and their production workloads can begin. This loading process is indirect and requires extra effort.

As an alternative, you can avoid this latency issue by running the k-NN plugin warmup API operation on whatever indices you're interested in searching. This operation loads all the graphs for all of the shards (primaries and replicas) of all the indices specified in the request into native memory.

After the process finishes, you can start searching against the indices with no initial latency penalties. The warmup API operation is idempotent, so if a segment's graphs are already loaded into memory, this operation has no impact on those graphs. It only loads graphs that aren't currently in memory.

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

The call does not return until the warmup operation is complete or the request times out. If the request times out, the operation still continues on the cluster. To monitor the warmup operation, use the Elasticsearch `_tasks` API:

```json
GET /_tasks
```

After the operation has finished, use the [k-NN `_stats` API operation](../settings#statistics) to see what the k-NN plugin loaded into the graph.

## Best practices
For the warmup API to function properly, follow these best practices.

First, don't run merge operations on indices that you want to warm up. During merge, the k-NN plugin creates new segments, and old segments are (sometimes) deleted. For example, you could encounter a situation in which the warmup API operation loads graphs A and B into native memory, but segment C is created from segments A and B being merged. The graphs for A and B would no longer be in memory, and graph C would also not be in memory. In this case, the initial penalty for loading graph C is still present.

Second, confirm that all graphs you want to warm up can fit into native memory. For more information about the native memory limit, see the [knn.memory.circuit_breaker.limit statistic](../settings/#cluster-settings). High graph memory usage causes cache thrashing, which can lead to operations constantly failing and attempting to run again.

Finally, don't index any documents that you want to load into the cache. Writing new information to segments prevents the warmup API operation from loading the graphs until they're searchable. This means that you would have to run the warmup operation again after indexing finishes.
