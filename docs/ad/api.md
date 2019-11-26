---
layout: default
title: Anomaly Detection API
parent: Anomaly Detection
nav_order: 1
---

# Anomaly Detection API

Use these anomaly detection operations to programmatically create and manage detectors.

---

#### Table of contents
- TOC
{:toc}


---

## Create Anomaly Detector

Creates an anomaly detector.

This command creates a detector named `http_requests` that finds anomalies based on the sum and average number of failed HTTP requests:


#### Request

```json
POST _opendistro/_anomaly_detection/detectors
{
    "name":"test-detector",
    "description":"test detector",
    "time_field":"timestamp",
    "indices":[
        "order*"
    ],
    "feature_attributes":[
        {
            "feature_name":"total_orders",
            "feature_enabled":true,
            "aggregation_query":{
                "value_sum":{
                    "sum":{
                        "field":"value"
                    }
                }
            }
        }
    ],
    "filter_query":{
        "bool":{
            "filter":[
                {
                    "exists":{
                        "field":"value",
                        "boost":1
                    }
                }
            ],
            "adjust_pure_negative":true,
            "boost":1
        }
    },
    "detection_interval":{
        "period":{
            "interval":1,
            "unit":"Minutes"
        }
    }
}
```

You can specify the following options.

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`name` |  The name of the detector. | `string` | Yes
`description` |  A description of the detector. | `string` | Yes
`time_field` |  The name of the time field. | `string` | Yes
`indices`  |  A list of indices to use as the data source. | `list` | Yes
`feature_attributes` | Specify a `feature_name`, set the `enabled` parameter to `true`, and specify an aggregation query. | `list` | Yes
`filter_query` |  Provide an optional filter query for your feature. | `object` | No
`detection_interval` | The time interval for your anomaly detector. | `object` | Yes

#### Sample response

```json
{
  "_id" : "B2aJlG4B04EFYPipCRO4",
  "_version" : 1,
  "_seq_no" : 3,
  "_primary_term" : 1,
  "anomaly_detector" : {
    "name":"test-detector",
    "description":"test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
    ],
    "feature_attributes" : [
      {
        "feature_id" : "BmaJlG4B04EFYPipCROs",
        "feature_name":"total_orders",
        "feature_enabled" : true,
        "aggregation_query" : {
          "value_sum" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ],
    "filter_query" : {
      "bool" : {
        "filter" : [
          {
            "exists" : {
              "field" : "value",
              "boost" : 1.0
            }
          }
        ],
        "adjust_pure_negative" : true,
        "boost" : 1.0
      }
    },
    "detection_interval" : {
      "period" : {
        "interval" : 5,
        "unit" : "Minutes"
      }
    },
    "last_update_time" : 1574450039212
  }
}
```

---

## Preview detector

Passes a date range to the anomaly detector to return any anomalies within that date range.

#### Request

```json
POST _opendistro/_anomaly_detection/detectors/<detector_id>/_preview
{
    "period_start":1573089773852,
    "period_end":1573521773853
}
```

#### Sample response

```json
{
    "anomaly_result":[
        ...
        {
            "detector_id":"B2aJlG4B04EFYPipCRO4",
            "anomaly_grade":0.1,
            "confidence":0.7,
            "feature_data":[
                {
                    "feature_id":"value_sum",
                    "feature_name":"Value Sum",
                    "data":20
                }
            ],
            "start_time":1573514220000,
            "end_time":1573514520000
        },
        ...
    ],
    "anomaly_detector":{
        "name":"test-detector",
        "description":"test detector",
        "time_field":"timestamp",
        ...
    }
}
```


---

## Search detector result

Returns all results for a search query.

#### Request

```json
GET /_opendistro/_anomaly_detection/results/_search
POST /_opendistro/_anomaly_detection/results/_search

{
  "query": {
    "bool" : {
      "must" : {
        "range" : {
          "anomaly_score" : { "gte" : 0.6, "lte" : 1 }
        }
      }
    }
  }
}
```

#### Sample response

```json
{
  "took" : 9,
  "timed_out" : false,
  "_shards" : {
    "total" : 25,
    "successful" : 25,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : ".opendistro-anomaly-results-history-2019.11.21-1",
        "_type" : "_doc",
        "_id" : "GO0UkW4BbunK2JwuvMUQ",
        "_version" : 1,
        "_seq_no" : 35,
        "_primary_term" : 1,
        "_score" : 1.0,
        "_source" : {
          "detector_id" : "dAaHjG4B5Uh30OvgBjjc",
          "anomaly_score" : 2.4603645209872402,
          "start_time" : 1574391785478,
          "confidence" : 0.8429920264756339,
          "feature_data" : [
            {
              "feature_id" : "value_sum",
              "feature_name" : "Value Sum",
              "data" : 70.1979163525
            }
          ],
          "end_time" : 1574392085478,
          "anomaly_grade" : 0.6303142329020289
        }
      },
      {
        "_index" : ".opendistro-anomaly-results-history-2019.11.21-1",
        "_type" : "_doc",
        "_id" : "He0ZkW4BbunK2JwuT8XZ",
        "_version" : 1,
        "_seq_no" : 38,
        "_primary_term" : 1,
        "_score" : 1.0,
        "_source" : {
          "detector_id" : "dAaHjG4B5Uh30OvgBjjc",
          "anomaly_score" : 2.5436755068046835,
          "start_time" : 1574392085478,
          "confidence" : 0.8430908518635617,
          "feature_data" : [
            {
              "feature_id" : "value_sum",
              "feature_name" : "Value Sum",
              "data" : 73.5079350732
            }
          ],
          "end_time" : 1574392385478,
          "anomaly_grade" : 0.630996309963105
        }
      }
    ]
  }
}
```

