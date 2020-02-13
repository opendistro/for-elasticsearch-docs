---
layout: default
title: Index Data
parent: Elasticsearch
nav_order: 3
---

# Index data

You index data using the Elasticsearch REST API. Two APIs exist: the index API and the `_bulk` API.

For situations in which new data arrives incrementally (for example, customer orders from a small business), you might use the index API to add documents individually as they arrive. For situations in which the flow of data is less frequent (for example, weekly updates to a marketing website), you might prefer to generate a file and send it to the `_bulk` API. For large numbers of documents, lumping requests together and using the `_bulk` API offers superior performance. If your documents are enormous, however, you might need to index them individually.


## Introduction to indexing

Before you can search data, you must *index* it. Indexing is the method by which search engines organize data for fast retrieval. The resulting structure is called, fittingly, an index.

In Elasticsearch, the basic unit of data is a JSON *document*. Within an index, Elasticsearch identifies each document using a unique *ID*.

A request to the index API looks like the following:

```json
PUT <index>/_doc/<id>
{ "A JSON": "document" }
```

A request to the `_bulk` API looks a little different, because you specify the index and ID in the bulk data:

```json
POST _bulk
{ "index": { "_index": "<index>", "_id": "<id>" } }
{ "A JSON": "document" }

```

Bulk data must conform to a specific format, which requires a newline character (`\n`) at the end of every line, including the last line. This is the basic format:

```
Action and metadata\n
Optional document\n
Action and metadata\n
Optional document\n

```

The document is optional, because `delete` actions do not require a document. The other actions (`index`, `create`, and `update`) all require a document. If you specifically want the action to fail if the document already exists, use the `create` action instead of the `index` action.
{: .note }

Elasticsearch features automatic index creation when you add a document to an index that doesn't already exist. It also features automatic ID generation if you don't specify an ID in the request. This simple example automatically creates the movies index, indexes the document, and assigns it a unique ID:

```json
POST movies/_doc
{ "title": "Spirited Away" }
```

Automatic ID generation has a clear downside: because the indexing request didn't specify a document ID, you can't easily update the document at a later time. To specify an ID of 1, use the following request, and note the use of PUT instead of POST:

```json
PUT movies/_doc/1
{ "title": "Spirited Away" }
```

Indices default to one primary shard and one replica. If you want to specify non-default settings, create the index before adding documents:

```json
PUT more-movies
{ "settings": { "number_of_shards": 6, "number_of_replicas": 2 } }
```

## Naming restrictions for indices

Elasticsearch indices have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with `_` (underscore) or `-` (hyphen).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## Read data

After you index a document, you can retrieve it by sending a GET request to the same endpoint that you used for indexing:

```json
GET movies/_doc/1

{
  "_index": "movies",
  "_type": "_doc",
  "_id": "1",
  "_version": 1,
  "found": true,
  "_source": {
    "title": "Spirited Away"
  }
}
```

You can see the document in the `_source` object. If the document is not found, the `found` key will be set to `false` and the `_source` object will not be part of the result.

To retrieve multiple documents with a single command, use the `_mget` operation.
The format for retrieving multiple documents is similar to the `_bulk` operation, where you must specify the index and ID in the request body:

```json
GET _mget
{
  "docs": [
    {
      "_index": "<index>",
      "_id": "<id>"
    },
    {
      "_index": "<index>",
      "_id": "<id>"
    }
  ]
}
```

To only return specific fields in a document:

```json
GET _mget
{
  "docs": [
    {
      "_index": "<index>",
      "_id": "<id>",
      "_source": "field1"
    },
    {
      "_index": "<index>",
      "_id": "<id>",
      "_source": "field2"
    }
  ]
}
```

To check if a document exists:

```json
HEAD movies/_doc/<doc-id>
```

If the document exists, you get back a `200 OK` response, and if it doesn't, you get back a `404 - Not Found` error.

## Update data

To update existing fields or to add new fields, send a POST request to the `_update` operation with your changes in a `doc` object:

```json
POST movies/_doc/1/_update
{
  "doc": {
    "title": "Castle in the Sky",
    "genre": ["Animation", "Fantasy"]
  }
}
```

The `title` field is updated and the `genre` field is added:

```json
GET movies/_doc/1

{
  "_index": "movies",
  "_type": "_doc",
  "_id": "1",
  "_version": 2,
  "found": true,
  "_source": {
    "title": "Castle in the Sky",
    "genre": [
      "Animation",
      "Fantasy"
    ]
  }
}
```

Note that the `_version` field of the document is incremented to 2. Use the `_version` field to keep track of how many times a document is updated.

POST requests are made for partial updates to a document. To altogether replace a document, use a PUT request:

```json
PUT movies/_doc/1
{
  "title": "Spirited Away"
}
```

The document with ID of 1 will contain only the `title` field, because the entire document will be replaced with the document indexed in this PUT request.

You can conditionally update a document based on whether or not it already exists using the `upsert` object.
Here, if the document exists, it's `title` field is changed to `Castle in the Sky`; if it doesn't already exist, the document within the `upsert` object is indexed:

```json
POST movies/_doc/2/_update
{
  "doc": {
    "title": "Castle in the Sky"
  },
  "upsert": {
    "title": "Only Yesterday",
    "genre": ["Animation", "Fantasy"],
    "date": 1993
  }
}
```

## Delete data

To delete a document from an index, use a DELETE request:

```json
DELETE movies/_doc/1
```

The delete operation increments the `_version` field. If you add the document back, the `_version` field is still incremented. This is because when you delete a document it isn't completely gone. The metadata of the document is still retained in the index.
