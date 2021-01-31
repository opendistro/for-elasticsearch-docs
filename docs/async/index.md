---
layout: default
title: Asynchronous Search
nav_order: 51
has_children: true
---

# Asynchronous Search

Searching large volumes of data can take a long time, especially if it’s across cold nodes or multiple remote clusters.

Asynchronous search lets you run search requests that execute in the background. You can monitor the progress of these searches and get back partial results as they become available. After the search completes, you can save the results to examine at a later time.

Asynchronous search requires Elasticsearch 7.9 or higher.

## REST API

To perform an asynchronous search, send requests to `_opendistro/_asynchronous_search`, with your query in the request body:

```json
POST _opendistro/_asynchronous_search
```

You can specify the following options.

Options | Description | Default value | Required
:--- | :--- |:--- |:--- |
`wait_for_completion_timeout` |  Specify the amount of time you plan to wait for the results. Whatever results you get within this time, you can see just like a normal search. The remaining results you can poll based on an ID. The maximum value is 300 seconds. | 1 second | No
`keep_on_completion` |  Whether you want to save the results in the cluster after the search is complete. You can examine the stored results at a later time. | `false` | No
`keep_alive` |  Specify the amount of time the result is saved in the cluster. For example, `2d` means that the results are stored in the cluster for 48 hours. The saved search results are deleted after this period or if the search is cancelled. Note that this includes the query execution time. If the query overruns this time, the process cancels this query automatically. | 12 hours | No

#### Sample Request

```json
POST _opendistro/_asynchronous_search/?pretty&size=10&wait_for_completion_timeout=1ms&keep_on_completion=true&request_cache=false
{
  "aggs": {
    "city": {
      "terms": {
        "field": "city",
        "size": 10
      }
    }
  }
}
```

#### Sample response

```json
{
  "*id*": "FklfVlU4eFdIUTh1Q1hyM3ZnT19fUVEUd29KLWZYUUI3TzRpdU5wMjRYOHgAAAAAAAAABg==",
  "state": "RUNNING",
  "start_time_in_millis": 1599833301297,
  "expiration_time_in_millis": 1600265301297,
  "response": {
    "took": 15,
    "timed_out": false,
    "terminated_early": false,
    "num_reduce_phases": 4,
    "_shards": {
      "total": 21,
      "successful": 4,
      "skipped": 0,
      "failed": 0
    },
    "hits": {
      "total": {
        "value": 807,
        "relation": "eq"
      },
      "max_score": null,
      "hits": []
    },
    "aggregations": {
      "city": {
        "doc_count_error_upper_bound": 16,
        "sum_other_doc_count": 403,
        "buckets": [
          {
            "key": "downsville",
            "doc_count": 1
          },
        ....
        ....
        ....
          {
            "key": "blairstown",
            "doc_count": 1
          }
        ]
      }
    }
  }
}
```

#### Response parameters

Options | Description
:--- | :---
`id` | Use the ID of an asynchronous search to monitor its progress, get its partial results, and/or delete the results. If the asynchronous search completes within the timeout period, the response won’t include the ID as the results are not stored in the cluster.
`state` | Whether the search is still running or it has completed and if the results persist in the cluster. The possible states are `RUNNING`, `COMPLETED`, or `PERSISTED`.
`start_time_in_millis` | The start time in milliseconds.
`expiration_time_in_millis` | The expiration time in milliseconds.
`took` | The total time that the search is running.
`response` | The actual search response.
`num_reduce_phases` | The number of times the coordinating node aggregates results from batches of shard responses (5 by default). If this number increases compared to the last retrieved results, you can expect additional results included in the search response
`total` | The total number of shards that executes the search.
`successful` | The number of shard responses the coordinating node received successfully.
`aggregations` | The partial aggregation results completed by the shards so far.

## Get partial results

After you submit an asynchronous search request, you can request partial responses with the ID that you see in the asynchronous search response.

```json
GET _opendistro/_asynchronous_search/<ID>?pretty
```

