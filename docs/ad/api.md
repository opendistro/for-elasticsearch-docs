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

#### Sample response

```json
{
  "_id": "m4ccEnIBTXsGi3mvMt9p",
  "_version": 1,
  "_seq_no": 3,
  "_primary_term": 1,
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
        "interval": 1,
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
        "feature_id": "mYccEnIBTXsGi3mvMd8_",
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
    ]
  }
}
```

To set a category field for high cardinality:

#### Request

```json
POST _opendistro/_anomaly_detection/detectors
{
  "name": "Second Test Detector 2",
  "description": "ok rate",
  "time_field": "@timestamp",
  "indices": [
    "host-cloudwatch"
  ],
  "category_field": [
    "host"
  ],
  "feature_attributes": [
    {
      "feature_id": "latency_max",
      "feature_name": "latency_max",
      "feature_enabled": true,
      "importance": 1,
      "aggregation_query": {
        "latency_max": {
          "max": {
            "field": "latency"
          }
        }
      }
    }
  ],
  "window_delay": {
    "period": {
      "interval": 10,
      "unit": "SECONDS"
    }
  },
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "ui_metadata": {
    "aabb": {
      "ab": "bb"
    }
  },
  "schema_version": 2
}
```

#### Sample response

```json
{
  "_id": "4CIGoHUBTpMGN-4KzBQg",
  "_version": 1,
  "_seq_no": 0,
  "anomaly_detector": {
    "name": "Second Test Detector 2",
    "description": "ok rate",
    "time_field": "@timestamp",
    "indices": [
      "server-metrics"
    ],
    "filter_query": {
      "match_all": {
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
        "interval": 10,
        "unit": "Seconds"
      }
    },
    "shingle_size": 1,
    "schema_version": 2,
    "feature_attributes": [
      {
        "feature_id": "latency_max",
        "feature_name": "latency_max",
        "feature_enabled": true,
        "aggregation_query": {
          "latency_max": {
            "max": {
              "field": "latency"
            }
          }
        }
      }
    ],
    "ui_metadata": {
      "aabb": {
        "ab": "bb"
      }
    },
    "last_update_time": 1604707601438,
    "category_field": [
      "host"
    ]
  },
  "_primary_term": 1
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
`window_delay` | Add extra processing time for data collection. | `object` | No
`category_field` | Categorizes or slices data with a dimension. Similar to `GROUP BY` in SQL. | `object` | No

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
    ...
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
    ...
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

If you specify a category field, each result associates with an entity:

#### Sample response

```json
{
  "anomaly_result": [
    {
      "detector_id": "4CIGoHUBTpMGN-4KzBQg",
      "data_start_time": 1604277960000,
      "data_end_time": 1604278020000,
      "schema_version": 0,
      "anomaly_grade": 0,
      "confidence": 0.99
    }
  ],
  "entity": [
    {
      "name": "host",
      "value": "i-00f28ec1eb8997686"
    }
  ]
},
{
  "detector_id": "4CIGoHUBTpMGN-4KzBQg",
  "data_start_time": 1604278020000,
  "data_end_time": 1604278080000,
  "schema_version": 0,
  "feature_data": [
    {
      "feature_id": "latency_max",
      "feature_name": "latency_max",
      "data": -17
    }
  ],
  "anomaly_grade": 0,
  "confidence": 0.99,
  "entity": [
    {
      "name": "host",
      "value": "i-00f28ec1eb8997686"
    }
  ]
}
...

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
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 1,
  "_seq_no" : 6,
  "_primary_term" : 1
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

To find an ordered set of anomaly records for an entity with an anomaly within a certain time range for a specific feature value:

#### Request

```json
POST /_opendistro/_anomaly_detection/detectors/results/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": "4CIGoHUBTpMGN-4KzBQg"
          }
        },
        {
          "range": {
            "anomaly_grade": {
              "gt": 0
            }
          }
        }
      ]
    }
  },
  "size": 8,
  "sort": [
    {
      "execution_end_time": {
        "order": "desc"
      }
    }
  ],
  "track_total_hits": true
}
```

#### Sample response

