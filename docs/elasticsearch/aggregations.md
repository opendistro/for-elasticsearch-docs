---
layout: default
title: Aggregations
parent: Elasticsearch
nav_order: 13
---

# Aggregations

Elasticsearch isn’t just for search. Aggregations let you tap into Elasticsearch's powerful analytics engine to analyze your data and extract statistics and build summaries.

The use cases of aggregations vary from analyzing data in real time to take some action to using Kibana to create a visualization dashboard.

Elasticsearch can perform aggregations on massive datasets in milliseconds. Compared to queries, aggregations consume more CPU cycles and memory.

This section helps to turn the question you want to ask of your data into the appropriate aggregation operation.

## Aggregations on text fields

By default, Elasticsearch does not support aggregations on an analyzed text field.
An aggregation on a text field would have to reverse the tokenization process back to its original string and then formulate an aggregation based on that. Such an operation would consume significant memory and degrade cluster performance.

It's possible to enable aggregations on text fields by setting the `fielddata` property to `true` in the index mapping. But the aggregation is still based on the tokenized words and not the raw text.

We recommend keeping a raw version of the text field as a keyword field that you can aggregate on. In this case, you can perform aggregations on the `title.raw` field, instead of the `title` field:

```json
PUT movies
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "fielddata": true,
        "fields": {
          "raw": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```

## General query structure

The structure of an aggregation query is as follows:

```json
GET _search
{
  "size": 0,
  "aggs": {
    "NAME": {
      "AGG_TYPE": {}
    }
  }
}
```

If you’re only interested in the aggregations and not the results of the query, set `size` to `0`.  

In the `aggs` property (you can use aggregations if you want), you can define any number of aggregations. Each aggregation is defined by its name and one of the types of aggregations that are provided by Elasticsearch.

The name of the aggregation helps you distinguish particular aggregations in the response. The `AGG_TYPE` property is where you specify the type of aggregation.

## Quick start

This section uses the Kibana sample web logs data. To add that sample data, log in to Kibana, choose **Home** and **Try our sample data**. For **Sample web logs**, choose **Add data**.

Then return to Dev Tools.

### avg

To find the average value for the `bytes` field:

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "avg_bytes": {
      "avg": {
        "field": "bytes"
      }
    }
  }
}
```

#### Sample response

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10000,
      "relation" : "gte"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "avg_bytes" : {
      "value" : 5664.749822367487
    }
  }
}
```
