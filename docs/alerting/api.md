---
layout: default
title: API
parent: Alerting
nav_order: 3
---

# Alerting API

Use the alerting API to programmatically manage monitors and alerts.


---

#### Table of contents
- TOC
{:toc}


---

## Create monitor

#### Request

```json
POST _opendistro/_alerting/monitors
{
  "type": "monitor",
  "name": "test-monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [{
    "search": {
      "indices": ["movies"],
      "query": {
        "size": 0,
        "aggregations": {},
        "query": {
          "bool": {
            "filter": {
              "range": {
                "@timestamp": {
                  "gte": "||-1h",
                  "lte": "",
                  "format": "epoch_millis"
                }
              }
            }
          }
        }
      }
    }
  }],
  "triggers": [{
    "name": "test-trigger",
    "severity": "1",
    "condition": {
      "script": {
        "source": "ctx.results[0].hits.total.value > 0",
        "lang": "painless"
      }
    },
    "actions": [{
      "name": "test-action",
      "destination_id": "ld7912sBlQ5JUWWFThoW",
      "message_template": {
        "source": "This is my message body."
      },
      "throttle_enabled": false,
      "subject_template": {
        "source": "TheSubject"
      }
    }]
  }]
}
```

If you use a custom webhook for your destination and need to embed JSON in the message body, be sure to escape your quotes:

```json
{
  "message_template": {
    {% raw %}"source": "{ \"text\": \"Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue. - Trigger: {{ctx.trigger.name}} - Severity: {{ctx.trigger.severity}} - Period start: {{ctx.periodStart}} - Period end: {{ctx.periodEnd}}\" }"{% endraw %}
  }
}
```

#### Sample response

```json
{
  "_id": "vd5k2GsBlQ5JUWWFxhsP",
  "_version": 1,
  "_seq_no": 7,
  "_primary_term": 1,
  "monitor": {
    "type": "monitor",
    "schema_version": 1,
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1562703611363,
    "schedule": {
      "period": {
        "interval": 1,
        "unit": "MINUTES"
      }
    },
    "inputs": [{
      "search": {
        "indices": [
          "movies"
        ],
        "query": {
          "size": 0,
          "query": {
            "bool": {
              "filter": [{
                "range": {
                  "@timestamp": {
                    "from": "||-1h",
                    "to": "",
                    "include_lower": true,
                    "include_upper": true,
                    "format": "epoch_millis",
                    "boost": 1
                  }
                }
              }],
              "adjust_pure_negative": true,
              "boost": 1
            }
          },
          "aggregations": {}
        }
      }
    }],
    "triggers": [{
      "id": "ud5k2GsBlQ5JUWWFxRvi",
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "ctx.results[0].hits.total.value > 0",
          "lang": "painless"
        }
      },
      "actions": [{
        "id": "ut5k2GsBlQ5JUWWFxRvj",
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
      }]
    }],
    "last_update_time": 1562703611363
  }
}
```


---

## Update monitor

When you update a monitor, include the current version number as a parameter. Open Distro for Elasticsearch increments the version number automatically (see the sample response).

#### Request

```json
PUT _opendistro/_alerting/monitors/<monitor_id>
{
  "type": "monitor",
  "name": "test-monitor",
  "enabled": true,
  "enabled_time": 1551466220455,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [{
    "search": {
      "indices": [
        "*"
      ],
      "query": {
        "query": {
          "match_all": {
            "boost": 1
          }
        }
      }
    }
  }],
  "triggers": [{
    "id": "StaeOmkBC25HCRGmL_y-",
    "name": "test-trigger",
    "severity": "1",
    "condition": {
      "script": {
        "source": "return true",
        "lang": "painless"
      }
    },
    "actions": [{
      "name": "test-action",
      "destination_id": "RtaaOmkBC25HCRGm0fxi",
      "subject_template": {
        "source": "My Message Subject",
        "lang": "mustache"
      },
      "message_template": {
        "source": "This is my message body.",
        "lang": "mustache"
      }
    }]
  }],
  "last_update_time": 1551466639295
}
```

#### Sample response

```json
{
  "_id": "Q9aXOmkBC25HCRGmzfw-",
  "_version": 4,
  "monitor": {
    "type": "monitor",
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1551466220455,
    "schedule": {
      "period": {
        "interval": 1,
        "unit": "MINUTES"
      }
    },
    "inputs": [{
      "search": {
        "indices": [
          "*"
        ],
        "query": {
          "query": {
            "match_all": {
              "boost": 1
            }
          }
        }
      }
    }],
    "triggers": [{
      "id": "StaeOmkBC25HCRGmL_y-",
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "return true",
          "lang": "painless"
        }
      },
      "actions": [{
        "name": "test-action",
        "destination_id": "RtaaOmkBC25HCRGm0fxi",
        "subject_template": {
          "source": "My Message Subject",
          "lang": "mustache"
        },
        "message_template": {
          "source": "This is my message body.",
          "lang": "mustache"
        }
      }]
    }],
    "last_update_time": 1551466761596
  }
}
```


