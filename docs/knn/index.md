---
layout: default
title: KNN
nav_order: 34
has_children: true
has_toc: false
---

# KNN

KNN is currently only available as part of the Docker image.
{: .warning }

Short for its associated *k-nearest neighbors* algorithm, the KNN plugin lets you search for points in a vector space and find the "nearest neighbors" for those points by Euclidean distance. Use cases include recommendations (for example, an "other songs you might like" feature in a music application), image recognition, and fraud detection. For background information on the algorithm, see [Wikipedia](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm).


## Get started

To use the KNN plugin, you must create an index with the `index.knn` setting and add one or more fields of the `knn_vector` data type:

```json
PUT my-index
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 2
      },
      "my_vector2": {
        "type": "knn_vector",
        "dimension": 4
      }
    }
  }
}
```

The `knn_vector` data type supports a single list of up to 10,000 floats, with the number of floats defined by the required dimension parameter.

In Elasticsearch, codecs handle the storage and retrieval of indices. The KNN plugin uses a custom codec to writes vector data to a graph so that the underlying KNN search library can read it.
{: .tip }

After you create the index, add some data to it:

```json
POST _bulk
{ "index": { "_index": "my-index", "_id": "1" } }
{ "my_vector1": [1.5, 2.5], "price": 12.2 }
{ "index": { "_index": "my-index", "_id": "2" } }
{ "my_vector1": [2.5, 3.5], "price": 7.1 }
{ "index": { "_index": "my-index", "_id": "3" } }
{ "my_vector1": [3.5, 4.5], "price": 12.9 }
{ "index": { "_index": "my-index", "_id": "4" } }
{ "my_vector1": [5.5, 6.5], "price": 1.2 }
{ "index": { "_index": "my-index", "_id": "5" } }
{ "my_vector1": [4.5, 5.5], "price": 3.7 }
{ "index": { "_index": "my-index", "_id": "6" } }
{ "my_vector2": [1.5, 5.5, 4.5, 6.4], "price": 10.3 }
{ "index": { "_index": "my-index", "_id": "7" } }
{ "my_vector2": [2.5, 3.5, 5.6, 6.7], "price": 5.5 }
{ "index": { "_index": "my-index", "_id": "8" } }
{ "my_vector2": [4.5, 5.5, 6.7, 3.7], "price": 4.4 }
{ "index": { "_index": "my-index", "_id": "9" } }
{ "my_vector2": [1.5, 5.5, 4.5, 6.4], "price": 8.9 }

```

Then you can search the data using the `knn` query type:

```json
GET my-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector2": {
        "vector": [2, 3, 5, 6],
        "k": 2
      }
    }
  }
}
```

In this case, `k` is the number of neighbors you want the query to return, but you must also include the `size` option. Otherwise, you get `k` results for each shard (and each segment) rather than `k` results for the entire query. The plugin supports a maximum `k` value of 10,000.

If you mix the `knn` query with other clauses, you might receive fewer than `k` results. In this example, the `post_filter` clause reduces the number of results from 2 to 1:

```json
GET my-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector2": {
        "vector": [2, 3, 5, 6],
        "k": 2
      }
    }
  },
  "post_filter": {
    "range": {
      "price": {
        "gte": 5,
        "lte": 10
      }
    }
  }
}
```