#### Sample response

```json
{
  "id": "Fk9lQk5aWHJIUUltR2xGWnpVcWtFdVEURUN1SWZYUUJBVkFVMEJCTUlZUUoAAAAAAAAAAg==",
  "state": "STORE_RESIDENT",
  "start_time_in_millis": 1599833907465,
  "expiration_time_in_millis": 1600265907465,
  "response": {
    "took": 83,
    "timed_out": false,
    "_shards": {
      "total": 20,
      "successful": 20,
      "skipped": 0,
      "failed": 0
    },
    "hits": {
      "total": {
        "value": 1000,
        "relation": "eq"
      },
      "max_score": 1,
      "hits": [
        {
          "_index": "bank",
          "_type": "_doc",
          "_id": "1",
          "_score": 1,
          "_source": {
            "email": "amberduke@abc.com",
            "city": "Brogan",
            "state": "IL"
          }
        },
       {....}
      ]
    },
    "aggregations": {
      "city": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 997,
        "buckets": [
          {
            "key": "belvoir",
            "doc_count": 2
          },
          {
            "key": "aberdeen",
            "doc_count": 1
          },
          {
            "key": "abiquiu",
            "doc_count": 1
          }
        ]
      }
    }
  }
}
```

After the response is successfully persisted, you get back the `STORE_RESIDENT` state in the response. 

You can poll the ID with the `wait_for_completion_timeout` parameter to wait for the results received for the time you specify.

For asynchronous searches with `keep_on_completion` as `true` and a sufficiently long `keep_alive` time, you can keep polling the IDs until the search completes. If you don’t want to periodically poll each ID, you can retain the results in your cluster with the `keep_alive` parameter and come back to it at a later time.

## Delete searches and results

You can use the DELETE API to delete any ongoing asynchronous search by its ID. If the search is still running, it’s cancelled. If the search is complete, the saved search results are deleted.

```json
DELETE _opendistro/_asynchronous_search/<ID>?pretty
```

#### Sample response

```json
{
  "acknowledged": "true"
}
```

## Monitor stats

You can use the stats API to monitor running, completed, and/or persisted asynchronous searches.

```json
GET _opendistro/_asynchronous_search/_stats
```

#### Sample response

```json
{
  "_nodes": {
    "total": 8,
    "successful": 8,
    "failed": 0
  },
  "cluster_name": "264071961897:asynchronous-search",
  "nodes": {
    "JKEFl6pdRC-xNkKQauy7Yg": {
      "name": "40eae75ed3fa9633fec88fd60ec189fb",
      "transport_address": "10.212.60.202:9300",
      "host": "10.212.60.202",
      "ip": "10.212.60.202:9300",
      "roles": [
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes": {
        "distributed_snapshot_deletion_enabled": "false",
        "zone": "us-east-1c",
        "cross_cluster_transport_address": "2600:1f18:10d4:8802:91e6:5857:5a69:9348",
      },
      "asynchronous_search_stats": {
        "submitted": 18236,
        "initialized": 112,
        "search_failed": 56,
        "search_completed": 56,
        "rejected": 18124,
        "persist_failed": 0,
        "cancelled": 1,
        "running_current": 399,
        "persisted": 100
      }
    }
  }
}
```

#### Response parameters

Options | Description
:--- | :---
`submitted` | The number of asynchronous search requests submitted.
`initialized` | The number of asynchronous search requests initialized.
`rejected` | The number of asynchronous search requests rejected.
`search_completed` | The number of asynchronous search requests that completed with a successful response.
`search_failed` | The number of asynchronous search requests that completed with a failed response.
`persisted` | The number of asynchronous search requests whose final result successfully persisted in the cluster.
`persist_failed` | The number of asynchronous search requests whose final result failed to persist in the cluster.
`running_current` | The number of asynchronous search requests running on a given coordinator node.
`cancelled` | The number of asynchronous search requests cancelled when running.
