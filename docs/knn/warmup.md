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
## Overview
The HNSW graphs used to perform k-Approximate Nearest Neighbor Search are stored as `.hnsw` files with other Lucene segment files. In order to perform search on these graphs, they need to be loaded into native memory. If the graphs have not yet been loaded into native memory, upon search, they will first be loaded and then searched. This can cause high latency during initial queries. To avoid this, users will often run random queries during a warmup period. After this warmup period, the graphs will be loaded into native memory and their production workloads can begin. This process is indirect and requires extra effort.

As an alternative, a user can run the k-NN plugin's warmup API on whatever indices they are interested in searching over. This API will load all the graphs for all of the shards (primaries and replicas) of all the indices specified in the request into native memory. After this process completes, a user will be able to start searching against their indices with no initial latency penalties. The warmup API is idempotent, so if a segment's graphs are already loaded into memory, this operation will have no impact on them. It only loads graphs that are not currently in memory.

## Usage
This command will perform warmup on index1, index2, and index3:
```
GET /_opendistro/_knn/warmup/index1,index2,index3?pretty
{
  "_shards" : {
    "total" : 6,
    "successful" : 6,
    "failed" : 0
  }
}
```
`total` indicates how many shards the warmup operation was performed on. `successful` indicates how many shards succeeded and `failed` indicates how many shards have failed.

The call will not return until the warmup operation is complete or the request times out. If the request times out, the operation will still be going on in the cluster. To monitor this, use the Elasticsearch `_tasks` API.

Following the completion of the operation, use the k-NN `_stats` API to see what has been loaded into the graph.

## Best practices
In order for the warmup API to function properly, you will need to follow a few best practices. First, you should not be running any merge operations on the indices you want to warm up. The reason for this is that, during merge, the k-NN plugin creates new segments, and old segments are (sometimes) deleted. You may see the situation where the warmup API loads graphs A and B into native memory, but segment C is created from segments A and B being merged. The graphs for A and B will no longer be in memory and neither will the graph for C. Then, the initial penalty of loading graph C on the first queries will still be present.

Second, you should first confirm that all of the graphs of interest are able to fit into native memory before running warmup. If they cannot all fit into memory, then the cache will thrash.
