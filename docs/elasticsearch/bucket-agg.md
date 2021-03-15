---
layout: default
title: Bucket Aggregations
parent: Aggregations
grand_parent: Elasticsearch
nav_order: 2
has_children: false
---

# Bucket Aggregations

Bucket aggregations categorize sets of documents as buckets. The type of bucket aggregation determines whether a given document falls into a bucket or not.

## terms

The `terms` aggregation dynamically creates a bucket for each unique term of a field.

For example, in web log data, you can use the terms aggregation to find how many documents you have with each response code:

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10
      }
    }
  }
}
```

#### Sample Response

```json
...
"aggregations" : {
  "response_codes" : {
    "doc_count_error_upper_bound" : 0,
    "sum_other_doc_count" : 0,
    "buckets" : [
      {
        "key" : "200",
        "doc_count" : 12832
      },
      {
        "key" : "404",
        "doc_count" : 801
      },
      {
        "key" : "503",
        "doc_count" : 441
      }
    ]
  }
 }
}
```

The values are returned with the the key `key`.
`doc_count` specifies the number of documents in each bucket. By default, the buckets are sorted in descending order of `doc-count`.

The response also includes two keys named `doc_count_error_upper_bound` and `sum_other_doc_count`.

The `terms` aggregation returns the top unique terms. So, if the data has many unique terms, then some of them might not appear in the results. The `sum_other_doc_count` field is the sum of the documents that are left out of the response. In this case, the number is 0 because all the unique values appear in the response.

The `doc_count_error_upper_bound` field represents the maximum possible count for a unique value that's left out of the final results. Use this field to estimate the error margin for the count.

The count might not be accurate. A coordinating node that’s responsible for the aggregation prompts each shard for its top unique terms. Imagine a scenario where the `size` parameter is 3.
The terms aggregation requests each shard for its top 3 unique terms. The coordinating node takes each of the results and aggregates them to compute the final result. If a shard has an object that’s not part of the top 3, then it won't show up in the response.

This is especially true if `size` is set to a low number. Because the default size is 10, an error is unlikely to happen. If you don’t need high accuracy and want to increase the performance, you can reduce the size.

## significant_terms

The `significant_terms` aggregation lets you spot unusual or interesting term occurrences in a filtered subset relative to the rest of the data in the index.

A foreground set is the set of documents that you filter. A background set is a set of all documents in an index.
The `significant_terms` aggregation examines all documents in the foreground set and finds a score for significant occurrences in contrast to the documents in the background set.

In the sample log data, each document has a field containing the `user-agent` of the visitor. This example searches for all requests from an iOS operating system. A regular terms aggregation on this foreground set returns Firefox because it has the most number of documents within this bucket. A significant terms aggregation returns Internet Explorer (IE) because IE has a significantly higher appearance in the foreground set as compared to the background set.

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "query": {
    "terms": {
      "machine.os.keyword": [
        "ios"
      ]
    }
  },
  "aggs": {
    "significant_response_codes": {
      "significant_terms": {
        "field": "agent.keyword"
      }
    }
  }
}
```

#### Sample response

```json
...
"aggregations" : {
  "significant_response_codes" : {
    "doc_count" : 2737,
    "bg_count" : 14074,
    "buckets" : [
      {
        "key" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
        "doc_count" : 818,
        "score" : 0.01462731514608217,
        "bg_count" : 4010
      },
      {
        "key" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
        "doc_count" : 1067,
        "score" : 0.009062566630410223,
        "bg_count" : 5362
      }
    ]
  }
 }
}
```

If your significant terms aggregation doesn't get any result, you might have not filtered the results with a query. Alternatively, the distribution of terms in the foreground set might be the same as the background set, implying that there isn't anything unusual in the foreground set.

## sampler, diversified_sampler

If you're aggregating over millions of documents, you can use a `sampler` aggregation to reduce its scope to a small sample of documents for a faster response. The sampler aggregation selects the samples by top-scoring documents. The results are approximate but closely represent the distribution of the real data. The sampler aggregation significantly improves query performance. But the estimated responses are not entirely reliable.

The basic syntax is:

```json
“aggs”: {
     "SAMPLE": {
         "sampler": {
             "shard_size": 100
         },
         "aggs": {…}
     }
}
```