---

## Get monitor

#### Request

```
GET _opendistro/_alerting/monitors/<monitor_id>
```

#### Sample response

```json
{
  "_id": "Q9aXOmkBC25HCRGmzfw-",
  "_version": 3,
  "monitor": {
    "type": "monitor",
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1551466220455,
    "schedule": {
      "period": {
        "interval": 1,
        "unit": "MINUTES"
      }
    },
    "inputs": [{
      "search": {
        "indices": [
          "*"
        ],
        "query": {
          "query": {
            "match_all": {
              "boost": 1
            }
          }
        }
      }
    }],
    "triggers": [{
      "id": "StaeOmkBC25HCRGmL_y-",
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "return true",
          "lang": "painless"
        }
      },
      "actions": [{
        "name": "test-action",
        "destination_id": "RtaaOmkBC25HCRGm0fxi",
        "subject_template": {
          "source": "My Message Subject",
          "lang": "mustache"
        },
        "message_template": {
          "source": "This is my message body.",
          "lang": "mustache"
        }
      }]
    }],
    "last_update_time": 1551466639295
  }
}
```


---

## Monitor stats

Returns statistics about the alerting feature. Use `_opendistro/_alerting/stats` to find node IDs and metrics. Then you can drill down using those values.

#### Request

```json
GET _opendistro/_alerting/stats
GET _opendistro/_alerting/stats/<metric>
GET _opendistro/_alerting/<node-id>/stats
GET _opendistro/_alerting/<node-id>/stats/<metric>
```

#### Sample response

```json
{
  "_nodes": {
    "total": 9,
    "successful": 9,
    "failed": 0
  },
  "cluster_name": "475300751431:alerting65-dont-delete",
  "opendistro.scheduled_jobs.enabled": true,
  "scheduled_job_index_exists": true,
  "scheduled_job_index_status": "green",
  "nodes_on_schedule": 9,
  "nodes_not_on_schedule": 0,
  "nodes": {
    "qWcbKbb-TVyyI-Q7VSeOqA": {
      "name": "qWcbKbb",
      "schedule_status": "green",
      "roles": [
        "MASTER"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 207017,
        "full_sweep_on_time": true
      },
      "jobs_info": {}
    },
    "Do-DX9ZcS06Y9w1XbSJo1A": {
      "name": "Do-DX9Z",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 230516,
        "full_sweep_on_time": true
      },
      "jobs_info": {}
    },
    "n5phkBiYQfS5I0FDzcqjZQ": {
      "name": "n5phkBi",
      "schedule_status": "green",
      "roles": [
        "MASTER"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 228406,
        "full_sweep_on_time": true
      },
      "jobs_info": {}
    },
    "Tazzo8cQSY-g3vOjgYYLzA": {
      "name": "Tazzo8c",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 211722,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "i-wsFmkB8NzS6aXjQSk0": {
          "last_execution_time": 1550864912882,
          "running_on_time": true
        }
      }
    },
    "Nyf7F8brTOSJuFPXw6CnpA": {
      "name": "Nyf7F8b",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 223300,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "NbpoFmkBeSe-hD59AKgE": {
          "last_execution_time": 1550864928354,
          "running_on_time": true
        },
        "-LlLFmkBeSe-hD59Ydtb": {
          "last_execution_time": 1550864732727,
          "running_on_time": true
        },
        "pBFxFmkBNXkgNmTBaFj1": {
          "last_execution_time": 1550863325024,
          "running_on_time": true
        },
        "hfasEmkBNXkgNmTBrvIW": {
          "last_execution_time": 1550862000001,
          "running_on_time": true
        }
      }
    },
    "oOdJDIBVT5qbbO3d8VLeEw": {
      "name": "oOdJDIB",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 227570,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "4hKRFmkBNXkgNmTBKjYX": {
          "last_execution_time": 1550864806101,
          "running_on_time": true
        }
      }
    },
    "NRDG6JYgR8m0GOZYQ9QGjQ": {
      "name": "NRDG6JY",
      "schedule_status": "green",
      "roles": [
        "MASTER"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 227652,
        "full_sweep_on_time": true
      },
      "jobs_info": {}
    },
    "URMrXRz3Tm-CB72hlsl93Q": {
      "name": "URMrXRz",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 231048,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "m7uKFmkBeSe-hD59jplP": {
          "running_on_time": true
        }
      }
    },
    "eXgt1k9oTRCLmx2HBGElUw": {
      "name": "eXgt1k9",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 229234,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "wWkFFmkBc2NG-PeLntxk": {
          "running_on_time": true
        },
        "3usNFmkB8NzS6aXjO1Gs": {
          "last_execution_time": 1550863959848,
          "running_on_time": true
        }
      }
    }
  }
}
```


