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
  "name": "test-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "order*"
  ],
  "feature_attributes": [
    {
      "feature_name": "total_order",
      "feature_enabled": true,
      "aggregation_query": {
        "total_order": {
          "sum": {
            "field": "value"
          }
        }
      }
    }
  ],
  "filter_query": {
    "bool": {
      "filter": [
        {
          "exists": {
            "field": "value",
            "boost": 1
          }
        }
      ],
      "adjust_pure_negative": true,
      "boost": 1
    }
  },
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
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
`window_delay` | Add extra processing time for data collection | `object` | No

#### Sample response

```json
{
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 1,
  "_seq_no" : 3,
  "_primary_term" : 1,
  "anomaly_detector" : {
    "name" : "test-detector",
    "description" : "Test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
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
    "window_delay" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "schema_version" : 0,
    "feature_attributes" : [
      {
        "feature_id" : "mYccEnIBTXsGi3mvMd8_",
        "feature_name" : "total_order",
        "feature_enabled" : true,
        "aggregation_query" : {
          "total_order" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ]
  }
}
```

---

## Preview detector

Passes a date range to the anomaly detector to return any anomalies within that date range.

#### Request

```json
POST _opendistro/_anomaly_detection/detectors/<detectorId>/_preview
{
  "period_start": 1588838250000,
  "period_end": 1589443050000
}
```

#### Sample response

```json
{
  "anomaly_result": [
    {
      "detector_id": "m4ccEnIBTXsGi3mvMt9p",
      "data_start_time": 1588843020000,
      "data_end_time": 1588843620000,
      "feature_data": [
        {
          "feature_id": "xxokEnIBcpeWMD987A1X",
          "feature_name": "total_order",
          "data": 489.9929131106
        }
      ],
      "anomaly_grade": 0,
      "confidence": 0.99
    }
  ],
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test detector",
    "time_field": "timestamp",
    "indices": [
      "order*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "exists": {
              "field": "value",
              "boost": 1
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 10,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "xxokEnIBcpeWMD987A1X",
        "feature_name": "total_order",
        "feature_enabled": true,
        "aggregation_query": {
          "total_order": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1589442309241
  }
}
```


---

## Start detector job

Starts an anomaly detector job.

#### Request

```json
POST _opendistro/_anomaly_detection/detectors/<detectorId>/_start
```

#### Sample response

```json
{
  "_id": "tNWMEHEBdsd5fFw61sVn",
  "_version": 1,
  "_seq_no": 6,
  "_primary_term": 19
}
```


---

## Stop detector job

Stops an anomaly detector job.

#### Request

```json
POST _opendistro/_anomaly_detection/detectors/<detectorId>/_stop
```

#### Sample response

```json
Stopped detector: m4ccEnIBTXsGi3mvMt9p
```

---

## Search detector result

Returns all results for a search query.

#### Request

```json
GET _opendistro/_anomaly_detection/detectors/results/_search
POST _opendistro/_anomaly_detection/detectors/results/_search

{
  "query": {
    "bool": {
      "must": {
        "range": {
          "anomaly_score": {
            "gte": 0.6,
            "lte": 1
          }
        }
      }
    }
  }
}
```

#### Sample response

```json
{
  "took": 9,
  "timed_out": false,
  "_shards": {
    "total": 25,
    "successful": 25,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".opendistro-anomaly-results-history-2020.04.30-1",
        "_type": "_doc",
        "_id": "_KBrzXEBbpoKkFM5mStm",
        "_version": 1,
        "_seq_no": 58,
        "_primary_term": 1,
        "_score": 1,
        "_source": {
          "detector_id": "2KDozHEBbpoKkFM58yr6",
          "anomaly_score": 0.8995068350366767,
          "execution_start_time": 1588289313114,
          "data_end_time": 1588289313114,
          "confidence": 0.84214852704501,
          "data_start_time": 1588289253114,
          "feature_data": [
            {
              "feature_id": "X0fpzHEB5NGZmIRkXKcy",
              "feature_name": "total_error",
              "data": 20
            }
          ],
          "execution_end_time": 1588289313126,
          "anomaly_grade": 0
        }
      },
      {
        "_index": ".opendistro-anomaly-results-history-2020.04.30-1",
        "_type": "_doc",
        "_id": "EqB1zXEBbpoKkFM5qyyE",
        "_version": 1,
        "_seq_no": 61,
        "_primary_term": 1,
        "_score": 1,
        "_source": {
          "detector_id": "2KDozHEBbpoKkFM58yr6",
          "anomaly_score": 0.7086834513354907,
          "execution_start_time": 1588289973113,
          "data_end_time": 1588289973113,
          "confidence": 0.42162017029510446,
          "data_start_time": 1588289913113,
          "feature_data": [
            {
              "feature_id": "X0fpzHEB5NGZmIRkXKcy",
              "feature_name": "memory_usage",
              "data": 20.0347333108
            }
          ],
          "execution_end_time": 1588289973124,
          "anomaly_grade": 0
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
  "_index" : ".opendistro-anomaly-detectors",
  "_type" : "_doc",
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 2,
  "result" : "deleted",
  "forced_refresh" : true,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 6,
  "_primary_term" : 1
}
```


