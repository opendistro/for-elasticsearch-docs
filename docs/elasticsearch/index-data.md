---
layout: default
title: Index Data
parent: Elasticsearch
nav_order: 2
---

# Index Data

You index data using the Elasticsearch REST API. Two APIs exist: the index API and the `_bulk` API.

For situations in which new data arrives incrementally (for example, customer orders from a small business), you might use the index API to add documents individually as they arrive. For situations in which the flow of data is less frequent (for example, weekly updates to a marketing website), you might prefer to generate a file and send it to the `_bulk` API. For large numbers of documents, lumping requests together and using the `_bulk` API offers superior performance. If your documents are enormous, however, you might need to index them individually.


## Introduction to indexing

A request to the index API looks like the following:

```json
PUT elasticsearch_domain/<index>/_doc/<id>
{ "A JSON": "document" }
```

A request to the `_bulk` API looks a little different, because you specify the index and ID in the bulk data:

```json
POST elasticsearch_domain/_bulk
{ "index": { "_index" : "<index>", "_type" : "_doc", "_id" : "<id>" } }
{ "A JSON": "document" }

```

Bulk data must conform to a specific format, which requires a newline character (\n) at the end of every line, including the last line. This is the basic format:

```
action_and_metadata>\n
optional_document\n
action_and_metadata\n
optional_document\n
...
```

The document is optional, because `delete` actions do not require a document. The other actions (`index`, `create`, and `update`) all require a document.
{: .note }

Elasticsearch features automatic index creation when you add a document to an index that doesn't already exist. It also features automatic ID generation if you don't specify an ID in the request. This simple example automatically creates the movies index, indexes the document, and assigns it a unique ID:

```json
POST elasticsearch_domain/movies/_doc
{"title": "Spirited Away"}
```

Automatic ID generation has a clear downside: because the indexing request didn't specify a document ID, you can't easily update the document at a later time. To specify an ID of 1, use the following request, and note the use of PUT instead of POST:

```json
PUT elasticsearch_domain/movies/_doc/1
{"title": "Spirited Away"}
```

Indices default to five primary shards and one replica. If you want to specify non-default settings, create the index before adding documents:

```json
PUT elasticsearch_domain/more-movies
{"settings": {"number_of_shards": 6, "number_of_replicas": 2}}
```


## Naming restrictions for indices

Elasticsearch indices have the following naming restrictions:

- All letters must be lowercase.
- Index names cannot begin with `_` or `-`.
- Index names cannot contain spaces, commas, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`.