```json
{
  "took": 443,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": ".opendistro-anomaly-results-history-2020.11.07-1",
        "_type": "_doc",
        "_id": "BiItoHUBTpMGN-4KARY5",
        "_version": 1,
        "_seq_no": 206,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "detector_id": "4CIGoHUBTpMGN-4KzBQg",
          "schema_version": 2,
          "anomaly_score": 2.462550517055763,
          "execution_start_time": 1604710105400,
          "data_end_time": 1604710094516,
          "confidence": 0.8246254862573076,
          "data_start_time": 1604710034516,
          "feature_data": [
            {
              "feature_id": "latency_max",
              "feature_name": "latency_max",
              "data": 3526
            }
          ],
          "execution_end_time": 1604710105401,
          "anomaly_grade": 0.08045977011494891,
          "entity": [
            {
              "name": "host",
              "value": "i-00f28ec1eb8997685"
            }
          ]
        },
        "sort": [
          1604710105401
        ]
      },
      {
        "_index": ".opendistro-anomaly-results-history-2020.11.07-1",
        "_type": "_doc",
        "_id": "wiImoHUBTpMGN-4KlhXs",
        "_version": 1,
        "_seq_no": 156,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "detector_id": "4CIGoHUBTpMGN-4KzBQg",
          "schema_version": 2,
          "anomaly_score": 4.892453213261217,
          "execution_start_time": 1604709684971,
          "data_end_time": 1604709674522,
          "confidence": 0.8313735633713821,
          "data_start_time": 1604709614522,
          "feature_data": [
            {
              "feature_id": "latency_max",
              "feature_name": "latency_max",
              "data": 5709
            }
          ],
          "execution_end_time": 1604709684971,
          "anomaly_grade": 0.06542056074767538,
          "entity": [
            {
              "name": "host",
              "value": "i-00f28ec1eb8997680"
            }
          ]
        },
        "sort": [
          1604709684971
        ]
      },
      {
        "_index": ".opendistro-anomaly-results-history-2020.11.07-1",
        "_type": "_doc",
        "_id": "ZiIcoHUBTpMGN-4KhhVA",
        "_version": 1,
        "_seq_no": 79,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "detector_id": "4CIGoHUBTpMGN-4KzBQg",
          "schema_version": 2,
          "anomaly_score": 3.187717536855158,
          "execution_start_time": 1604709025343,
          "data_end_time": 1604709014520,
          "confidence": 0.8301116064308817,
          "data_start_time": 1604708954520,
          "feature_data": [
            {
              "feature_id": "latency_max",
              "feature_name": "latency_max",
              "data": 441
            }
          ],
          "execution_end_time": 1604709025344,
          "anomaly_grade": 0.040767386091133916,
          "entity": [
            {
              "name": "host",
              "value": "i-00f28ec1eb8997680"
            }
          ]
        },
        "sort": [
          1604709025344
        ]
      }
    ]
  }
}
...
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
          "detector_id" : "m4ccEnIBTXsGi3mvMt9p",
          "model_type" : "rcf",
          "model_id" : "m4ccEnIBTXsGi3mvMt9p_model_rcf_0"
        },
        {
          "detector_id" : "m4ccEnIBTXsGi3mvMt9p",
          "model_type" : "threshold",
          "model_id" : "m4ccEnIBTXsGi3mvMt9p_model_threshold"
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
          "detector_id" : "m4ccEnIBTXsGi3mvMt9p",
          "model_type" : "rcf",
          "model_id" : "m4ccEnIBTXsGi3mvMt9p_model_rcf_2"
        },
        {
          "detector_id" : "m4ccEnIBTXsGi3mvMt9p",
          "model_type" : "rcf",
          "model_id" : "m4ccEnIBTXsGi3mvMt9p_model_rcf_1"
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
  "_id": "OClTEnIBmSf7y6LP11Jz",
  "_version": 1,
  "_seq_no": 10,
  "_primary_term": 1,
  "monitor": {
    "type": "monitor",
    "schema_version": 1,
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1589445384043,
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
        "id": "NilTEnIBmSf7y6LP11Jr",
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
            "id": "NylTEnIBmSf7y6LP11Jr",
            "name": "test-action",
            "destination_id": "ld7912sBlQ5JUWWFThoW",
            "message_template": {
              "source": "This is my message body.",
              "lang": "mustache"
            },
            "throttle_enabled": false,
            "subject_template": {
              "source": "TheSubject",
              "lang": "mustache"
            }
          }
        ]
      }
    ],
    "last_update_time": 1589445384043
  }
}
```

---

## Profile detector

Returns information related to the current state of the detector and memory usage, including current errors and shingle size, to help troubleshoot the detector.

This command helps locate logs by identifying the nodes that run the anomaly detector job for each detector.

It also helps track the initialization percentage, the required shingles, and the estimated time left.  

#### Request

```json
GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile/
GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile?_all=true
GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile/<type>
GET /_opendistro/_anomaly_detection/detectors/<detectorId>/_profile/<type1>,<type2>
```

#### Sample Responses

