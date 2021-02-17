---
layout: default
title: k-NN
nav_order: 50
has_children: true
has_toc: false
---

# k-NN

Short for *k-nearest neighbors*, the k-NN plugin enables users to search for the k-nearest neighbors to a query point across an index of vectors. To determine the neighbors, a user can specify the space (the distance function) they want to use to measure the distance between points.

Use cases include recommendations (for example, an "other songs you might like" feature in a music application), image recognition, and fraud detection. For background information on the k-NN search, see [Wikipedia](https://en.wikipedia.org/wiki/Nearest_neighbor_search).

This plugin supports three different methods for obtaining the k-nearest neighbors from an index of vectors:
 
1. **Approximate k-NN**

    The first method takes an approximate nearest neighbor approach; it uses the HNSW algorithm to return the approximate k-nearest neighbors to a query vector. This algorithm sacrifices indexing speed and search accuracy in return for lower latency and more scalable search. To learn more about the algorithm, please refer to [nmslib's documentation](https://github.com/nmslib/nmslib/) or [the paper introducing the algorithm](https://arxiv.org/abs/1603.09320). 

    Approximate k-NN is the best choice for searches over large indices (i.e. hundreds of thousands of vectors or more) that require low latency. Approximate k-NN should not be used if a filter will be applied on the index before the k-NN search, greatly reducing the number of vectors to be searched. In this case, either the script scoring method or the painless extensions should be used.

    For more details refer to the [Approximate k-NN section](approximate-knn).

2. **Script Score k-NN**

    The second method extends Elasticsearch's script scoring functionality to execute a brute force, exact k-NN search over "knn_vector" fields or fields that can represent binary objects. With this approach, users are able to run k-NN search on a subset of vectors in their index (sometimes referred to as a pre-filter search).

    This approach should be used for searches over smaller bodies of documents or when a pre-filter is needed. Using this approach on large indices may lead to high latencies.

    For more details refer to the [k-NN Script Score section](knn-score-script).

3. **Painless extensions**

    The third method adds the distance functions as painless extensions that can be used in more complex combinations. Similar to the k-NN Script Score, this method can be used to perform a brute force, exact k-NN search across an index and supports pre-filtering.

    This approach has slightly slower query performance compared to Script Score k-NN. This approach should be preferred over Script Score k-NN if the use case requires more customization over the final score.

    For more details refer to the [painless functions section](painless-functions).


Overall, for larger data sets, users should generally choose the approximate nearest neighbor method, because it scales significantly better. For smaller data sets, where a user may want to apply a filter, they should choose the custom scoring approach. If users have a more complex use case where they need to use a distance function as part of their scoring method, they should use the painless scripting approach. 
