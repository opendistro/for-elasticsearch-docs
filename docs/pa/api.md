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

For a full list of metrics, see [Metrics reference](../reference/). Performance Analyzer updates its data every five seconds. If you create a custom client, we recommend using that same interval for calls to the API.


#### Sample request

```
GET _opendistro/_performanceanalyzer/metrics?metrics=Latency,CPU_Utilization&agg=avg,max&dim=ShardID&nodes=all
```

#### Sample response

```json
{
  "keHlhQbbTpm1BYicficEQg": {
    "timestamp": 1554940530000,
    "data": {
      "fields": [{
          "name": "ShardID",
          "type": "VARCHAR"
        },
        {
          "name": "Latency",
          "type": "DOUBLE"
        },
        {
          "name": "CPU_Utilization",
          "type": "DOUBLE"
        }
      ],
      "records": [
        [
          null,
          null,
          0.012552206029147535
        ],
        [
          "1",
          4.8,
          0.0009780939762972104
        ]
      ]
    }
  },
  "bHdpbMJZTs-TKtZro2SmYA": {
    "timestamp": 1554940530000,
    "data": {
      "fields": [{
          "name": "ShardID",
          "type": "VARCHAR"
        },
        {
          "name": "Latency",
          "type": "DOUBLE"
        },
        {
          "name": "CPU_Utilization",
          "type": "DOUBLE"
        }
      ],
      "records": [
        [
          null,
          18.2,
          0.011966493817311527
        ],
        [
          "1",
          14.8,
          0.0007670829370071493
        ]
      ]
    }
  }
}
```

In this case, each top-level object represents a node. The API returns names and data types for the metrics and dimensions that you specified, along with values from five seconds ago and current values (if different). Null values represent inactivity during that time period.