---

## Update detector

Updates a detector with any changes, including the description or adding or removing of features.

#### Request

```json
PUT _opendistro/_anomaly_detection/detectors/<detectorId>
{
  "name": "test-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "order*"
  ],
  "feature_attributes": [
    {
      "feature_name": "total_order",
      "feature_enabled": true,
      "aggregation_query": {
        "total_order": {
          "sum": {
            "field": "value"
          }
        }
      }
    }
  ],
  "filter_query": {
    "bool": {
      "filter": [
        {
          "exists": {
            "field": "value",
            "boost": 1
          }
        }
      ],
      "adjust_pure_negative": true,
      "boost": 1
    }
  },
  "detection_interval": {
    "period": {
      "interval": 10,
      "unit": "Minutes"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  }
}
```


#### Sample response

```json
{
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 2,
  "_seq_no" : 4,
  "_primary_term" : 1,
  "anomaly_detector" : {
    "name" : "test-detector",
    "description" : "Test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
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
        "interval" : 10,
        "unit" : "Minutes"
      }
    },
    "window_delay" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "schema_version" : 0,
    "feature_attributes" : [
      {
        "feature_id" : "xxokEnIBcpeWMD987A1X",
        "feature_name" : "total_order",
        "feature_enabled" : true,
        "aggregation_query" : {
          "total_order" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ]
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
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 1,
  "_primary_term" : 1,
  "_seq_no" : 3,
  "anomaly_detector" : {
    "name" : "test-detector",
    "description" : "Test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
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
    "window_delay" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "schema_version" : 0,
    "feature_attributes" : [
      {
        "feature_id" : "mYccEnIBTXsGi3mvMd8_",
        "feature_name" : "total_order",
        "feature_enabled" : true,
        "aggregation_query" : {
          "total_order" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ],
    "last_update_time" : 1589441737319
  }
}
```


Use `job=true` to get anomaly detection job information.

#### Request

```json
GET _opendistro/_anomaly_detection/detectors/<detectorId>?job=true
```

#### Sample response

```json
{
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 1,
  "_primary_term" : 1,
  "_seq_no" : 3,
  "anomaly_detector" : {
    "name" : "test-detector",
    "description" : "Test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
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
    "window_delay" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "schema_version" : 0,
    "feature_attributes" : [
      {
        "feature_id" : "mYccEnIBTXsGi3mvMd8_",
        "feature_name" : "total_order",
        "feature_enabled" : true,
        "aggregation_query" : {
          "total_order" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ],
    "last_update_time" : 1589441737319
  },
  "anomaly_detector_job" : {
    "name" : "m4ccEnIBTXsGi3mvMt9p",
    "schedule" : {
      "interval" : {
        "start_time" : 1589442051271,
        "period" : 1,
        "unit" : "Minutes"
      }
    },
    "window_delay" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "enabled" : true,
    "enabled_time" : 1589442051271,
    "last_update_time" : 1589442051271,
    "lock_duration_seconds" : 60
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
    "match": {
      "name": "test-detector"
    }
  }
}
```


#### Sample response

```json
{
  "took": 13,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 994,
      "relation": "eq"
    },
    "max_score": 3.5410638,
    "hits": [
      {
        "_index": ".opendistro-anomaly-detectors",
        "_type": "_doc",
        "_id": "m4ccEnIBTXsGi3mvMt9p",
        "_version": 2,
        "_seq_no": 221,
        "_primary_term": 1,
        "_score": 3.5410638,
        "_source": {
          "name": "test-detector",
          "description": "Test detector",
          "time_field": "timestamp",
          "indices": [
            "order*"
          ],
          "filter_query": {
            "bool": {
              "filter": [
                {
                  "exists": {
                    "field": "value",
                    "boost": 1
                  }
                }
              ],
              "adjust_pure_negative": true,
              "boost": 1
            }
          },
          "detection_interval": {
            "period": {
              "interval": 10,
              "unit": "Minutes"
            }
          },
          "window_delay": {
            "period": {
              "interval": 1,
              "unit": "Minutes"
            }
          },
          "schema_version": 0,
          "feature_attributes": [
            {
              "feature_id": "xxokEnIBcpeWMD987A1X",
              "feature_name": "total_order",
              "feature_enabled": true,
              "aggregation_query": {
                "total_order": {
                  "sum": {
                    "field": "value"
                  }
                }
              }
            }
          ],
          "last_update_time": 1589442309241
        }
      }
    ]
  }
}
```

