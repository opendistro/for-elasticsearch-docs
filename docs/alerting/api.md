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
POST _alerting/monitors
{
  "name": "test-monitor",
  "type": "monitor",
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
                  "gte": "{{period_end}}||-1h",
                  "lte": "{{period_end}}",
                  "format": "epoch_millis"
                }
              }
            }
          }
        }
      }
    }
  }],
  "triggers": [],
  "ui_metadata": {
    "schedule": {
      "timezone": null,
      "frequency": "interval",
      "period": {
        "interval": 1,
        "unit": "MINUTES"
      },
      "daily": 0,
      "weekly": {
        "mon": false,
        "tue": false,
        "wed": false,
        "thur": false,
        "fri": false,
        "sat": false,
        "sun": false
      },
      "monthly": {
        "type": "day",
        "day": 1
      },
      "cronExpression": "0 */1 * * *"
    },
    "search": {
      "searchType": "graph",
      "aggregationType": "count",
      "fieldName": "",
      "overDocuments": "all documents",
      "groupedOverTop": 5,
      "groupedOverFieldName": "bytes",
      "bucketValue": 1,
      "bucketUnitOfTime": "h"
    }
  }
}
```

#### Sample response

```json
{
  "_id": "NjDQOWgBPlGCdcEsP4vu",
  "_version": 1
}
```


---

## Update monitor

When you update a monitor, include the current version number as a parameter. ODE increments the version number automatically (see the sample response).

#### Request

```json
PUT _alerting/monitors/<monitor_id>?version=<number>
{
  "type": "monitor",
  "name": "test-test",
  "enabled": true,
  "enabled_time": 1547157353943,
  "schedule": {
    "period": {
      "unit": "MINUTES",
      "interval": 2
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
                  "gte": "{{period_end}}||-1h",
                  "lte": "{{period_end}}",
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
    "id": "LTDFOWgBPlGCdcEsdYs5",
    "name": "test-trigger",
    "severity": "4",
    "condition": {
      "script": {
        "source": "_ctx.results[0].hits.total > 5000",
        "lang": "painless"
      }
    },
    "actions": [{
      "sns": {
        "name": "test-sns",
        "topic_arn": "arn:aws:sns:us-west-1:904601396794:Test",
        "role_arn": "arn:aws:iam::904601396794:role/AndrewLimitedAccess",
        "subject_template": {
          "source": "My message subject",
          "lang": "mustache"
        },
        "message_template": {
          "source": "{{_ctx.monitor.name}} just entered an alert state. Please investigate the issue.\n- Trigger: {{_ctx.trigger.name}}\n- Severity: {{_ctx.trigger.severity}}\n- Period start: {{_ctx.period_start}}\n- Period end: {{_ctx.period_end}}",
          "lang": "mustache"
        }
      }
    }]
  }],
  "last_update_time": 1547157468473,
  "ui_metadata": {
    "schedule": {
      "timezone": null,
      "frequency": "interval",
      "period": {
        "unit": "MINUTES",
        "interval": 2
      },
      "daily": 0,
      "weekly": {
        "tue": false,
        "wed": false,
        "thur": false,
        "sat": false,
        "fri": false,
        "mon": false,
        "sun": false
      },
      "monthly": {
        "type": "day",
        "day": 1
      },
      "cronExpression": "0 */1 * * *"
    },
    "search": {
      "searchType": "graph",
      "aggregationType": "count",
      "fieldName": "",
      "overDocuments": "all documents",
      "groupedOverTop": 5,
      "groupedOverFieldName": "bytes",
      "bucketValue": 1,
      "bucketUnitOfTime": "h"
    }
  }
}
```

#### Sample response

```json
{
  "_id": "NjDQOWgBPlGCdcEsP4vu",
  "_version": 3
}
```


---

## Get monitor

#### Request

```
GET _alerting/monitors/<monitor_id>
```

#### Sample response

```json
{
  "_id": "NjDQOWgBPlGCdcEsP4vu",
  "_version": 1,
  "monitor": {
    "type": "monitor",
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1547158175726,
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
    "triggers": [],
    "last_update_time": 1547158175726
  }
}
```


---

## Monitor stats

#### Request

```json
GET _opendistro/_monitors/stats
GET _opendistro/_monitors/stats/job_sweeper_metrics
GET _opendistro/_monitors/stats/jobs_info
```

#### Sample response

```json
{
  "Something": "Useful"
}
```

---

## Delete monitor

#### Request

```
DELETE _alerting/monitors/<monitor_id>
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
GET _alerting/monitors/_search
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

#### Request

```json
POST _alerting/monitors/<monitor_id>/_execute
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

To get the alert ID, query the `.opendistro-alerts` index. See [Alerting indices](../settings#alerting-indices).

#### Request

```json
POST _alerting/monitors/<monitor-id>/_acknowledge/alerts
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
