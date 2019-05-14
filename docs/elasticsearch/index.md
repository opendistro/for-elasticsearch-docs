---
layout: default
title: Elasticsearch
nav_order: 10
has_children: true
has_toc: false
---

# Introduction to Elasticsearch

Elasticsearch is a distributed search and analytics engine based on [Apache Lucene](https://lucene.apache.org/). Its distributed design means that you interact with Elasticsearch *clusters*. Each cluster is a collection of one or more *nodes*, servers that store your data and process search requests.


## Indices and documents

Elasticsearch organizes data into *indices*. Each index is a collection of JSON *documents*. A simple JSON document might look like this:

```json
{
  "title": "The Wind Rises",
  "release_date": "2013-07-20"
}
```

When you add the document to an index, Elasticsearch adds some metadata, such as the unique document *ID*:

```json
{
  "_index": "<index-name>",
  "_type": "_doc",
  "_id": "<document-id>",
  "_version": 1,
  "_source": {
    "title": "The Wind Rises",
    "release_date": "2013-07-20"
  }
}
```

Indices also contain mappings and settings:

- A *mapping* is the collection of *fields* that documents in the index have. In this case, those fields are `title` and `release_date`.
- Settings include data like the index name, creation date, and number of shards.

Older versions of Elasticsearch used arbitrary document *types*, but indices created in current versions of Elasticsearch should use a single type named `_doc`. If you have multiple document types, store them in different indices.
{: .note }


## Primary and replica shards

Elasticsearch splits indices into *shards* so that they can be evenly distributed across nodes in a cluster. For example, a 400 GB index might be too large for any single node in your cluster to handle, but split into ten shards, each one 40 GB, Elasticsearch can distribute the shards across ten nodes and work with each shard individually.

By default, Elasticsearch creates a *replica* shard for each *primary* shard. If you split your index into ten shards, for example, Elasticsearch also creates ten replica shards. These replica shards act as backups in the event of a node failure---Elasticsearch distributes replica shards to different nodes than their corresponding primary shards---but they also improve the speed and rate at which the cluster can process search requests. You might specify more than one replica per index for a search-heavy workload.

Despite being a piece of an Elasticsearch index, each shard is actually a full Lucene index---confusing, we know. This detail is important, though, because each instance of Lucene is a running process that consumes CPU and memory. Splitting a 400 GB index into 1,000 shards, for example, would place needless strain on your cluster. A good rule of thumb is to keep shard size between 10--50 GB.


## REST API

You interact with Elasticsearch clusters using the REST API, which offers a lot of flexibility. You can use clients like [curl](https://curl.haxx.se/) or any programming language that can send HTTP requests. To add a JSON document to an Elasticsearch index (i.e. index a document), you send an HTTP request:

```json
PUT https://<host>:<port>/<index-name>/_doc/<document-id>
{
  "title": "The Wind Rises",
  "release_date": "2013-07-20"
}
```

To run a search for the document:

```
GET https://<host>:<port>/<index-name>/_search?q=wind
```

To delete the document:

```
DELETE https://<host>:<port>/<index-name>/_doc/<document-id>
```

You can change most Elasticsearch settings using the REST API, modify indices, check the health of the cluster, get statistics---almost everything.