---

## Get detector stats

Provides information about how the plugin is performing.

#### Request

```json
GET _opendistro/_anomaly_detection/stats
GET _opendistro/_anomaly_detection/<nodeId>/stats
GET _opendistro/_anomaly_detection/<nodeId>/stats/<stat>
GET _opendistro/_anomaly_detection/stats/<stat>
```

#### Sample response

```json
{
  "_nodes" : {
    "total" : 3,
    "successful" : 3,
    "failed" : 0
  },
  "cluster_name" : "multi-node-run",
  "anomaly_detectors_index_status" : "green",
  "detector_count" : 1,
  "models_checkpoint_index_status" : "green",
  "anomaly_results_index_status" : "green",
  "nodes" : {
    "IgWDUfzFRzW0FWAXM5FGJw" : {
      "ad_execute_request_count" : 8,
      "ad_execute_failure_count" : 7,
      "models" : [
        {
          "detector_id" : "asbPyG4BlFrvFHzloDO-",
          "model_type" : "rcf",
          "model_id" : "asbPyG4BlFrvFHzloDO-_model_rcf_0"
        },
        {
          "detector_id" : "asbPyG4BlFrvFHzloDO-",
          "model_type" : "threshold",
          "model_id" : "asbPyG4BlFrvFHzloDO-_model_threshold"
        }
      ]
    },
    "y7YUQWukQEWOYbfdEq13hQ" : {
      "ad_execute_request_count" : 0,
      "ad_execute_failure_count" : 0,
      "models" : [ ]
    },
    "cDcGNsPoRAyRMlPP1m-vZw" : {
      "ad_execute_request_count" : 0,
      "ad_execute_failure_count" : 0,
      "models" : [
        {
          "detector_id" : "asbPyG4BlFrvFHzloDO-",
          "model_type" : "rcf",
          "model_id" : "asbPyG4BlFrvFHzloDO-_model_rcf_2"
        },
        {
          "detector_id" : "asbPyG4BlFrvFHzloDO-",
          "model_type" : "rcf",
          "model_id" : "asbPyG4BlFrvFHzloDO-_model_rcf_1"
        }
      ]
    }
  }
}
```

---

## Create monitor

Create a monitor to set up alerts for the detector.

#### Request

```json
POST _opendistro/_alerting/monitors
{
  "type": "monitor",
  "name": "test-monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 20,
      "unit": "MINUTES"
    }
  },
  "inputs": [
    {
      "search": {
        "indices": [
          ".opendistro-anomaly-results*"
        ],
        "query": {
          "size": 1,
          "query": {
            "bool": {
              "filter": [
                {
                  "range": {
                    "data_end_time": {
                      "from": "{{period_end}}||-20m",
                      "to": "{{period_end}}",
                      "include_lower": true,
                      "include_upper": true,
                      "boost": 1
                    }
                  }
                },
                {
                  "term": {
                    "detector_id": {
                      "value": "m4ccEnIBTXsGi3mvMt9p",
                      "boost": 1
                    }
                  }
                }
              ],
              "adjust_pure_negative": true,
              "boost": 1
            }
          },
          "sort": [
            {
              "anomaly_grade": {
                "order": "desc"
              }
            },
            {
              "confidence": {
                "order": "desc"
              }
            }
          ],
          "aggregations": {
            "max_anomaly_grade": {
              "max": {
                "field": "anomaly_grade"
              }
            }
          }
        }
      }
    }
  ],
  "triggers": [
    {
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "return ctx.results[0].aggregations.max_anomaly_grade.value != null && ctx.results[0].aggregations.max_anomaly_grade.value > 0.7 && ctx.results[0].hits.hits[0]._source.confidence > 0.7",
          "lang": "painless"
        }
      },
      "actions": [
        {
          "name": "test-action",
          "destination_id": "ld7912sBlQ5JUWWFThoW",
          "message_template": {
            "source": "This is my message body."
          },
          "throttle_enabled": false,
          "subject_template": {
            "source": "TheSubject"
          }
        }
      ]
    }
  ]
}
```

#### Sample response