```json
GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile

{
    "state":"DISABLED",
    "error":"Stopped detector: AD models memory usage exceeds our limit."
}

GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile?_all=true&pretty

{
  "state": "RUNNING",
  "models": [
    {
      "model_id": "cneh7HEBHPICjJIdXdrR_model_rcf_2",
      "model_size_in_bytes": 4456448,
      "node_id": "VS29z70PSzOdHiEw4SoV9Q"
    },
    {
      "model_id": "cneh7HEBHPICjJIdXdrR_model_rcf_1",
      "model_size_in_bytes": 4456448,
      "node_id": "VS29z70PSzOdHiEw4SoV9Q"
    },
    {
      "model_id": "cneh7HEBHPICjJIdXdrR_model_threshold",
      "node_id": "Og23iUroTdKrkwS-y89zLw"
    },
    {
      "model_id": "cneh7HEBHPICjJIdXdrR_model_rcf_0",
      "model_size_in_bytes": 4456448,
      "node_id": "Og23iUroTdKrkwS-y89zLw"
    }
  ],
  "shingle_size": 8,
  "coordinating_node": "Og23iUroTdKrkwS-y89zLw",
  "total_size_in_bytes": 13369344,
  "init_progress": {
    "percentage": "70%",
    "estimated_minutes_left": 77,
    "needed_shingles": 77
  }
}

GET _opendistro/_anomaly_detection/detectors/<detectorId>/_profile/total_size_in_bytes

{
  "total_size_in_bytes" : 13369344
}
```

If you have configured the category field, you can see the number of unique values in the field and also all the active entities with models running in memory.
You can use this data to estimate the memory required for anomaly detection to help decide the size of your cluster.
For example, if a detector has one million entities and only 10 of them are active in memory, then you need to scale up your cluster.

#### Request

```json
GET /_opendistro/_anomaly_detection/detectors/<detectorId>/_profile?_all=true&pretty

{
  "state": "RUNNING",
  "models": [
    {
      "model_id": "T4c3dXUBj-2IZN7itix__entity_i-00f28ec1eb8997684",
      "model_size_in_bytes": 712480,
      "node_id": "g6pmr547QR-CfpEvO67M4g"
    },
    {
      "model_id": "T4c3dXUBj-2IZN7itix__entity_i-00f28ec1eb8997685",
      "model_size_in_bytes": 712480,
      "node_id": "g6pmr547QR-CfpEvO67M4g"
    },
    {
      "model_id": "T4c3dXUBj-2IZN7itix__entity_i-00f28ec1eb8997686",
      "model_size_in_bytes": 712480,
      "node_id": "g6pmr547QR-CfpEvO67M4g"
    },
    {
      "model_id": "T4c3dXUBj-2IZN7itix__entity_i-00f28ec1eb8997680",
      "model_size_in_bytes": 712480,
      "node_id": "g6pmr547QR-CfpEvO67M4g"
    },
    {
      "model_id": "T4c3dXUBj-2IZN7itix__entity_i-00f28ec1eb8997681",
      "model_size_in_bytes": 712480,
      "node_id": "g6pmr547QR-CfpEvO67M4g"
    },
    {
      "model_id": "T4c3dXUBj-2IZN7itix__entity_i-00f28ec1eb8997682",
      "model_size_in_bytes": 712480,
      "node_id": "g6pmr547QR-CfpEvO67M4g"
    },
    {
      "model_id": "T4c3dXUBj-2IZN7itix__entity_i-00f28ec1eb8997683",
      "model_size_in_bytes": 712480,
      "node_id": "g6pmr547QR-CfpEvO67M4g"
    }
  ],
  "total_size_in_bytes": 4987360,
  "init_progress": {
    "percentage": "100%"
  },
  "total_entities": 7,
  "active_entities": 7
}
```

No anomaly results for an entity indicates that either the entity doesn't have any sample data or its model is removed from the model cache.

 `last_sample_timestamp` shows the last document containing the entity, while `last_active_timestamp` shows the timestamp when the entity’s model was last seen in the model cache.

#### Request

```json
GET /_opendistro/_anomaly_detection/detectors/<detectorId>/_profile?_all=true&entity=i-00f28ec1eb8997686
{
  "category_field": "host",
  "value": "i-00f28ec1eb8997686",
  "is_active": true,
  "last_active_timestamp": 1604026394879,
  "last_sample_timestamp": 1604026394879,
  "init_progress": {
    "percentage": "100%"
  },
  "model": {
    "model_id": "TFUdd3UBBwIAGQeRh5IS_entity_i-00f28ec1eb8997686",
    "model_size_in_bytes": 712480,
    "node_id": "MQ-bTBW3Q2uU_2zX3pyEQg"
  },
  "state": "RUNNING"
}
```


---