---

## Delete detector

Deletes a detector based on the `detector_id`.

#### Request

```json
DELETE _opendistro/_anomaly_detection/detectors/<detectorId>
```


#### Sample response

```json
{
    "_index":".opendistro-anomaly-detectors",
    "_type":"_doc",
    "_id":"-pkshm4BEeUxI8h32j-f",
    "_version":3,
    "result":"deleted",
    "forced_refresh":true,
    "_shards":{
        "total":2,
        "successful":1,
        "failed":0
    },
    "_seq_no":3,
    "_primary_term":2
}
```


---

## Update detector

Updates a detector with any changes, including the description or adding or removing of features.

#### Request

```json
PUT _opendistro/_anomaly_detection/detectors/<detectorId>
{
    "name":"test-detector",
    "description":"test detector",
    "time_field":"timestamp",
    "indices":[
        "order*"
    ],
    "feature_attributes":[
        {
            "feature_name":"total_orders",
            "feature_enabled":true,
            "aggregation_query":{
                "value_sum":{
                    "sum":{
                        "field":"value"
                    }
                }
            }
        }
    ],
    "filter_query":{
        "bool":{
            "filter":[
                {
                    "exists":{
                        "field":"value",
                        "boost":1
                    }
                }
            ],
            "adjust_pure_negative":true,
            "boost":1
        }
    },
    "detection_interval":{
        "period":{
            "interval":1,
            "unit":"Minutes"
        }
    }
}
```


#### Sample response

```json
{
  "_id" : "B2aJlG4B04EFYPipCRO4",
  "_version" : 2,
  "_seq_no" : 1,
  "_primary_term" : 1,
  "anomaly_detector" : {
    "name" : "test-detector",
    "description" : "test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
    ],
    "feature_attributes" : [
      {
        "feature_id" : "y3IJpG4BnLrCZiZnQ1rH",
        "feature_name" : "total_orders",
        "feature_enabled" : true,
        "aggregation_query" : {
          "value_sum" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ],
    "filter_query" : {
      "bool" : {
        "filter" : [
          {
            "exists" : {
              "field" : "value",
              "boost" : 1.0
            }
          }
        ],
        "adjust_pure_negative" : true,
        "boost" : 1.0
      }
    },
    "detection_interval" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "last_update_time" : 1574710100935
  }
}
```


---

## Get detector

Returns all information about a detector based on the `detector_id`.

#### Request

```json
GET _opendistro/_anomaly_detection/detectors/<detectorId>
```


#### Sample response

```json

{
  "_id" : "B2aJlG4B04EFYPipCRO4",
  "_version" : 1,
  "_primary_term" : 1,
  "_seq_no" : 3,
  "anomaly_detector" : {
    "name" : "test-detector",
    "description" : "test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
    ],
    "feature_attributes" : [
      {
        "feature_id" : "BmaJlG4B04EFYPipCROs",
        "feature_name" : "value_sum",
        "feature_enabled" : true,
        "aggregation_query" : {
          "value_sum" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ],
    "filter_query" : {
      "bool" : {
        "filter" : [
          {
            "exists" : {
              "field" : "value",
              "boost" : 1.0
            }
          }
        ],
        "adjust_pure_negative" : true,
        "boost" : 1.0
      }
    },
    "detection_interval" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    }
    "last_update_time" : 1574450039212
  }
}
```


---

## Search detector

Returns all anomaly detectors for a search query.

#### Request

```json
GET _opendistro/_anomaly_detection/detectors/_search
POST _opendistro/_anomaly_detection/detectors/_search

Sample Input:
{
  "query": {
    "match" : {
      "name": "Test"
    }
  }
}
```


#### Sample response

```json
{
    "took":7,
    "timed_out":false,
    "_shards":{
        "total":1,
        "successful":1,
        "skipped":0,
        "failed":0
    },
    "hits":{
        "total":{
            "value":1,
            "relation":"eq"
        },
        "max_score":0.2876821,
        "hits":[
            {
                "_index":".opendistro-anomaly-detectors",
                "_type":"_doc",
                "_id":"iYUdhm4BPhacIe2Bwma3",
                "_version":1,
                "_seq_no":0,
                "_primary_term":1,
                "_score":0.2876821,
                "_source":{
                    "name":"My Test Detector",
                    "description":"fault count",
                    "time_field":"timestamp",
                    "indices":[
                        "test*"
                    ],
                    "feature_attributes":[
                        {
                            "feature_id":"value_sum",
                            "feature_name":"Value Sum",
                            "feature_enabled":true,
                            "aggregation_query":{
                                "value_sum":{
                                    "sum":{
                                        "field":"value"
                                    }
                                }
                            }
                        }
                    ],
                    "filter_query":{
                        "match_all":{
                            "boost":1
                        }
                    },
                    "detection_interval":{
                        "period":{
                            "interval":5,
                            "unit":"Minutes"
                        }
                    },
                    "last_update_time":1574208127000
                }
            }
        ]
    }
}
```
