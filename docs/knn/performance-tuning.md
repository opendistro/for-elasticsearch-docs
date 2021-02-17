---
layout: default
title: Performance Tuning
parent: k-NN
nav_order: 7
---

# Performance Tuning

This section provides recommendations for performance tuning to improve indexing/search performance for approximate k-NN. From a high level k-NN works on following principles:
* Graphs are created per knn_vector field / (Lucene) segment pair
* Queries execute on segments sequentially inside the shard (same as any other Elasticsearch query)
* Each graph in the segment returns <=k neighbors.
* Coordinator node picks up final size number of neighbors from the neighbors returned by each shard

Additionally, this section provides recommendations for comparing approximate k-NN to exact k-NN with score script.

## Indexing Performance Tuning

The following steps can be taken to help improve indexing performance, especially when you plan to index large number of vectors at once:
1. Disable refresh interval (Default = 1 sec) or set a long duration for refresh interval to avoid creating multiple small segments
```
PUT /<index_name>/_settings
{
    "index" : {
        "refresh_interval" : "-1"
    }
}
```
*Note* -- Be sure to reenable refresh_interval after indexing finishes.

2. Disable Replicas (No Elasticsearch replica shard).  

Having replicas set to 0, will avoid duplicate construction of graphs in both primary and replicas. When we enable replicas after the indexing, the serialized graphs are directly copied. Having no replicas means that losing a node(s) may incur data loss, so it is important that the data lives elsewhere so that this initial load can be retried in case of an issue.

3. Increase number of indexing threads

If the hardware we choose has multiple cores, we could allow multiple threads in graph construction and there by speed up the indexing process. You could determine the number of threads to be alloted by using the [knn.algo_param.index_thread_qty](../settings/#Cluster-settings) setting.

Please keep an eye on CPU utilization and choose right number of threads. Since graph construction is costly, having multiple threads can put additional load on CPU. 

## Search Performance Tuning

1. Have fewer segments

To improve Search performance it is necessary to keep the number of segments under control. Lucene's IndexSearcher will search over all of the segments in a shard to find the 'size' best results. But, because the complexity of search for the HNSW algorithm is logarithmic with respect to the number of vectors, searching over 5 graphs with a 100 vectors each and then taking the top size results from 5*k results will take longer than searching over 1 graph with 500 vectors and then taking the top size results from k results. Ideally having 1 segment per shard will give the optimal performance with respect to search latency. We could configure index to have multiple shards to aviod having giant shards and achieve more parallelism.

We can control the number of segments either during indexing by asking Elasticsearch to slow down the segment creation by disabling the refresh interval or choosing larger refresh interval.

2. Warm up the index

The graphs are constructed during indexing, but they are loaded into memory during the first search. The way search works in Lucene is that each segment is searched sequentially (so, for k-NN, each segment returns up to k nearest neighbors of the query point) and the top size number of results based on the score would be returned from all of the results returned by segements at a shard level(higher score --> better result).

Once a graph is loaded(graphs are loaded outside Elasticsearch JVM), we cache the graphs in memory. So the initial queries would be expensive in the order of few seconds and subsequent queries should be faster in the order of milliseconds(assuming knn circuit breaker is not hit).

In order to avoid this latency penalty during your first queries, a user should use the warmup API on the indices they want to search. The API looks like this:

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

The API loads all of the graphs for all of the shards (primaries and replicas) for the specified indices into the cache. Thus, there will be no penalty to load graphs during initial searches. *Note — * this API only loads the segments of the indices it sees into the cache. If a merge or refresh operation finishes after this API is ran or if new documents are added, this API will need to be re-ran to load those graphs into memory.

3. Avoid reading stored fields

If the use case is to just read the nearest neighbors Ids and scores, then we could disable reading stored fields which could save some time retrieving the vectors from stored fields.

## Improving Recall

Recall could depend on multiple factors like number of vectors, number of dimensions, segments etc. Searching over large number of small segments and aggregating the results leads better recall than searching over small number of large segments and aggregating results. The larger the graph the more chances of losing recall if sticking to smaller algorithm parameters. Choosing larger values for algorithm params should help solve this issue but at the cost of search latency and indexing time. That being said, it is important to understand your system's requirements for latency and accuracy, and then to choose the number of segments you want your index to have based on experimentation.

Recall can be configured by adjusting the algorithm parameters of hnsw algorithm exposed through index settings. Algorithm params that control the recall are m, ef_construction, ef_search. For more details on influence of algorithm parameters on the indexing, search recall, please refer this doc (https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md). Increasing these values could help recall(better search results) but at the cost of higher memory utilization and increased indexing time. Our default values work on a broader set of use cases from our experiments but we encourage users to run their own experiments on their data sets and choose the appropriate values. You could refer to these settings in this section (https://github.com/opendistro-for-elasticsearch/k-NN#index-level-settings). We will add details on our experiments shortly here.

## Estimating Memory Usage
Typically, in an Elasticsearch cluster, a certain portion of RAM is set aside for the JVM heap. The k-NN plugin allocates graphs in a portion of the remaining RAM. This portion's size is determined by the circuit_breaker_limit cluster setting. By default, the circuit breaker limit is set at 50%.

The memory require for graphs can be estimated to be `1.1 * (4 * dimension + 8 * M)` bytes/vector.

As an example, assume that we have 1 Million vectors with dimension of 256 and M of 16, the memory required could be estimated as:
```
1.1 * (4 *256 + 8 * 16) * 1,000,000 ~= 1.26 GB
```

*Note* -- Remember, when having a replica will double the total number of vectors.   

## Approximate nearest neighbor vs. score script 

The standard KNN query and custom scoring option perform differently. Test using a representative set of documents to see if the search results and latencies match your expectations.

Custom scoring works best if the initial filter reduces the number of documents to no more than 20,000. Increasing shard count can improve latencies, but be sure to keep shard size within [the recommended guidelines](../../elasticsearch/#primary-and-replica-shards).