The `shard_size` property tells Elasticsearch how many documents (at most) to collect from each shard.

For example, you can limit the number of documents collected on each shard to 1,000 and then bucket the documents by a terms aggregation.

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 1000
      },
      "aggs": {
        "terms": {
          "terms": {
            "field": "agent.keyword"
          }
        }
      }
    }
  }
}
```

#### Sample response

```json
...
"aggregations" : {
  "sample" : {
    "doc_count" : 1000,
    "terms" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
          "doc_count" : 368
        },
        {
          "key" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.50 Safari/534.24",
          "doc_count" : 329
        },
        {
          "key" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
          "doc_count" : 303
        }
      ]
    }
  }
 }
}
```

The `diversified_sampler` aggregation lets you reduce the bias in the distribution of the sample pool. You can use the `field` setting to control the maximum number of documents collected on any one shard which shares a common value:

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sample": {
      "diversified_sampler": {
        "shard_size": 1000,
        "field": "response.keyword"
      },
      "aggs": {
        "terms": {
          "terms": {
            "field": "agent.keyword"
          }
        }
      }
    }
  }
}
```

#### Sample response

```json
...
"aggregations" : {
  "sample" : {
    "doc_count" : 3,
    "terms" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
          "doc_count" : 2
        },
        {
          "key" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
          "doc_count" : 1
        }
      ]
    }
  }
 }
}
```


## missing

If you have documents in your index that don’t contain the aggregating field at all or have a value of NULL, use the `missing` parameter to specify the name of the bucket such documents should be placed in.

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10,
        "missing": "N/A"
      }
    }
  }
}
```

You can set a minimum number of documents for a bucket with the `min_doc_count` parameter. The default value is 1, that’s why the missing parameter does not return any buckets in its response. Set its value to 0 to see the bucket in the response.

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10,
        "missing": "N/A",
        "min_doc_count": 0
      }
    }
  }
}
```

#### Sample response

```json
...
"aggregations" : {
  "response_codes" : {
    "doc_count_error_upper_bound" : 0,
    "sum_other_doc_count" : 0,
    "buckets" : [
      {
        "key" : "200",
        "doc_count" : 12832
      },
      {
        "key" : "404",
        "doc_count" : 801
      },
      {
        "key" : "503",
        "doc_count" : 441
      },
      {
        "key" : "N/A",
        "doc_count" : 0
      }
    ]
  }
 }
}
```

### histogram, date_histogram

The `histogram` aggregation bucket documents based on a specified interval.

With histogram aggregations, you can visualize the distributions of values in a given range of documents very easily. Now Elasticsearch doesn’t give you back an actual graph of course, that’s what Kibana is for. But it'll give you the JSON response that you can use to construct your own graph.
Lets say we want to bucket the `number_of_bytes` field by 10,000 intervals:

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes": {
      "histogram": {
        "field": "bytes",
        "interval": 10000
      }
    }
  }
}
```

Sample Response

```json
...
"aggregations" : {
  "number_of_bytes" : {
    "buckets" : [
      {
        "key" : 0.0,
        "doc_count" : 13372
      },
      {
        "key" : 10000.0,
        "doc_count" : 702
      }
    ]
  }
 }
}
```

The `date_histogram` aggregation uses date math to generate histograms for time-series data.

For example, you can find how many hits your website gets per month:

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "logs_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "month"
      }
    }
  }
}
```

#### Sample response

```json
...
"aggregations" : {
  "logs_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595
      }
    ]
  }
}
}
```

The response has three months worth of logs. If you graph these values, you can see the peak and valleys of the request traffic to you website month over month.

### range, date_range

The `range` aggregation lets you define the range for each bucket.

For example, you can find the number of bytes between 1000 and 2000, 2000 and 3000, and 3000 and 4000.
Within the range parameter, you can define ranges as objects of an array.


```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes_distribution": {
      "range": {
        "field": "bytes",
        "ranges": [
          {
            "from": 1000,
            "to": 2000
          },
          {
            "from": 2000,
            "to": 3000
          },
          {
            "from": 3000,
            "to": 4000
          }
        ]
      }
    }
  }
}
```

The response includes the `from` key values and excludes the `to` key values:

#### Sample response

