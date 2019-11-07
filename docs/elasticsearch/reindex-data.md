---
layout: default
title: Reindex Data
parent: Elasticsearch
nav_order: 3
---

# Reindex data

After creating an index, if you need to make an extensive change such as adding a new field to every document or performing some computation on all integer fields, rather than deleting your index, making the change offline, and then indexing your data all over again, you can use the `_reindex` operation.

With the `_reindex` operation, you can copy all or a subset of documents that you select through a query to another index. Reindex is a `POST` operation and you need to specify a source and destination index.

Reindexing can be an expensive operation depending on the size of your source index. We recommend you disable all replicas on your destination index and re-enable them once the reindex process is complete.
{: .note }

---

#### Table of contents
1. TOC
{:toc}


---

## Reindex all documents

You can copy all documents from one index to another.

This command copies all the documents from a source index to a destination index:

```json
POST _reindex
{
   "source":{
      "index":"source"
   },
   "dest":{
      "index":"destination"
   }
}
```

The settings from the source index are not copied over, so if the destination index is not already created, the `_reindex` operation creates a new destination index with default configurations.

To use the `_reindex` operation to change your index settings, create a destination index with your desired settings and then run the above command.

## Reindex from a remote cluster

You can copy documents from an index in a remote cluster. Use the `remote` option to specify the remote hostname and the required login credentials.

This command reaches out to a remote cluster, logs in with the username and password, and copies all the documents from the source index in that remote cluster to the destination index in your local cluster:

```json
POST _reindex
{
   "source":{
      "remote":{
         "host":"https://<REST_endpoint_of_remote_cluster>:9200",
         "username":"YOUR_USERNAME",
         "password":"YOUR_PASSWORD"
      }
   },
   "dest":{
      "index":"destination"
   }
}
```

## Reindex a subset of documents

You can copy only a specific set of documents that match a search query.

This command copies only a subset of documents matched by a query operation to the destination index:

```json
POST _reindex
{
   "source":{
      "index":"source",
      "query":"Add your query operation"
   },
   "dest":{
      "index":"destination"
   }
}
```

For a list of all query operations, see [Full-text queries](../full-text/).

## Combine one or more indices

You can combine documents from one or more indices by adding the source indices as a list.

This command copies all documents from two source indices to one destination index:

```json
POST _reindex
{
   "source":{
      "index":[
         "source_1",
         "source_2"
      ]
   },
   "dest":{
      "index":"destination"
   }
}
```

## Reindex missing documents

You can copy only documents missing from a destination index by setting the `op_type` option to `create`. To ignore all version conflicts of documents, set the `conflicts` option to `proceed`.

```json
POST _reindex
{
   "conflicts":"proceed",
   "source":{
      "index":"source"
   },
   "dest":{
      "index":"destination",
      "op_type":"create"
   }
}
```

## Reindex sorted documents

You can copy certain documents after sorting specific fields in the document.

This command copies the last 10 documents based on the `timestamp` field:

```json
POST _reindex
{
   "size":10,
   "source":{
      "index":"source",
      "sort":{
         "timestamp":"desc"
      }
   },
   "dest":{
      "index":"destination"
   }
}
```

## Transform documents during reindexing

You can use an ingesting pipeline during the `reindex` operation to transform your data in flight as part of an ingest node pipeline process. The documents from the source index go through a pipeline that transforms them in some way before they get copied to the destination index.

```json
POST _reindex
{
   "source":{
      "index":"source"
   },
   "dest":{
      "index":"destination",
      "pipeline":"YOUR_PIPELINE"
   }
}
```

Another way to transform your data during the reindexing process is to use the `script` option.
We recommend using the painless scripting language while scripting in the Elasticsearch API.

This command runs the source index through a painless script before copying it to the destination index:

```json
POST _reindex
{
   "source":{
      "index":"source"
   },
   "dest":{
      "index":"destination"
   },
   "script":{
      "lang":"painless",
      "source":"YOUR_PAINLESS_SCRIPTING_SYNTAX"
   }
}
```

## Update documents in current index

To update your data in your current index itself without copying it to a different index, use the `update_by_query` operation.

The `update_by_query` operation is `POST` operation that you can perform on a single index at a time.

```json
POST <index_name>/_update_by_query
```

If you run this command with no parameters, it increments the version number for all documents in the index.