```json
{
  "_id" : "OClTEnIBmSf7y6LP11Jz",
  "_version" : 1,
  "_seq_no" : 10,
  "_primary_term" : 1,
  "monitor" : {
    "type" : "monitor",
    "schema_version" : 1,
    "name" : "test-monitor",
    "enabled" : true,
    "enabled_time" : 1589445384043,
    "schedule" : {
      "period" : {
        "interval" : 20,
        "unit" : "MINUTES"
      }
    },
    "inputs" : [
      {
        "search" : {
          "indices" : [
            ".opendistro-anomaly-results*"
          ],
          "query" : {
            "size" : 1,
            "query" : {
              "bool" : {
                "filter" : [
                  {
                    "range" : {
                      "data_end_time" : {
                        "from" : "{{period_end}}||-20m",
                        "to" : "{{period_end}}",
                        "include_lower" : true,
                        "include_upper" : true,
                        "boost" : 1.0
                      }
                    }
                  },
                  {
                    "term" : {
                      "detector_id" : {
                        "value" : "m4ccEnIBTXsGi3mvMt9p",
                        "boost" : 1.0
                      }
                    }
                  }
                ],
                "adjust_pure_negative" : true,
                "boost" : 1.0
              }
            },
            "sort" : [
              {
                "anomaly_grade" : {
                  "order" : "desc"
                }
              },
              {
                "confidence" : {
                  "order" : "desc"
                }
              }
            ],
            "aggregations" : {
              "max_anomaly_grade" : {
                "max" : {
                  "field" : "anomaly_grade"
                }
              }
            }
          }
        }
      }
    ],
    "triggers" : [
      {
        "id" : "NilTEnIBmSf7y6LP11Jr",
        "name" : "test-trigger",
        "severity" : "1",
        "condition" : {
          "script" : {
            "source" : "return ctx.results[0].aggregations.max_anomaly_grade.value != null && ctx.results[0].aggregations.max_anomaly_grade.value > 0.7 && ctx.results[0].hits.hits[0]._source.confidence > 0.7",
            "lang" : "painless"
          }
        },
        "actions" : [
          {
            "id" : "NylTEnIBmSf7y6LP11Jr",
            "name" : "test-action",
            "destination_id" : "ld7912sBlQ5JUWWFThoW",
            "message_template" : {
              "source" : "This is my message body.",
              "lang" : "mustache"
            },
            "throttle_enabled" : false,
            "subject_template" : {
              "source" : "TheSubject",
              "lang" : "mustache"
            }
          }
        ]
      }
    ],
    "last_update_time" : 1589445384043
  }
}
```

---

## Profile detector

Returns information related to the current state of the detector and memory usage, including current errors and shingle size, to help troubleshoot the detector.

This command also helps locate logs by identifying the nodes that run the anomaly detector job for each detector.

#### Request

```json
GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile/
GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile?_all
GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile/<type>
```
#### Sample Responses

```json
GET _opendistro/_anomaly_detection/detectors/4j1313EBhPlEUyl3nsX-/_profile

{
    "state":"DISABLED",
    "error":"Stopped detector: AD models memory usage exceeds our limit."
}

GET _opendistro/_anomaly_detection/detectors/m4ccEnIBTXsGi3mvMt9p/_profile?_all=true&pretty

{
  "state" : "RUNNING",
  "models" : [
    {
      "model_id" : "cneh7HEBHPICjJIdXdrR_model_rcf_2",
      "model_size_in_bytes" : 4456448,
      "node_id" : "VS29z70PSzOdHiEw4SoV9Q"
    },
    {
      "model_id" : "cneh7HEBHPICjJIdXdrR_model_rcf_1",
      "model_size_in_bytes" : 4456448,
      "node_id" : "VS29z70PSzOdHiEw4SoV9Q"
    },
    {
      "model_id" : "cneh7HEBHPICjJIdXdrR_model_threshold",
      "node_id" : "Og23iUroTdKrkwS-y89zLw"
    },
    {
      "model_id" : "cneh7HEBHPICjJIdXdrR_model_rcf_0",
      "model_size_in_bytes" : 4456448,
      "node_id" : "Og23iUroTdKrkwS-y89zLw"
    }
  ],
  "shingle_size" : 8,
  "coordinating_node" : "Og23iUroTdKrkwS-y89zLw",
  "total_size_in_bytes" : 13369344
}

GET _opendistro/_anomaly_detection/detectors/m4ccEnIBTXsGi3mvMt9p/_profile/total_size_in_bytes

{
  "total_size_in_bytes" : 13369344
}
```

---