---

## Delete monitor

#### Request

```
DELETE _opendistro/_alerting/monitors/<monitor_id>
```

#### Sample response

```json
{
  "_index": ".opendistro-scheduled-jobs",
  "_type": "_doc",
  "_id": "OYAHOmgBl3cmwnqZl_yH",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 11,
  "_primary_term": 1
}
```


---

## Search monitors

#### Request

```json
GET _opendistro/_alerting/monitors/_search
{
  "query": {
    "match" : {
      "monitor.name": "my-monitor-name"
    }
  }
}
```

#### Sample response

```json
{
  "took": 17,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 0.6931472,
    "hits": [{
      "_index": ".opendistro-scheduled-jobs",
      "_type": "_doc",
      "_id": "eGQi7GcBRS7-AJEqfAnr",
      "_score": 0.6931472,
      "_source": {
        "type": "monitor",
        "name": "my-monitor-name",
        "enabled": true,
        "enabled_time": 1545854942426,
        "schedule": {
          "period": {
            "interval": 1,
            "unit": "MINUTES"
          }
        },
        "inputs": [{
          "search": {
            "indices": [
              "*"
            ],
            "query": {
              "size": 0,
              "query": {
                "bool": {
                  "filter": [{
                    "range": {
                      "@timestamp": {
                        "from": "{{period_end}}||-1h",
                        "to": "{{period_end}}",
                        "include_lower": true,
                        "include_upper": true,
                        "format": "epoch_millis",
                        "boost": 1
                      }
                    }
                  }],
                  "adjust_pure_negative": true,
                  "boost": 1
                }
              },
              "aggregations": {}
            }
          }
        }],
        "triggers": [{
          "id": "Sooi7GcB53a0ewuj_6MH",
          "name": "Over",
          "severity": "1",
          "condition": {
            "script": {
              "source": "_ctx.results[0].hits.total > 400000",
              "lang": "painless"
            }
          },
          "actions": []
        }],
        "last_update_time": 1545854975758
      }
    }]
  }
}
```


---

## Run monitor

You can add the optional `?dryrun=true` parameter to the URL to show the results of a run without actions sending any message.


#### Request

```json
POST _opendistro/_alerting/monitors/<monitor_id>/_execute
```

#### Sample response

```json
{
  "monitor_name": "logs",
  "period_start": 1547161872322,
  "period_end": 1547161932322,
  "error": null,
  "trigger_results": {
    "Sooi7GcB53a0ewuj_6MH": {
      "name": "Over",
      "triggered": true,
      "error": null,
      "action_results": {}
    }
  }
}
```


---

## Acknowledge alert

To get the alert ID, query the `.opendistro-alerts` index. See [Alerting indices](../settings#alerting-indices). You can acknowledge any number of alerts in one call. If the alert is already in an ERROR, COMPLETED, or ACKNOWLEDGED state, it will appear in the `failed` array.


#### Request

```json
POST _opendistro/_alerting/monitors/<monitor-id>/_acknowledge/alerts
{
  "alerts": ["bn0_PmgBoCvkhulGF2K8"]
}
```

#### Sample response

```json
{
  "success": [
    "bn0_PmgBoCvkhulGF2K8"
  ],
  "failed": []
}
```


---

## Create destination

#### Request

```json
POST _opendistro/_alerting/destinations
{
  "name": "my-destination",
  "type": "slack",
  "slack": {
    "url": "http://www.example.com"
  }
}
```

#### Sample response

```json
{
  "_id": "nO-yFmkB8NzS6aXjJdiI",
  "_version": 1,
  "destination": {
    "type": "slack",
    "name": "my-destination",
    "last_update_time": 1550863967624,
    "slack": {
      "url": "http://www.example.com"
    }
  }
}
```


---

## Update destination

#### Request

```json
PUT _opendistro/_alerting/destinations/<destination-id>
{
  "name": "my-updated-destination",
  "type": "slack",
  "slack": {
    "url": "http://www.example.com"
  }
}
```

#### Sample response

```json
{
  "_id": "pe-1FmkB8NzS6aXjqvVY",
  "_version": 4,
  "destination": {
    "type": "slack",
    "name": "my-updated-destination",
    "last_update_time": 1550864289375,
    "slack": {
      "url": "http://www.example.com"
    }
  }
}
```


---

## Delete destination

#### Request

```
_opendistro/_alerting/destinations/<destination-id>
```

#### Sample response

```json
{
  "_index": ".opendistro-alerting-config",
  "_type": "_doc",
  "_id": "Zu-zFmkB8NzS6aXjLeBI",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 8,
  "_primary_term": 1
}
```
