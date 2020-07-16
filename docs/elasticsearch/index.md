---
layout: default
title: Elasticsearch
nav_order: 10
has_children: true
has_toc: false
---

# Introduction to Elasticsearch-test3

Elasticsearch is a distributed search and analytics engine based on [Apache Lucene](https://lucene.apache.org/). After adding your data to Elasticsearch, you can perform full-text searches on it with all of the features you might expect: search by field, search multiple indices, boost fields, rank results by score, sort results by field, and aggregate results.

Unsurprisingly, people often use Elasticsearch as the backend for a search application---think [Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:FAQ/Technical#What_software_is_used_to_run_Wikipedia?) or an online store. It offers excellent performance and can scale up and down as the needs of the application grow or shrink.

An equally popular, but less obvious use case is log analytics, in which you take the logs from an application, feed them into Elasticsearch, and use the rich search and visualization functionality to identify issues. For example, a malfunctioning web server might throw a 500 error 0.5% of the time, which can be hard to notice unless you have a real-time graph of all HTTP status codes that the server has thrown in the past four hours. You can use [Kibana](../kibana/) to build these sorts of visualizations from data in Elasticsearch.


## Clusters and nodes

Its distributed design means that you interact with Elasticsearch *clusters*. Each cluster is a collection of one or more *nodes*, servers that store your data and process search requests.

You can run Elasticsearch locally on a laptop---its system requirements are minimal---but you can also scale a single cluster to hundreds of powerful machines in a data center.

In a single node cluster, such as a laptop, one machine has to do everything: manage the state of the cluster, index and search data, and perform any preprocessing of data prior to indexing it. As a cluster grows, however, you can subdivide responsibilities. Nodes with fast disks and plenty of RAM might be great at indexing and searching data, whereas a node with plenty of CPU power and a tiny disk could manage cluster state. For more information on setting node types, see [Cluster Formation](cluster/).


## Indices and documents

Elasticsearch organizes data into *indices*. Each index is a collection of JSON *documents*. If you have a set of raw encyclopedia articles or log lines that you want to add to Elasticsearch, you must first convert them to [JSON](https://www.json.org/). A simple JSON document for a movie might look like this:

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

Older versions of Elasticsearch used arbitrary document *types*, but indices created in current versions of Elasticsearch should use a single type named `_doc`. Store different document types in different indices.
{: .note }


## Primary and replica shards

Elasticsearch splits indices into *shards* for even distribution across nodes in a cluster. For example, a 400 GB index might be too large for any single node in your cluster to handle, but split into ten shards, each one 40 GB, Elasticsearch can distribute the shards across ten nodes and work with each shard individually.

By default, Elasticsearch creates a *replica* shard for each *primary* shard. If you split your index into ten shards, for example, Elasticsearch also creates ten replica shards. These replica shards act as backups in the event of a node failure---Elasticsearch distributes replica shards to different nodes than their corresponding primary shards---but they also improve the speed and rate at which the cluster can process search requests. You might specify more than one replica per index for a search-heavy workload.

Despite being a piece of an Elasticsearch index, each shard is actually a full Lucene index---confusing, we know. This detail is important, though, because each instance of Lucene is a running process that consumes CPU and memory. More shards is not necessarily better. Splitting a 400 GB index into 1,000 shards, for example, would place needless strain on your cluster. A good rule of thumb is to keep shard size between 10--50 GB.


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
