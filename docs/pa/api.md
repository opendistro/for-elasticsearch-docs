---
layout: default
title: API
parent: Performance Analyzer
nav_order: 1
---

# Performance Analyzer API

Performance Analyzer uses a single HTTP method and URI for all requests:

```
GET <endpoint>:9600/_opendistro/_performanceanalyzer/metrics
```

Note the use of port 9600. Then you provide parameters for metrics, aggregations, dimensions, and nodes (optional):

```
?metrics=<metrics>&agg=<aggregations>&dim=<dimensions>&nodes=all"
```

For a full list of metrics, see [Metrics Reference](../reference). Performance Analyzer updates its data every five seconds. If you create a custom client, we recommend using that same interval for calls to the API.


#### Sample request

```
GET _opendistro/_performanceanalyzer/metrics?metrics=Latency,CPU_Utilization&agg=avg,max&dim=ShardID&nodes=all
```

#### Sample response

```json
{
  "yC2YRPmpSNqpl9pStH5Mdw": {
    "timestamp": 1548713530000,
    "data": {
      "fields": [{
          "name": "shardid",
          "type": "VARCHAR"
        },
        {
          "name": "latency",
          "type": "DOUBLE"
        },
        {
          "name": "cpu_utilization",
          "type": "DOUBLE"
        }
      ],
      "records": [
        [
          null,
          306,
          0.06842689613768262
        ],
        [
          "0",
          null,
          0.026413448068841307
        ],
        [
          "1",
          null,
          0.02321152691614969
        ],
        [
          "2",
          null,
          0.026813448068841308
        ],
        [
          "3",
          null,
          0.21690950570342207
        ],
        [
          "4",
          null,
          0.17610470282169302
        ]
      ]
    }
  },
  "47oneXY0ToyGBbI-x9Jb7A": {
    "timestamp": 1548713530000,
    "data": {
      "fields": [{
          "name": "shardid",
          "type": "VARCHAR"
        },
        {
          "name": "latency",
          "type": "DOUBLE"
        },
        {
          "name": "cpu_utilization",
          "type": "DOUBLE"
        }
      ],
      "records": [
        [
          null,
          null,
          0.008001600320064013
        ]
      ]
    }
  },
  "xAZjzUnyTz2QFdk3V8eLzA": {
    "timestamp": 1548713530000,
    "data": {
      "fields": [{
          "name": "shardid",
          "type": "VARCHAR"
        },
        {
          "name": "latency",
          "type": "DOUBLE"
        },
        {
          "name": "cpu_utilization",
          "type": "DOUBLE"
        }
      ],
      "records": [
        [
          null,
          null,
          0.006798640271945611
        ]
      ]
    }
  },
  "cYxWiAadQWqWQE-aTE9x4g": {
    "timestamp": 1548713535000,
    "data": {
      "fields": [{
          "name": "shardid",
          "type": "VARCHAR"
        },
        {
          "name": "latency",
          "type": "DOUBLE"
        },
        {
          "name": "cpu_utilization",
          "type": "DOUBLE"
        }
      ],
      "records": [
        [
          null,
          318.5,
          0.0904
        ],
        [
          "0",
          null,
          0.0212
        ],
        [
          "1",
          null,
          0.022
        ],
        [
          "2",
          null,
          0.02
        ],
        [
          "3",
          null,
          0.294
        ],
        [
          "4",
          null,
          0.0204
        ]
      ]
    }
  }
}
```
