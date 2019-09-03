---
layout: default
title: CAT API
parent: Elasticsearch
nav_order: 4
---

# cat API

You can get essential statistics about your cluster in an easy-to-understand, tabular format using the compact and aligned text (CAT) API.
The cat API is a human-readable interface that returns plain text instead of traditional JSON.

Using the cat API, you can answer questions like which node is the elected master, what state is the cluster in, how many documents are in each index, and so on.

To see the available operations in the cat API, use the following command.
#### Request

```json
GET _cat
```

You can also use the following string parameters with your query.

Parameter | Description
:--- | :--- |
`?v` |  Makes the output more verbose by adding headers to the columns. It also adds some formatting to help align each of the columns together.
`?help` | Lists the default and other available headers for a given operation.
`?h`  |  Limits the output to specific headers.
`?format` |  Outputs the result in JSON, YAML, or CBOR formats.
`?sort` | Sorts the output by the specified columns.

To see what each column represents, use the `?v` parameter:

```json
GET _cat/<operation_name>?v
```

To see all the available headers, you can use the `?help` parameter:

```json
GET _cat/<operation_name>?help
```

To limit the output to a subset of headers, you can use the `?h` parameter:

```json
GET _cat/<operation_name>?h=<header_name_1>,<header_name_2>&v
```

Typically, for any operation you can find out what headers are available using the `?help` parameter, and then use the `?h` parameter to limit the output to only the headers that you care about.

---

#### Table of contents
1. TOC
{:toc}

---

## Allocation

Shows the allocation of disk space for indices and the number of shards on each node.

```json
GET _cat/allocation?v
```

## Shards

Shows the state of all primary and replica shards and how they are distributed.

```json
GET _cat/shards?v
```

To see only the information about shards of a specific index, add the index name after your query.

```json
GET _cat/shards/<index>?v
```

## Master

Shows information that helps identify the elected master node.

```json
GET _cat/master?v
```

## Nodes

Shows node-level information, including node roles and load metrics.

A few important node metrics are `pid`, `name`, `master`, `ip`, `port`, `version`, `build`, `jdk`, along with `disk`, `heap`, `ram`, and `file_desc`.

```json
GET _cat/nodes?v
```

## Tasks

Shows the progress of all tasks currently running on your cluster.

```json
GET _cat/tasks?v
```

## Indices

Shows information related to indices⁠—how much disk space they are using, how many shards they have, their health status, and so on.

```json
GET _cat/indices?v
```

To limit the information to a specific index, add the index name after your query.

```json
GET _cat/indices/<index>?v
```

## Segments

Shows Lucene segment-level information for each index.

```json
GET _cat/segments?v
```

To see only the information about segments of a specific index, add the index name after your query.

```json
GET _cat/segments/<index>?v
```

## Count

Shows the number of documents in your cluster.

```json
GET _cat/count?v
```

To see the number of documents in a specific index, add the index name after your query.

```json
GET _cat/count/<index>?v
```

## Recovery

Shows all completed and ongoing index and shard recoveries.

```json
GET _cat/recovery?v
```

To see only the recoveries of a specific index, add the index name after your query.

```json
GET _cat/recovery/<index>?v
```

## Health

Shows the status of the cluster, how long the cluster has been up, the number of nodes, and other useful information that helps you analyze the health of your cluster.

```json
GET _cat/health?v
```

## Pending tasks

Shows the progress of all pending tasks, including task priority and time in queue.

```json
GET _cat/pending_tasks?v
```

## Aliases

Shows the mapping of aliases to indices, plus routing and filtering information.

```json
GET _cat/aliases?v
```

To limit the information to a specific alias, add the alias name after your query.

```json
GET _cat/aliases/<alias>?v
```

## Thread pool

Shows the active, queued, and rejected threads of different thread pools on each node.

```json
GET _cat/thread_pool?v
```

To limit the information to a specific thread pool, add the thread pool name after your query.

```json
GET _cat/thread_pool/<thread_pool>?v
```

## Plugins

Shows the names, components, and versions of the installed plugins.

```json
GET _cat/plugins?v
```

## Field data

Shows the memory size used by each field per node.

```json
GET _cat/fielddata?v
```

To limit the information to a specific field, add the field name after your query.

```json
GET _cat/fielddata/<fields>?v
```

## Node attributes

Shows the attributes of custom nodes.

```json
GET _cat/nodeattrs?v
```

## Repositories

Shows all snapshot repositories and their types.

```json
GET _cat/repositories?v
```

## Snapshots

Shows all snapshots for a repository.

```json
GET _cat/snapshots/<repository>?v
```

## Templates

Shows the names, patterns, order numbers, and version numbers of index templates.

```json
GET _cat/templates?v
```