```json
...
"aggregations" : {
  "number_of_bytes_distribution" : {
    "buckets" : [
      {
        "key" : "1000.0-2000.0",
        "from" : 1000.0,
        "to" : 2000.0,
        "doc_count" : 805
      },
      {
        "key" : "2000.0-3000.0",
        "from" : 2000.0,
        "to" : 3000.0,
        "doc_count" : 1369
      },
      {
        "key" : "3000.0-4000.0",
        "from" : 3000.0,
        "to" : 4000.0,
        "doc_count" : 1422
      }
    ]
  }
 }
}
```

The `date_range` aggregation is conceptually the same as the `range` aggregation, except that it lets you perform date math.
For example, you can get all documents from the last 10 days. To make the date more readable, include the format with a `format` parameter:

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes": {
      "date_range": {
        "field": "@timestamp",
        "format": "MM-yyyy",
        "ranges": [
          {
            "from": "now-10d/d",
            "to": "now"
          }
        ]
      }
    }
  }
}
```

#### Sample response

```json
...
"aggregations" : {
  "number_of_bytes" : {
    "buckets" : [
      {
        "key" : "03-2021-03-2021",
        "from" : 1.6145568E12,
        "from_as_string" : "03-2021",
        "to" : 1.615451329043E12,
        "to_as_string" : "03-2021",
        "doc_count" : 0
      }
    ]
  }
 }
}
```

### filter, filters

A `filter` aggregation is query clause, exactly like a search query - `match` or `term` or `range`. You can use the filter aggregation to narrow down the entire set of documents to a specific set before creating buckets.

In this case, the `avg` aggregation runs within the context of a filter. It only aggregates the documents that match the range query:

```json
GET kibana_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "low_value": {
      "filter": {
        "range": {
          "taxful_total_price": {
            "lte": 50
          }
        }
      },
      "aggs": {
        "avg_amount": {
          "avg": {
            "field": "taxful_total_price"
          }
        }
      }
    }
  }
}
```

Sample Response

```json
...
"aggregations" : {
  "low_value" : {
    "doc_count" : 1633,
    "avg_amount" : {
      "value" : 38.363175998928355
    }
  }
 }
}
```

A `filters` aggregation is the same as the filter aggregation except that it lets you use multiple filter aggregations.
While the filter aggregation results in a single bucket, the filters aggregation returns multiple buckets – one for each of the defined filters.

To create a bucket for all the documents that didn't match the any of the filter queries, set the `other_bucket` property to `true`:

```json
GET kibana_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "200_os": {
      "filters": {
        "other_bucket": true,
        "filters": [
          {
            "term": {
              "response.keyword": "200"
            }
          },
          {
            "term": {
              "machine.os.keyword": "osx"
            }
          }
        ]
      },
      "aggs": {
        "avg_amount": {
          "avg": {
            "field": "bytes"
          }
        }
      }
    }
  }
}
```

#### Sample response

```json
...
"aggregations" : {
  "200_os" : {
    "buckets" : [
      {
        "doc_count" : 12832,
        "avg_amount" : {
          "value" : 5897.852711970075
        }
      },
      {
        "doc_count" : 2825,
        "avg_amount" : {
          "value" : 5620.347256637168
        }
      },
      {
        "doc_count" : 1017,
        "avg_amount" : {
          "value" : 3247.0963618485744
        }
      }
    ]
  }
 }
}
```

### global

A `global` aggregations lets you break out of the aggregation context of a filter aggregation. Even if you have included a query that narrows down a set of documents, the global aggregation aggregates on all documents as if the filter query wasn't there. It ignores the filter aggregation and implicitly assumes the `match_all` query.

```json
GET kibana_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "range": {
      "taxful_total_price": {
        "lte": 50
      }
    }
  },
  "aggs": {
    "total_avg_amount": {
      "global": {},
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "taxful_total_price"
          }
        }
      }
    }
  }
}
```

You can see the average value for the `taxful_total_price` field is 75.05 and not the 38.36 as seen in the `filter` example when the query matched:

#### Sample response

```json
...
"aggregations" : {
  "total_avg_amount" : {
    "doc_count" : 4675,
    "avg_price" : {
      "value" : 75.05542864304813
    }
  }
 }
}
```
