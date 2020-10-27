---
layout: default
title: KNN
nav_order: 34
has_children: true
has_toc: false
---

# KNN

Short for its associated *k-nearest neighbors* algorithm, the KNN plugin lets you search for points in a vector space and find the "nearest neighbors" for those points by Euclidean distance or cosine similarity. Use cases include recommendations (for example, an "other songs you might like" feature in a music application), image recognition, and fraud detection. For background information on the algorithm, see [Wikipedia](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm).


## Get started

To use the KNN query type, you must create an index with `index.knn: true` and add one or more fields of the `knn_vector` data type. Additionally, you can specify the `index.knn.space_type` parameter with `l2` to use Euclidean distance or `cosinesimil` to use cosine similarity for calculations. By default, `index.knn.space_type` is `l2`. Here is an example that creates an index with two `knn_vector` fields and uses cosine similarity:

```json
PUT my-knn-index-1
{
  "settings": {
    "index": {
      "knn": true,
      "knn.space_type": "cosinesimil"
    }
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

In Elasticsearch, codecs handle the storage and retrieval of indices. The KNN plugin uses a custom codec to write vector data to a graph so that the underlying KNN search library can read it.
{: .tip }

After you create the index, add some data to it:

```json
POST _bulk
{ "index": { "_index": "my-knn-index-1", "_id": "1" } }
{ "my_vector1": [1.5, 2.5], "price": 12.2 }
{ "index": { "_index": "my-knn-index-1", "_id": "2" } }
{ "my_vector1": [2.5, 3.5], "price": 7.1 }
{ "index": { "_index": "my-knn-index-1", "_id": "3" } }
{ "my_vector1": [3.5, 4.5], "price": 12.9 }
{ "index": { "_index": "my-knn-index-1", "_id": "4" } }
{ "my_vector1": [5.5, 6.5], "price": 1.2 }
{ "index": { "_index": "my-knn-index-1", "_id": "5" } }
{ "my_vector1": [4.5, 5.5], "price": 3.7 }
{ "index": { "_index": "my-knn-index-1", "_id": "6" } }
{ "my_vector2": [1.5, 5.5, 4.5, 6.4], "price": 10.3 }
{ "index": { "_index": "my-knn-index-1", "_id": "7" } }
{ "my_vector2": [2.5, 3.5, 5.6, 6.7], "price": 5.5 }
{ "index": { "_index": "my-knn-index-1", "_id": "8" } }
{ "my_vector2": [4.5, 5.5, 6.7, 3.7], "price": 4.4 }
{ "index": { "_index": "my-knn-index-1", "_id": "9" } }
{ "my_vector2": [1.5, 5.5, 4.5, 6.4], "price": 8.9 }

```

Then you can search the data using the `knn` query type:

```json
GET my-knn-index-1/_search
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


## Compound queries with KNN

If you use the `knn` query alongside filters or other clauses (e.g. `bool`, `must`, `match`), you might receive fewer than `k` results. In this example, `post_filter` reduces the number of results from 2 to 1:

```json
GET my-knn-index-1/_search
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


## Custom scoring

The [previous example](#mixing-queries) shows a search that returns fewer than `k` results. If you want to avoid this situation, KNN's custom scoring option lets you essentially invert the order of events.

First, add another index:

```json
PUT my-knn-index-2
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 2
      },
      "color": {
        "type": "keyword"
      }
    }
  }
}
```

If you *only* want to use KNN's custom scoring, you can omit `"index.knn": true`. The benefit of this approach is faster indexing speed and lower memory usage, but you lose the ability to perform standard KNN queries on the index.
{: .tip}

Then add some documents:

```json
POST _bulk
{ "index": { "_index": "my-knn-index-2", "_id": "1" } }
{ "my_vector": [1, 1], "color" : "RED" }
{ "index": { "_index": "my-knn-index-2", "_id": "2" } }
{ "my_vector": [2, 2], "color" : "RED" }
{ "index": { "_index": "my-knn-index-2", "_id": "3" } }
{ "my_vector": [3, 3], "color" : "RED" }
{ "index": { "_index": "my-knn-index-2", "_id": "4" } }
{ "my_vector": [10, 10], "color" : "BLUE" }
{ "index": { "_index": "my-knn-index-2", "_id": "5" } }
{ "my_vector": [20, 20], "color" : "BLUE" }
{ "index": { "_index": "my-knn-index-2", "_id": "6" } }
{ "my_vector": [30, 30], "color" : "BLUE" }

```

Finally, use the `script_store` query to pre-filter your documents before identifying nearest neighbors:

```json
GET my-knn-index-2/_search
{
  "size": 2,
  "query": {
    "script_score": {
      "query": {
        "bool": {
          "filter": {
            "term": {
              "color": "BLUE"
            }
          }
        }
      },
      "script": {
        "lang": "knn",
        "source": "knn_score",
        "params": {
          "field": "my_vector",
          "vector": [9.9, 9.9],
          "space_type": "l2"
        }
      }
    }
  }
}
```

All parameters are required.

- `lang` is the script type. This value is usually `painless`, but here you must specify `knn`.
- `source` is the name of the stored script, `knn_store`.
- `field` is the field that contains your vector data.
- `vector` is the point you want to find the nearest neighbors for.
- `space_type` is either `l2` or `cosinesimil`.


## Performance considerations

The standard KNN query and custom scoring option perform differently. Test using a representative set of documents to see if the search results and latencies match your expectations.

Custom scoring works best if the initial filter reduces the number of documents to no more than 20,000. Increasing shard count can improve latencies, but be sure to keep shard size within [the recommended guidelines](../elasticsearch/#primary-and-replica-shards).
